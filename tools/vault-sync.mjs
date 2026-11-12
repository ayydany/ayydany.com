// One-way sync from Obsidian vault notes to Hexo posts.
//
// A vault note joins the sync when its frontmatter has `status: draft` or
// `status: published`. Drafts go to source/_drafts (gitignored, previewed
// with `hexo server --draft`); published notes go to source/_posts.
//
// The site stays the source of truth for posts it already has: an existing
// source/_posts/<slug>.md is only overwritten when it is listed in
// vault-sync.json (the posts this sync owns) or the generated output is
// identical to it, in which case it is adopted.

import yaml from "js-yaml";
import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { basename, extname, join, resolve } from "node:path";

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg"]);
const STATUSES = new Set(["draft", "published"]);
// Letters, digits and single dashes. New posts should use lowercase; older
// site posts (e.g. Metroid-Dread-Review) keep their capitals because the slug is the URL.
const SLUG_RE = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
// Keys copied from the vault note into the Hexo frontmatter as-is.
const PASSTHROUGH_KEYS = ["updated", "categories", "description", "layout", "comments", "excerpt"];

export function vaultSyncConfig(siteDir = process.cwd(), env = process.env) {
  const vaultDir = resolve(env.VAULT_DIR ?? join(env.HOME ?? "", "Obsidian"));
  const postsDir = resolve(
    vaultDir,
    env.VAULT_POSTS_DIR ?? "20 Active Efforts/Personal/ayydany.com/Posts"
  );
  return {
    siteDir: resolve(siteDir),
    vaultDir,
    postsDir,
    attachmentDirs: [join(postsDir, "attachments"), join(vaultDir, "99 Attachments"), postsDir],
    manifestPath: resolve(siteDir, "vault-sync.json"),
  };
}

export function splitFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(text);
  if (!match) return { data: {}, body: text };
  return { data: yaml.load(match[1]) ?? {}, body: text.slice(match[0].length) };
}

const pad = (n) => String(n).padStart(2, "0");

// Hexo reads dates in the site timezone, so keep the wall-clock value.
// Unquoted YAML timestamps without an offset parse as UTC, so read UTC fields.
export function formatDate(value) {
  if (value instanceof Date) {
    return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())} ${pad(value.getUTCHours())}:${pad(value.getUTCMinutes())}:${pad(value.getUTCSeconds())}`;
  }
  const match = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(String(value).trim());
  if (!match) throw new Error(`unrecognised date "${value}" (use "YYYY-MM-DDTHH:mm")`);
  const [, day, hh = "00", mm = "00", ss = "00"] = match;
  return `${day} ${hh}:${mm}:${ss}`;
}

const asList = (value) =>
  value == null || value === "" ? [] : (Array.isArray(value) ? value : [value]).map(String);

function hexoFrontmatter(data) {
  const lines = [`title: '${String(data.title).replace(/'/g, "''")}'`];
  if (data.date != null) lines.push(`date: ${formatDate(data.date)}`);
  const tags = asList(data.site_tags);
  if (tags.length) lines.push("tags:", ...tags.map((tag) => `  - ${tag}`));
  const extra = Object.fromEntries(
    PASSTHROUGH_KEYS.filter((key) => data[key] != null).map((key) => [key, data[key]])
  );
  let text = lines.join("\n") + "\n";
  if (Object.keys(extra).length) text += yaml.dump(extra, { lineWidth: -1 });
  return `---\n${text}---\n`;
}

// Apply fn to prose only: fenced code blocks and inline code stay untouched.
function mapProse(body, fn) {
  return body
    .split(/(^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)[ \t]*$)/m)
    .map((part, i) =>
      i % 2
        ? part
        : part
            .split(/(`[^`\n]*`)/)
            .map((piece, j) => (j % 2 ? piece : fn(piece)))
            .join("")
    )
    .join("");
}

// Turn Obsidian markdown into Hexo markdown. Returns the body plus the
// image files the post needs in its asset folder.
export function convertBody(body, { resolveAsset, postLink, warn }) {
  const assets = new Map();

  const image = (target, alt) => {
    const name = basename(target.split("#")[0].trim());
    if (!IMAGE_EXTS.has(extname(name).toLowerCase())) return null;
    const source = resolveAsset(name);
    if (!source) {
      warn(`image not found: ${name}`);
      return `{% asset_img ${name} %}`;
    }
    assets.set(name, source);
    // Hexo's '"title" "alt"' form: the caption becomes both the tooltip and the alt text.
    const text = alt && !/^\d+(x\d+)?$/.test(alt) ? alt.replace(/[{}%"']/g, "").trim() : "";
    const caption = text ? ` '"${text}" "${text}"'` : "";
    return `{% asset_img ${name.includes(" ") ? `"${name}"` : name}${caption} %}`;
  };

  const converted = mapProse(body, (text) =>
    text
      // Obsidian comments are private notes; never publish them.
      .replace(/%%[\s\S]*?%%/g, "")
      // ![[image.png|alt]]
      .replace(/!\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (whole, target, alt) => {
        const out = image(target, alt?.trim());
        if (out == null) warn(`embed left as-is (not an image): ${whole}`);
        return out ?? whole;
      })
      // ![alt](attachments/image.png) — local files only.
      .replace(/!\[([^\]]*)\]\((?!https?:|\/)([^)\s]+)\)/g, (whole, alt, target) => {
        return image(decodeURIComponent(target), alt.trim()) ?? whole;
      })
      // [[Note#Heading|Text]]
      .replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g, (whole, note, text) => {
        const label = (text ?? note).trim();
        const slug = postLink(note.trim());
        if (!slug) {
          warn(`link to "${note.trim()}" is not a published post; kept as plain text`);
          return label;
        }
        return `{% post_link ${slug} '${label.replace(/'/g, "\\'")}' %}`;
      })
  );

  return { body: converted, assets };
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function readText(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function loadManifest(path) {
  const text = await readText(path);
  return text ? JSON.parse(text) : { managed: [] };
}

function validate(data) {
  const problems = [];
  if (!STATUSES.has(data.status)) problems.push(`status must be draft or published, got "${data.status}"`);
  if (!data.title) problems.push("missing title");
  if (!SLUG_RE.test(data.slug ?? "")) problems.push(`slug must be letters, digits and dashes, got "${data.slug ?? ""}"`);
  if (data.status === "published" && data.date == null) problems.push("published posts need a date");
  return problems;
}

// Two post files are the same post when their frontmatter values and body
// text match, whatever the YAML formatting (quoting, key order, `tags: x` vs a list).
export function samePost(a, b) {
  const normalise = (text) => {
    const { data, body } = splitFrontmatter(text);
    const meta = { ...data };
    if ("tags" in meta) meta.tags = asList(meta.tags);
    if (meta.date != null) meta.date = formatDate(meta.date);
    if (typeof meta.title === "string") meta.title = meta.title.trim();
    const keys = Object.keys(meta).sort();
    return JSON.stringify([keys.map((k) => [k, meta[k]]), body.replace(/^\s*\n/, "").trimEnd()]);
  };
  try {
    return normalise(a) === normalise(b);
  } catch {
    return false;
  }
}

export async function syncVault(config = vaultSyncConfig(), log = console.log) {
  const { siteDir, postsDir, attachmentDirs, manifestPath } = config;
  if (!(await exists(postsDir))) {
    throw new Error(`Vault posts folder not found: ${postsDir} (set VAULT_DIR or VAULT_POSTS_DIR)`);
  }

  const manifest = await loadManifest(manifestPath);
  const managed = new Set(manifest.managed);
  const notes = [];
  let skipped = 0;

  for (const file of (await readdir(postsDir)).sort()) {
    if (!file.endsWith(".md") || file === "Index.md") continue;
    const { data, body } = splitFrontmatter(await readFile(join(postsDir, file), "utf8"));
    if (data.status == null) continue;
    const problems = validate(data);
    if (problems.length) {
      problems.forEach((message) => log(`  ! ${file}: ${message}`));
      skipped++;
      continue;
    }
    notes.push({ file, name: file.slice(0, -3), data, body });
  }

  const published = new Map(
    notes.filter((n) => n.data.status === "published").map((n) => [n.name, n.data.slug])
  );
  const drafts = new Map(
    notes.filter((n) => n.data.status === "draft").map((n) => [n.name, n.data.slug])
  );

  const resolveAsset = (name) =>
    attachmentDirs.map((dir) => join(dir, name)).find((path) => existsSync(path));

  const counts = { written: 0, unchanged: 0, skipped };
  let manifestChanged = false;

  for (const note of notes) {
    const { data } = note;
    const warn = (message) => log(`  ! ${note.file}: ${message}`);

    const isDraft = data.status === "draft";
    const { body, assets } = convertBody(note.body, {
      resolveAsset,
      // Drafts may link to other drafts; published posts only to published ones.
      postLink: (name) => published.get(name) ?? (isDraft ? drafts.get(name) : undefined),
      warn,
    });

    let frontmatter;
    try {
      frontmatter = hexoFrontmatter(data);
    } catch (error) {
      warn(error.message);
      counts.skipped++;
      continue;
    }

    const output = `${frontmatter}\n${body.replace(/^\s*\n/, "").trimEnd()}\n`;
    const dir = join(siteDir, "source", isDraft ? "_drafts" : "_posts");
    const target = join(dir, `${data.slug}.md`);
    const current = await readText(target);

    if (!isDraft && current != null && !managed.has(data.slug)) {
      if (!samePost(current, output)) {
        warn(
          `source/_posts/${data.slug}.md already exists and differs; the site copy wins. ` +
            "Copy its content into the vault note, then sync again."
        );
        counts.skipped++;
        continue;
      }
      log(`  + adopted ${data.slug} (vault note matches the site)`);
    }
    if (!isDraft && !managed.has(data.slug)) {
      managed.add(data.slug);
      manifestChanged = true;
    }

    await mkdir(dir, { recursive: true });
    if (current != null && samePost(current, output)) {
      counts.unchanged++;
    } else {
      await writeFile(target, output);
      log(`  ✓ ${isDraft ? "draft" : "post"} ${data.slug}`);
      counts.written++;
    }

    if (assets.size) {
      const assetDir = join(dir, data.slug);
      await mkdir(assetDir, { recursive: true });
      for (const [name, source] of assets) {
        await copyFile(source, join(assetDir, name));
      }
    }

    if (!isDraft) {
      // A draft that got published no longer needs its preview copy.
      await rm(join(siteDir, "source", "_drafts", `${data.slug}.md`), { force: true });
      await rm(join(siteDir, "source", "_drafts", data.slug), { recursive: true, force: true });
    } else if (managed.has(data.slug)) {
      warn(`marked draft in the vault but already published on the site; source/_posts/${data.slug}.md left in place`);
    }
  }

  if (manifestChanged) {
    manifest.managed = [...managed].sort();
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  }

  log(
    `Vault sync: ${counts.written} written, ${counts.unchanged} unchanged, ${counts.skipped} skipped ` +
      `(${notes.length + skipped} of the notes in ${basename(postsDir)} have a status)`
  );
  return counts;
}

import gulp from "gulp";
import { spawn } from "node:child_process";
import { access, lstat, mkdir, readlink, rm, rmdir, symlink } from "node:fs/promises";
import { join, resolve } from "node:path";

function runCommand(command, args = [], options = {}) {
  return new Promise((resolveCommand, reject) => {
    const proc = spawn(command, args, { stdio: "inherit", ...options });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) {
        resolveCommand();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

function captureCommand(command, args = []) {
  return new Promise((resolveCommand, reject) => {
    const proc = spawn(command, args, { stdio: ["ignore", "pipe", "inherit"] });
    let output = "";
    proc.stdout.on("data", (chunk) => (output += chunk));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) {
        resolveCommand(output.trim());
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

function spawnHexo(command, args = []) {
  return (done) => {
    runCommand("hexo", [command, ...args])
      .then(() => done())
      .catch((err) => done(err));
  };
}

const artifacts = [".deploy_git", "node_modules", "public", "db.json"];

async function removeArtifacts() {
  for (const target of artifacts) {
    const fullPath = resolve(process.cwd(), target);
    await rm(fullPath, { recursive: true, force: true });
    console.log(`Removed ${target}`);
  }
}

const cleanHexo = spawnHexo("clean");

export const generateWatch = spawnHexo("generate", ["-w"]);
export const serve = spawnHexo("serve");

export const dev = gulp.parallel(generateWatch, serve);

export const generate = spawnHexo("generate");
export const deploy = gulp.series(assertThemeNotLinked, spawnHexo("deploy"));
export const clean = gulp.series(cleanHexo, removeArtifacts);
export const deps = async () => {
  try {
    await runCommand("ncu", ["--version"], { stdio: "ignore" });
  } catch (error) {
    throw new Error(
      "ncu (npm-check-updates) is not installed. Install it globally (`npm install -g npm-check-updates`) or add it locally."
    );
  }

  await runCommand("ncu", ["-u"]);
  await runCommand("npm", ["install"]);
};

// Local theme development.
// Hexo prefers themes/<name>/ over node_modules/hexo-theme-<name>/, so a
// gitignored themes/cactus symlink to the theme checkout overrides the pinned
// npm dependency locally without touching package.json or CI.
const themeRepo = "ayydany/hexo-theme-cactus-catppuccin";
const themeLinkPath = resolve(process.cwd(), "themes", "cactus");
const themeCheckout = resolve(
  process.cwd(),
  process.env.THEME_DIR ?? "../hexo-theme-cactus-catppuccin"
);

async function linkedThemeTarget() {
  try {
    const stats = await lstat(themeLinkPath);
    if (!stats.isSymbolicLink()) {
      throw new Error(`${themeLinkPath} exists and is not a symlink; refusing to touch it.`);
    }
    return resolve(join(themeLinkPath, ".."), await readlink(themeLinkPath));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function assertThemeNotLinked() {
  const target = await linkedThemeTarget();
  if (target) {
    throw new Error(
      `Local theme is linked (${target}). Run \`npx gulp themeUnlink\` before deploying.`
    );
  }
}

export async function themeLink() {
  try {
    await access(join(themeCheckout, "_config.yml"));
  } catch {
    throw new Error(
      `No theme checkout at ${themeCheckout}. Clone ${themeRepo} there or set THEME_DIR.`
    );
  }

  const target = await linkedThemeTarget();
  if (target === themeCheckout) {
    console.log(`Theme already linked: themes/cactus -> ${themeCheckout}`);
    return;
  }
  if (target) {
    throw new Error(`themes/cactus already points to ${target}. Run \`npx gulp themeUnlink\` first.`);
  }

  await mkdir(join(themeLinkPath, ".."), { recursive: true });
  await symlink(themeCheckout, themeLinkPath, "dir");
  console.log(`Linked themes/cactus -> ${themeCheckout}`);
}

export async function themeUnlink() {
  const target = await linkedThemeTarget();
  if (!target) {
    console.log("Theme is not linked; using the pinned npm dependency.");
    return;
  }

  await rm(themeLinkPath);
  await rmdir(join(themeLinkPath, "..")).catch(() => {});
  console.log("Unlinked themes/cactus; using the pinned npm dependency.");
}

// Pin the npm dependency to a pushed theme commit.
// THEME_REF may be a branch name (default: master) or a commit SHA.
export async function themeBump() {
  const ref = process.env.THEME_REF ?? "master";
  let sha = ref;

  if (!/^[0-9a-f]{7,40}$/.test(ref)) {
    const remote = await captureCommand("git", [
      "ls-remote",
      `https://github.com/${themeRepo}.git`,
      `refs/heads/${ref}`,
    ]);
    sha = remote.split(/\s+/)[0];
    if (!sha) {
      throw new Error(`Branch ${ref} not found on ${themeRepo}. Push the theme first.`);
    }
  }

  const shortSha = sha.slice(0, 7);
  await runCommand("npm", ["install", `hexo-theme-cactus@github:${themeRepo}#${shortSha}`]);
  console.log(`Pinned hexo-theme-cactus to ${themeRepo}#${shortSha}`);
}

export default gulp.series(serve);

# ayydany.com

This project uses [Hexo](https://hexo.io/) for static site generation and [Gulp](https://gulpjs.com/) to simplify common tasks.

## Usage

### Install Dependencies

```bash

npm install

```

### VS Code tasks

The repo includes `.vscode/tasks.json` so you can run the gulp tasks from `Terminal > Run Task…` (they call `npx gulp <task>`).

### Common Gulp Tasks

- **Development (watch & serve):**

```bash
gulp dev
```

Runs `hexo generate -w` and `hexo serve` concurrently.

- **Generate static files:**

```bash
gulp generate

```

- **Update dependencies (ncu -u + npm install):**

```bash
gulp deps
```

Requires `npm-check-updates` (`ncu`) to be installed (`npm i -g npm-check-updates`), otherwise the task will error.

- **Deploy:**

Pushing to `master` deploys automatically: `.github/workflows/deploy.yml` builds the site and pushes it to the `live` branch with the workflow's `GITHUB_TOKEN`. Pull requests get a build-only check (`.github/workflows/build.yml`).

To deploy manually, you need SSH push access to the repo, and the theme must not be linked:

```bash
gulp deploy
```

- **Clean Hexo artifacts and generated files:**

```bash
gulp clean
```

- **Serve only:**

```bash
gulp
```

(Default task, runs `hexo serve`)

## Writing posts in Obsidian

Posts are written in the Obsidian vault (`~/Obsidian/20 Active Efforts/Personal/ayydany.com/Posts`) and synced one way into `source/`. A note joins the sync once its frontmatter has a `status`:

```yaml
title: "Post title"
slug: post-title              # URL and file name: source/_posts/post-title.md
status: draft                 # draft -> source/_drafts (gitignored), published -> source/_posts
date: "2026-11-12T10:00:00"   # required when published
site_tags: [linux, obsidian]  # becomes the Hexo `tags`
```

```bash
npx gulp preview     # sync, watch the vault, and serve drafts at http://localhost:4000
npx gulp vaultSync   # one-off sync
```

- `![[image.png|caption]]` and `![alt](attachments/image.png)` become `{% asset_img %}`; images are looked up in `Posts/attachments/`, then `99 Attachments/`.
- `[[Other Post]]` becomes a `{% post_link %}` when that note is synced; otherwise plain text. `%% comments %%` are dropped.
- The site wins: an existing post is only overwritten once it is listed in `vault-sync.json` (adopted automatically when the vault note produces identical output).
- Publishing stays manual: set `status: published`, run the sync, review `git diff`, commit, and push to `master`.
- `VAULT_DIR` and `VAULT_POSTS_DIR` override the vault paths.

## Theme development

The theme ([`ayydany/hexo-theme-cactus-catppuccin`](https://github.com/ayydany/hexo-theme-cactus-catppuccin)) is pinned in `package.json`. To work on it against this site without pushing anything:

```bash
npx gulp themeLink    # symlink themes/cactus -> ../hexo-theme-cactus-catppuccin (gitignored)
npx gulp dev          # edit the theme; changes are picked up live
# commit + push in the theme repo, then:
npx gulp themeUnlink
npx gulp themeBump    # optional: refresh the local pin to the theme's latest master (THEME_REF=<ref> to override)
```

CI (build and deploy) always installs the theme's latest `master` itself, so the committed pin only affects local builds. To publish a theme change, push to `master` here or run the Deploy workflow manually.

`gulp deploy` refuses to run while the theme is linked. See `AGENTS.md` for the full loop.

## Manual Hexo Commands

You can still run Hexo commands directly if needed:

```bash
hexo generate
hexo serve
hexo deploy
```

### Create new content

```bash
hexo new post "My Post Title"
hexo new page "about"
hexo new draft "idea-note"
hexo new review "Game Title"   # uses scaffolds/review.md
```

Move drafts to `source/_posts` (or run `hexo publish <draft>`) when ready.

## Project Structure

- `gulpfile.js`: Gulp tasks for Hexo commands
- `source/`: Your Hexo content
- `themes/`: gitignored; only present while the local theme is linked
- `README.md`: This file

---

Using Gulp makes running Hexo tasks easier and more consistent!

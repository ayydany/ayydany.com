# AGENTS.md (ayydany.com)

This repository contains the source code for my personal portfolio website, built with **Hexo** and my Catppuccin fork of the **Cactus** theme ([`ayydany/hexo-theme-cactus-catppuccin`](https://github.com/ayydany/hexo-theme-cactus-catppuccin), checked out locally at `../hexo-theme-cactus-catppuccin`).

## 🏗 Repository Structure

- **`source/`**: Markdown posts, pages, and static assets.
- **`themes/`**: Gitignored. Only exists while the local theme checkout is linked (see below). Never commit it.
- **`_config.yml`**: Main Hexo configuration.
- **`_config.cactus.yml`**: Site-specific theme overrides (links, social, copy). Generic theme behavior belongs in the theme repo, not here.
- **`gulpfile.js`**: Build and automation tasks.

## 🚀 Hexo Workflow

| Task | Command | Description |
| :--- | :--- | :--- |
| **Clean** | `npx gulp clean` | Removes `public/`, `db.json`, `node_modules/`, and `.deploy_git/`. |
| **Develop** | `npx gulp dev` | Runs `hexo generate -w` and `hexo server` together. |
| **Generate** | `npx gulp generate` | Builds the static site into `public/`. |
| **Deploy** | `npx gulp deploy` | Deploys to the `live` branch. Normally CI does this on push to `master`. Refuses to run while the theme is linked. |
| **New Post** | `npx hexo new post "Title"` | Creates a new blog post in `source/_posts/`. Prefer writing in the vault (below). |
| **Vault Sync** | `npx gulp vaultSync` | Syncs Obsidian vault posts with a `status` into `source/_drafts` / `source/_posts`. |
| **Preview** | `npx gulp preview` | Vault sync in watch mode plus `hexo server --draft`. |

## ✍️ Vault Posts

Posts synced from the Obsidian vault (`tools/vault-sync.mjs`, listed in `vault-sync.json`) are generated files: edit the vault note, not `source/_posts/<slug>.md`, or the next sync overwrites it. `source/_drafts/` is gitignored and generated. See README "Writing posts in Obsidian".

## ✅ CI

- `.github/workflows/build.yml`: build-only check on pull requests.
- `.github/workflows/deploy.yml`: builds and deploys to `live` on every push to `master`.
- **Both workflows build with the theme's latest `master`**, not the committed pin. After `npm ci` they run `npx gulp themeBump` (in the runner only; nothing is committed back). So whatever is on theme `master` ships on the next site deploy, and the committed pin only affects local builds.

## 🎨 Theme Development Loop

The theme is an npm dependency pinned to a commit SHA in `package.json`, but CI always builds with the theme's latest `master` (see CI above). **Theme `master` is effectively production**: it goes live on the next site deploy. So iterate locally and only merge working theme changes:

1. **Link** the local checkout: `npx gulp themeLink`
   - Creates the gitignored symlink `themes/cactus -> ../hexo-theme-cactus-catppuccin`. Hexo prefers `themes/<name>/` over `node_modules/hexo-theme-<name>/`, so the local theme overrides the pinned one. `package.json` and the lockfile are not touched.
   - Set `THEME_DIR=/path/to/checkout` if the theme lives elsewhere.
2. **Develop**: `npx gulp dev`, then edit files in the theme repo. Watch mode picks up theme changes.
3. **Verify the theme** in its own repo: `npm test` and `npm run lint`.
4. **Commit and push** the theme changes from the theme repo, using its own branch/PR flow.
5. **Unlink**: `npx gulp themeUnlink`
6. **Optional: refresh the local pin** with `npx gulp themeBump` so local builds match what CI deploys. Defaults to the theme's remote `master`; `THEME_REF=<branch-or-sha>` picks another. Commit `package.json` and `package-lock.json` together as one `chore(theme): ...` commit. CI doesn't need this.
   - To publish a theme change, push any commit to site `master` or run the Deploy workflow manually (`gh workflow run deploy.yml`).

Rules for agents:
- Don't make pin commits just to get a theme change deployed. CI already uses the latest theme.
- Never commit `themes/` and never deploy while linked (the `deploy` task enforces this).
- Check `test -L themes/cactus` before assuming which theme build is in use.

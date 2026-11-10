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
| **New Post** | `npx hexo new post "Title"` | Creates a new blog post in `source/_posts/`. |

## ✅ CI

- `.github/workflows/build.yml`: build-only check on pull requests.
- `.github/workflows/deploy.yml`: builds and deploys to `live` on every push to `master`.

## 🎨 Theme Development Loop

The theme is an npm dependency pinned to a commit SHA in `package.json`. **Pushing to `master` here deploys to production**, so do not iterate on theme changes by pushing theme commits and re-pinning each one. Iterate locally, then pin once:

1. **Link** the local checkout: `npx gulp themeLink`
   - Creates the gitignored symlink `themes/cactus -> ../hexo-theme-cactus-catppuccin`. Hexo prefers `themes/<name>/` over `node_modules/hexo-theme-<name>/`, so the local theme overrides the pinned one. `package.json` and the lockfile are not touched.
   - Set `THEME_DIR=/path/to/checkout` if the theme lives elsewhere.
2. **Develop**: `npx gulp dev`, then edit files in the theme repo. Watch mode picks up theme changes.
3. **Verify the theme** in its own repo: `npm test` and `npm run lint`.
4. **Commit and push** the theme changes from the theme repo, using its own branch/PR flow.
5. **Unlink**: `npx gulp themeUnlink`
6. **Pin** the pushed commit: `npx gulp themeBump`
   - Defaults to the theme's remote `master`. Use `THEME_REF=<branch-or-sha>` to choose another.
   - Then run `npx gulp generate` to check the site against the pinned theme, and commit `package.json` and `package-lock.json` in a single `chore(theme): ...` commit.

Rules for agents:
- Make one pin commit per batch of theme work, not one per theme commit.
- Never commit `themes/` and never deploy while linked (the `deploy` task enforces this).
- Check `test -L themes/cactus` before assuming which theme build is in use.

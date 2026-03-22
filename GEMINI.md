# GEMINI.md (ayydany.com)

This repository contains the source code for my personal portfolio website, built with **Hexo** and the **Cactus** theme.

## 🏗 Repository Structure

- **`source/`**: Markdown posts, pages, and static assets.
- **`themes/`**: (DEPRECATED) Theme is now managed via NPM (`hexo-theme-cactus`).
- **`_config.yml`**: Main Hexo configuration.
- **`_config.cactus.yml`**: Theme-specific configuration overrides.
- **`gulpfile.js`**: Build and automation tasks.

## 🚀 Hexo Workflow

Use the following commands (or the `hexo-workflow` skill) for development:

| Task | Command | Description |
| :--- | :--- | :--- |
| **Clean** | `gulp clean` | Removes `public/`, `db.json`, and other artifacts. |
| **Develop** | `gulp dev` | Starts a local server with live-reloading (`hexo server -w`). |
| **Generate** | `gulp generate` | Builds the static site into `public/`. |
| **Deploy** | `gulp deploy` | Deploys the site to the `live` branch on GitHub. |
| **New Post** | `hexo new post "Title"` | Creates a new blog post in `source/_posts/`. |

## 🛠 Maintenance Guidelines

- **Theme Updates**: To update the theme, update the git hash/branch in `package.json` and run `npm install`.
- **Styling**: Most styling overrides are handled via `_config.cactus.yml` or by modifying the fork at `github:ayydany/hexo-theme-cactus`.

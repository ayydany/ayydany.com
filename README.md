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

## Theme development

The theme ([`ayydany/hexo-theme-cactus-catppuccin`](https://github.com/ayydany/hexo-theme-cactus-catppuccin)) is pinned in `package.json`. To work on it against this site without pushing anything:

```bash
npx gulp themeLink    # symlink themes/cactus -> ../hexo-theme-cactus-catppuccin (gitignored)
npx gulp dev          # edit the theme; changes are picked up live
# commit + push in the theme repo, then:
npx gulp themeUnlink
npx gulp themeBump    # pin package.json to the theme's latest pushed master (THEME_REF=<ref> to override)
```

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

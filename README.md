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

```bash
gulp deploy
```

**Note:** For deployment to work, you must set the `GITHUB_TOKEN` environment variable with a valid GitHub token that has permission to push to your repository.

Example:

```bash
export GITHUB_TOKEN=your_token_here
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
- `themes/`: Hexo themes
- `README.md`: This file

---

Using Gulp makes running Hexo tasks easier and more consistent!

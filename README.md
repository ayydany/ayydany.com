# ayydany.com

This project uses [Hexo](https://hexo.io/) for static site generation and [Gulp](https://gulpjs.com/) to simplify common tasks.

## Usage

### Install Dependencies

```bash

npm install

```

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

## Project Structure

- `gulpfile.js`: Gulp tasks for Hexo commands
- `source/`: Your Hexo content
- `themes/`: Hexo themes
- `README.md`: This file

---

Using Gulp makes running Hexo tasks easier and more consistent!

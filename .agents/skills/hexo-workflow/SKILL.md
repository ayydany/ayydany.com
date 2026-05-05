---
name: hexo-workflow
description: Expert guidance for managing the ayydany.com website, including content creation, previewing, and deployment using Hexo and Gulp.
---

# Hexo Workflow (ayydany.com)

Expert guidance for managing the **ayydany.com** website, including content creation, previewing, and deployment.

## 📝 Content Creation

- **New Post**: Use `hexo new post "My New Post"`. Files are created in `source/_posts/`.
- **New Page**: Use `hexo new page "about"`. Files are created in `source/about/index.md`.
- **Front Matter**: Ensure all posts include a `title`, `date`, and relevant `tags`.

## 🖥 Local Development

- **Local Preview**: Use `gulp dev` to start a local server (`http://localhost:4000`) with live-reloading enabled.
- **Clean Build**: If files aren't updating, run `gulp clean` followed by `gulp generate`.

## 🚀 Deployment

- **Automated Deploy**: Run `gulp deploy`. This will:
  1. Generate a production build.
  2. Push the `public/` folder contents to the `live` branch on GitHub.
  3. Ensure `$GITHUB_TOKEN` is available in the environment if running in CI.

## 🎨 Theme Customization

- **Config Overrides**: All theme-specific settings should be made in `_config.cactus.yml`.
- **NPM Integration**: The Cactus theme is managed via NPM. To update, run `npm install github:ayydany/hexo-theme-cactus --save`.

## 📂 Troubleshooting

- **Stylus Errors**: If styles aren't rendering, ensure `hexo-renderer-stylus` is properly installed and run `gulp clean`.
- **Missing Images**: Verify image paths in Markdown are relative to the post folder if `post_asset_folder` is enabled.

# Agent Notes

- Always use 'pkill -f "gulp|hexo" || true && gulp clean && gulp generate && gulp dev' to rebuild and preview the site reliably.
- Always rebuild first with 'gulp clean && gulp generate', THEN start the server as a standalone background command with 'gulp dev'.

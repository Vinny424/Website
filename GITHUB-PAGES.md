# GitHub Pages deployment

This folder is ready to publish as a static GitHub Pages site.

- Enable GitHub Pages from the `main` branch and repository root (`/`).
- `.nojekyll` is required so the `_ds/` design-system assets are served.
- `index.html` is the public home page.
- Public routes use normal `.html` files; the `.dc.html` files remain as component sources used by `support.js`.
- No build step is required.

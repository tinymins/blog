# Emil Zhai's Blog

A static SPA (Vite + React 19 + TS) hosted on GitHub Pages.
**Posts live as GitHub Issues** — open a new issue to publish a post.

🌐 **Production**: https://minrc.com/  ·  **Repo Pages preview**: https://tinymins.github.io/blog/

---

## How content works

| Thing | Where |
| --- | --- |
| Post body | A GitHub **Issue** opened by the repo owner (`tinymins`) |
| Post title | Issue title |
| Categories / tags | Issue labels |
| Comments | Issue comments |
| Images | Pushed to the **`assets`** branch under `posts/<slug>/`, embedded in the issue body via `https://raw.githubusercontent.com/tinymins/blog/assets/...` |

The frontend fetches issues via the public GitHub REST API — no backend, no auth. See [`src/api.ts`](src/api.ts).

## Publish a new post

1. Open a new issue at https://github.com/tinymins/blog/issues/new
2. Title = post title; body = markdown
3. To embed an image, drag-and-drop into the issue editor (GitHub will host it on `user-attachments`), **or** push it to the `assets` branch and reference its raw URL — your call. Both work.
4. Add labels for category / tags.
5. Submit. Frontend will pick it up on next page load (no rebuild needed — content is fetched at runtime).

Editing or deleting a post = edit or close the issue.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output to dist/
npm run lint
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml` which builds and deploys to GitHub Pages via `actions/deploy-pages@v4`. No secrets required.

Optional: analytics (Google Analytics 4 + Microsoft Clarity) can be enabled via two repository secrets — see [`docs/ANALYTICS.md`](docs/ANALYTICS.md).

## Custom domain

`public/CNAME` contains `minrc.com`. To change domain:
1. Edit `public/CNAME`, commit, push.
2. Update DNS at your registrar (4 A records to GitHub Pages IPs, or CNAME to `tinymins.github.io.`).
3. In Settings → Pages, update Custom domain.

Other personal domains (`zhaiyiming.com`, `vmins.com`) are configured to 301-redirect to `minrc.com` at the DNS / registrar level (path-preserving).

## Migration from Typecho

Original blog was a self-hosted Typecho install at `zhaiyiming.com` (2014–2026).
All 66 published posts were migrated to issues by a one-time script:
- Parsed `typecho_contents` from a MySQL dump
- Extracted markdown bodies, categories, tags, embedded images
- Re-hosted images on the `assets` branch (originals on local server + fetched-from-live for legacy `wp-content/` paths + Renren `a.xnimg.cn` icons)
- Created issues in chronological order, so issue #1 = oldest post
- Original publish date appended as a footer in each post body

---

Made with assistance from GitHub Copilot.

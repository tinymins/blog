# Agent guide

Conventions for AI assistants (Copilot CLI / Claude Code / Codex / etc.) operating on this repo.

## Content model recap

- One **GitHub issue opened by `tinymins`** = one blog post.
- Issue **title** = post title; issue **body** (markdown) = post content.
- Issue **labels** = categories / tags shown on the site.
- Issue **comments** = post comments.
- All content is fetched at runtime via the public GitHub REST API in [`src/api.ts`](src/api.ts). No build-time content generation.

## Labels — golden rule

> **Every label must be in active use. Delete labels that no post references.**

The site's `/search` page lists labels by querying `/repos/.../labels` (every label defined on the repo). If a label exists but no issue uses it, it shows up as a clickable filter that returns zero results — a dead UI affordance for visitors.

### After publishing or deleting a post, run this check

```bash
# what's actually used by open issues authored by the owner
gh api --paginate "repos/tinymins/Blog/issues?state=open&creator=tinymins&per_page=100" \
  --jq '.[].labels[].name' | sort -u > /tmp/used.txt

# what's defined on the repo
gh api --paginate "repos/tinymins/Blog/labels?per_page=100" \
  --jq '.[].name' | sort -u > /tmp/all.txt

# anything here = orphan label, DELETE it
comm -23 /tmp/all.txt /tmp/used.txt
```

### Delete orphan labels

```bash
gh label delete "<label name>" --yes -R tinymins/Blog
```

### Common offenders

GitHub auto-creates a default set of labels when a repo is first created (`bug`, `documentation`, `duplicate`, `enhancement`, `good first issue`, `help wanted`, `invalid`, `question`, `wontfix`). These are **not** blog categories — if they reappear (e.g. a fresh fork), delete them.

### When adding a new label to a post

If the desired label doesn't exist yet, GitHub will reject the addition. Create it first either via the UI or:

```bash
gh label create "<name>" --color "<6-hex>" -R tinymins/Blog
```

Pick a color consistent with existing siblings (look at the label list before choosing).

## Posts — operations checklist

When **publishing** a new post (new issue):

1. Title in the same language as the body (mostly Chinese on this blog).
2. If the post has a custom publish date (e.g. migrated from old blog, or backdated), prepend `<!-- date: 2024-05-12T08:00:00Z -->` (any ISO-8601 date) as the **first** line of the body. The frontend parses this via `dateFrontmatterRegex` in `src/api.ts` and uses it for sorting / display.
3. Attach images either by drag-and-drop in GitHub (auto-uploaded to `user-attachments`) **or** push to the `assets` branch under `posts/<slug>/` and reference via `https://raw.githubusercontent.com/tinymins/blog/assets/posts/<slug>/...`.
4. Apply labels for category / tags. **Use existing labels if at all possible.** Only create new ones when there's clear thematic need.
5. After publishing, no orphan-label cleanup is needed — you only added labels.

When **deleting / unpublishing** a post (closing an issue, or removing labels):

1. Close the issue (don't delete — preserves comment history & permalinks).
2. **Run the orphan-label check above.** Deleting a post may leave behind labels that were only used by it.
3. Delete any orphan labels surfaced by the check.

When **renaming a label**:

1. Use `gh label edit "<old>" --name "<new>" -R tinymins/Blog` — GitHub re-points all issues automatically.
2. No code change needed; the frontend reads label names dynamically.

## Code conventions (quick reference)

Full conventions live in the inline instructions for human contributors. Highlights for agents:

- All GitHub API calls go through [`src/api.ts`](src/api.ts); do **not** `fetch` GitHub directly from components.
- TypeScript strict; no `any`. Use `unknown` + type guards when needed.
- No UI framework (Tailwind / MUI / Antd / shadcn). Styles are hand-written CSS in `src/**/*.css` and `src/index.css`.
- No state-management library (Redux / Zustand / Jotai). Hooks + props.
- No data-fetching library (SWR / React Query). Plain `fetch` via `src/api.ts`.
- Markdown is rendered with `marked` only. Don't add a second markdown renderer.
- Run `npm run lint` and `npm run build` before declaring code work done; both must pass.
- One independent fix = one commit.
- Do **not** push automatically — `git commit` freely, `git push` only when explicitly approved.

## Workflow / deployment

- `main` → push triggers `.github/workflows/deploy.yml` → `actions/deploy-pages@v4`.
- Don't touch `.github/workflows/deploy.yml` or `public/CNAME` unless the task explicitly requires it.
- Analytics IDs are injected at build time from `VITE_GA_ID` / `VITE_CLARITY_ID` repo secrets. See [`docs/ANALYTICS.md`](docs/ANALYTICS.md).

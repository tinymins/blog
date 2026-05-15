# Analytics Setup Guide

This blog ships with optional integrations for two analytics providers:

- **Google Analytics 4 (GA4)** — main global analytics; rich reports.
- **Microsoft Clarity** — free, unlimited; PV/UV plus heatmaps and session
  recordings. Hosted on Microsoft's global CDN, so it works reliably for
  visitors inside mainland China.

Both are **opt-in**. If you don't configure an ID for a provider, the
corresponding script is never loaded. Analytics is also fully disabled in
local development (`npm run dev`) regardless of configuration — it only
runs in production builds (`npm run build`).

You don't need both. Use only what you want.

---

## 1. Register a GA4 property

1. Visit <https://analytics.google.com/> and sign in with a Google account.
2. Click **Admin** (bottom-left gear icon) → **Create** → **Account**. Pick a
   name, timezone and reporting currency.
3. Under the new account, **Create** → **Property**. Name it (e.g. "Blog"),
   pick your timezone and currency, then **Next** → fill business info →
   **Create**.
4. When prompted for a data stream platform, pick **Web**. Enter your
   website URL (`https://minrc.com` or whatever domain you're deploying to)
   and a stream name → **Create stream**.
5. On the stream details page, copy the **Measurement ID** at the top
   right — it looks like `G-XXXXXXXXXX`. That string is the value you'll
   put into the `VITE_GA_ID` secret below.

**Where to view data later:** GA4 → **Reports → Realtime** for live
traffic; **Reports → Engagement → Pages and screens** for per-page
breakdowns. Reports usually lag the realtime view by 24–48 hours.

> **About mainland China visitors:** The GA4 script is served from
> `www.googletagmanager.com`, which is intermittently blocked from
> mainland China. Expect somewhere between 50% and 85% of your
> mainland visitors to successfully load it — the rest never get the
> script and never appear in your GA4 reports. This loss is invisible
> in the dashboard (GA only shows what it received). For a more honest
> picture of your China traffic, cross-reference with Clarity below.

---

## 2. Register a Microsoft Clarity project

1. Visit <https://clarity.microsoft.com/> and sign in (Microsoft, Google
   or Facebook account all work).
2. Click **+ New project**. Fill in:
   - **Name**: anything (e.g. "Blog")
   - **Website URL**: your blog's URL
   - **Site category**: pick "Personal blog" or whatever fits
3. After creation, open the project, then click the gear icon →
   **Settings → Setup**. The first field, **Project ID**, is a short
   alphanumeric string (~10 chars) — that's the value for the
   `VITE_CLARITY_ID` secret.

**Where to view data later:** Clarity → **Dashboard** for traffic,
sources, devices, countries; **Recordings** for individual session
playbacks; **Heatmaps** for click/scroll heatmaps per URL. Data shows
up within a few minutes of the first real visit.

Clarity records mouse movement and clicks by default but **does not**
capture text typed into form fields — input contents are masked.

---

## 3. Configure GitHub Actions secrets

The IDs are read at **build time** by Vite. In GitHub Actions, the deploy
workflow (`.github/workflows/deploy.yml`) reads them from repository
secrets and injects them into the build step.

1. Open the repo on GitHub → **Settings** (top tab).
2. In the left sidebar, under **Security**, click **Secrets and variables
   → Actions**.
3. Click **New repository secret**:
   - **Name**: `VITE_GA_ID`
   - **Secret**: the `G-XXXXXXXXXX` from step 1
   - Click **Add secret**
4. Click **New repository secret** again:
   - **Name**: `VITE_CLARITY_ID`
   - **Secret**: the Clarity project ID from step 2
   - Click **Add secret**

That's it. The next push to `main` triggers the deploy workflow, which
will build the site with these IDs baked in. Verify by opening the
deployed site and checking the browser DevTools **Network** tab — you
should see requests to `googletagmanager.com/gtag/js` and/or
`clarity.ms/tag/...` returning 200.

### Using only one provider

Leave the unwanted secret blank (or don't create it). The corresponding
script will be omitted from the bundle and no requests will be made.

### Rotating an ID

Edit the secret value in the Actions UI, then either push a new commit
or manually re-run the deploy workflow from the Actions tab.

---

## 4. Local development

`npm run dev` never sends analytics, even if you have a local `.env`
file with the IDs set. The `initAnalytics()` function in
`src/analytics.ts` early-returns when `import.meta.env.PROD` is false.

If you want to test analytics integration locally:

1. Copy `.env.example` to `.env.local` and fill in real IDs.
2. Run `npm run build && npm run preview`.
3. Open the previewed site and check DevTools → Network.

`.env.local` is gitignored — don't commit it.

---

## 5. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| No data in GA4 realtime after deploy | Check Network panel for `gtag/js` request. If it 404s or never fires, the secret may be empty or misnamed. |
| No data in Clarity | Same as above for `clarity.ms/tag/<id>`. Clarity also needs at least one real visit; your own first visit shows up within ~2 minutes. |
| Pageviews don't increment on route change | The `useAnalytics` hook must be called inside `<BrowserRouter>`. It already is, in `src/App.tsx`. If you restructure routing, keep it there. |
| Mainland China visitors missing from GA4 | Expected (see note in §1). Use Clarity numbers as the cross-check. |
| Analytics fires in `npm run dev` | It shouldn't — `initAnalytics()` is guarded by `import.meta.env.PROD`. If it does, you're probably running `vite preview` or a production build locally. |

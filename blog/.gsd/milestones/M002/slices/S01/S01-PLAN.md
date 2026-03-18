# S01: Deploy to Cloudflare Pages with custom domain, performance, and analytics

**Goal:** The site auto-deploys from GitHub to Cloudflare Pages and is live at https://vahagn.dev with Lighthouse 95+, cache headers, Brotli, and analytics.
**Demo:** Push a commit to main → CF Pages auto-builds → visit https://vahagn.dev and browse the full site → Lighthouse scores 95+ → Cloudflare Web Analytics shows page views.

## Must-Haves

- `.node-version` file with `22` for CF Pages build environment (Node ≥22.12.0 required by `package.json` engines)
- `public/_headers` with cache-control for static assets and security headers (no `no-transform` on HTML — would block Web Analytics beacon injection)
- CF Pages project connected to GitHub repo with correct build settings (`npm run build`, output `dist`, framework preset Astro)
- `NODE_VERSION=22` set as CF Pages environment variable (belt-and-suspenders alongside `.node-version`)
- Custom domain `vahagn.dev` configured on CF Pages with HTTPS
- `www.vahagn.dev` → `vahagn.dev` redirect
- Cloudflare Web Analytics enabled via Pages dashboard (one-click, no code changes)
- Lighthouse 95+ on all four metrics against the live production URL

## Verification

- `npm run build` — 22 pages, zero errors (pre-deploy sanity check)
- CF Pages build log shows successful build with Node 22 and all 22 pages
- `curl -I https://vahagn.dev` → HTTP 200, valid `cf-ray` header, `content-type: text/html`
- `curl -I https://www.vahagn.dev` → redirects to `https://vahagn.dev`
- `curl -I https://vahagn.dev -H "Accept-Encoding: br"` → `content-encoding: br` (Brotli)
- `curl -I https://vahagn.dev/blog/` → 200 with HTML content
- `curl -I https://vahagn.dev/og/mastering-typescript-patterns.png` → 200 with `image/png` (OG images built correctly)
- Lighthouse CLI: `npx lighthouse https://vahagn.dev --output=json --chrome-flags="--headless"` → all scores ≥ 95
- Cloudflare Web Analytics dashboard shows page views after visiting the site
- `bash scripts/verify-m02.sh` — deployment verification script (created in T04)

## Tasks

- [x] **T01: Add build environment files and deploy to CF Pages** `est:20m`
  - Why: This is the highest-risk step — proving Node 22 + Sharp works in CF Pages' build environment. Everything else is blocked until the build succeeds. Also validates R021 (auto-deploy on push to main).
  - Files: `.node-version`, `public/_headers`
  - Do:
    1. Create `.node-version` containing `22` at the project root
    2. Create `public/_headers` with cache rules for static assets (`/_astro/*` gets `Cache-Control: public, max-age=31536000, immutable` since Astro hashes filenames; HTML pages get `Cache-Control: public, max-age=0, must-revalidate`) and security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`) — do NOT use `no-transform` on HTML pages as it blocks CF Web Analytics beacon injection
    3. Commit and push both files to `main`
    4. In Cloudflare dashboard: create a new Pages project, connect to the `vahagn-madatyan/me` GitHub repo, set framework preset to Astro, build command `npm run build`, output directory `dist`, add environment variable `NODE_VERSION=22` (and `SHARP_IGNORE_GLOBAL_LIBVIPS=1` as fallback for Sharp)
    5. Trigger the first build and monitor the build log for success
  - Verify: CF Pages build completes with zero errors; `<project>.pages.dev` URL serves the site; OG images are present at `<project>.pages.dev/og/mastering-typescript-patterns.png`
  - Done when: the site is live at the `.pages.dev` URL with all pages and OG images working

- [ ] **T02: Configure custom domain and DNS** `est:15m`
  - Why: Without the custom domain, there's no `vahagn.dev`. This validates R022 and starts DNS propagation early.
  - Files: none (Cloudflare dashboard configuration)
  - Do:
    1. If vahagn.dev is not already on Cloudflare: add it as a zone in Cloudflare dashboard, update registrar nameservers to Cloudflare's assigned nameservers, wait for zone activation
    2. In CF Pages project settings → Custom domains: add `vahagn.dev` as custom domain
    3. Add `www.vahagn.dev` as a second custom domain (CF Pages handles www→apex redirect automatically)
    4. Wait for SSL certificate provisioning (typically 5-15 minutes after DNS propagates)
  - Verify: `curl -I https://vahagn.dev` returns 200 with valid HTTPS; `curl -I https://www.vahagn.dev` redirects to `https://vahagn.dev`; all pages load at the production domain
  - Done when: `https://vahagn.dev` serves the site with valid HTTPS and www redirects to apex

- [ ] **T03: Verify performance and tune if needed** `est:15m`
  - Why: Validates R023 (Lighthouse 95+, Brotli, cache headers). The site's architecture (pure static, zero JS, one 57KB CSS file) should hit 95+ naturally, but this task verifies against the live URL and fixes any gaps.
  - Files: `public/_headers` (if adjustments needed)
  - Do:
    1. Run Lighthouse CLI against `https://vahagn.dev`: `npx lighthouse https://vahagn.dev --output=json --output=html --output-path=./lighthouse-report --chrome-flags="--headless"`
    2. Verify all four scores (Performance, Accessibility, Best Practices, SEO) are ≥ 95
    3. Verify Brotli: `curl -I https://vahagn.dev -H "Accept-Encoding: br"` should show `content-encoding: br`
    4. Verify cache headers: `curl -I https://vahagn.dev/_astro/[any-hashed-file]` should show `cache-control: public, max-age=31536000, immutable`
    5. Verify HTML cache: `curl -I https://vahagn.dev/` should show `cache-control: public, max-age=0, must-revalidate`
    6. If any Lighthouse score is below 95, diagnose and fix (likely candidates: missing meta description on a page, image without dimensions, accessibility issue)
  - Verify: Lighthouse JSON output shows all scores ≥ 95; Brotli and cache headers confirmed via curl
  - Done when: Lighthouse audit produces 95+ on all four metrics against the live production URL

- [ ] **T04: Enable analytics and write deployment verification script** `est:15m`
  - Why: Validates R024 (Cloudflare Web Analytics) and creates the ongoing verification surface for the deployment. This is the final task because analytics is lowest-risk and depends on the site being live.
  - Files: `scripts/verify-m02.sh`
  - Do:
    1. In Cloudflare dashboard: Workers & Pages → project → Metrics → Enable Web Analytics (one-click, auto-injects beacon on next deploy)
    2. Trigger a redeploy (push a trivial commit or use CF Pages dashboard) so the beacon gets injected
    3. Visit several pages on https://vahagn.dev to generate analytics data
    4. Check CF Web Analytics dashboard — should show page views within a few minutes
    5. Write `scripts/verify-m02.sh` that checks the deployment is healthy:
       - `curl -sI https://vahagn.dev` returns 200
       - Response includes `cf-ray` header (served by Cloudflare)
       - `curl -sI https://vahagn.dev -H "Accept-Encoding: br"` includes `content-encoding: br`
       - `curl -s https://vahagn.dev | grep -q 'static.cloudflareinsights.com'` (Web Analytics beacon present)
       - `curl -sI https://vahagn.dev/blog/` returns 200
       - `curl -sI https://vahagn.dev/rss.xml` returns 200
       - `curl -sI https://vahagn.dev/sitemap-index.xml` returns 200
       - `curl -sI https://vahagn.dev/og/mastering-typescript-patterns.png` returns 200 with content-type image/png
  - Verify: `bash scripts/verify-m02.sh` passes all checks; CF Web Analytics dashboard shows page views
  - Done when: Web Analytics is recording page views and verify-m02.sh passes all checks against the live site

## Observability / Diagnostics

**Runtime signals:**
- CF Pages build log: success/failure status, Node version used, page count, Sharp compatibility
- `cf-ray` response header on every request confirms Cloudflare is serving the site
- `_headers` file rules are observable via `curl -I` on any page or asset path
- Brotli encoding confirmed via `content-encoding: br` header when `Accept-Encoding: br` is sent
- Web Analytics beacon presence: `grep 'static.cloudflareinsights.com'` in page HTML

**Inspection surfaces:**
- `curl -I https://vahagn.dev` — HTTP status, cache headers, `cf-ray`, content-type
- `curl -I https://vahagn.dev/_astro/<any-hashed-file>` — immutable cache header verification
- `curl -I https://vahagn.dev/og/<slug>.png` — OG image availability and content-type
- CF Pages dashboard → Deployments → build log for each deploy
- CF Web Analytics dashboard → page views and beacon injection status
- `scripts/verify-m02.sh` (created in T04) — automated health check script

**Failure visibility:**
- CF Pages build failure: visible in dashboard Deployments tab with full build log
- Missing `_headers` rules: detectable via `curl -I` showing default headers instead of custom ones
- OG image generation failure: 404 on `/og/*.png` paths
- Web Analytics beacon blocked by `no-transform`: `curl -s https://vahagn.dev | grep -c 'cloudflareinsights'` returns 0

**Redaction constraints:**
- No secrets in committed files — CF Pages env vars (`NODE_VERSION`, `SHARP_IGNORE_GLOBAL_LIBVIPS`) are non-sensitive build config
- Cloudflare account ID and API tokens are dashboard-only, never in repo

## Files Likely Touched

- `.node-version` (new — Node version for CF Pages build)
- `public/_headers` (new — cache control and security headers)
- `scripts/verify-m02.sh` (new — deployment health verification script)

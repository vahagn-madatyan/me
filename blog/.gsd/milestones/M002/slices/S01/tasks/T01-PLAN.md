---
estimated_steps: 5
estimated_files: 2
---

# T01: Add build environment files and deploy to CF Pages

**Slice:** S01 — Deploy to Cloudflare Pages with custom domain, performance, and analytics
**Milestone:** M002

## Description

Create the two static files needed for Cloudflare Pages deployment (`.node-version` and `public/_headers`), push them to main, then set up the CF Pages project in the dashboard connected to the GitHub repo. This retires the highest risk — Node 22 + Sharp compatibility in CF Pages' build environment.

## Steps

1. Create `.node-version` at project root containing `22` (CF Pages reads this to select Node version; `package.json` requires `>=22.12.0`)
2. Create `public/_headers` with Cloudflare Pages header rules:
   - `/_astro/*` → `Cache-Control: public, max-age=31536000, immutable` (Astro hashes all asset filenames)
   - `/*` → `Cache-Control: public, max-age=0, must-revalidate` plus security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`)
   - Important: do NOT use `no-transform` on HTML pages — it blocks Cloudflare Web Analytics beacon auto-injection
3. Run `npm run build` locally to verify the new files don't break anything (they shouldn't — they're static files copied to `dist/`)
4. Commit and push both files to `main`
5. In Cloudflare dashboard: create Pages project → connect `vahagn-madatyan/me` repo → framework preset Astro → build command `npm run build` → output directory `dist` → environment variables `NODE_VERSION=22` and `SHARP_IGNORE_GLOBAL_LIBVIPS=1` → deploy

## Must-Haves

- [ ] `.node-version` file exists at project root with content `22`
- [ ] `public/_headers` has immutable cache on `/_astro/*` and security headers on `/*`
- [ ] `public/_headers` does NOT contain `no-transform` on HTML paths
- [ ] CF Pages build completes with zero errors
- [ ] Site is accessible at `<project>.pages.dev`
- [ ] OG images are present (e.g., `/og/mastering-typescript-patterns.png` returns 200)

## Verification

- `npm run build` locally — 22 pages, zero errors
- `cat .node-version` → `22`
- `cat public/_headers` → contains `Cache-Control` and security headers, no `no-transform` on `/*`
- CF Pages build log shows Node 22, successful `npm run build`, zero errors
- `curl -I https://<project>.pages.dev` → 200
- `curl -I https://<project>.pages.dev/og/mastering-typescript-patterns.png` → 200, `content-type: image/png`

## Inputs

- Complete static site from M001 — `npm run build` produces 22 pages in `dist/`
- `astro.config.mjs` with `site: 'https://vahagn.dev'` already set
- `package.json` with `engines.node: ">=22.12.0"`

## Expected Output

- `.node-version` — new file, Node version for CF Pages
- `public/_headers` — new file, cache control and security response headers
- Live site at `<project>.pages.dev` served by Cloudflare Pages

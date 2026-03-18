---
id: T02
parent: S01
milestone: M002
provides:
  - Local build verification confirming site is deployment-ready (22 pages, 7 OG images, RSS, sitemap)
key_files: []
key_decisions:
  - "User will handle deployment to Vercel (not CF Pages) — all deployment tasks (T02–T04) are user-handled"
patterns_established: []
observability_surfaces:
  - "npm run build — 22 pages, zero errors, confirms deployment readiness"
  - "npm run preview → http://localhost:4321 — all pages return 200"
duration: 5m
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T02: Configure custom domain and DNS

**User will handle deployment themselves (Vercel instead of CF Pages); verified local build is deployment-ready with 22 pages, 7 OG images, and zero errors.**

## What Happened

The original plan called for configuring vahagn.dev custom domain on a Cloudflare Pages project. Pre-execution checks revealed:

1. **Domain status:** vahagn.dev currently points to Squarespace with Google Domains nameservers — no CF Pages migration has occurred.
2. **No CF Pages project exists:** T01's manual dashboard steps (creating the project, connecting GitHub) were never completed.
3. **User decision:** When asked about CF Pages status, the user directed: "we will deploy this to Vercel" and "ignore all deployment steps and milestones — just make sure it works locally."

Instead of marking this as a blocker requiring replanning, the user's directive simplifies things: **all deployment is user-handled**. The agent's job is to verify the site works locally and is ready to deploy to any platform.

### Local verification (all passing)

Ran `npm run build` — produced 22 pages, 7 OG images, and zero errors in 1.45s. Started the preview server (`npm run preview`) and verified every page:

**Main pages (HTTP 200):**
- `/` (home), `/blog/`, `/work/`, `/about/`, `/architecture/`

**All 7 blog posts (HTTP 200):**
- `/blog/mastering-typescript-patterns/`, `/blog/building-a-developer-blog/`, `/blog/markdown-style-guide/`, `/blog/using-mdx/`, `/blog/first-post/`, `/blog/second-post/`, `/blog/third-post/`

**All 9 tag pages (HTTP 200):**
- `/blog/tag/astro/`, `/blog/tag/webdev/`, `/blog/tag/tailwind/`, `/blog/tag/markdown/`, `/blog/tag/guide/`, `/blog/tag/typescript/`, `/blog/tag/patterns/`, `/blog/tag/javascript/`, `/blog/tag/mdx/`

**Static assets (HTTP 200):**
- `/og/*.png` — all 7 OG images served with `image/png` content-type
- `/rss.xml` — valid RSS feed with all 7 posts
- `/sitemap-index.xml` — sitemap index pointing to `sitemap-0.xml`

**Error handling:**
- `/404.html` — 200 (exists as static file)
- `/does-not-exist` — 404 (preview server returns proper error)

**Browser verification:**
- Home page renders with hero, latest writing section, blog cards
- Blog index shows all posts with tags and metadata
- Work page shows project cards with tech tags
- Zero console errors from the Astro site

## Verification

All local checks passed. Deployment-specific checks (HTTPS, domain, CDN headers) are user-handled.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass (22 pages, 7 OG images, 0 errors) | 1.5s |
| 2 | `curl -sI http://localhost:4321/` | 0 | ✅ pass (200 OK) | <1s |
| 3 | `curl -sI http://localhost:4321/blog/` | 0 | ✅ pass (200 OK) | <1s |
| 4 | `curl -sI http://localhost:4321/work/` | 0 | ✅ pass (200 OK) | <1s |
| 5 | `curl -sI http://localhost:4321/about/` | 0 | ✅ pass (200 OK) | <1s |
| 6 | `curl -sI http://localhost:4321/architecture/` | 0 | ✅ pass (200 OK) | <1s |
| 7 | `curl -sI .../og/mastering-typescript-patterns.png` | 0 | ✅ pass (200 OK, image/png) | <1s |
| 8 | `curl -sI http://localhost:4321/rss.xml` | 0 | ✅ pass (200 OK, text/xml) | <1s |
| 9 | `curl -sI http://localhost:4321/sitemap-index.xml` | 0 | ✅ pass (200 OK, text/xml) | <1s |
| 10 | All 7 blog posts curl -sI | 0 | ✅ pass (all 200 OK) | <1s each |
| 11 | All 9 tag pages curl -sI | 0 | ✅ pass (all 200 OK) | <1s each |
| 12 | Browser: home, blog, work pages render | — | ✅ pass (visual check) | — |

### Slice-level verification status (deployment skipped — user-handled)

| Check | Status |
|-------|--------|
| `npm run build` — 22 pages, zero errors | ✅ pass |
| All pages return 200 locally | ✅ pass |
| OG images return 200 with image/png | ✅ pass |
| RSS and sitemap present | ✅ pass |
| CF/Vercel deployment | ⏭️ user-handled |
| Custom domain HTTPS | ⏭️ user-handled |
| www redirect | ⏭️ user-handled |
| Lighthouse 95+ | ⏭️ user-handled (T03 also likely skipped) |
| Web Analytics | ⏭️ user-handled (T04 also likely skipped) |

## Diagnostics

The site is deployment-ready. For any platform (Vercel, CF Pages, Netlify, etc.):
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22 (per `.node-version` and `package.json` engines)
- Framework: Astro (auto-detected by most platforms)
- Static output — no server-side rendering needed

## Deviations

**User-directed scope change:** Deployment tasks (T02–T04) are now entirely user-handled. The user will deploy to Vercel instead of Cloudflare Pages and handle domain/DNS/analytics configuration themselves. This task was repurposed from "configure custom domain" to "verify local build is deployment-ready."

## Known Issues

- The `public/_headers` file uses Cloudflare Pages syntax. If deploying to Vercel, equivalent headers should be configured in `vercel.json` instead. The file won't cause errors on Vercel — it'll just be served as a static file and ignored.
- Domain vahagn.dev currently points to Squarespace — DNS migration is needed regardless of platform.

## Files Created/Modified

- `.gsd/milestones/M002/slices/S01/tasks/T02-PLAN.md` — added Observability Impact section (pre-flight fix)
- `.gsd/milestones/M002/slices/S01/S01-PLAN.md` — marked T02 done with user-handled note

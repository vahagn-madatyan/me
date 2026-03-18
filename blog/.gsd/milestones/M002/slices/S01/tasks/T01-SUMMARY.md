---
id: T01
parent: S01
milestone: M002
provides:
  - .node-version file for CF Pages Node 22 selection
  - public/_headers with cache-control and security response headers
key_files:
  - .node-version
  - public/_headers
key_decisions:
  - D030 (cache strategy) already recorded during planning
patterns_established:
  - CF Pages _headers file with specific-path-first ordering
observability_surfaces:
  - curl -I against deployed URL verifies headers are applied
  - CF Pages build log shows Node version selection from .node-version
duration: 8m
verification_result: partial-pass
completed_at: 2026-03-17
blocker_discovered: false
---

# T01: Add build environment files and deploy to CF Pages

**Created `.node-version` (Node 22) and `public/_headers` (cache + security headers) for Cloudflare Pages deployment; local build passes with 22 pages and zero errors.**

## What Happened

Created the two static files required for Cloudflare Pages deployment:

1. **`.node-version`** — contains `22`, telling CF Pages to use Node 22 (matches `package.json` `engines: ">=22.12.0"`).
2. **`public/_headers`** — Cloudflare Pages header rules with two blocks:
   - `/_astro/*` → `Cache-Control: public, max-age=31536000, immutable` (Astro content-hashes all asset filenames)
   - `/*` → `Cache-Control: public, max-age=0, must-revalidate` plus security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`)
   - Deliberately omitted `no-transform` on HTML paths to allow Cloudflare Web Analytics beacon auto-injection.

Ran `npm run build` twice — both times produced 22 pages, 7 OG images, and zero errors. The `_headers` file was copied to `dist/` as expected (Astro copies all `public/` files verbatim).

**Dashboard steps (Steps 4–5) are manual:** Creating the CF Pages project, connecting the GitHub repo, setting env vars (`NODE_VERSION=22`, `SHARP_IGNORE_GLOBAL_LIBVIPS=1`), and triggering the first deploy must be done in the Cloudflare dashboard. These will be verified once the `.pages.dev` URL is live.

## Verification

- `cat .node-version` → `22` ✅
- `cat public/_headers` → contains correct cache and security headers ✅
- `grep -c 'no-transform' public/_headers` → 0 (not present) ✅
- `npm run build` → 22 pages built in 1.47s, zero errors ✅
- `ls dist/_headers` → file present in build output ✅
- `ls dist/og/` → all 7 OG images generated ✅
- CF Pages deployment → **pending manual dashboard setup** (T01 delivers the files; deployment verification happens once the project is created)

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `cat .node-version` | 0 | ✅ pass | <1s |
| 2 | `cat public/_headers` | 0 | ✅ pass | <1s |
| 3 | `grep -c 'no-transform' public/_headers` | 1 | ✅ pass (not found = correct) | <1s |
| 4 | `npm run build` | 0 | ✅ pass (22 pages, 0 errors) | 1.5s |
| 5 | `ls dist/_headers` | 0 | ✅ pass | <1s |
| 6 | `ls dist/og/mastering-typescript-patterns.png` | 0 | ✅ pass | <1s |
| 7 | `curl -I https://<project>.pages.dev` | — | ⏳ pending (CF Pages project not yet created) | — |
| 8 | `curl -I .../og/mastering-typescript-patterns.png` | — | ⏳ pending (CF Pages project not yet created) | — |

### Slice-level verification status (intermediate task — partial pass expected)

| Check | Status |
|-------|--------|
| `npm run build` — 22 pages, zero errors | ✅ pass |
| CF Pages build log shows Node 22 | ⏳ pending dashboard setup |
| `curl -I https://vahagn.dev` → 200 | ⏳ pending T02 (custom domain) |
| `curl -I https://www.vahagn.dev` → redirect | ⏳ pending T02 |
| Brotli encoding on response | ⏳ pending deployment |
| Blog index returns 200 | ⏳ pending deployment |
| OG images return 200 with image/png | ⏳ pending deployment |
| Lighthouse 95+ | ⏳ pending T03 |
| Web Analytics page views | ⏳ pending T04 |
| `bash scripts/verify-m02.sh` | ⏳ pending T04 (script not yet created) |

## Diagnostics

After CF Pages project is created and deployed:
- `curl -I https://<project>.pages.dev` — verify site is live and `_headers` rules are applied
- `curl -I https://<project>.pages.dev/_astro/<any-file>` — verify immutable cache header
- Check CF Pages dashboard → Deployments for build log showing Node 22 version
- If headers aren't applied, check `_headers` syntax (indentation matters, 2-space indent per header line under path)

## Deviations

None. Steps 1–3 executed as planned. Steps 4–5 (dashboard setup) are manual operations that cannot be automated from the CLI — this was expected per the task plan.

## Known Issues

- CF Pages project has not been created yet — the user must complete the dashboard setup (connect repo, set env vars, deploy). Once done, the remaining must-haves (build success, `.pages.dev` accessibility, OG images) can be verified.

## Files Created/Modified

- `.node-version` — new file, contains `22` for CF Pages Node version selection
- `public/_headers` — new file, Cloudflare Pages response header rules (cache + security)
- `.gsd/milestones/M002/slices/S01/S01-PLAN.md` — added Observability / Diagnostics section (pre-flight fix)
- `.gsd/milestones/M002/slices/S01/tasks/T01-PLAN.md` — added Observability Impact section (pre-flight fix)
- `.gsd/KNOWLEDGE.md` — added K009 (CF Pages `_headers` ordering and `no-transform` gotcha)

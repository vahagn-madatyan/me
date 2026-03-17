---
id: T03
parent: S03
milestone: M001
provides:
  - RSS feed with <category> elements from blog post tags
  - robots.txt with User-agent, Allow, and Sitemap directives
  - Sitemap serialize config with weekly changefreq and 0.8 priority for blog URLs
  - Comprehensive 29-check verify-s03.sh covering all S03 deliverables + S01/S02 regression
key_files:
  - src/pages/rss.xml.js
  - public/robots.txt
  - astro.config.mjs
  - scripts/verify-s03.sh
key_decisions:
  - "Used grep -o for RSS category counting since RSS XML is single-line — grep -c counts lines, not occurrences"
patterns_established:
  - "Verification scripts should use grep -o | wc -l for counting XML elements in single-line files, not grep -c"
observability_surfaces:
  - "bash scripts/verify-s03.sh — 29-check comprehensive verification for entire S03 slice"
  - "grep -o '<category>' dist/rss.xml | wc -l — counts RSS category elements (10 expected)"
  - "cat dist/robots.txt — shows robots directives"
  - "grep -E 'weekly|0\\.8' dist/sitemap-0.xml — confirms sitemap serialize config applied"
duration: 5m
verification_result: passed
completed_at: 2026-03-16
blocker_discovered: false
---

# T03: Update RSS with categories, add robots.txt, configure sitemap, write verification

**Added RSS category tags from post metadata, created robots.txt with sitemap reference, configured sitemap serialize for blog URLs, and wrote 29-check verification script proving entire S03 slice.**

## What Happened

1. **RSS categories** — Updated `src/pages/rss.xml.js` to map `post.data.tags` into the `categories` field for each RSS item. The `@astrojs/rss` package maps these to `<category>` XML elements. Result: 10 category elements across 7 non-draft posts (posts without tags correctly omit categories).

2. **robots.txt** — Created `public/robots.txt` with `User-agent: *`, `Allow: /`, and `Sitemap: https://vahagn.dev/sitemap-index.xml`. Astro copies `public/` files to `dist/` as-is.

3. **Sitemap serialize** — Confirmed `@astrojs/sitemap@3.7.1` supports the `serialize` callback (checked type declarations). Added serialize config to `astro.config.mjs` that sets `changefreq: 'weekly'` and `priority: 0.8` for URLs containing `/blog/`. Verified these values appear in `dist/sitemap-0.xml`.

4. **Verification script** — Wrote `scripts/verify-s03.sh` with 29 checks across 9 sections: OG images (7 checks), JSON-LD (3), OG meta tags (5), canonical URL (1), RSS categories (3), robots.txt (4), sitemap (3), S02 regression (1), S01 regression (1). All pass.

## Verification

- `bash scripts/verify-s03.sh` — **29/29 passed**
- `grep -o '<category>' dist/rss.xml | wc -l` → 10 category elements
- `cat dist/robots.txt` — contains User-agent, Allow, Sitemap directives
- `grep 'weekly' dist/sitemap-0.xml` — confirms serialize applied
- `bash scripts/verify-s02.sh` — 22/22 pass (no regressions)
- `bash scripts/verify-s01.sh` — 19/19 pass (no regressions)

## Diagnostics

- **RSS categories:** `grep -o '<category>' dist/rss.xml | wc -l` — 0 means tags not mapped; check `post.data.tags` is populated in content schema
- **Robots.txt:** `cat dist/robots.txt` — missing file means `public/robots.txt` wasn't created or Astro build skipped it
- **Sitemap:** `grep -E 'weekly|0\.8' dist/sitemap-0.xml` — absence means serialize callback isn't running; check `@astrojs/sitemap` version supports `serialize`
- **Full slice check:** `bash scripts/verify-s03.sh` — any failure exits non-zero with explicit ✗ marker and section context

## Deviations

- Fixed verification script to use `grep -o '<category>' | wc -l` instead of `grep -c '<category>'` — RSS XML is a single line so `-c` always returns 1 regardless of occurrence count.

## Known Issues

None.

## Files Created/Modified

- `src/pages/rss.xml.js` — added `categories: post.data.tags` to RSS item mapping
- `public/robots.txt` — new: robots directives with sitemap reference
- `astro.config.mjs` — added serialize callback to sitemap() integration
- `scripts/verify-s03.sh` — new: 29-check comprehensive S03 verification script
- `.gsd/milestones/M001/slices/S03/tasks/T03-PLAN.md` — added Observability Impact section (pre-flight fix)

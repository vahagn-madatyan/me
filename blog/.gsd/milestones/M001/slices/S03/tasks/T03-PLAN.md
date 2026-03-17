---
estimated_steps: 4
estimated_files: 4
---

# T03: Update RSS with categories, add robots.txt, configure sitemap, write verification

**Slice:** S03 — SEO & OG Images
**Milestone:** M001

## Description

Complete R017 (RSS categories, robots.txt, sitemap config) and write the comprehensive verification script that proves the entire S03 slice works. This is the lowest-risk task — mostly static files and config, plus assembling the verification script.

## Steps

1. **Update `src/pages/rss.xml.js`** — Add `categories` to each RSS item from the post's `tags` array. The `@astrojs/rss` package supports a `categories` field in each item object:
   ```js
   items: posts.map((post) => ({
     ...post.data,
     categories: post.data.tags,
     link: `/blog/${post.id}/`,
   })),
   ```
   This maps the `tags` array from the blog schema directly to RSS `<category>` elements.

2. **Create `public/robots.txt`** — Static file:
   ```
   User-agent: *
   Allow: /
   
   Sitemap: https://vahagn.dev/sitemap-index.xml
   ```
   This file is copied as-is to `dist/robots.txt` during build.

3. **Configure sitemap serialization in `astro.config.mjs`** — Add a `serialize` option to the `sitemap()` integration to set blog URLs with a higher `changefreq`:
   ```js
   sitemap({
     serialize(item) {
       if (item.url.includes('/blog/')) {
         item.changefreq = 'weekly';
         item.priority = 0.8;
       }
       return item;
     },
   })
   ```
   **Note:** Check the current `@astrojs/sitemap` version — the `serialize` API may differ. If `serialize` isn't supported, use `filter` or `customPages` instead. The sitemap is already working (link in BaseHead); this is enhancement only.

4. **Write `scripts/verify-s03.sh`** — Comprehensive verification script covering all S03 deliverables plus S01/S02 regression. Structure:
   - Header: run `npm run build` first
   - OG image checks: count PNG files in `dist/og/`, verify each non-draft post has one, spot-check dimensions
   - SEO meta checks: JSON-LD present in blog post HTML, og:image points to `/og/`, article OG tags present, og:type correct on blog vs non-blog pages
   - Canonical URL check: present in blog post HTML
   - RSS checks: `<category>` elements present in `dist/rss.xml`
   - Robots checks: `dist/robots.txt` exists, contains Sitemap reference
   - Sitemap check: sitemap files exist
   - S02 regression: `bash scripts/verify-s02.sh`
   - S01 regression: `bash scripts/verify-s01.sh`
   - Summary: total checks passed/failed

   Use the same pattern as `scripts/verify-s02.sh` (counter-based, pass/fail per check, summary at end).

## Must-Haves

- [ ] RSS feed items include `<category>` elements from post tags
- [ ] `public/robots.txt` exists with `User-agent`, `Allow`, and `Sitemap` directives
- [ ] Sitemap integration enhanced with blog-specific change frequency (best effort — skip if API not supported)
- [ ] `scripts/verify-s03.sh` covers all S03 deliverables and runs S01+S02 regression
- [ ] All verification checks pass

## Verification

- `npm run build` — zero errors
- `bash scripts/verify-s03.sh` — all checks pass
- `grep '<category>' dist/rss.xml` — shows tag categories
- `test -f dist/robots.txt && grep 'Sitemap' dist/robots.txt` — robots.txt deployed
- `bash scripts/verify-s02.sh` — 22/22 pass (no regressions)
- `bash scripts/verify-s01.sh` — 19/19 pass (no regressions)

## Inputs

- `src/pages/rss.xml.js` — current RSS feed: fetches blog collection, filters drafts, maps to items with `...post.data` and link. No categories yet.
- `src/content.config.ts` — blog schema includes `tags: z.array(z.string()).default([])` from S02.
- `astro.config.mjs` — current: `integrations: [mdx(), sitemap()]` with no sitemap options.
- `scripts/verify-s02.sh` — existing 22-check verification script (regression baseline).
- `scripts/verify-s01.sh` — existing 19-check verification script (regression baseline).
- T01 output: OG PNG files in `dist/og/` for each non-draft post.
- T02 output: JSON-LD, article OG tags, and canonical URL in blog post HTML.

## Expected Output

- `src/pages/rss.xml.js` — updated with `categories` field from tags
- `public/robots.txt` — new static file with robots directives and sitemap reference
- `astro.config.mjs` — sitemap integration with serialize config (if API supports it)
- `scripts/verify-s03.sh` — new comprehensive verification script, all checks passing

## Observability Impact

- **RSS categories:** `grep -o '<category>' dist/rss.xml | wc -l` — counts category elements; 0 means tags aren't mapping
- **Robots.txt:** `cat dist/robots.txt` — should show User-agent, Allow, Sitemap directives; missing file means `public/robots.txt` wasn't created
- **Sitemap config:** `grep -E 'weekly|0\.8' dist/sitemap-0.xml` — confirms serialize config applied; absence means serialize callback isn't running
- **Verification script:** `bash scripts/verify-s03.sh` — 29 checks covering all S03 deliverables plus S01/S02 regression; any failure exits non-zero with explicit ✗ marker
- **Failure shapes:** RSS with no `<category>` → tags field empty or not mapped; robots.txt missing from dist → file not in `public/`; sitemap without changefreq → serialize API incompatibility

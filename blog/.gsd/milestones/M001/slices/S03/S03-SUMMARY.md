---
id: S03
parent: M001
milestone: M001
provides:
  - OG image pipeline (Satori → Sharp → 1200×630 PNG) for all non-draft blog posts
  - JSON-LD BlogPosting structured data on blog post pages
  - Dynamic og:image and twitter:image meta tags pointing to generated PNGs
  - article:published_time and article:tag OG meta tags on blog posts
  - Canonical URL with frontmatter override support
  - RSS feed with <category> elements from post tags
  - robots.txt with sitemap reference
  - Sitemap serialize config with weekly changefreq and 0.8 priority for blog URLs
  - 29-check verification script (scripts/verify-s03.sh)
requires:
  - slice: S01
    provides: BaseLayout.astro, BaseHead.astro — SEO component integration point, Atkinson WOFF fonts in public/fonts/
  - slice: S02
    provides: Blog content collection schema (content.config.ts), BlogPost.astro layout, RSS feed (rss.xml.js), sample blog posts with tags
affects:
  - none (terminal slice — consumed by build output)
key_files:
  - src/utils/og-template.ts
  - src/pages/og/[slug].png.ts
  - src/components/BaseHead.astro
  - src/components/BaseLayout.astro
  - src/layouts/BlogPost.astro
  - src/pages/blog/[slug].astro
  - src/pages/rss.xml.js
  - public/robots.txt
  - astro.config.mjs
  - scripts/verify-s03.sh
key_decisions:
  - "D005 validated: Satori + Sharp OG generation works with Astro 6 — key milestone risk retired"
  - "D019: Atkinson Hyperlegible WOFF1 fonts used for OG images since Satori doesn't support WOFF2 (project fonts are WOFF2-only via @fontsource-variable)"
  - "JSON-LD rendered via JSON.stringify() + set:html to avoid Astro HTML-escaping the JSON"
  - "type='article' on BaseLayout is the single prop that activates all article-specific SEO behavior"
  - "All new BaseHead/BaseLayout props are optional with defaults — zero impact on non-blog pages"
patterns_established:
  - "Satori element trees use explicit { type, props: { style, children } } — every container needs display: 'flex' (K004)"
  - "Font paths resolved via fileURLToPath(new URL('../../../', import.meta.url)) + '/public/fonts/' — relative paths break at build time (K005)"
  - "Optional SEO props threaded BaseHead → BaseLayout → BlogPost via conditional spread: {...(prop ? { prop } : {})}"
  - "Verification scripts use grep -o | wc -l for counting XML elements in single-line files, not grep -c"
observability_surfaces:
  - "bash scripts/verify-s03.sh — 29-check comprehensive verification for entire S03 slice"
  - "ls dist/og/*.png | wc -l — count matches non-draft posts (currently 7)"
  - "grep 'application/ld+json' dist/blog/*/index.html — validates JSON-LD presence"
  - "grep 'og:image' dist/blog/*/index.html — confirms OG image URLs point to /og/ PNGs"
  - "grep -o '<category>' dist/rss.xml | wc -l — counts RSS category elements"
  - "cat dist/robots.txt — shows robots directives"
drill_down_paths:
  - .gsd/milestones/M001/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T03-SUMMARY.md
duration: 21m
verification_result: passed
completed_at: 2026-03-16
---

# S03: SEO & OG Images

**Build-time OG image pipeline, JSON-LD structured data, article-aware meta tags, RSS categories, robots.txt, and sitemap config — full SEO infrastructure for the blog, verified across 29 automated checks.**

## What Happened

Built the complete SEO layer for the blog in three tasks:

**T01 — OG Image Pipeline:** Installed Satori and created a build-time image generation pipeline. `og-template.ts` builds Satori element trees from post metadata using the site's dark/teal design identity (dark slate background, teal accent, white text, tag pills, date footer). The `[slug].png.ts` static endpoint enumerates non-draft posts via `getStaticPaths()`, renders Satori SVG → Sharp PNG at 1200×630. Font loading uses `import.meta.url` resolution for reliable paths across dev/build. All 7 non-draft posts get correctly-sized OG images. Also fixed a pre-existing gap where `@tailwindcss/typography` was referenced but not installed.

**T02 — Meta Tags & JSON-LD:** Enhanced `BaseHead.astro` with 6 optional props (`type`, `pubDate`, `updatedDate`, `tags`, `canonicalOverride`, `slug`) all defaulted so non-blog pages are unaffected. When `type === 'article'`, the component emits `og:image` pointing to the generated PNG, `article:published_time`, `article:tag` meta tags, `twitter:image`, and a complete `BlogPosting` JSON-LD block. Canonical URL supports frontmatter override. Props thread through BaseLayout → BlogPost via conditional spreads.

**T03 — RSS, robots.txt, sitemap, verification:** Updated RSS feed to emit `<category>` elements from post tags (10 categories across 7 posts). Created `robots.txt` with sitemap reference. Added sitemap serialize config for blog URLs (`changefreq: 'weekly'`, `priority: 0.8`). Wrote comprehensive 29-check verification script covering all S03 deliverables plus S01/S02 regression.

## Verification

- `bash scripts/verify-s03.sh` — **29/29 passed** covering:
  - [1] OG Image Generation: 7 checks (directory, file count, specific slugs, no draft, dimensions 1200×630)
  - [2] JSON-LD: 3 checks (present on blog posts, BlogPosting type, absent on homepage)
  - [3] OG Meta Tags: 5 checks (og:image with /og/ path, og:type article vs website, article:published_time)
  - [4] Canonical URL: 1 check (rel="canonical" present)
  - [5] RSS Categories: 3 checks (feed exists, categories present, ≥3 category elements)
  - [6] Robots.txt: 4 checks (exists, User-agent, Allow, Sitemap reference)
  - [7] Sitemap: 3 checks (XML exists, weekly changefreq, 0.8 priority)
  - [8] S02 Regression: 22/22 passed
  - [9] S01 Regression: 19/19 passed
- `npm run build` — zero errors, 10 pages built

## Requirements Advanced

- R015 — OG images now generate at build time from post metadata with site branding. 7 PNGs at 1200×630 in `dist/og/`.
- R016 — JSON-LD BlogPosting, og:image, twitter:image, article OG tags, canonical URLs all present on blog posts. Non-blog pages have basic OG tags only.
- R017 — RSS feed includes `<category>` tags, `robots.txt` references sitemap, sitemap has blog-specific changefreq/priority.

## Requirements Validated

- R015 — Proof: `ls dist/og/*.png | wc -l` → 7; `file dist/og/building-a-developer-blog.png` → PNG 1200×630; no draft post OG image exists. Covered by verify-s03.sh checks [1].
- R016 — Proof: JSON-LD with BlogPosting schema present on blog posts, absent on non-blog pages; og:image points to `/og/{slug}.png`; article:published_time and article:tag present; canonical URL correct. Covered by verify-s03.sh checks [2-4].
- R017 — Proof: RSS has ≥3 `<category>` elements from post tags; robots.txt has User-agent/Allow/Sitemap directives; sitemap XML has weekly changefreq and 0.8 priority for blog URLs. Covered by verify-s03.sh checks [5-7].

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- Installed `@tailwindcss/typography` in T01 — pre-existing gap from S02 where the CSS `@plugin` reference existed but the npm package was missing. Not a deviation from S03 plan, but a fix to unblock the build.

## Known Limitations

- OG image fonts are Atkinson Hyperlegible (WOFF1), not the site's Inter/JetBrains Mono — Satori only supports WOFF1/TTF/OTF, and the project fonts ship as WOFF2 via @fontsource-variable. Acceptable since OG images are branded graphics, not pixel-perfect typography matches.
- Title truncated at 60 chars, description at 120 chars in OG images — longer text gets ellipsis. This is a design choice to prevent overflow.
- Tag pills capped at 4 on OG images to avoid layout overflow.

## Follow-ups

- none

## Files Created/Modified

- `package.json` — added `satori@^0.25.0` and `@tailwindcss/typography` dependencies
- `src/utils/og-template.ts` — new: Satori element tree builder with dark/teal design
- `src/pages/og/[slug].png.ts` — new: static endpoint generating 1200×630 PNG OG images
- `src/components/BaseHead.astro` — added optional SEO props, JSON-LD, article OG tags, dynamic og:image, canonical override
- `src/components/BaseLayout.astro` — threaded optional SEO props through to BaseHead
- `src/layouts/BlogPost.astro` — passes type="article", dates, tags, slug, canonicalOverride to BaseLayout
- `src/pages/blog/[slug].astro` — passes post.id as slug to BlogPost
- `src/pages/rss.xml.js` — added `categories: post.data.tags` to RSS items
- `public/robots.txt` — new: User-agent/Allow/Sitemap directives
- `astro.config.mjs` — added serialize callback to sitemap() for blog URL priority
- `scripts/verify-s03.sh` — new: 29-check comprehensive verification script

## Forward Intelligence

### What the next slice should know
- BaseHead.astro now accepts 6 optional SEO props — all defaulted, so new pages don't need to pass anything. Only blog posts pass `type="article"` to activate the full SEO machinery. If S04/S05/S06/S07 add pages, they just use BaseLayout as before with no changes.
- The OG image endpoint only generates images for blog posts. If project pages or other pages need OG images later, the endpoint would need expanding — but for now the default `image` prop fallback in BaseHead handles non-blog OG images.
- `@tailwindcss/typography` is now installed and working. The prose styling it provides is available site-wide.

### What's fragile
- Satori element trees require explicit `display: 'flex'` on every container and cannot have raw string children of flex containers — any template changes silently produce broken images with no error (K004). Visual inspection of generated PNGs is the only way to catch layout issues.
- Font loading path (`fileURLToPath(new URL('../../../', import.meta.url))`) is sensitive to the file's directory depth — if `og/[slug].png.ts` moves, the relative path breaks silently.

### Authoritative diagnostics
- `bash scripts/verify-s03.sh` — 29 checks covering all S03 deliverables plus S01/S02 regression. Any failure exits non-zero with explicit ✗ marker and section context. This is the single source of truth for S03 health.
- `file dist/og/<slug>.png` — confirms PNG format and dimensions directly from binary header.

### What assumptions changed
- D005 (Satori + Sharp OG generation) is now proven — the key risk from the milestone roadmap is retired. Satori works with Atkinson WOFF1 fonts, Sharp converts correctly, and the whole pipeline integrates cleanly with Astro 6 static endpoints.

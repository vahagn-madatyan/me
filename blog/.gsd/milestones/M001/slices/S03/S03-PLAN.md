# S03: SEO & OG Images

**Goal:** Auto-generated OG images from post metadata, JSON-LD structured data, enhanced meta tags, updated RSS/sitemap, and robots.txt — all verifiable in build output.
**Demo:** `npm run build` produces PNG OG images in `dist/og/` for each non-draft post, blog post HTML contains JSON-LD BlogPosting schema and `og:image` pointing to the generated PNG, RSS includes category tags, `robots.txt` references the sitemap.

## Must-Haves

- OG images (1200×630 PNG) auto-generated at build time for every non-draft blog post via Satori + Sharp
- OG image template uses site branding (dark background, teal/cyan primary) with post title, description, tags, and site URL
- `og:image` meta tag on blog posts points to the generated `/og/{slug}.png` (absolute URL)
- JSON-LD `BlogPosting` schema on blog post pages with title, description, datePublished, author, tags
- `canonicalURL` frontmatter field overrides auto-generated canonical when present
- `article:published_time` and `article:tag` OG tags on blog posts
- RSS feed includes `<category>` elements from post tags
- `robots.txt` exists and references sitemap
- Sitemap configured with blog-specific change frequency
- All new BaseHead/BaseLayout props are optional — non-blog pages work unchanged

## Proof Level

- This slice proves: integration (content schema → OG image generation → meta tag pipeline)
- Real runtime required: no (build-time verification via `npm run build` + file inspection)
- Human/UAT required: no

## Verification

- `bash scripts/verify-s03.sh` — comprehensive verification script covering all deliverables
- `npm run build` — zero errors (baseline)
- PNG files exist in `dist/og/` for each non-draft post with correct dimensions (1200×630)
- `grep 'application/ld+json' dist/blog/building-a-developer-blog/index.html` — JSON-LD present
- `grep 'og:image' dist/blog/building-a-developer-blog/index.html` — OG image points to `/og/` endpoint
- `grep 'article:published_time' dist/blog/building-a-developer-blog/index.html` — article OG tags present
- `grep '<category>' dist/rss.xml` — tags appear as RSS categories
- `test -f dist/robots.txt && grep 'Sitemap' dist/robots.txt` — robots.txt deployed with sitemap reference
- `bash scripts/verify-s02.sh` — S02 regression (22 checks still pass)
- `bash scripts/verify-s01.sh` — S01 regression (19 checks still pass)

## Observability / Diagnostics

- Runtime signals: none (all build-time)
- Inspection surfaces: `bash scripts/verify-s03.sh`, `ls dist/og/`, `grep` meta tags in built HTML
- Failure visibility: `npm run build` error output with file/line context; Satori errors surface as build failures with stack traces
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: Blog content schema from S02 (`src/content.config.ts`), `BaseHead.astro` and `BaseLayout.astro` from S01, `BlogPost.astro` layout from S02, existing RSS feed (`rss.xml.js`) from S02, Atkinson WOFF fonts from `public/fonts/`
- New wiring introduced in this slice: OG image static endpoint at `/og/[slug].png`, JSON-LD script block in `<head>`, `canonicalURL` frontmatter → canonical `<link>` override, RSS category tags, robots.txt, sitemap serialize config
- What remains before the milestone is truly usable end-to-end: S04 (reading experience), S05 (projects), S06 (about/architecture), S07 (homepage assembly)

## Tasks

- [x] **T01: Build OG image pipeline with Satori + Sharp** `est:45m`
  - Why: Retires the milestone's key risk (D005) — proves Satori renders OG images at build time with WOFF fonts and Sharp converts to PNG. Self-contained and independently verifiable.
  - Files: `src/pages/og/[slug].png.ts`, `src/utils/og-template.ts`, `package.json`
  - Do: Install `satori`. Create `og-template.ts` helper that builds a Satori element tree (object API, not JSX) from post metadata — dark background, teal/cyan branding, title, description, tags, site URL, 1200×630. Create `[slug].png.ts` static endpoint with `getStaticPaths()` enumerating non-draft posts and `GET()` rendering Satori → Sharp → PNG Response. Load Atkinson WOFF fonts via `fs.readFileSync` with `import.meta.url` resolution. Wrap Sharp conversion in try/catch.
  - Verify: `npm run build` succeeds, `ls dist/og/*.png` shows 7 files (one per non-draft post), `node -e "require('sharp')('dist/og/building-a-developer-blog.png').metadata().then(m => console.log(m.width, m.height))"` outputs `1200 630`
  - Done when: Every non-draft blog post has a corresponding 1200×630 PNG in `dist/og/` and build completes with zero errors.

- [ ] **T02: Enhance BaseHead with JSON-LD, dynamic OG image, and article meta** `est:30m`
  - Why: Wires the OG images into page meta tags, adds JSON-LD structured data for search engines, and supports canonical URL override from frontmatter — completing R016.
  - Files: `src/components/BaseHead.astro`, `src/components/BaseLayout.astro`, `src/layouts/BlogPost.astro`, `src/pages/blog/[slug].astro`
  - Do: Add optional props to BaseHead (`type`, `pubDate`, `updatedDate`, `tags`, `canonicalOverride`). When `type === 'article'`, derive slug from `Astro.url.pathname`, set `og:image` to absolute URL `/og/{slug}.png`, add `article:published_time` and `article:tag` meta tags, emit JSON-LD `BlogPosting` script block. Support `canonicalOverride` overriding auto-generated canonical. Thread new props through BaseLayout. Pass blog data from BlogPost.astro. All new props optional with defaults — non-blog pages unchanged.
  - Verify: `npm run build`, inspect `dist/blog/building-a-developer-blog/index.html` for JSON-LD, `og:image` pointing to `/og/`, `article:published_time`, canonical URL. Check a non-blog page (e.g., `dist/index.html`) still works without the new props.
  - Done when: Blog post HTML contains valid JSON-LD BlogPosting schema, `og:image` pointing to generated PNG, article OG tags, and correct canonical URL. Non-blog pages render unchanged.

- [ ] **T03: Update RSS with categories, add robots.txt, configure sitemap, write verification** `est:20m`
  - Why: Completes R017 (RSS categories, robots.txt, sitemap config) and creates the comprehensive verification script that proves the entire slice works.
  - Files: `src/pages/rss.xml.js`, `public/robots.txt`, `astro.config.mjs`, `scripts/verify-s03.sh`
  - Do: Update `rss.xml.js` to map post tags into RSS `categories` array. Create `public/robots.txt` with User-agent/Allow/Sitemap directives pointing to `https://vahagn.dev/sitemap-index.xml`. Add `serialize` function to sitemap integration in `astro.config.mjs` to set blog URLs with higher changefreq. Write `scripts/verify-s03.sh` covering all slice deliverables plus S01/S02 regression.
  - Verify: `npm run build`, `bash scripts/verify-s03.sh` passes all checks
  - Done when: `scripts/verify-s03.sh` passes all checks including OG images, JSON-LD, meta tags, RSS categories, robots.txt, sitemap, and S01/S02 regression.

## Files Likely Touched

- `package.json` — add `satori` dependency
- `src/utils/og-template.ts` — new: Satori element tree builder
- `src/pages/og/[slug].png.ts` — new: static OG image endpoint
- `src/components/BaseHead.astro` — add JSON-LD, article OG tags, canonical override, dynamic og:image
- `src/components/BaseLayout.astro` — thread new optional SEO props
- `src/layouts/BlogPost.astro` — pass blog metadata to BaseLayout for SEO
- `src/pages/blog/[slug].astro` — pass slug/canonicalURL to BlogPost
- `src/pages/rss.xml.js` — add categories from tags
- `public/robots.txt` — new: robots directives
- `astro.config.mjs` — sitemap serialize config
- `scripts/verify-s03.sh` — new: comprehensive verification script

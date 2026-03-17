---
id: T02
parent: S03
milestone: M001
provides:
  - JSON-LD BlogPosting structured data in blog post <head>
  - Dynamic og:image pointing to /og/{slug}.png for blog posts
  - article:published_time and article:tag OG meta tags
  - Canonical URL override from frontmatter canonicalURL field
  - twitter:image pointing to generated OG PNG for blog posts
key_files:
  - src/components/BaseHead.astro
  - src/components/BaseLayout.astro
  - src/layouts/BlogPost.astro
  - src/pages/blog/[slug].astro
key_decisions:
  - "Slug derived from Astro.url.pathname in BlogPost as fallback, but explicitly passed from [slug].astro via post.id for reliability"
  - "JSON-LD built with JSON.stringify() in frontmatter script, rendered via set:html to avoid Astro HTML-escaping the JSON"
  - "OG image URL computed conditionally: article+slug → /og/{slug}.png, otherwise → image.src fallback"
patterns_established:
  - "Optional SEO props threaded BaseHead → BaseLayout → BlogPost via conditional spread: {...(prop ? { prop } : {})}"
  - "type='article' on BaseLayout triggers all article-specific meta (OG tags, JSON-LD) — single prop controls all SEO behavior"
observability_surfaces:
  - "grep 'application/ld+json' dist/blog/*/index.html — validates JSON-LD presence per blog post"
  - "grep 'og:type' dist/*/index.html — confirms article vs website differentiation"
  - "grep 'og:image' dist/blog/*/index.html — confirms OG image URLs point to /og/ PNGs"
  - "grep -c 'ld+json' dist/index.html — must return 0 (no JSON-LD on non-blog pages)"
duration: 8m
verification_result: passed
completed_at: 2026-03-16
blocker_discovered: false
---

# T02: Enhance BaseHead with JSON-LD, dynamic OG image, and article meta

**Wired OG images into page meta tags, added JSON-LD BlogPosting structured data, article OG tags, canonical URL override, and dynamic twitter:image for all blog posts — non-blog pages unchanged.**

## What Happened

Enhanced `BaseHead.astro` with 6 optional props (`type`, `pubDate`, `updatedDate`, `tags`, `canonicalOverride`, `slug`) all defaulted so non-blog pages work unchanged. When `type === 'article'` and `slug` is provided, og:image and twitter:image point to `https://vahagn.dev/og/{slug}.png` instead of the fallback placeholder. Article-specific OG tags (`article:published_time`, `article:modified_time`, `article:tag`) render conditionally. JSON-LD BlogPosting schema is built via `JSON.stringify()` and rendered with `set:html` to avoid Astro's HTML entity escaping. Canonical URL supports override from frontmatter `canonicalURL` field.

Threaded all new props through `BaseLayout.astro` using conditional spreads. Updated `BlogPost.astro` to pass `type="article"`, dates, tags, slug, and optional canonicalOverride to BaseLayout. Updated `[slug].astro` to pass `post.id` as slug.

## Verification

All task-level checks passed:
- `npm run build` — zero errors, 10 pages built
- `grep 'application/ld+json'` — JSON-LD present on blog posts, valid JSON confirmed via `JSON.parse()`
- `og:image` contains `https://vahagn.dev/og/building-a-developer-blog.png` ✓
- `article:published_time` present ✓
- `article:tag` — 3 tags (astro, webdev, tailwind) ✓
- `og:type` = `article` on blog posts, `website` on homepage ✓
- `twitter:image` points to OG PNG ✓
- Homepage: 0 JSON-LD blocks, og:type=website ✓
- About page: 0 JSON-LD blocks, og:type=website ✓
- Blog listing page: 0 JSON-LD blocks, og:type=website ✓
- Canonical URL: `https://vahagn.dev/blog/building-a-developer-blog/` ✓

Regression checks:
- S02 verification: 22/22 passed ✓
- S01 verification: 19/19 passed ✓

Slice-level checks (partial — T03 not yet done):
- ✓ `npm run build` zero errors
- ✓ OG PNGs in `dist/og/` (7 files, from T01)
- ✓ JSON-LD present on blog posts
- ✓ og:image points to `/og/` endpoint
- ✓ article:published_time present
- ○ RSS categories — T03
- ○ robots.txt — T03
- ○ verify-s03.sh script — T03

## Diagnostics

- **Inspect JSON-LD:** `grep -o '<script type="application/ld+json">[^<]*</script>' dist/blog/*/index.html` extracts all JSON-LD blocks
- **Validate JSON-LD:** Pipe the above through `sed` + `JSON.parse()` to confirm valid JSON
- **Check og:image URLs:** `grep -o 'og:image[^>]*content="[^"]*"' dist/blog/*/index.html` — should all contain `/og/` path
- **Verify non-blog pages unchanged:** `grep -c 'ld+json' dist/index.html` must return 0; `grep 'og:type' dist/index.html` must show "website"
- **Failure shapes:** Missing JSON-LD → `set:html` with null jsonLd correctly renders nothing; wrong og:image → visible in grep output; broken canonical → `<link rel="canonical">` has wrong href

## Deviations

None — implemented exactly as planned.

## Known Issues

None.

## Files Created/Modified

- `src/components/BaseHead.astro` — added optional SEO props, conditional article OG tags, JSON-LD BlogPosting, canonical override, dynamic og:image/twitter:image
- `src/components/BaseLayout.astro` — added optional SEO props to interface, threaded through to BaseHead via conditional spreads
- `src/layouts/BlogPost.astro` — passes type="article", pubDate, updatedDate, tags, slug, canonicalOverride to BaseLayout
- `src/pages/blog/[slug].astro` — passes post.id as slug to BlogPost
- `.gsd/milestones/M001/slices/S03/tasks/T02-PLAN.md` — added Observability Impact section (pre-flight fix)

---
id: T01
parent: S04
milestone: M001
provides:
  - Tag archive pages at /blog/tag/[tag]/ with pagination
  - Tag pill navigation from BlogCard and BlogPost to tag archives
key_files:
  - src/pages/blog/tag/[tag]/[...page].astro
  - src/components/BlogCard.astro
  - src/layouts/BlogPost.astro
key_decisions:
  - Used flatMap over allTags to return paginated routes per tag (same pattern as main blog listing)
  - Tag pills use string concatenation ("/blog/tag/" + tag + "/") for href — safe for current single-word tags; URL encoding needed if multi-word tags are introduced
patterns_established:
  - Tag archive route pattern: getStaticPaths enumerates unique tags, paginate() per tag at pageSize 10
  - Tag pill links: <a> with transition-colors hover state, consistent across BlogCard and BlogPost
observability_surfaces:
  - find dist/blog/tag -name index.html | sort — lists all generated tag archive pages
  - grep -c 'href="/blog/tag/' dist/blog/index.html — counts tag pill links on listing page
  - grep -o 'href="/blog/tag/[^"]*"' dist/blog/*/index.html — shows all tag pill hrefs across posts
duration: 8m
verification_result: passed
completed_at: 2026-03-16
blocker_discovered: false
---

# T01: Create tag archive pages and link tag pills

**Created paginated tag archive pages at `/blog/tag/[tag]/` and converted all tag pills from inert `<span>` to navigable `<a>` links.**

## What Happened

1. Created `src/pages/blog/tag/[tag]/[...page].astro` with `getStaticPaths` that enumerates unique tags from all non-draft posts, filters and sorts posts per tag by pubDate descending, and paginates at pageSize 10. Template reuses BlogCard grid layout and pagination nav from the main blog listing. Includes "← All posts" back link and "{n} posts" count.

2. Updated `src/components/BlogCard.astro` — changed tag pills from `<span>` to `<a href={"/blog/tag/" + tag + "/"}>` with `transition-colors hover:bg-primary-200 dark:hover:bg-primary-800` hover states. All existing static classes preserved.

3. Updated `src/layouts/BlogPost.astro` — same `<span>` → `<a>` change with matching hover classes.

Build generates 9 tag archive pages (astro, webdev, tailwind, markdown, guide, typescript, patterns, javascript, mdx). Draft tag correctly excluded from production output.

## Verification

- `npm run build` exits zero — 19 pages built including 9 tag archive pages
- `test -f dist/blog/tag/astro/index.html` — PASS
- `grep -l 'href="/blog/tag/astro/"' dist/blog/building-a-developer-blog/index.html` — PASS (tag pills in post HTML)
- `grep -l 'href="/blog/tag/astro/"' dist/blog/index.html` — PASS (tag pills in listing HTML)
- `grep -c 'rounded-2xl' dist/blog/tag/astro/index.html` — 1 (BlogCard markup present)
- `test ! -f dist/blog/tag/draft/index.html` — PASS (draft tag excluded in production)
- Browser: tag archive page renders with correct heading, BlogCard grid, and post count
- Browser: clicking tag pill navigates to correct archive page
- Browser: post detail page shows tag pills as `<a>` links with correct hrefs
- S02 regression: 22/22 checks pass
- S04 slice verification: not yet created (T03 deliverable) — all T01 checks pass independently

## Diagnostics

- **Tag archive pages:** `find dist/blog/tag -name index.html | sort` lists all generated pages
- **Tag pill links:** `grep -r 'href="/blog/tag/' dist/blog/` confirms wiring across all pages
- **Missing archives:** compare `grep -oh 'href="/blog/tag/[^"]*"' dist/blog/index.html | sort -u` against `ls dist/blog/tag/` to detect mismatches
- **Build failures:** `npm run build` stderr surfaces template errors, missing imports, or bad getStaticPaths returns

## Deviations

None.

## Known Issues

- Tags are all lowercase single words currently. If multi-word tags are introduced (e.g. "web dev"), the href concatenation will produce `/blog/tag/web dev/` which needs URL encoding. The getStaticPaths params would also need encoding consideration. Not a problem today but noted for future.

## Files Created/Modified

- `src/pages/blog/tag/[tag]/[...page].astro` — new tag archive page with getStaticPaths enumeration, BlogCard grid, pagination
- `src/components/BlogCard.astro` — tag pills: `<span>` → `<a>` with hover state and archive link
- `src/layouts/BlogPost.astro` — tag pills: `<span>` → `<a>` with hover state and archive link
- `.gsd/milestones/M001/slices/S04/S04-PLAN.md` — added Observability / Diagnostics section
- `.gsd/milestones/M001/slices/S04/tasks/T01-PLAN.md` — added Observability Impact section

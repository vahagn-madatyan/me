---
id: T03
parent: S02
milestone: M001
provides:
  - Paginated blog listing at /blog/ with BlogCard grid and pagination nav
  - 3 new sample posts exercising all extended schema fields (tags, featured, draft, code blocks)
  - Draft filtering in listing, individual posts, and RSS feed
  - Route fix — [slug].astro replaces [...slug].astro to avoid rest-param conflict
  - End-to-end verification script (scripts/verify-s02.sh) with 22 checks
key_files:
  - src/pages/blog/[...page].astro
  - src/pages/blog/[slug].astro
  - src/pages/rss.xml.js
  - src/content/blog/building-a-developer-blog.md
  - src/content/blog/mastering-typescript-patterns.md
  - src/content/blog/draft-upcoming-post.md
  - scripts/verify-s02.sh
key_decisions:
  - Used [...page].astro rest param for pagination (page 1 = /blog/, page 2 = /blog/2/)
  - Draft filtering uses import.meta.env.PROD ternary in listing/posts, unconditional in RSS
  - Existing posts updated with tags field (empty or relevant) to exercise extended schema
patterns_established:
  - Draft filter pattern: .filter(post => import.meta.env.PROD ? !post.data.draft : true) for pages, .filter(post => !post.data.draft) for RSS
  - Reading time wiring in listing: computed inline via getReadingTime(post.body ?? '') per card
  - Pagination nav pattern: conditional prev/next links with page.url.prev/next, centered page counter
observability_surfaces:
  - scripts/verify-s02.sh — 22-check verification covering Shiki, typography, listing, posts, reading time, tags, drafts, route structure, and S01 regression
duration: ~15min
verification_result: passed
completed_at: 2026-03-16
blocker_discovered: false
---

# T03: Create paginated listing, sample posts, route fix, and verification script

**Assembled paginated blog listing, 3 new sample posts, draft filtering, route fix, and 22-check verification script — all S02 slice checks pass.**

## What Happened

1. **Created 3 sample blog posts:**
   - `building-a-developer-blog.md` — featured post about building this blog with TypeScript, JSX, and CSS code blocks (~500 words). Tags: astro, webdev, tailwind. `featured: true`.
   - `mastering-typescript-patterns.md` — technical post with discriminated unions, branded types, builder pattern. Multiple TypeScript code blocks (~800 words). Tags: typescript, patterns, javascript.
   - `draft-upcoming-post.md` — draft post with `draft: true`, tags: draft. Exists solely to verify draft filtering.

2. **Updated all 5 existing posts** with `tags` field: first-post, second-post, third-post get `tags: []`; markdown-style-guide gets `['markdown', 'guide']`; using-mdx gets `['mdx', 'astro']`.

3. **Deleted `src/pages/blog/index.astro`** — replaced by paginated `[...page].astro`.

4. **Created `src/pages/blog/[...page].astro`** — paginated listing using `paginate()` with pageSize 10, draft filtering, descending date sort, BlogCard grid, and prev/next pagination nav.

5. **Replaced `src/pages/blog/[...slug].astro` with `src/pages/blog/[slug].astro`** — single param route with draft filtering in getStaticPaths, reading time calculation from post.body.

6. **Updated `src/pages/rss.xml.js`** — added `.filter(post => !post.data.draft)` to always exclude drafts from RSS.

7. **Wrote `scripts/verify-s02.sh`** — 22-check verification script covering the full S02 slice.

## Verification

- `npm run build` — zero errors, 10 pages built (draft excluded)
- `bash scripts/verify-s02.sh` — **22/22 checks passed**:
  - Shiki dual-theme CSS variables present ✓
  - Typography prose class present ✓
  - Paginated listing exists with reading time ✓
  - 7+ individual post directories exist ✓
  - Reading time on individual posts ✓
  - Tags rendered with pill classes ✓
  - Draft post absent from dist/ and RSS ✓
  - Route structure correct ([slug].astro, [...page].astro) ✓
  - S01 regression check passed ✓
- `bash scripts/verify-s01.sh` — **19/19 checks passed** (no regressions)

## Diagnostics

- **Build verification:** `bash scripts/verify-s02.sh` — runs build + 22 checks in one pass
- **Draft filtering probe:** `test ! -d dist/blog/draft-upcoming-post` — draft absent from production
- **Draft in RSS probe:** `! grep -q 'draft-upcoming-post' dist/rss.xml`
- **Reading time probe:** `grep -r 'min read' dist/blog/` — present in both listing and posts
- **Tag rendering probe:** `grep 'bg-primary-100' dist/blog/building-a-developer-blog/index.html`
- **Shiki probe:** `grep -r 'shiki-dark' dist/blog/` — dual-theme CSS variables in code blocks
- **Route conflict check:** `ls src/pages/blog/` — should show `[...page].astro` and `[slug].astro` only

## Deviations

None — all 6 steps executed as planned.

## Known Issues

None.

## Files Created/Modified

- `src/content/blog/building-a-developer-blog.md` — new featured sample post with code blocks
- `src/content/blog/mastering-typescript-patterns.md` — new technical post with multi-language code
- `src/content/blog/draft-upcoming-post.md` — new draft post for filtering verification
- `src/content/blog/first-post.md` — added `tags: []`
- `src/content/blog/second-post.md` — added `tags: []`
- `src/content/blog/third-post.md` — added `tags: []`
- `src/content/blog/markdown-style-guide.md` — added `tags: ['markdown', 'guide']`
- `src/content/blog/using-mdx.mdx` — added `tags: ['mdx', 'astro']`
- `src/pages/blog/[...page].astro` — new paginated listing page
- `src/pages/blog/[slug].astro` — new individual post route (replaces [...slug].astro)
- `src/pages/blog/index.astro` — deleted (replaced by [...page].astro)
- `src/pages/blog/[...slug].astro` — deleted (replaced by [slug].astro)
- `src/pages/rss.xml.js` — added draft filtering
- `scripts/verify-s02.sh` — new 22-check verification script

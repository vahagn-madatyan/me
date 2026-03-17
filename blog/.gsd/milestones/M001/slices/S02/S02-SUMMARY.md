---
id: S02
parent: M001
milestone: M001
provides:
  - Extended blog content schema with tags, featured, draft, canonicalURL fields
  - Paginated blog listing at /blog/ (10 posts/page) with BlogCard grid and pagination nav
  - Individual post pages at /blog/[slug]/ with reading time, tags, description
  - Shiki dual-theme syntax highlighting via CSS variables (github-dark / github-light)
  - Tailwind typography plugin loaded via @plugin directive for prose styling
  - Reading time utility (200 WPM, rounded up) displayed on cards and posts
  - BlogCard component — reusable card contract for S04 tag archives and S07 homepage
  - Draft filtering in listing, post routes, and RSS feed
  - 3 new sample posts exercising all extended frontmatter fields
  - 22-check verification script (scripts/verify-s02.sh)
requires:
  - slice: S01
    provides: BaseLayout.astro, Header.astro, Footer.astro, global.css with Tailwind v4 theme, FormattedDate.astro
affects:
  - S03 (consumes blog schema and post data for OG images, JSON-LD, RSS)
  - S04 (consumes BlogPost layout, BlogCard, blog collection for TOC/related/share/tags)
  - S07 (consumes BlogCard and blog collection for featured posts on homepage)
key_files:
  - src/content.config.ts
  - astro.config.mjs
  - src/styles/global.css
  - src/utils/reading-time.ts
  - src/components/BlogCard.astro
  - src/layouts/BlogPost.astro
  - src/pages/blog/[...page].astro
  - src/pages/blog/[slug].astro
  - src/pages/rss.xml.js
  - scripts/verify-s02.sh
key_decisions:
  - Shiki defaultColor:false for CSS variable output — spans get --shiki-light/--shiki-dark instead of inline colors, enabling dark mode switching without JS
  - Tailwind typography loaded via @plugin directive in CSS (v4 CSS-first approach), not a JS config
  - All new schema fields use .default() or .optional() for backward compatibility with existing posts
  - Reading time computed at build time in page route, passed as prop to layout — no runtime cost
  - [...page].astro rest param for pagination (page 1 = /blog/, page 2 = /blog/2/)
  - Draft filtering uses import.meta.env.PROD ternary in pages, unconditional in RSS
patterns_established:
  - Shiki dual-theme CSS pattern: .astro-code and .astro-code span swap --shiki-light/--shiki-dark based on html.dark class
  - Schema extension pattern: all new fields use .default() or .optional() to preserve backward compatibility
  - Reading time wiring: page computes via getReadingTime(post.body), passes as prop to layout
  - Tag pill pattern: static Tailwind classes bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full
  - BlogCard contract: { title, description, pubDate, heroImage?, tags?, readingTime, slug }
  - Draft filter pattern: .filter(post => import.meta.env.PROD ? !post.data.draft : true)
  - Pagination nav pattern: conditional prev/next links with page.url.prev/next
observability_surfaces:
  - "bash scripts/verify-s02.sh — 22-check verification covering Shiki, typography, listing, posts, reading time, tags, drafts, route structure, and S01 regression"
  - "grep -r 'shiki-dark' dist/blog/ — confirms CSS variable pipeline active in code blocks"
  - "grep -r 'prose' dist/blog/ — confirms typography plugin loaded"
  - "grep -r 'min read' dist/blog/ — confirms reading time on cards and posts"
  - "test ! -d dist/blog/draft-upcoming-post — confirms draft absent from production"
drill_down_paths:
  - .gsd/milestones/M001/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S02/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S02/tasks/T03-SUMMARY.md
duration: ~31m
verification_result: passed
completed_at: 2026-03-16
---

# S02: Blog Engine

**Complete blog engine with extended content schema, paginated listing, Shiki dual-theme syntax highlighting, reading time, typography, draft filtering, and reusable BlogCard component — all verified with 22-check build script.**

## What Happened

Three tasks executed in sequence, each building on the last:

**T01 (Rendering Pipeline)** configured the three foundational systems. Extended the blog schema in `content.config.ts` with 4 new fields (tags, featured, draft, canonicalURL) — all with `.default()` or `.optional()` so the 5 existing posts continue to validate. Configured Shiki with `defaultColor: false` in `astro.config.mjs`, which outputs CSS variables (`--shiki-light`, `--shiki-dark`) on each code span instead of inline colors. Added `@plugin "@tailwindcss/typography"` in `global.css` (Tailwind v4 CSS-first plugin loading) and wrote CSS rules for the Shiki dual-theme swap keyed on `html.dark`.

**T02 (Components)** built the reusable pieces. Created `reading-time.ts` utility (strips markdown artifacts, counts words, divides by 200 WPM, rounds up). Created `BlogCard.astro` with hero image, title, description, date, tag pills, and reading time — all static Tailwind classes to avoid purge issues. Updated `BlogPost.astro` layout with reading time beside date, description below title, and tag pills. Wired reading time computation in the `[...slug].astro` page route.

**T03 (Assembly)** brought everything together. Wrote 3 new sample posts — one featured with code blocks (`building-a-developer-blog`), one technical with multi-language TypeScript patterns (`mastering-typescript-patterns`), and one draft (`draft-upcoming-post`) for filtering verification. Updated all 5 existing posts with tags field. Replaced `index.astro` with `[...page].astro` for pagination via `paginate()` at pageSize 10. Replaced `[...slug].astro` with `[slug].astro` to avoid rest-param conflict. Added draft filtering to RSS. Wrote the 22-check verification script.

## Verification

- `npm run build` — zero errors, 10 pages built (draft correctly excluded)
- `bash scripts/verify-s02.sh` — **22/22 checks passed**:
  - Shiki dual-theme CSS variables present in post HTML (98 matches on mastering-typescript-patterns)
  - Typography `prose` class in post HTML
  - Paginated listing at `/blog/` with reading time
  - 7+ individual post directories exist
  - Reading time on individual posts
  - Tags rendered with pill classes (`bg-primary-100`)
  - Draft post absent from `dist/` and RSS feed
  - Route structure correct (`[slug].astro` + `[...page].astro`)
  - S01 regression check — 19/19 still pass
- `bash scripts/verify-s01.sh` — **19/19 passed** (zero regressions)

## Requirements Advanced

- R004 (Blog Content Collection) — Schema extended with tags, featured, draft, canonicalURL. All 8 posts (5 existing + 3 new) validate against the schema. Draft post correctly excluded from production build.
- R005 (Blog Pagination) — Listing at `/blog/` uses Astro `paginate()` with pageSize 10, prev/next nav.
- R007 (Reading Time) — Displayed on both blog cards and post headers. 200 WPM, rounded up, minimum 1 min.
- R009 (Syntax Highlighting) — Shiki dual themes (github-dark/github-light) via CSS variables, switching with dark mode toggle. Copy button deferred to S04.
- R006 (Tag Filtering) — Tags defined in frontmatter and rendered as pills. Archive pages deferred to S04.

## Requirements Validated

- R004 (Blog Content Collection) — Extended schema builds successfully with all 8 posts. All frontmatter fields validated by Zod at build time. Proof: `npm run build` zero errors + schema validation is build-time.
- R005 (Blog Pagination) — Paginated listing exists at `dist/blog/index.html` with BlogCard grid and reading time. Proof: `scripts/verify-s02.sh` checks 3, 4.
- R007 (Reading Time) — Present in both listing and individual post HTML. Proof: `grep -r 'min read' dist/blog/` matches in listing and all posts.
- R009 (Syntax Highlighting) — Partial validation. Dual themes confirmed via CSS variable output (`--shiki-dark` in 98 spans). Copy button (S04) not yet delivered. Proof: `scripts/verify-s02.sh` check 1.

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

None — all three tasks executed exactly as planned.

## Known Limitations

- **Pagination not exercised with >10 posts:** Only 7 non-draft posts exist, so page 2+ isn't generated yet. The pagination nav component renders conditionally — it will appear when content exceeds pageSize.
- **Copy button on code blocks:** Deferred to S04 per plan. Code blocks have Shiki highlighting but no copy affordance yet.
- **Tag archive pages:** Tags are rendered as visual pills but don't link to `/blog/tag/[tag]` yet — that's S04 scope.
- **Featured post query:** The `featured` field exists in schema but isn't consumed by any page yet — S07 homepage will use it.

## Follow-ups

- S04 needs to add `href` to tag pills pointing to `/blog/tag/[tag]/`
- S07 should query `featured: true` posts from the collection for homepage display
- S03 will consume the extended schema fields (tags, description, canonicalURL) for SEO meta and OG images

## Files Created/Modified

- `src/content.config.ts` — Extended schema with tags, featured, draft, canonicalURL fields
- `astro.config.mjs` — Added markdown.shikiConfig with dual themes and defaultColor: false
- `src/styles/global.css` — Added @plugin typography directive + Shiki dual-theme CSS rules + code block styling
- `src/utils/reading-time.ts` — new: reading time calculation and formatting utilities
- `src/components/BlogCard.astro` — new: post card component with full metadata display
- `src/layouts/BlogPost.astro` — updated: added reading time, tags, description display
- `src/pages/blog/[...page].astro` — new: paginated listing with BlogCard grid
- `src/pages/blog/[slug].astro` — new: individual post route with draft filtering
- `src/pages/blog/index.astro` — deleted (replaced by [...page].astro)
- `src/pages/blog/[...slug].astro` — deleted (replaced by [slug].astro)
- `src/pages/rss.xml.js` — added draft filtering
- `src/content/blog/building-a-developer-blog.md` — new featured sample post
- `src/content/blog/mastering-typescript-patterns.md` — new technical sample post
- `src/content/blog/draft-upcoming-post.md` — new draft post for filtering verification
- `src/content/blog/first-post.md` — added tags field
- `src/content/blog/second-post.md` — added tags field
- `src/content/blog/third-post.md` — added tags field
- `src/content/blog/markdown-style-guide.md` — added tags field
- `src/content/blog/using-mdx.mdx` — added tags field
- `scripts/verify-s02.sh` — new 22-check verification script

## Forward Intelligence

### What the next slice should know
- The BlogCard component contract is `{ title, description, pubDate, heroImage?, tags?, readingTime, slug }` — S04 tag archives and S07 homepage should use this exactly.
- Reading time is computed from `post.body` via `getReadingTime()` — it must be calculated in the page route and passed as a prop, not computed in the component.
- Tag pills currently have no `href` — S04 should wrap them in `<a href="/blog/tag/${tag}/">` when creating tag archive pages.
- Draft filtering pattern: use `import.meta.env.PROD ? !post.data.draft : true` in pages to show drafts in dev but hide in production.
- The `featured` field on posts defaults to `false` — `building-a-developer-blog.md` is the only post with `featured: true`.

### What's fragile
- `post.body` for reading time — Astro's content layer provides `body` but its exact format (raw markdown vs stripped) affects word count accuracy. The utility strips common markdown artifacts but may undercount in edge cases with heavy HTML or MDX components.
- Static Tailwind classes on tag pills — dynamic class construction (template literals with variable parts) gets purged by Tailwind in production. All styling must use complete static class strings.

### Authoritative diagnostics
- `bash scripts/verify-s02.sh` — the single source of truth for S02 health. 22 checks covering every deliverable. Run after any change to blog-related files.
- `grep -r 'shiki-dark' dist/blog/` — the fastest way to confirm Shiki dual-theme is still working. If zero matches, check `astro.config.mjs` shikiConfig.
- `npm run build` exit code — all schema, Shiki, and typography failures are build-time errors with file/line context.

### What assumptions changed
- No assumptions changed — all three planned tasks executed without deviation.

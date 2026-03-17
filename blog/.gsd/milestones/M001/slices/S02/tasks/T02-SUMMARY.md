---
id: T02
parent: S02
milestone: M001
provides:
  - Reading time utility (getReadingTime, formatReadingTime) for blog content
  - BlogCard component with full metadata display (hero, title, description, date, tags, reading time)
  - Updated BlogPost layout with reading time beside date, description below title, tag pills
key_files:
  - src/utils/reading-time.ts
  - src/components/BlogCard.astro
  - src/layouts/BlogPost.astro
  - src/pages/blog/[...slug].astro
key_decisions:
  - Reading time computed at build time in [...slug].astro from post.body, passed as prop to layout — avoids runtime cost
  - Tag pills use static Tailwind classes (bg-primary-100/dark:bg-primary-900) per S01 purge constraint
  - BlogPost Props extends CollectionEntry<'blog'>['data'] with intersection type for readingTime
patterns_established:
  - Reading time wiring pattern: page computes via getReadingTime(post.body), passes as prop to layout
  - Tag pill pattern: static classes bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full px-2 py-0.5 text-xs
  - BlogCard contract: { title, description, pubDate, heroImage?, tags?, readingTime, slug }
observability_surfaces:
  - "grep 'min read' dist/blog/[slug]/index.html — confirms reading time rendered in each post"
  - "test -f src/components/BlogCard.astro — confirms component exists for T03 consumption"
duration: ~8m
verification_result: passed
completed_at: 2026-03-16
blocker_discovered: false
---

# T02: Build blog components — BlogCard, reading time utility, and BlogPost layout update

**Created reading time utility, BlogCard component, and updated BlogPost layout with reading time, tags, and description display — all 5 posts build with correct reading times.**

## What Happened

1. **`src/utils/reading-time.ts`** — Created with two exports:
   - `getReadingTime(content)`: strips code fences, inline code, images, links, HTML tags, headings, emphasis, blockquotes, and horizontal rules from Markdown content, counts remaining words, divides by 200 WPM, rounds up with `Math.ceil`, returns `Math.max(1, minutes)`.
   - `formatReadingTime(minutes)`: returns `"${minutes} min read"`.

2. **`src/components/BlogCard.astro`** — Card component with:
   - Props: `{ title, description, pubDate, heroImage?, tags?, readingTime, slug }`
   - Hero image with aspect-video, scale hover effect via group-hover
   - Title as link to `/blog/${slug}/`
   - Description paragraph
   - Footer: FormattedDate + reading time (left), tag pills (right)
   - All static Tailwind classes — no dynamic construction
   - Full dark mode support via `dark:` variants
   - Hover: shadow-lg + ring-primary transition

3. **`src/layouts/BlogPost.astro`** — Updated:
   - Props type: `CollectionEntry<'blog'>['data'] & { readingTime: number }`
   - Reading time displayed next to date with middot separator
   - Description paragraph below title
   - Tag pills below description (same static classes as BlogCard)
   - Preserved existing prose container, hero image, and updated date handling

4. **`src/pages/blog/[...slug].astro`** — Updated to compute reading time from `post.body` and pass to BlogPost layout.

## Verification

- `npm run build` — **zero errors**, all 5 posts + listing + RSS built successfully
- `grep 'min read' dist/blog/first-post/index.html` — found `3 min read` ✅
- Reading times verified across all posts: first-post (3), markdown-style-guide (2), second-post (3), third-post (3), using-mdx (1) — all sensible
- `test -f src/components/BlogCard.astro` — exists ✅
- `test -f src/utils/reading-time.ts` — exists ✅
- Shiki dual-theme still works: `grep -c 'shiki-dark' dist/blog/markdown-style-guide/index.html` → 48 ✅
- Prose classes present in all post pages ✅

### Slice-level S02 checks (partial — T02 is intermediate):
- ✅ Shiki dual-theme CSS variables present in post HTML
- ✅ `prose` class present in post HTML (5 posts)
- ✅ Individual post pages exist at `dist/blog/[slug]/index.html` (5 posts)
- ✅ Reading time text present in all post HTML
- ✅ Blog listing exists at `dist/blog/index.html`
- ⏳ Paginated listing (T03)
- ⏳ Tags rendered in post HTML (no posts have tags in frontmatter yet — T03)
- ⏳ Draft posts absent from production (T03)
- ⏳ RSS draft filtering (T03)
- ⏳ `scripts/verify-s02.sh` (T03)

## Diagnostics

- **Reading time probe:** `grep -r 'min read' dist/blog/` — every post should show `X min read`. If a post shows `NaN min read` or nothing, the `[...slug].astro` page isn't passing `readingTime` correctly.
- **BlogCard not yet in any page output** — it's a component for T03 to integrate into the listing page. Verify only by file existence until then.
- **Tag pill rendering:** Will be visible in post HTML once sample posts with tags are added in T03. Check with `grep 'bg-primary-100' dist/blog/[slug]/index.html`.

## Deviations

None — implemented exactly as planned.

## Known Issues

None.

## Files Created/Modified

- `src/utils/reading-time.ts` — new: reading time calculation and formatting utilities
- `src/components/BlogCard.astro` — new: post card component with full metadata display
- `src/layouts/BlogPost.astro` — updated: added reading time, tags, description display
- `src/pages/blog/[...slug].astro` — updated: computes readingTime from post.body, passes to layout
- `.gsd/milestones/M001/slices/S02/tasks/T02-PLAN.md` — added Observability Impact section

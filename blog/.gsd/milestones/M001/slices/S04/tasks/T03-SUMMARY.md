---
id: T03
parent: S04
milestone: M001
provides:
  - Sticky Table of Contents sidebar with IntersectionObserver scroll-spy on long posts (≥5 min read)
  - Conditional two-column grid layout (content + TOC) on desktop for long posts
  - Single-column layout preserved for short posts and mobile
  - scroll-margin-top on prose headings for correct anchor offset
  - mastering-typescript-patterns post extended to 1970 words (6 min read) to exercise TOC
  - scripts/verify-s04.sh covering all 5 S04 features + S02 regression (17/17 pass)
key_files:
  - src/components/TableOfContents.astro
  - src/layouts/BlogPost.astro
  - src/pages/blog/[slug].astro
  - src/styles/global.css
  - src/content/blog/mastering-typescript-patterns.md
  - scripts/verify-s04.sh
key_decisions:
  - TOC renders only when readingTime >= 5 AND filtered headings (h2/h3) exist
  - Two-column layout uses CSS grid lg:grid-cols-[1fr_250px] for content + 250px TOC sidebar
  - TOC hidden on mobile via hidden lg:block — graceful degradation to single-column
  - Scroll-spy uses IntersectionObserver with rootMargin '-80px 0px -60% 0px' to highlight one heading at a time
  - Active TOC link uses border-l-2 highlight with text-primary-500 color
patterns_established:
  - Astro render() destructuring: { Content, headings } from render(post) — headings are Array<{depth, slug, text}>
  - Reading-time strips code blocks — prose word count matters for threshold, not total word count
  - Conditional layout pattern: ternary in Astro template switches between grid and single-column article
observability_surfaces:
  - scripts/verify-s04.sh — 17-check build-time verification covering all S04 features + S02 regression
  - grep -l '<nav' dist/blog/*/index.html — which posts got a TOC
  - grep -c 'IntersectionObserver' dist/blog/mastering-typescript-patterns/index.html — scroll-spy present
  - grep 'scroll-margin-top' dist/_astro/*.css — heading offset rule shipped
duration: 20m
verification_result: passed
completed_at: 2026-03-16
blocker_discovered: false
---

# T03: Build TOC with scroll-spy and write verification script

**Built sticky Table of Contents with IntersectionObserver scroll-spy, conditional two-column layout, extended sample post to 1970 words, and wrote 17-check verify-s04.sh — all passing.**

## What Happened

1. Updated `[slug].astro` to destructure `headings` from `render(post)` and pass to BlogPost layout. Fixed a pre-existing duplicate `</BlogPost>` closing tag.

2. Created `TableOfContents.astro` — filters headings to h2/h3, renders a `<nav>` with anchor links (h3s indented via `pl-6`), wrapped in a sticky `<aside>`. Client script implements scroll-spy via IntersectionObserver with `rootMargin: '-80px 0px -60% 0px'`. Active link gets `text-primary-500` + `font-medium` + `border-primary-500` highlight — all static Tailwind classes per K002.

3. Restructured `BlogPost.astro` with conditional layout: when `showToc` (readingTime ≥ 5 AND h2/h3 headings exist), uses `max-w-6xl` container with `lg:grid lg:grid-cols-[1fr_250px] lg:gap-8`. TOC sidebar hidden on mobile via `hidden lg:block`. When `showToc` is false, preserves original `max-w-3xl` single-column layout. All existing T02 components (ShareButtons, RelatedPosts, CopyButton) remain in place.

4. Added `scroll-margin-top: 5rem` on `.prose h2, .prose h3, .prose h4` in `global.css` for proper anchor offset clearing the sticky header.

5. Extended `mastering-typescript-patterns.md` to 1970 total words (1097 prose words after code-block stripping → 6 min read). Added sections on utility types (Pick, Omit, Record, Partial), conditional types, template literal types, and type guards with substantive prose and code examples.

6. Wrote `scripts/verify-s04.sh` with 17 checks covering tag archives, tag pill links, related posts, share buttons, copy button, TOC presence/absence, and S02 regression.

## Verification

- `npm run build` exits zero
- `bash scripts/verify-s04.sh` — 17/17 PASS
- `bash scripts/verify-s02.sh` — 22/22 PASS (regression)
- Long post (`mastering-typescript-patterns`) has TOC `<nav>` with heading anchors, IntersectionObserver script, and `lg:grid` layout
- Short post (`first-post`) has no TOC, uses `max-w-3xl` single-column layout
- Browser verification confirmed TOC sidebar renders correctly with all headings visible and properly indented

## Diagnostics

- `bash scripts/verify-s04.sh` — primary diagnostic surface, 17 checks with PASS/FAIL output
- `grep -l '<nav' dist/blog/*/index.html` — which posts received a TOC
- `grep -c 'IntersectionObserver' dist/blog/mastering-typescript-patterns/index.html` — expect 1+
- `grep 'scroll-margin-top' dist/_astro/*.css` — heading offset rule in CSS bundle
- Build errors surface as `npm run build` stderr with file:line:col detail

## Deviations

- `[slug].astro` had a duplicate `</BlogPost>` closing tag (pre-existing from T02) — fixed as part of adding `headings` prop
- Reading-time function strips code blocks, so raw word count of 1327 words was insufficient (only 417 prose words → 3 min). Extended with substantial prose paragraphs to reach 1097 prose words → 6 min read.

## Known Issues

- None

## Files Created/Modified

- `src/components/TableOfContents.astro` — new TOC component with scroll-spy via IntersectionObserver
- `src/layouts/BlogPost.astro` — restructured for conditional two-column grid layout
- `src/pages/blog/[slug].astro` — extracts headings from render(), passes to layout, fixed duplicate closing tag
- `src/styles/global.css` — added scroll-margin-top on prose headings
- `src/content/blog/mastering-typescript-patterns.md` — extended from ~677 to 1970 words with TypeScript content
- `scripts/verify-s04.sh` — 17-check verification script for all S04 features + S02 regression
- `.gsd/milestones/M001/slices/S04/tasks/T03-PLAN.md` — added Observability Impact section (pre-flight fix)

---
id: S04
parent: M001
milestone: M001
provides:
  - Tag archive pages at /blog/tag/[tag]/ with pagination (9 tags, pageSize 10)
  - Navigable tag pill links in BlogCard and BlogPost components
  - RelatedPosts component with tag-overlap scoring (top 3, graceful empty state)
  - ShareButtons component for X, LinkedIn, Dev.to (URL-based, no third-party JS)
  - CopyButton script island for clipboard copy on all code blocks
  - TableOfContents with IntersectionObserver scroll-spy on long posts (≥5 min read)
  - Conditional two-column grid layout on desktop for long posts
  - scroll-margin-top on prose headings for anchor offset
  - 17-check verification script (scripts/verify-s04.sh)
requires:
  - slice: S02
    provides: BlogPost.astro layout, BlogCard.astro component, blog content collection (tags, body), [slug].astro page route, reading-time.ts utility, global.css
affects:
  - none (terminal slice — enhances S02 pages)
key_files:
  - src/pages/blog/tag/[tag]/[...page].astro
  - src/components/RelatedPosts.astro
  - src/components/ShareButtons.astro
  - src/components/CopyButton.astro
  - src/components/TableOfContents.astro
  - src/layouts/BlogPost.astro
  - src/pages/blog/[slug].astro
  - src/components/BlogCard.astro
  - src/styles/global.css
  - src/content/blog/mastering-typescript-patterns.md
  - scripts/verify-s04.sh
key_decisions:
  - D021: TOC visible only when readingTime >= 5 AND h2/h3 headings exist — two-column grid layout on desktop, single-column on mobile/short posts
  - D022: Scroll-spy uses IntersectionObserver with rootMargin '-80px 0px -60% 0px' — accounts for sticky header, single active heading
  - D023: CopyButton uses self-activating script island with global CSS — runtime DOM injection onto Shiki-rendered .astro-code elements
patterns_established:
  - Tag archive route pattern: getStaticPaths enumerates unique tags, paginate() per tag at pageSize 10
  - Client script island pattern: Astro component with only <script> and <style is:global>, no template markup
  - Astro render() destructuring: { Content, headings } from render(post) for heading extraction
  - Conditional layout pattern: ternary in Astro template switches between grid and single-column article
  - Share URL construction: full URL from Astro.site with fallback to hardcoded domain
  - Related post scoring: count shared tags primary, pubDate descending secondary, draft filtering consistent
observability_surfaces:
  - scripts/verify-s04.sh — 17-check build-time verification covering all 5 S04 features + S02 regression
  - find dist/blog/tag -name index.html | sort — lists all generated tag archive pages
  - grep -l '<nav' dist/blog/*/index.html — which posts got a TOC
  - grep -c 'IntersectionObserver' dist/blog/mastering-typescript-patterns/index.html — scroll-spy present
  - grep 'scroll-margin-top' dist/_astro/*.css — heading offset rule shipped
  - grep 'twitter.com/intent\|linkedin.com/sharing\|dev.to/new' dist/blog/*/index.html — share button URLs
  - grep -c 'Related Posts' dist/blog/*/index.html — related posts rendering per post
  - grep -l 'navigator.clipboard' dist/blog/*/index.html — copy button script presence
drill_down_paths:
  - .gsd/milestones/M001/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S04/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S04/tasks/T03-SUMMARY.md
duration: 43m
verification_result: passed
completed_at: 2026-03-16
---

# S04: Blog Reading Experience

**Tag archive pages, related posts, share buttons, code copy buttons, and sticky TOC with scroll-spy — all five blog reading enhancements shipped and verified across 17 build-time checks.**

## What Happened

S04 added five interactive features to the blog post reading experience, all building on the S02 blog engine.

**T01 (Tag Archives)** created paginated tag archive pages at `/blog/tag/[tag]/` using `getStaticPaths` to enumerate unique tags from non-draft posts. The template reuses BlogCard for the post grid and includes pagination nav, post count, and a back link. Tag pills in both `BlogCard.astro` and `BlogPost.astro` were converted from inert `<span>` to navigable `<a>` links with hover states. Build produces 9 tag archive pages (astro, webdev, tailwind, markdown, guide, typescript, patterns, javascript, mdx). Draft tags are correctly excluded.

**T02 (Related Posts, Share Buttons, Copy Button)** created three components and wired them into the blog post layout. `RelatedPosts.astro` filters all posts by shared tags with the current post, scores by overlap count, and renders up to 3 compact cards (title, date, reading time). Posts with no tag overlap render nothing. `ShareButtons.astro` renders X, LinkedIn, and Dev.to share links with SVG icons, `target="_blank"`, and proper URL encoding. `CopyButton.astro` is a self-activating script island that finds all `.astro-code` blocks at DOMContentLoaded, wraps each in a positioned container, and injects a copy button using `navigator.clipboard.writeText()` with "Copied!" feedback. The `[slug].astro` page route was updated to fetch all posts and pass them to the layout for related post calculation.

**T03 (TOC & Verification)** was the most complex task. `[slug].astro` now destructures `headings` from `render()` and passes them to `BlogPost.astro`. `TableOfContents.astro` filters to h2/h3, renders a sticky `<nav>` with anchor links (h3s indented), and implements scroll-spy via IntersectionObserver. `BlogPost.astro` was restructured with a conditional layout: long posts (readingTime ≥ 5 AND headings exist) get a `max-w-6xl` two-column grid (`lg:grid-cols-[1fr_250px]`); short posts keep the original `max-w-3xl` single-column. `scroll-margin-top: 5rem` was added to prose headings in `global.css`. The `mastering-typescript-patterns.md` post was extended to 1970 words (1097 prose words → 6 min read) to exercise the TOC. Finally, `scripts/verify-s04.sh` was written with 17 checks covering all features plus S02 regression.

## Verification

- `npm run build` exits zero
- `bash scripts/verify-s04.sh` — 17/17 PASS (tag archives, tag pill links, related posts, share buttons, copy button, TOC presence on long post, TOC absence on short post, S02 regression)
- `bash scripts/verify-s02.sh` — 22/22 PASS (full S02 regression)
- All observability diagnostic commands produce expected output
- Browser verification confirmed tag pill navigation, share button rendering, copy button DOM injection, TOC sidebar with heading links, and related posts display

## Requirements Advanced

- R006 — Tag archive pages generated for all 9 unique tags with pagination; tag pills in BlogCard and BlogPost are navigable links
- R008 — TOC auto-generated from h2/h3, sticky sidebar on desktop, scroll-spy via IntersectionObserver, conditional on ≥5 min read
- R009 — Copy button on code blocks completed (Shiki dual themes already validated in S02)
- R010 — Related posts with tag-overlap scoring, up to 3 results, graceful empty state
- R011 — Share buttons for X, LinkedIn, Dev.to with URL-based links, no third-party JS

## Requirements Validated

- R006 — 9 tag archive pages at /blog/tag/[tag]/ with correct getStaticPaths enumeration, tag pills navigable. Proof: scripts/verify-s04.sh [Tag Archives] + [Tag Pill Links]
- R008 — TOC with scroll-spy on long posts, absent on short posts. Proof: scripts/verify-s04.sh [Table of Contents] + [TOC Absent on Short Post]
- R009 — Fully validated across S02 (Shiki) + S04 (copy button). Proof: scripts/verify-s02.sh check 1 + scripts/verify-s04.sh [Copy Button]
- R010 — Related posts appear on tagged posts, absent on tagless posts. Proof: scripts/verify-s04.sh [Related Posts]
- R011 — Share button URLs for all 3 platforms present in build output. Proof: scripts/verify-s04.sh [Share Buttons]

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- Dev.to share button used string concatenation instead of nested template literals to avoid esbuild parse error (K007). Functionally equivalent.
- CopyButton uses `<style is:global>` with raw CSS instead of Tailwind utility classes — runtime-injected DOM elements can't use Astro template Tailwind classes.
- `mastering-typescript-patterns.md` required more prose extension than expected — initial 1327 total words only yielded 417 prose words (3 min) after code-block stripping (K008). Extended to 1970 words (1097 prose → 6 min).
- Fixed pre-existing duplicate `</BlogPost>` closing tag in `[slug].astro` during T03 headings integration.

## Known Limitations

- `navigator.clipboard.writeText()` is blocked in Playwright headless context (no clipboard permission). Copy button error path handles this gracefully — shows "Error" for 2s. Works correctly in real browser on localhost.
- Scroll-spy runtime behavior (active heading highlighting during scroll) is build-verified structurally but requires manual browser interaction for full confirmation — covered in UAT.
- Tag href uses string concatenation (`"/blog/tag/" + tag + "/"`). If multi-word tags are introduced, URL encoding will be needed in both hrefs and getStaticPaths params.

## Follow-ups

- none

## Files Created/Modified

- `src/pages/blog/tag/[tag]/[...page].astro` — new: tag archive route with getStaticPaths, BlogCard grid, pagination
- `src/components/RelatedPosts.astro` — new: tag-based related posts with compact card UI (top 3)
- `src/components/ShareButtons.astro` — new: X, LinkedIn, Dev.to share link component with SVG icons
- `src/components/CopyButton.astro` — new: self-activating copy button script island for code blocks
- `src/components/TableOfContents.astro` — new: TOC with scroll-spy via IntersectionObserver
- `src/layouts/BlogPost.astro` — modified: conditional two-column layout, imports all new components, tag pills as links
- `src/pages/blog/[slug].astro` — modified: extracts headings from render(), passes allPosts/tags to layout
- `src/components/BlogCard.astro` — modified: tag pills converted from `<span>` to `<a>` with archive links
- `src/styles/global.css` — modified: added scroll-margin-top on prose headings
- `src/content/blog/mastering-typescript-patterns.md` — extended to 1970 words (6 min read) for TOC exercise
- `scripts/verify-s04.sh` — new: 17-check verification script for all S04 features + S02 regression

## Forward Intelligence

### What the next slice should know
- `BlogPost.astro` is now significantly more complex — it has conditional layout (single vs two-column), five imported components (ShareButtons, RelatedPosts, CopyButton, TableOfContents, SEO), and multiple optional props (headings, allPosts, currentSlug, currentTags). Any further modifications should be tested with both a long post (mastering-typescript-patterns) and a short post (first-post) to verify both layout paths.
- `[slug].astro` now fetches ALL blog posts (for related posts calculation) and destructures `headings` from `render()`. This is the right place to pass additional data to the layout.
- The tag archive route at `src/pages/blog/tag/[tag]/[...page].astro` follows the same `getStaticPaths` + `paginate()` pattern as the main blog listing. Consistent pagination UI is shared between both.

### What's fragile
- **BlogPost.astro layout conditional** — the `showToc` ternary controls two different container widths (`max-w-6xl` grid vs `max-w-3xl` single-column). Adding new sections or components needs to consider both branches.
- **CopyButton runtime injection** — depends on `.astro-code` class selector from Shiki output. If Shiki changes its output class, buttons won't appear (silent failure, no build error).
- **Reading-time threshold** — K008 is critical: reading-time strips code blocks before word count. A post that looks long in raw markdown may not cross the 5-min threshold. Always check with the `getReadingTime()` function, not `wc -w`.

### Authoritative diagnostics
- `bash scripts/verify-s04.sh` — 17 checks covering all S04 features with PASS/FAIL per check, exits 1 on any failure. This is the single source of truth for S04 integrity.
- `bash scripts/verify-s02.sh` — S02 regression (22 checks). Run both after any BlogPost.astro or [slug].astro changes.

### What assumptions changed
- Original assumption: 1300 total words would produce ≥5 min read. Actual: code-heavy posts need ~2x the raw word count to hit the prose-word threshold. K008 documents this.
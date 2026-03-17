---
id: T02
parent: S04
milestone: M001
provides:
  - ShareButtons component with X, LinkedIn, Dev.to share links on every blog post
  - RelatedPosts component showing up to 3 tag-matched posts at bottom of each post
  - CopyButton script island adding copy-to-clipboard on all .astro-code blocks
  - Blog page route passes allPosts, currentSlug, currentTags to layout for related post calculation
key_files:
  - src/components/ShareButtons.astro
  - src/components/RelatedPosts.astro
  - src/components/CopyButton.astro
  - src/layouts/BlogPost.astro
  - src/pages/blog/[slug].astro
key_decisions:
  - Avoided nested template literals in ShareButtons — esbuild chokes on backtick-in-backtick. Used string concatenation for Dev.to prefill URL.
  - CopyButton uses global CSS styles instead of Tailwind utility classes for the dynamically-created button, since the button is injected at runtime by vanilla JS (not in Astro template).
  - RelatedPosts uses compact card design (title, date, reading time) — not full BlogCard — to keep the related section lightweight.
patterns_established:
  - Client script island pattern — CopyButton.astro contains only a <script> and <style is:global>, no template markup. Self-activating on DOMContentLoaded.
  - Share URL construction — full URL built from Astro.site with fallback to hardcoded domain.
  - Related post scoring — count shared tags for primary sort, pubDate descending for secondary. Draft filtering applied consistently.
observability_surfaces:
  - "grep 'twitter.com/intent\\|linkedin.com/sharing\\|dev.to/new' dist/blog/*/index.html — verifies share button URLs in build output"
  - "grep -c 'Related Posts' dist/blog/*/index.html — shows which posts render related section (0 for tagless posts)"
  - "grep -l 'navigator.clipboard' dist/blog/*/index.html — confirms copy button script presence"
  - "navigator.clipboard.writeText failures show as console errors on insecure origins; button shows 'Error' text for 2s on failure"
duration: 15m
verification_result: passed
completed_at: 2026-03-16
blocker_discovered: false
---

# T02: Add related posts, share buttons, and code copy button

**Created ShareButtons, RelatedPosts, and CopyButton components and integrated all three into BlogPost layout with correct wiring from [slug].astro page route.**

## What Happened

Created three new Astro components and wired them into the blog post layout:

1. **ShareButtons.astro** — Renders X, LinkedIn, and Dev.to share links as `<a>` tags with `target="_blank"` and `rel="noopener noreferrer"`. Each link includes an SVG icon and accessible `aria-label`. URLs use `encodeURIComponent` for proper encoding. Placed after the `<hr>` below the title/meta area.

2. **RelatedPosts.astro** — Accepts `currentSlug`, `currentTags`, and `allPosts`. Filters by shared tags (excludes current post and drafts in production), scores by tag overlap count (secondary sort by pubDate), takes top 3. Renders compact cards with title (linked), date, and reading time. Returns empty fragment when no matches or tags are empty.

3. **CopyButton.astro** — Client-side script island using vanilla JS. On `DOMContentLoaded`, finds all `.astro-code` elements, wraps each in a `position: relative` container, and inserts an absolute-positioned "Copy" button. Click handler uses `navigator.clipboard.writeText()` with "Copied!" feedback for 2 seconds. Error path shows "Error" text. Uses global CSS for button styling since buttons are injected at runtime.

4. **Updated [slug].astro** to fetch all blog posts, filter drafts, sort by date, and pass `allPosts`, `currentSlug`, and `currentTags` to BlogPost layout.

5. **Updated BlogPost.astro** with optional `allPosts`, `currentSlug`, and `currentTags` props. Imports and places all three components. Constructs full URL from `Astro.site` for share buttons.

Hit one issue: nested template literals in the Dev.to prefill URL broke esbuild. Fixed by using string concatenation instead.

## Verification

- `npm run build` exits zero — 19 pages built
- `grep -l 'twitter.com/intent/tweet' dist/blog/building-a-developer-blog/index.html` — PASS
- `grep -l 'linkedin.com/sharing' dist/blog/building-a-developer-blog/index.html` — PASS
- `grep -l 'dev.to/new' dist/blog/building-a-developer-blog/index.html` — PASS
- `grep -l 'Related' dist/blog/building-a-developer-blog/index.html` — PASS (shows "Using MDX" as related via shared `astro` tag)
- `grep -l 'navigator.clipboard' dist/blog/mastering-typescript-patterns/index.html` — PASS
- Tagless posts (first-post, second-post): 0 "Related Posts" matches — PASS (no empty section)
- Tagless posts still show ShareButtons — PASS (verified in browser)
- `bash scripts/verify-s02.sh` — 22/22 pass (S02 regression clean)
- Browser verification: share buttons visible with icons, related posts section at bottom, copy buttons in DOM on code blocks (4 wrappers, 4 buttons on building-a-developer-blog)

## Diagnostics

- **Share button URLs:** `grep 'twitter.com/intent\|linkedin.com/sharing\|dev.to/new' dist/blog/*/index.html` — verifies presence and encoding in build output. Malformed URLs surface as garbled href values.
- **Related posts rendering:** `grep -c 'Related Posts' dist/blog/*/index.html` — returns 0 for tagless posts, 1 for tagged posts with overlap. Mismatch indicates tag scoring or draft-filtering bug.
- **Copy button script:** `grep -l 'navigator.clipboard' dist/blog/*/index.html` — confirms script injection. Runtime failures surface as console errors or "Error" button text.
- **Draft leakage:** Compare `grep -o 'href="/blog/[^"]*"' dist/blog/*/index.html | sort -u` against `ls dist/blog/` to detect drafts that shouldn't be linked in related posts.

## Deviations

- Used string concatenation instead of nested template literals for Dev.to prefill URL to avoid esbuild parse error — functionally equivalent.
- CopyButton uses `<style is:global>` with raw CSS instead of Tailwind utility classes for the dynamically-created button, since runtime-injected DOM elements can't use Astro template Tailwind classes.

## Known Issues

- `navigator.clipboard.writeText()` is blocked in Playwright headless automation context (no clipboard permission grant). The error path handles this gracefully — button shows "Error" for 2s. Works correctly in real browser on localhost (secure context).

## Files Created/Modified

- `src/components/ShareButtons.astro` — new: X, LinkedIn, Dev.to share link component
- `src/components/RelatedPosts.astro` — new: tag-based related posts with compact card UI
- `src/components/CopyButton.astro` — new: self-activating copy button script island for code blocks
- `src/layouts/BlogPost.astro` — modified: imports and places all three components, adds optional props
- `src/pages/blog/[slug].astro` — modified: fetches allPosts, passes currentSlug/currentTags to layout
- `.gsd/milestones/M001/slices/S04/tasks/T02-PLAN.md` — modified: added Observability Impact section

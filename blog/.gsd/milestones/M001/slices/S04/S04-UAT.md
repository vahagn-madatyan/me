# S04: Blog Reading Experience — UAT

**Milestone:** M001
**Written:** 2026-03-16

## UAT Type

- UAT mode: mixed
- Why this mode is sufficient: Tag archives, related posts, share buttons, and copy button are artifact-verifiable in build output. Scroll-spy TOC requires live browser interaction (IntersectionObserver + scroll behavior). Copy button "Copied!" feedback requires live runtime with clipboard API.

## Preconditions

- `npm run build` exits zero
- Dev server running: `npm run dev` accessible at http://localhost:4321
- At least one long post (≥5 min read) with code blocks: `mastering-typescript-patterns`
- At least one short post (<5 min read): `first-post`
- At least one post with tags that overlap other posts: `building-a-developer-blog` (tags: astro, webdev, tailwind)

## Smoke Test

Navigate to http://localhost:4321/blog/mastering-typescript-patterns/ — verify the page has a TOC sidebar on the right (desktop), share buttons below the title, code blocks with copy buttons, and a related posts section at the bottom.

## Test Cases

### 1. Tag archive pages render correctly

1. Navigate to http://localhost:4321/blog/tag/astro/
2. **Expected:** Page heading shows "astro" tag name. BlogCard grid displays posts tagged with `astro`. Post count is shown. "← All posts" link navigates back to /blog/.
3. Click on a BlogCard title to navigate to the post.
4. **Expected:** Post page loads correctly.
5. Click browser back to return to tag archive.
6. **Expected:** Tag archive page still renders correctly.

### 2. Tag pill links navigate to archives

1. Navigate to http://localhost:4321/blog/
2. Find a BlogCard with tag pills (e.g., `building-a-developer-blog`).
3. Click the `astro` tag pill.
4. **Expected:** Navigates to /blog/tag/astro/ — the tag archive page for `astro`.
5. Navigate to http://localhost:4321/blog/building-a-developer-blog/
6. Click the `tailwind` tag pill in the post header area.
7. **Expected:** Navigates to /blog/tag/tailwind/ — the tag archive page for `tailwind`.

### 3. Related posts appear on tagged posts

1. Navigate to http://localhost:4321/blog/building-a-developer-blog/
2. Scroll to the bottom of the post content.
3. **Expected:** A "Related Posts" section appears with up to 3 posts that share tags (astro, webdev, or tailwind). Each related post shows title (linked), date, and reading time.
4. Click a related post link.
5. **Expected:** Navigates to the related post page correctly.

### 4. Related posts absent on tagless posts

1. Navigate to http://localhost:4321/blog/first-post/
2. Scroll to the bottom.
3. **Expected:** No "Related Posts" section is rendered. No empty heading or container visible.

### 5. Share buttons render and link correctly

1. Navigate to http://localhost:4321/blog/building-a-developer-blog/
2. Locate the share buttons (below the title/meta area).
3. **Expected:** Three share buttons visible with icons — X (Twitter), LinkedIn, Dev.to.
4. Hover over the X share button.
5. **Expected:** Link href contains `twitter.com/intent/tweet` with encoded URL and title parameters.
6. Hover over the LinkedIn share button.
7. **Expected:** Link href contains `linkedin.com/sharing/share-offsite` with encoded URL.
8. Hover over the Dev.to share button.
9. **Expected:** Link href contains `dev.to/new` with prefill parameter.
10. All links have `target="_blank"` (open in new tab).

### 6. Copy button on code blocks

1. Navigate to http://localhost:4321/blog/mastering-typescript-patterns/
2. Find a code block with syntax highlighting.
3. **Expected:** A "Copy" button appears in the top-right corner of the code block.
4. Click the "Copy" button.
5. **Expected:** Button text changes to "Copied!" for ~2 seconds, then reverts to "Copy".
6. Paste clipboard content (Cmd+V in a text field).
7. **Expected:** The code block content is pasted correctly.

### 7. TOC renders on long post (desktop)

1. Set browser viewport to desktop width (≥1024px).
2. Navigate to http://localhost:4321/blog/mastering-typescript-patterns/
3. **Expected:** A Table of Contents sidebar appears on the right side. It lists all h2 and h3 headings from the post. h3 headings are visually indented under their parent h2.
4. The TOC is sticky — scroll down and verify it stays visible in the viewport.

### 8. Scroll-spy highlights active heading

1. Continue on the `mastering-typescript-patterns` post at desktop width.
2. Scroll slowly down through the post content.
3. **Expected:** As each heading enters the upper portion of the viewport, the corresponding TOC link gets highlighted (text color change + left border indicator).
4. Only one heading is highlighted at a time.
5. Scroll back up.
6. **Expected:** The highlighted TOC link updates to match the visible heading.

### 9. TOC anchor links work with correct offset

1. Click a heading link in the TOC sidebar.
2. **Expected:** Page scrolls to that heading. The heading is visible and not hidden behind the sticky header (scroll-margin-top offsets it correctly).

### 10. TOC absent on short post

1. Navigate to http://localhost:4321/blog/first-post/
2. **Expected:** No TOC sidebar. Single-column layout. Post content fills the full width (max-w-3xl).

### 11. TOC hidden on mobile

1. Set browser viewport to mobile width (<1024px).
2. Navigate to http://localhost:4321/blog/mastering-typescript-patterns/
3. **Expected:** No TOC sidebar visible. Post uses single-column layout. All other components (share buttons, related posts, copy buttons) still render correctly.

## Edge Cases

### Draft posts excluded from tag archives

1. Navigate to http://localhost:4321/blog/tag/ directory listing (if accessible) or check build output.
2. **Expected:** No tag archive page exists for tags that only appear on draft posts. Draft posts do not appear in any tag archive listing.

### Post with no code blocks

1. Navigate to a post without code blocks (e.g., `first-post`).
2. **Expected:** No copy button script errors in console. Page renders cleanly.

### Tag archive with single post

1. Navigate to a tag archive for a tag used by only one post.
2. **Expected:** Page renders correctly with a single BlogCard. No pagination controls shown (only 1 post).

### Share buttons on tagless post

1. Navigate to http://localhost:4321/blog/first-post/
2. **Expected:** Share buttons still render (they depend on URL/title, not tags). Links are correctly formed.

## Failure Signals

- TOC sidebar visible on a short post (<5 min read) — layout conditional is broken
- TOC sidebar missing on a long post (≥5 min) at desktop width — headings extraction or showToc logic failed
- Tag pills that are not clickable (still `<span>` instead of `<a>`) — T01 regression
- "Related Posts" heading visible with no posts listed — empty state not handled
- Console errors during scroll on long post — IntersectionObserver misconfiguration
- Copy button not appearing on code blocks — `.astro-code` selector mismatch or DOMContentLoaded timing issue
- Share button URLs with unencoded characters — `encodeURIComponent` not applied
- 404 when clicking a tag pill link — tag archive route mismatch

## Requirements Proved By This UAT

- R006 — Tag archive pages generated and navigable via tag pill links
- R008 — TOC with scroll-spy on long posts, absent on short, responsive mobile behavior
- R009 — Copy button on code blocks (completing partial S02 validation of Shiki dual themes)
- R010 — Related posts with tag-overlap matching, graceful empty state
- R011 — Share buttons for X, LinkedIn, Dev.to with correct URLs

## Not Proven By This UAT

- Share button destination pages actually accept the URLs correctly (external platform behavior)
- Clipboard API behavior across all browsers (only tested in Chromium via localhost)
- Scroll-spy behavior with very fast scrolling or programmatic scroll
- Tag archive pagination with >10 posts per tag (current sample data has <10 per tag)

## Notes for Tester

- **Scroll-spy is the key interactive test** — test cases 7-9 are the most important UAT items since build-time verification can only confirm the script is present, not that it works correctly during scroll.
- **Copy button requires secure context** — works on localhost but may show "Error" on http:// non-localhost origins. This is expected browser behavior.
- **Dark mode:** Toggle dark mode and verify all new components (TOC, share buttons, related posts, copy button, tag archive) look correct in both themes.
- **Mobile nav:** On mobile, the tag archive page should be navigable via the header hamburger menu → Blog → tag pills.
- The `mastering-typescript-patterns` post is the designated long post for TOC testing. If it somehow shows <5 min read, the reading-time calculation may have changed (see K008).

---
estimated_steps: 7
estimated_files: 6
---

# T02: Add related posts, share buttons, and code copy button

**Slice:** S04 — Blog Reading Experience
**Milestone:** M001

## Description

Create three components — RelatedPosts, ShareButtons, and CopyButton — and wire them into the blog post layout. Related posts (R010) shows up to 3 posts with shared tags at the bottom of each post. Share buttons (R011) provide URL-based share links for X, LinkedIn, and Dev.to. Copy button (R009 partial) adds clipboard copy to all code blocks. All integrate into the existing single-column BlogPost layout before T03 restructures it for TOC.

**Relevant skill:** `astro` — Astro component patterns, client-side scripting islands.

## Steps

1. **Create `src/components/ShareButtons.astro`** — accepts `url: string` and `title: string` props.
   - Render share links as `<a>` tags with `target="_blank"` and `rel="noopener noreferrer"`:
     - **X:** `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
     - **LinkedIn:** `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
     - **Dev.to:** `https://dev.to/new?prefill=${encodeURIComponent(`---\ntitle: ${title}\npublished: false\n---\n\nOriginally posted at ${url}`)}`
   - Style as a horizontal row of icon/text buttons with hover states
   - Use static Tailwind classes only (K002)
   - Include accessible labels (aria-label on each link)

2. **Create `src/components/RelatedPosts.astro`** — accepts `currentSlug: string`, `currentTags: string[]`, and `allPosts` (array of blog collection entries).
   - Filter logic:
     - Exclude the current post by slug
     - Exclude drafts in production: `import.meta.env.PROD ? !post.data.draft : true`
     - Only include posts that share at least one tag with `currentTags`
     - Score by number of shared tags (more overlap = higher rank)
     - Secondary sort by pubDate descending
     - Take top 3
   - If zero matches OR `currentTags` is empty — render nothing (no empty section heading)
   - Render as compact cards: title (linked to post), date, reading time — NOT full BlogCard (too heavy for this context)
   - Import `getReadingTime` and `formatReadingTime` for reading time display
   - Import `FormattedDate` for consistent date formatting
   - Wrap in a section with "Related Posts" heading

3. **Create `src/components/CopyButton.astro`** — client JS island for code block copy.
   - Use a `<script>` tag (no framework hydration needed — vanilla JS)
   - On DOM load, find all `.astro-code` elements (Shiki output class)
   - For each code block:
     - Wrap in a `<div>` with `position: relative` if not already wrapped
     - Create a copy button positioned absolutely at top-right of the wrapper
     - Button text: "Copy" (changes to "Copied!" for 2 seconds after click)
     - Click handler: `navigator.clipboard.writeText(codeElement.textContent)` 
   - Style the button with static Tailwind classes — small, semi-transparent, appears on hover of the code block wrapper
   - **Critical:** The button must be outside the scrollable `.astro-code` area (inside the wrapper but positioned absolutely) so it doesn't scroll away with long code lines

4. **Update `src/pages/blog/[slug].astro`** — pass additional data to BlogPost layout for related posts.
   - Fetch all blog posts: `const allPosts = await getCollection('blog')`
   - Filter out drafts: same pattern as existing code
   - Sort by date descending
   - Pass to BlogPost layout as a prop: `allPosts={filteredPosts}`
   - Pass `currentSlug={post.id}` and `currentTags={post.data.tags}` 

5. **Update `src/layouts/BlogPost.astro`** to integrate all three components.
   - Add `allPosts`, `currentSlug?`, and `currentTags?` to the Props type (optional for backward compatibility)
   - Import ShareButtons, RelatedPosts, CopyButton
   - Place ShareButtons after the title/meta area (below the `<hr>`)
   - Place RelatedPosts after the prose `<div>` / `<slot />`
   - Place CopyButton anywhere in the template (it's a self-activating script island)
   - Construct the full post URL: `const fullUrl = new URL('/blog/' + derivedSlug + '/', Astro.site || 'https://vahagn.dev').toString()`

6. **Verify the build** — `npm run build` should succeed.
   - Check post HTML for `twitter.com/intent/tweet` (share buttons)
   - Check `building-a-developer-blog` post for related post links (it shares `astro` tag with `using-mdx`)
   - Check posts with code blocks for copy button script

7. **Test edge case: posts with no tags** — `first-post`, `second-post`, `third-post` have empty tag arrays. RelatedPosts should render nothing. ShareButtons should still appear.

## Must-Haves

- [ ] ShareButtons component renders X, LinkedIn, Dev.to share links with correct URLs
- [ ] RelatedPosts component shows up to 3 related posts based on shared tags
- [ ] RelatedPosts renders nothing when no tag overlap exists (no empty section)
- [ ] CopyButton adds copy-to-clipboard functionality to all `.astro-code` blocks
- [ ] Copy button shows "Copied!" feedback after clicking
- [ ] All three components integrated into BlogPost.astro layout
- [ ] `[slug].astro` passes all posts and current post metadata to layout
- [ ] `npm run build` succeeds with zero errors

## Verification

- `npm run build` exits zero
- `grep -l 'twitter.com/intent/tweet' dist/blog/building-a-developer-blog/index.html` — share buttons present
- `grep -l 'linkedin.com/sharing' dist/blog/building-a-developer-blog/index.html` — LinkedIn share link
- `grep -l 'dev.to/new' dist/blog/building-a-developer-blog/index.html` — Dev.to share link
- `grep -l 'Related' dist/blog/building-a-developer-blog/index.html` — related posts section (shares `astro` tag with using-mdx)
- `grep -l 'clipboard\|navigator.clipboard' dist/blog/mastering-typescript-patterns/index.html` — copy button script on page with code blocks
- `bash scripts/verify-s02.sh` — S02 regression passes (22/22)

## Inputs

- `src/layouts/BlogPost.astro` — current layout to add components into (T01 has already updated tag pills to links)
- `src/pages/blog/[slug].astro` — current page route to add allPosts fetching
- `src/components/BlogCard.astro` — reference for tag pill styling and card patterns (NOT used in RelatedPosts — use compact cards instead)
- `src/utils/reading-time.ts` — `getReadingTime()` and `formatReadingTime()` for related post cards
- `src/components/FormattedDate.astro` — for consistent date display in related posts
- S02 forward intelligence: draft filter pattern is `import.meta.env.PROD ? !post.data.draft : true`
- S02 forward intelligence: static Tailwind classes only — no dynamic class construction

## Expected Output

- `src/components/ShareButtons.astro` — new share button component
- `src/components/RelatedPosts.astro` — new related posts component  
- `src/components/CopyButton.astro` — new copy button island component
- `src/layouts/BlogPost.astro` — updated with all three components integrated
- `src/pages/blog/[slug].astro` — updated to pass allPosts, currentSlug, currentTags to layout
- Build output: share URLs, related post links, and copy button scripts in post HTML

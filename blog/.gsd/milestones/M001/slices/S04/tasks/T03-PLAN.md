---
estimated_steps: 7
estimated_files: 6
---

# T03: Build TOC with scroll-spy and write verification script

**Slice:** S04 — Blog Reading Experience
**Milestone:** M001

## Description

Build the sticky Table of Contents with IntersectionObserver scroll-spy for long posts (R008), restructure BlogPost.astro to a two-column layout on desktop when TOC is present, extend a sample post to >1000 words to exercise the feature, and write the comprehensive `scripts/verify-s04.sh` verification script covering all S04 deliverables plus S02 regression.

This is the most complex task in S04. It modifies the BlogPost layout from single-column (`max-w-3xl`) to a conditional two-column grid on `lg:` breakpoint when a TOC is warranted. The TOC only renders when `readingTime >= 5` (≈1000+ words) AND headings exist.

**Relevant skill:** `astro` — Astro component patterns, client-side scripting.

## Steps

1. **Update `src/pages/blog/[slug].astro`** to extract headings from `render()`.
   - Change: `const { Content } = await render(post)` → `const { Content, headings } = await render(post)`
   - Pass `headings` to BlogPost layout as a prop: `headings={headings}`
   - The `headings` array is `Array<{ depth: number, slug: string, text: string }>` — provided by Astro's markdown pipeline

2. **Create `src/components/TableOfContents.astro`** — accepts `headings` prop.
   - Filter to only h2 (depth 2) and h3 (depth 3) — ignore h1 (title) and h4+
   - Render a `<nav>` with:
     - A "Table of Contents" heading
     - A list of anchor links: `<a href={"#" + heading.slug}>{heading.text}</a>`
     - h3 items indented under their parent h2 (use `pl-4` class)
   - Wrap in `<aside>` with `sticky top-24` positioning (clears the sticky header)
   - Add `max-h-[calc(100vh-8rem)] overflow-y-auto` for scrollable TOC on very long posts
   - Client `<script>` implementing scroll-spy:
     - Query all heading elements by their IDs (from `heading.slug`)
     - Create `IntersectionObserver` with options: `{ rootMargin: '-80px 0px -60% 0px', threshold: 0 }`
     - On intersection, find the corresponding TOC link and add an active class (e.g., `text-primary-500 font-medium`)
     - Remove active class from all other TOC links
     - Use static Tailwind classes for active/inactive states (K002)
   - Style TOC links with `text-sm text-secondary-500 hover:text-primary-500 transition-colors`

3. **Restructure `src/layouts/BlogPost.astro`** for conditional two-column layout.
   - Add `headings` to Props type: `headings?: Array<{ depth: number; slug: string; text: string }>`
   - Determine whether to show TOC: `const showToc = (headings?.filter(h => h.depth === 2 || h.depth === 3).length ?? 0) > 0 && readingTime >= 5`
   - When `showToc` is true on desktop (`lg:`):
     - Replace the outer `<article class="mx-auto max-w-3xl">` with a wider container (`max-w-6xl`)
     - Use CSS grid: `lg:grid lg:grid-cols-[1fr_250px] lg:gap-8` (content takes remaining space, TOC gets 250px sidebar)
     - Content stays in the main column
     - TOC renders in the sidebar column, wrapped in `<div class="hidden lg:block">`
   - When `showToc` is false: keep existing single-column `max-w-3xl` layout unchanged
   - All existing components (ShareButtons, RelatedPosts, CopyButton from T02) must remain in place within the content column
   - **Mobile:** TOC sidebar is hidden on `< lg` breakpoints via `hidden lg:block`. The layout gracefully degrades to single-column.

4. **Add scroll-margin-top in `src/styles/global.css`** for heading anchor offset.
   - Add rule: `.prose h2, .prose h3, .prose h4 { scroll-margin-top: 5rem; }` (or use `scroll-mt-20` equivalent — 80px to clear sticky header)
   - This ensures clicking a TOC link doesn't hide the heading behind the fixed header

5. **Extend `src/content/blog/mastering-typescript-patterns.md`** to exceed 1000 words.
   - Add real, substantive TypeScript content sections — not filler text
   - Good candidates: add sections on utility types (Pick, Omit, Record, Partial), conditional types, template literal types, type guards, branded types
   - Target: 1200+ words so it clearly crosses the 5-min read / 1000-word threshold
   - Ensure new sections have h2 and h3 headings to populate the TOC
   - Keep existing content and frontmatter intact

6. **Write `scripts/verify-s04.sh`** — comprehensive verification script.
   - Run `npm run build` first (exit if non-zero)
   - Check categories (target ~14-16 checks):
     - **Tag archives:** `dist/blog/tag/astro/index.html` exists; contains BlogCard markup
     - **Tag pill links:** post HTML contains `href="/blog/tag/astro/"`; card listing HTML contains tag links
     - **Related posts:** `building-a-developer-blog` post contains "Related" section with a link to another post
     - **Share buttons:** post HTML contains `twitter.com/intent/tweet`, `linkedin.com/sharing`, `dev.to/new`
     - **Copy button:** post with code blocks contains `clipboard` or `navigator.clipboard` in script
     - **TOC on long post:** `mastering-typescript-patterns` HTML contains `<nav` with heading anchor links and IntersectionObserver script
     - **TOC absent on short post:** `first-post` HTML does NOT contain TOC nav
     - **S02 regression:** run `bash scripts/verify-s02.sh` and check it passes (22/22)
   - Print pass/fail summary with counts
   - Exit non-zero if any check fails

7. **Final verification** — run `bash scripts/verify-s04.sh` and confirm all checks pass.

## Must-Haves

- [ ] `[slug].astro` extracts `headings` from `render()` and passes to layout
- [ ] TableOfContents component renders h2/h3 heading links with correct anchor hrefs
- [ ] Scroll-spy script uses IntersectionObserver to highlight active heading
- [ ] TOC is sticky positioned (`sticky top-24`) in a sidebar column on desktop
- [ ] BlogPost.astro uses two-column grid layout when TOC is present, single-column otherwise
- [ ] TOC only renders when `readingTime >= 5` AND headings exist
- [ ] TOC hidden on mobile (< lg breakpoint)
- [ ] Heading elements have `scroll-margin-top` for proper anchor offset
- [ ] At least one post exceeds 1000 words to exercise the TOC
- [ ] `scripts/verify-s04.sh` covers all 5 S04 features + S02 regression
- [ ] `npm run build` exits zero
- [ ] `bash scripts/verify-s04.sh` passes all checks

## Verification

- `npm run build` exits zero
- `bash scripts/verify-s04.sh` passes all checks
- `bash scripts/verify-s02.sh` passes 22/22 (regression)
- `grep -l '<nav' dist/blog/mastering-typescript-patterns/index.html` — TOC nav exists on long post
- `grep -c 'IntersectionObserver' dist/blog/mastering-typescript-patterns/index.html` — scroll-spy script present
- TOC absent from short posts: `! grep -q 'Table of Contents' dist/blog/first-post/index.html`

## Inputs

- `src/layouts/BlogPost.astro` — current layout with ShareButtons, RelatedPosts, CopyButton already wired from T02
- `src/pages/blog/[slug].astro` — current page route, needs `headings` extraction added
- `src/styles/global.css` — needs `scroll-margin-top` rule added
- `src/content/blog/mastering-typescript-patterns.md` — current ~677 words, needs extension to 1000+
- Astro `render()` returns `{ Content, headings }` where `headings` is `Array<{ depth: number, slug: string, text: string }>`
- S02 forward intelligence: reading time at 200 WPM means 5 min ≈ 1000 words — use `readingTime >= 5` as TOC threshold
- K002: all Tailwind classes must be static strings, no dynamic construction

## Observability Impact

- **TOC rendering:** `grep -l '<nav' dist/blog/*/index.html` shows which posts got a TOC. Long posts (≥5 min) must appear; short posts must not.
- **Scroll-spy script:** `grep -c 'IntersectionObserver' dist/blog/mastering-typescript-patterns/index.html` confirms the scroll-spy is present (expect 1+).
- **Heading anchor offset:** `grep 'scroll-margin-top' dist/_astro/*.css` verifies the heading offset rule shipped in the CSS bundle.
- **verify-s04.sh:** The verification script itself is the primary diagnostic surface — it reports per-check PASS/FAIL and exits non-zero on any failure. Downstream agents run `bash scripts/verify-s04.sh` to verify the entire slice.
- **Build failures:** Missing imports, bad prop types, or template errors in the TOC component surface as `npm run build` stderr with file:line:col detail.

## Expected Output

- `src/components/TableOfContents.astro` — new TOC component with scroll-spy
- `src/layouts/BlogPost.astro` — restructured for conditional two-column layout
- `src/pages/blog/[slug].astro` — extracts and passes `headings`
- `src/styles/global.css` — `scroll-margin-top` on prose headings
- `src/content/blog/mastering-typescript-patterns.md` — extended to 1000+ words with new sections
- `scripts/verify-s04.sh` — comprehensive verification script

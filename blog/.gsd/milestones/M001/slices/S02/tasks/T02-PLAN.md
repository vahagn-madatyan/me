---
estimated_steps: 3
estimated_files: 3
---

# T02: Build blog components — BlogCard, reading time utility, and BlogPost layout update

**Slice:** S02 — Blog Engine
**Milestone:** M001

## Description

Create the reusable components that T03's pages will compose: a reading time utility function, a BlogCard component for listing pages, and an updated BlogPost layout that displays all extended schema fields. These components establish boundary contracts consumed by S04 (tag archives, related posts) and S07 (homepage featured posts).

**Key constraint from S01:** Tailwind v4 purges dynamically-constructed classes in production builds. All BlogCard and tag pill styling must use static, hardcoded Tailwind classes — no template literals building class names from variables.

## Steps

1. **Create `src/utils/reading-time.ts`:**
   - Export `getReadingTime(content: string): number`:
     - Strip common Markdown syntax (headings, links, images, code fences, HTML tags)
     - Count remaining words by splitting on whitespace
     - Divide by 200 (words per minute)
     - Round up with `Math.ceil`, minimum 1 minute
     - Return integer minutes
   - Export `formatReadingTime(minutes: number): string`:
     - Return `"${minutes} min read"`
   - Keep it simple — exact Markdown stripping doesn't need to be perfect, just close enough for a reliable estimate

2. **Create `src/components/BlogCard.astro`:**
   - Props interface: `{ title: string, description: string, pubDate: Date, heroImage?: ImageMetadata, tags?: string[], readingTime: number, slug: string }`
   - Card structure:
     - Hero image (if present) with aspect ratio, rounded corners
     - Title as link to `/blog/${slug}/`
     - Description text (truncated or full — frontmatter descriptions are already short)
     - Footer row: FormattedDate + reading time on one side, tag pills on the other
   - Tag pills: use static classes like `bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200` with `text-xs rounded-full px-2 py-0.5` — NO dynamic class construction
   - Import and use `FormattedDate` component for date display
   - Import and use `formatReadingTime` from reading-time utility
   - Dark mode styles via `dark:` prefix on all color classes
   - Card hover: subtle scale or shadow transition

3. **Update `src/layouts/BlogPost.astro`:**
   - Update `type Props` to include new fields: `tags?: string[]`, `readingTime: number` (plus existing title, description, pubDate, updatedDate, heroImage)
   - Destructure new props: `tags`, `readingTime`
   - Add reading time display next to the date line (e.g., "Mar 15, 2026 · 5 min read")
   - Add tag pills below the title (same static classes as BlogCard)
   - Add description paragraph below title if present
   - Keep existing prose container and image handling intact
   - Import `formatReadingTime` from reading-time utility

## Must-Haves

- [ ] `getReadingTime` returns integer minutes ≥ 1 for any non-empty content
- [ ] `formatReadingTime` returns "X min read" string
- [ ] BlogCard renders title, description, date, reading time, tags, and links to post
- [ ] BlogCard uses only static Tailwind classes (no dynamic class construction)
- [ ] BlogPost layout displays reading time next to date and tags below title
- [ ] All components use `dark:` variants for dark mode

## Verification

- `npm run build` — zero errors
- Check build output for BlogPost layout rendering: `grep 'min read' dist/blog/first-post/index.html` — should find reading time text
- Check that BlogCard component file exists: `test -f src/components/BlogCard.astro`
- Check that reading time utility exists: `test -f src/utils/reading-time.ts`

## Inputs

- `src/content.config.ts` — extended schema from T01 (tags, featured, draft, canonicalURL fields)
- `src/styles/global.css` — typography plugin loaded, Shiki CSS configured (from T01)
- `src/layouts/BlogPost.astro` — current layout with prose container, needs props expansion
- `src/components/FormattedDate.astro` — existing date formatting component (reuse in BlogCard)
- S01 forward intelligence — Tailwind v4 purges dynamic classes, use static classes or @apply

## Expected Output

- `src/utils/reading-time.ts` — reading time calculation and formatting functions
- `src/components/BlogCard.astro` — post card component with full metadata display
- `src/layouts/BlogPost.astro` — updated layout with reading time, tags, description

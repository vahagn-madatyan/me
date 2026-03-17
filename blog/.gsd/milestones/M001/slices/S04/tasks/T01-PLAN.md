---
estimated_steps: 5
estimated_files: 3
---

# T01: Create tag archive pages and link tag pills

**Slice:** S04 — Blog Reading Experience
**Milestone:** M001

## Description

Create paginated tag archive pages at `/blog/tag/[tag]/` and convert tag pills in BlogCard and BlogPost from inert `<span>` elements to `<a>` links pointing to the archive route. This delivers R006 (tag archive pages) and establishes tag-based navigation throughout the blog.

**Relevant skill:** `astro` — Astro project patterns, `getStaticPaths`, pagination.

## Steps

1. **Create `src/pages/blog/tag/[tag]/[...page].astro`** — the tag archive page route.
   - In `getStaticPaths({ paginate })`:
     - Fetch all blog posts via `getCollection('blog')`
     - Filter out drafts in production: `import.meta.env.PROD ? !post.data.draft : true`
     - Collect unique tags from all filtered posts into a flat array
     - For each unique tag, filter posts that contain that tag, sort by pubDate descending
     - Return `paginate(filteredPosts, { pageSize: 10, params: { tag } })` for each tag
   - In the template:
     - Use `BaseLayout` with title `Posts tagged "${tag}" — ${SITE_TITLE}`
     - Show a heading like `Posts tagged "astro"` with a link back to `/blog/`
     - Render posts in a grid using `BlogCard` (same pattern as `[...page].astro` listing)
     - Include pagination nav (same pattern as the main blog listing)
   - Import `getReadingTime` for computing reading time on each card
   - Use `Astro.params.tag` to get the current tag from the URL

2. **Update tag pills in `src/components/BlogCard.astro`** — wrap each tag `<span>` in an `<a>` link.
   - Change the tag pill from `<span class="...">` to `<a href={"/blog/tag/" + tag + "/"} class="...">` 
   - Keep all existing Tailwind classes intact (static classes — K002)
   - Add hover state: `hover:bg-primary-200 dark:hover:bg-primary-800` or similar
   - Ensure `transition-colors` for smooth hover

3. **Update tag pills in `src/layouts/BlogPost.astro`** — same change as BlogCard.
   - Change `<span>` to `<a href={"/blog/tag/" + tag + "/"}>` with same styling
   - Add matching hover state classes
   - Keep all existing classes unchanged

4. **Verify build succeeds** — run `npm run build` and confirm:
   - `dist/blog/tag/astro/index.html` exists (astro tag has 2 posts)
   - Tag archive pages contain BlogCard markup
   - Post HTML contains `<a` tags with `href="/blog/tag/astro/"` on tag pills
   - No build errors

5. **Spot-check tag encoding** — current tags are all lowercase single words, but the code should use string concatenation (not template literals with complex expressions) and handle the general case. Tags like `"web dev"` would need URL encoding in the route.

## Must-Haves

- [ ] Tag archive page route at `src/pages/blog/tag/[tag]/[...page].astro` generates pages for each unique tag
- [ ] Archive pages show filtered posts using BlogCard with pagination
- [ ] Draft posts excluded from tag archives in production
- [ ] Tag pills in BlogCard.astro are `<a>` links to `/blog/tag/{tag}/`
- [ ] Tag pills in BlogPost.astro are `<a>` links to `/blog/tag/{tag}/`
- [ ] `npm run build` succeeds with zero errors

## Verification

- `npm run build` exits zero
- `test -f dist/blog/tag/astro/index.html` — tag archive page exists
- `grep -l 'href="/blog/tag/astro/"' dist/blog/building-a-developer-blog/index.html` — tag pill links in post HTML
- `grep -l 'href="/blog/tag/astro/"' dist/blog/index.html` — tag pill links in listing HTML
- `grep -c 'BlogCard\|blog-card\|rounded-2xl' dist/blog/tag/astro/index.html` — BlogCard markup present in archive

## Observability Impact

- **New build artifacts:** `dist/blog/tag/*/index.html` — one page per unique tag. Absence indicates `getStaticPaths` enumeration failure.
- **Inspectable signals:** `grep -r 'href="/blog/tag/' dist/blog/` confirms tag pill links are wired. Count should match total tag occurrences across all posts × 2 (BlogCard listing + individual post pages).
- **Failure visibility:** Missing tag archive pages produce no error at build time (Astro simply doesn't generate them). Verify by checking `ls dist/blog/tag/` after build. Tag pills with broken hrefs are visible via `grep` — a tag pill `<a>` with no matching `dist/blog/tag/{tag}/` directory indicates a mismatch.
- **How to inspect later:** `find dist/blog/tag -name index.html | sort` lists all generated tag archive pages. `grep -c 'href="/blog/tag/' dist/blog/index.html` counts tag pill links on the listing page.

## Inputs

- `src/pages/blog/[...page].astro` — reference for `getStaticPaths` + `paginate()` pattern and BlogCard usage
- `src/components/BlogCard.astro` — tag pill markup to update (currently `<span>`)
- `src/layouts/BlogPost.astro` — tag pill markup to update (currently `<span>`)
- `src/utils/reading-time.ts` — `getReadingTime()` function for computing reading time on archive cards
- S02 forward intelligence: tag pill classes are `rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200` — keep these static, add hover classes as separate complete strings

## Expected Output

- `src/pages/blog/tag/[tag]/[...page].astro` — new tag archive page with pagination
- `src/components/BlogCard.astro` — tag pills changed from `<span>` to `<a>` with archive links
- `src/layouts/BlogPost.astro` — tag pills changed from `<span>` to `<a>` with archive links
- Build output: `dist/blog/tag/astro/`, `dist/blog/tag/typescript/`, etc. for each tag

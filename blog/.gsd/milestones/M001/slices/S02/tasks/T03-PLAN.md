---
estimated_steps: 6
estimated_files: 12
---

# T03: Create paginated listing, sample posts, route fix, and verification script

**Slice:** S02 — Blog Engine
**Milestone:** M001

## Description

Final assembly task: write real sample blog posts exercising all frontmatter fields, build the paginated listing page, fix the route conflict, filter drafts from RSS, and write the verification script that proves the entire blog engine works end-to-end.

This task ties together everything from T01 (schema + rendering pipeline) and T02 (components) into a working blog with real content.

## Steps

1. **Write 3–4 sample blog posts in `src/content/blog/`:**
   - **`building-a-developer-blog.md`** — A post about building this blog. Include `featured: true`, tags like `["astro", "webdev", "tailwind"]`. Needs >200 words for meaningful reading time. Include a few code blocks (TypeScript, JSX, CSS) to exercise Shiki syntax highlighting.
   - **`mastering-typescript-patterns.md`** — Technical post about TypeScript. Tags: `["typescript", "patterns", "javascript"]`. Include multiple code blocks in TypeScript showing different patterns. This is the primary Shiki test post — needs code in 2+ languages.
   - **`draft-upcoming-post.md`** — A draft post with `draft: true`. Tags: `["draft"]`. Short content is fine — this exists to verify draft filtering. Must NOT appear in production build output or RSS.
   - Optionally a 4th post to increase content volume. All posts need: title, description, pubDate, tags. Use realistic dates (early 2026).
   - **Update existing posts** (`first-post.md`, `second-post.md`, `third-post.md`, `markdown-style-guide.md`, `using-mdx.mdx`): add `tags` and appropriate frontmatter to work with extended schema. These can keep `tags: []` or get relevant tags. Don't break their existing content.

2. **Delete `src/pages/blog/index.astro`** — this is replaced by the paginated `[...page].astro`

3. **Create `src/pages/blog/[...page].astro`:**
   - Export `getStaticPaths` using `paginate()` with `pageSize: 10`
   - Fetch all blog posts via `getCollection('blog')`
   - Filter drafts in production: `.filter(post => import.meta.env.PROD ? !post.data.draft : true)`
   - Sort by `pubDate` descending
   - For each post, calculate reading time using `getReadingTime` from the raw body
   - To get raw body for reading time: use `post.body` (Astro content collection provides the raw markdown body as `post.body`)
   - Render a grid of `BlogCard` components
   - Add pagination navigation at the bottom: Previous / Next links using `page.url.prev` and `page.url.next`
   - Page 1 URL = `/blog/` (rest param absent), page 2 = `/blog/2/`, etc.
   - Wrap in `BaseLayout` with title "Blog"

4. **Rename `src/pages/blog/[...slug].astro` → `src/pages/blog/[slug].astro`:**
   - Delete the old `[...slug].astro` file
   - Create `[slug].astro` (single param instead of rest param — post IDs are single-segment)
   - Keep same logic: `getStaticPaths` from `getCollection('blog')`, render with `BlogPost` layout
   - Add draft filtering: in `getStaticPaths`, filter out drafts in production
   - Calculate reading time from `post.body` and pass to BlogPost layout as a prop
   - Pass all extended schema fields to BlogPost: `{...post.data, readingTime}`

5. **Update `src/pages/rss.xml.js`:**
   - Add draft filtering: `.filter(post => !post.data.draft)` (RSS should never include drafts, even in dev)
   - Keep existing RSS generation logic

6. **Write `scripts/verify-s02.sh`:**
   - Run `npm run build` first
   - Check Shiki dual themes: `grep -q 'shiki-dark' dist/blog/*/index.html` for at least one post
   - Check prose class: `grep -q 'prose' dist/blog/*/index.html` for at least one post
   - Check paginated listing exists: `test -f dist/blog/index.html`
   - Check individual post pages: verify at least 3 post dirs exist under `dist/blog/`
   - Check reading time on listing: `grep -q 'min read' dist/blog/index.html`
   - Check reading time on post: `grep -q 'min read' dist/blog/building-a-developer-blog/index.html`
   - Check tags rendered: `grep -q 'astro' dist/blog/building-a-developer-blog/index.html` (tag pill text)
   - Check draft not in production: `test ! -d dist/blog/draft-upcoming-post` (draft dir should not exist)
   - Check draft not in RSS: `! grep -q 'draft-upcoming-post' dist/rss.xml` (or whatever the draft title is)
   - Check S01 still passes: `bash scripts/verify-s01.sh`
   - Use pass/fail counter format similar to verify-s01.sh
   - Print summary at end

## Must-Haves

- [ ] 3+ new sample posts with full extended frontmatter (tags, featured, code blocks)
- [ ] 1 draft post that does NOT appear in production build or RSS
- [ ] Existing 5 posts updated with tags (even if empty) and still build correctly
- [ ] Paginated listing at `/blog/` with BlogCard grid and pagination nav
- [ ] `[slug].astro` replaces `[...slug].astro` — no rest-param conflict
- [ ] Draft filtering in listing, individual posts, and RSS
- [ ] `scripts/verify-s02.sh` passes all checks
- [ ] `scripts/verify-s01.sh` still passes (no regressions)

## Verification

- `npm run build` — zero errors
- `bash scripts/verify-s02.sh` — all checks pass
- `bash scripts/verify-s01.sh` — all checks still pass (no regressions)
- Draft post directory absent from `dist/blog/`
- Paginated listing renders BlogCard components with all metadata

## Inputs

- `src/content.config.ts` — extended schema from T01
- `src/styles/global.css` — typography + Shiki CSS from T01
- `src/components/BlogCard.astro` — card component from T02
- `src/layouts/BlogPost.astro` — updated layout from T02
- `src/utils/reading-time.ts` — reading time utility from T02
- `src/components/BaseLayout.astro` — page wrapper from S01
- `src/components/FormattedDate.astro` — date display component from S01
- `scripts/verify-s01.sh` — existing verification script from S01

## Expected Output

- `src/content/blog/building-a-developer-blog.md` — featured sample post with code blocks
- `src/content/blog/mastering-typescript-patterns.md` — technical post with multi-language code
- `src/content/blog/draft-upcoming-post.md` — draft post for filtering verification
- `src/pages/blog/[...page].astro` — paginated blog listing
- `src/pages/blog/[slug].astro` — individual post route (replaces [...slug].astro)
- `src/pages/rss.xml.js` — updated with draft filtering
- `scripts/verify-s02.sh` — build output verification (target: 12+ checks)
- Updated existing posts with extended frontmatter fields

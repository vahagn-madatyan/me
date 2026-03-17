# S02: Blog Engine — UAT

**Milestone:** M001
**Written:** 2026-03-16

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All deliverables are static build output (HTML files, CSS classes, route structure). The 22-check verification script already validates build artifacts. Visual design quality was verified during task execution. No runtime state or server-side logic to test.

## Preconditions

- `npm run build` succeeds with zero errors
- Build output in `dist/` is fresh (no stale artifacts)
- `scripts/verify-s02.sh` and `scripts/verify-s01.sh` exist and are executable

## Smoke Test

Run `bash scripts/verify-s02.sh` — all 22 checks must pass. If this passes, the slice fundamentals are working.

## Test Cases

### 1. Extended Schema Validation

1. Open `src/content.config.ts` and verify the blog schema includes: `tags` (string array, default `[]`), `featured` (boolean, default `false`), `draft` (boolean, default `false`), `canonicalURL` (optional string).
2. Run `npm run build`.
3. **Expected:** Build succeeds with zero errors. All 8 posts (5 original + 3 new) validate against the schema without any requiring the new fields in frontmatter.

### 2. Shiki Dual-Theme Syntax Highlighting

1. Run `npm run build`.
2. Run `grep -c 'shiki-dark' dist/blog/mastering-typescript-patterns/index.html`.
3. **Expected:** Count > 0 (should be ~98). Each code span has `--shiki-light` and `--shiki-dark` CSS variables instead of inline color styles.
4. Open `src/styles/global.css` and verify CSS rules exist that swap `.astro-code` and `.astro-code span` colors based on `html.dark` class.

### 3. Typography Plugin Active

1. Run `grep 'prose' dist/blog/building-a-developer-blog/index.html`.
2. **Expected:** At least one match — the blog post content wrapper has a `prose` class.
3. Verify `@plugin "@tailwindcss/typography"` exists in `src/styles/global.css`.

### 4. Paginated Blog Listing

1. Run `test -f dist/blog/index.html && echo "EXISTS"`.
2. **Expected:** "EXISTS" — paginated listing generates at `/blog/`.
3. Open `dist/blog/index.html` and verify it contains BlogCard elements with title, description, date, reading time, and tag pills.
4. Verify pagination nav is not rendered (only 7 posts, pageSize is 10 — no page 2 needed).

### 5. Individual Post Pages

1. Run `ls dist/blog/ | grep -v index.html | head -10`.
2. **Expected:** Directories for each non-draft post: `building-a-developer-blog`, `mastering-typescript-patterns`, `first-post`, `second-post`, `third-post`, `markdown-style-guide`, `using-mdx`.
3. Each directory contains `index.html`.

### 6. Reading Time Display

1. Run `grep 'min read' dist/blog/building-a-developer-blog/index.html`.
2. **Expected:** "X min read" text present in the post header area.
3. Run `grep 'min read' dist/blog/index.html`.
4. **Expected:** Reading time present on blog cards in the listing page.
5. Verify reading times are sensible: building-a-developer-blog (~500 words → 3 min), mastering-typescript-patterns (~800 words → 4-5 min).

### 7. Tag Rendering

1. Run `grep 'astro' dist/blog/building-a-developer-blog/index.html`.
2. **Expected:** Tag "astro" rendered in the post page.
3. Run `grep 'bg-primary-100' dist/blog/building-a-developer-blog/index.html`.
4. **Expected:** Tag pill styling classes present (confirms visual tag pills, not just text).
5. Verify `mastering-typescript-patterns` shows tags: typescript, patterns, javascript.

### 8. Draft Filtering — Production Build

1. Run `test -d dist/blog/draft-upcoming-post && echo "FOUND" || echo "ABSENT"`.
2. **Expected:** "ABSENT" — draft post must not exist in production build output.
3. Run `grep 'draft-upcoming-post' dist/rss.xml && echo "IN_RSS" || echo "NOT_IN_RSS"`.
4. **Expected:** "NOT_IN_RSS" — draft post must not appear in RSS feed.
5. Verify `src/content/blog/draft-upcoming-post.md` exists with `draft: true` in frontmatter (the source file must exist even though it's filtered from output).

### 9. Route Structure

1. Run `ls src/pages/blog/`.
2. **Expected:** Contains `[slug].astro` and `[...page].astro`. Does NOT contain `[...slug].astro` or `index.astro`.
3. **Expected:** `[slug].astro` handles individual posts. `[...page].astro` handles paginated listing.

### 10. RSS Draft Filtering

1. Run `cat dist/rss.xml | grep '<title>' | head -20`.
2. **Expected:** All non-draft post titles appear. "draft-upcoming-post" or its title do NOT appear.

### 11. BlogCard Component Contract

1. Open `src/components/BlogCard.astro`.
2. **Expected:** Props interface includes: `title`, `description`, `pubDate`, `heroImage?`, `tags?`, `readingTime`, `slug`.
3. Verify all Tailwind classes are static strings (no template literal class construction).
4. Verify dark mode support via `dark:` variants.

### 12. S01 Non-Regression

1. Run `bash scripts/verify-s01.sh`.
2. **Expected:** 19/19 checks pass. S02 changes did not break any S01 functionality.

## Edge Cases

### Draft Posts Visible in Dev Mode

1. In `src/pages/blog/[slug].astro`, verify the `getStaticPaths` function includes the filter: `import.meta.env.PROD ? !post.data.draft : true`.
2. **Expected:** Draft posts are included in dev server output but excluded from production builds.

### Posts Without New Frontmatter Fields

1. Open `src/content/blog/first-post.md` — it should have `tags: []` but no `featured` or `draft` or `canonicalURL` fields.
2. Run `npm run build`.
3. **Expected:** Build succeeds — schema defaults handle missing fields gracefully.

### Empty Tags Array

1. Posts with `tags: []` should render without any tag pills (no empty pill element, no "undefined" text).
2. Check `dist/blog/first-post/index.html` for any stray tag-related markup.
3. **Expected:** No tag section rendered when tags array is empty.

### Reading Time Minimum

1. The shortest post (`using-mdx`) should show at least "1 min read".
2. Run `grep 'min read' dist/blog/using-mdx/index.html`.
3. **Expected:** "1 min read" — the utility enforces `Math.max(1, minutes)`.

## Failure Signals

- `npm run build` fails — schema validation error, Shiki theme not found, or typography plugin load failure (all with file/line context)
- `scripts/verify-s02.sh` reports any failures — specific check number indicates which subsystem broke
- `draft-upcoming-post` directory exists in `dist/blog/` — draft filtering broken
- Code blocks show no syntax colors — Shiki CSS variable pipeline broken (check `astro.config.mjs` shikiConfig and `global.css` CSS rules)
- "NaN min read" in any post HTML — reading time utility receiving bad input
- Tag pills missing from posts that have tags — BlogPost layout not rendering tags array

## Requirements Proved By This UAT

- R004 (Blog Content Collection) — Test cases 1, 3, 8 prove schema validates all posts with extended frontmatter
- R005 (Blog Pagination) — Test case 4 proves paginated listing works with `paginate()`
- R007 (Reading Time) — Test cases 6, edge case "Reading Time Minimum" prove reading time on cards and posts
- R009 (Syntax Highlighting) — Test case 2 proves Shiki dual themes via CSS variables (copy button is S04 scope)

## Not Proven By This UAT

- Visual quality of dark mode code theme switching (requires dev server + browser toggle — artifact checks confirm CSS variables exist but not visual appearance)
- Pagination with >10 posts (only 7 non-draft posts exist, so page 2 is never generated)
- Tag pill click navigation to `/blog/tag/[tag]/` (S04 scope — pills are not links yet)
- BlogCard visual layout and hover states (artifact-driven UAT, not live browser)
- Featured post consumption on homepage (S07 scope)
- Copy button on code blocks (S04 scope)

## Notes for Tester

- The verification script (`scripts/verify-s02.sh`) is the fastest way to re-check everything — it runs a fresh build and all 22 checks in one pass.
- Tag pills are currently non-interactive text — they will become links in S04 when tag archive pages are created.
- The `featured` field defaults to `false` and is only set to `true` on `building-a-developer-blog.md`. No page currently queries for featured posts — S07 will.
- If you want to visually verify Shiki theme switching, run `npm run dev`, navigate to `/blog/mastering-typescript-patterns/`, and toggle dark mode. Code blocks should swap between github-light and github-dark color schemes.

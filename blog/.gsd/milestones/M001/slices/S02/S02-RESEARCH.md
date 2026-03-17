# S02: Blog Engine — Research

**Date:** 2026-03-16
**Depth:** Targeted

## Summary

S02 extends the existing blog scaffolding into a complete blog engine: extended content schema, paginated listing, reading time, Shiki dual-theme syntax highlighting, and proper prose typography. All technologies are well-understood and well-supported by Astro 6 — no novel integrations or risk areas.

The main finding is that the foundation is already solid from S01 — every page wraps in `BaseLayout`, Tailwind v4 compiles, dark mode works. The gaps are specific and mechanical: the content schema is minimal (no tags/featured/draft), there's no pagination, no reading time, and two critical rendering issues — **the `@tailwindcss/typography` plugin is installed in `node_modules` but never loaded via Tailwind v4's `@plugin` directive**, so prose classes in `BlogPost.astro` have no effect; and **Shiki is using its default single theme** (`github-dark` inline styles) with no CSS-variable dual-theme setup for dark mode toggling.

## Recommendation

Build in three phases: (1) schema + rendering pipeline (content.config.ts, astro.config.mjs Shiki config, global.css typography plugin + code theme CSS), (2) components (reading-time utility, BlogCard, BlogPost layout update), (3) pages + content (paginated listing, post route update, sample posts with full frontmatter). This order ensures each phase has testable output and downstream phases consume stable contracts.

For Shiki dual themes, use `themes: { light: 'github-light', dark: 'github-dark' }` with `defaultColor: false` — this outputs CSS variables (`--shiki-light`, `--shiki-dark`) on each span, then CSS in `global.css` selects the right variable based on `html.dark` class. This integrates cleanly with S01's class-based dark mode.

For pagination, replace `src/pages/blog/index.astro` with `src/pages/blog/[...page].astro` using Astro's `paginate()`. Rename `[...slug].astro` → `[slug].astro` to avoid two rest-parameter routes in the same directory.

## Implementation Landscape

### Key Files

**Modify:**
- `src/content.config.ts` — Add `tags` (string array), `featured` (boolean), `draft` (boolean), `canonicalURL` (optional string) to the Zod schema. All new fields optional with sensible defaults to avoid breaking existing posts.
- `astro.config.mjs` — Add `markdown.shikiConfig` with `themes: { light: 'github-light', dark: 'github-dark' }` and `defaultColor: false`.
- `src/styles/global.css` — Add `@plugin "@tailwindcss/typography"` directive (Tailwind v4 plugin loading). Add CSS for Shiki dual-theme toggling: `.astro-code` and `.astro-code span` use `--shiki-light` by default, `html.dark` variant switches to `--shiki-dark`. Add code block base styling (border-radius, padding, font-size).
- `src/layouts/BlogPost.astro` — Add reading time display, tags list, description. Accept new props from extended schema. Ensure prose container works with loaded typography plugin.
- `src/pages/blog/[...slug].astro` → **rename to** `src/pages/blog/[slug].astro` — Change from rest param to single param (avoids conflict with `[...page].astro`). Add draft filtering (`import.meta.env.PROD ? !data.draft : true`). Pass reading time to layout.
- `src/pages/rss.xml.js` — Add draft filtering so draft posts don't appear in RSS feed.

**Create:**
- `src/pages/blog/[...page].astro` — Paginated blog listing using `paginate()` in `getStaticPaths`. Page size 10 (per R005). Replaces current `index.astro`. Uses `[...page]` rest param so page 1 = `/blog/`, page 2 = `/blog/2/`, etc. Renders BlogCard grid with pagination nav.
- `src/components/BlogCard.astro` — Post card component: hero image, title, description excerpt, formatted date, tags as pills, reading time. Used by listing page (and later by S04 tag archives, S07 homepage).
- `src/utils/reading-time.ts` — Export `getReadingTime(content: string): number`. Strip Markdown syntax, count words, divide by 200, round up, return minutes. Also export `formatReadingTime(minutes: number): string` → "X min read".
- `src/content/blog/` — 3-4 sample posts with full extended frontmatter (tags, featured flag, code blocks in multiple languages for syntax highlighting testing). Replace existing lorem ipsum posts. At least one post needs substantial code blocks to verify Shiki theming. At least one should be `featured: true`. Include diverse tags for downstream S04 tag archive testing.

**Delete:**
- `src/pages/blog/index.astro` — Replaced by `[...page].astro`

### Build Order

1. **Schema + rendering pipeline first** — Extend `content.config.ts`, configure Shiki dual themes in `astro.config.mjs`, load typography plugin and add Shiki CSS in `global.css`. Verify: `npm run build` succeeds, build output for markdown-style-guide post shows `--shiki-light`/`--shiki-dark` CSS variables on code spans (not inline `background-color:#24292e`), and prose classes produce actual typographic styles.

2. **Components second** — Create `reading-time.ts` utility, `BlogCard.astro` component, update `BlogPost.astro` layout. These depend on schema fields existing. Verify: components render in isolation, reading time calculates correctly.

3. **Pages + content last** — Write sample posts with full frontmatter, create paginated `[...page].astro`, rename `[...slug].astro` → `[slug].astro`, update RSS draft filtering. Verify: paginated listing renders, individual posts render with all metadata, drafts hidden in production build.

### Verification Approach

- `npm run build` — zero errors, correct page count (should increase with new sample posts + pagination pages)
- Check build output HTML for a post with code blocks:
  - `grep 'shiki-dark' dist/blog/*/index.html` — confirms dual-theme CSS variables present
  - `grep 'prose' dist/blog/*/index.html` — confirms prose class is present
- Check paginated output: `ls dist/blog/` should show individual post dirs + numbered page dirs (if >10 posts) + `index.html` for page 1
- Check draft filtering: a post with `draft: true` should not appear in production `dist/` output or RSS
- Reading time visible on both listing cards and post pages
- Tags display as interactive-looking pills on post pages
- Dev server visual check: code blocks switch colors when toggling dark/light mode

## Constraints

- **Tailwind v4 plugin loading** — Must use `@plugin "@tailwindcss/typography"` in CSS, not `plugins: [...]` in a config file (Tailwind v4 CSS-first approach, no `tailwind.config.js` exists).
- **Shiki `defaultColor: false`** — Requires explicit CSS to select light/dark variables. Without it, code blocks have no colors at all. The CSS must target `.astro-code` (Astro's wrapper class for Shiki output) and `.astro-code span`.
- **Rest-param route conflict** — Cannot have both `[...page].astro` and `[...slug].astro` in `src/pages/blog/`. Rename slug route to `[slug].astro` (single param). Post IDs are single-segment strings, so this is safe.
- **Existing posts have minimal frontmatter** — New schema fields must be optional or have defaults. Existing 5 posts lack `tags`, `featured`, `draft`, `canonicalURL`. Either update them all or rely on `.optional()` / `.default()` in Zod.
- **Tailwind v4 class purging** — S01 discovered that dynamically-referenced classes get purged in production. Tag pill colors and any hover states must use static classes or `@apply` in a style block. The BlogCard and tag pill components should use hardcoded Tailwind classes, not dynamic class construction.

## Common Pitfalls

- **`@plugin` path resolution** — The `@plugin` directive resolves relative to the CSS file. Since `global.css` is in `src/styles/`, use `@plugin "@tailwindcss/typography"` (package name, not relative path) — Tailwind v4 resolves npm packages automatically.
- **Shiki CSS variable specificity** — The dark-mode CSS for `.astro-code span` needs to override inline styles that Shiki may still set. Use `!important` or ensure `defaultColor: false` fully suppresses inline colors (it should, but verify in build output).
- **Pagination page 1 URL** — With `[...page].astro`, page 1 has `params.page === undefined`, generating `/blog/index.html`. This is the expected behavior — the `...` rest syntax allows the param to be absent for the first page.
- **`image()` schema helper** — The existing `heroImage` uses `z.optional(image())` with the `{ image }` context from `schema: ({ image }) =>`. New fields don't need this context, but the function signature must keep destructuring `image`.

## Open Risks

- **Typography plugin v0.5 + Tailwind v4 compatibility** — `@tailwindcss/typography` v0.5.19 lists `>=4.0.0-beta.1` as peer dep, so it should work. But the prose modifier classes (`prose-secondary`, etc.) may not match our custom color scale. Verify that `prose-secondary` resolves, otherwise use the default `prose` with custom dark overrides. Might need `prose-slate` or just `prose` + `dark:prose-invert`.
- **Sample post content quality** — Posts need enough substance for reading time to be meaningful (>1 min) and enough code blocks to test Shiki. Thin placeholder content won't validate the features.

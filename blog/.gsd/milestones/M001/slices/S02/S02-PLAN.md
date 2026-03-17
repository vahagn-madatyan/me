# S02: Blog Engine

**Goal:** Complete blog engine with extended content schema, paginated listing, reading time, Shiki dual-theme syntax highlighting, and proper prose typography — all rendering in dev server with sample posts.
**Demo:** Navigate to `/blog/` and see a paginated card grid of posts with titles, descriptions, dates, tags, and reading time. Click into a post and see properly typeset prose with syntax-highlighted code blocks that switch themes with dark mode toggle.

## Must-Haves

- Extended blog schema: tags (string array), featured (boolean), draft (boolean), canonicalURL (optional string) — all optional with defaults
- Shiki dual themes (github-dark / github-light) using CSS variables that respect dark mode toggle
- `@tailwindcss/typography` loaded and prose classes producing real typographic styles
- Reading time utility (200 words/min, rounded up) displayed on blog cards and post headers
- BlogCard component with hero image, title, description, date, tags, reading time
- BlogPost layout updated with reading time, tags, description display
- Paginated blog listing at `/blog/` using Astro's `paginate()` with 10 posts/page
- Route renamed from `[...slug].astro` to `[slug].astro` to avoid rest-param conflict
- 3–4 sample posts with full extended frontmatter (diverse tags, featured flag, code blocks)
- Draft posts filtered from production build and RSS feed

## Proof Level

- This slice proves: integration (content schema → rendering pipeline → page output)
- Real runtime required: yes (dev server visual check for dark mode code theme switching)
- Human/UAT required: no (automated build checks + visual verification by agent)

## Verification

- `npm run build` — zero errors
- `bash scripts/verify-s02.sh` — build output verification script checking:
  - Shiki dual-theme CSS variables (`--shiki-dark`) present in post HTML
  - `prose` class present in post HTML
  - Paginated listing at `dist/blog/index.html`
  - Individual post pages exist at `dist/blog/[slug]/index.html`
  - Reading time text present in post HTML and listing HTML
  - Tags rendered in post HTML
  - Draft posts absent from production output
  - RSS feed does not contain draft post titles
  - Prior S01 checks still pass (`bash scripts/verify-s01.sh`)

## Integration Closure

- Upstream surfaces consumed: `BaseLayout.astro` (page wrapper), `Header.astro`/`Footer.astro` (chrome), `global.css` (Tailwind theme + design tokens), `FormattedDate.astro` (date formatting)
- New wiring introduced: Content collection schema extended → blog pages consume new fields; Shiki config in `astro.config.mjs`; typography plugin in `global.css`; `BlogCard.astro` component (boundary contract for S04, S07)
- What remains: S03 (SEO/OG), S04 (TOC/related/share/copy/tag archives), S05 (projects), S06 (about/arch), S07 (homepage assembly)

## Tasks

- [ ] **T01: Configure rendering pipeline — Shiki dual themes, typography plugin, extended schema** `est:30m`
  - Why: Foundation config changes that all components and pages depend on. Highest-risk items (Shiki CSS variables, typography plugin loading) must be proven first.
  - Files: `src/content.config.ts`, `astro.config.mjs`, `src/styles/global.css`
  - Do: (1) Extend blog schema in content.config.ts with tags, featured, draft, canonicalURL — all optional with defaults. (2) Add `markdown.shikiConfig` with `themes: { light: 'github-light', dark: 'github-dark' }` and `defaultColor: false` in astro.config.mjs. (3) Add `@plugin "@tailwindcss/typography"` directive in global.css. (4) Add CSS rules for Shiki dual-theme toggling: `.astro-code` background swap and `.astro-code span` color swap using `--shiki-light`/`--shiki-dark` CSS variables keyed on `html.dark`. (5) Add code block base styling (border-radius, padding, font-size, overflow).
  - Verify: `npm run build` succeeds. `grep 'shiki-dark' dist/blog/markdown-style-guide/index.html` finds CSS variable references. `grep 'prose' dist/blog/first-post/index.html` confirms prose class present.
  - Done when: Build succeeds, existing posts render with dual-theme CSS variables on code spans, and prose classes produce actual typography styles.

- [ ] **T02: Build blog components — BlogCard, reading time utility, and BlogPost layout update** `est:40m`
  - Why: Reusable components needed by paginated listing (T03), and downstream by S04 tag archives and S07 homepage. Reading time utility is a shared function.
  - Files: `src/utils/reading-time.ts`, `src/components/BlogCard.astro`, `src/layouts/BlogPost.astro`
  - Do: (1) Create `src/utils/reading-time.ts` exporting `getReadingTime(content: string): number` (strip markdown, count words, divide by 200, round up) and `formatReadingTime(minutes: number): string` → "X min read". (2) Create `src/components/BlogCard.astro` — card with hero image, title, description excerpt, formatted date, tag pills, reading time. Props from blog collection entry data + reading time + slug. Use static Tailwind classes (no dynamic class construction — they get purged in prod). (3) Update `src/layouts/BlogPost.astro` to accept and display reading time, tags array, and description. Add tag pills below title, reading time next to date. Keep existing prose container. Ensure type Props matches extended schema.
  - Verify: `npm run build` succeeds. BlogPost layout renders all metadata fields. BlogCard component exists and renders.
  - Done when: Both components accept extended schema fields, reading time function calculates correctly, `npm run build` zero errors.

- [ ] **T03: Create paginated listing, sample posts, route fix, and verification script** `est:45m`
  - Why: Assembles everything into working pages with real content. Creates the paginated listing, writes sample posts exercising all frontmatter fields, renames slug route to avoid conflict, filters drafts from RSS, and writes the verification script.
  - Files: `src/pages/blog/[...page].astro`, `src/pages/blog/[slug].astro`, `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`, `src/pages/rss.xml.js`, `src/content/blog/` (3–4 new posts), `scripts/verify-s02.sh`
  - Do: (1) Write 3–4 sample blog posts with full extended frontmatter — at least one with `featured: true`, at least one with `draft: true`, diverse tags, one with substantial multi-language code blocks for Shiki testing. Posts need enough content for meaningful reading time (>200 words each). (2) Delete `src/pages/blog/index.astro`. Create `src/pages/blog/[...page].astro` with `getStaticPaths` using `paginate()` at pageSize 10, rendering BlogCard grid with pagination nav. Filter drafts in production. (3) Rename `src/pages/blog/[...slug].astro` → `src/pages/blog/[slug].astro`. Add draft filtering (`import.meta.env.PROD ? !data.draft : true`). Pass reading time to BlogPost layout. (4) Update `src/pages/rss.xml.js` to filter draft posts. (5) Replace old placeholder blog posts with updated frontmatter or remove if superseded. (6) Write `scripts/verify-s02.sh` checking all build output assertions from slice verification.
  - Verify: `npm run build` succeeds. `bash scripts/verify-s02.sh` passes all checks. Paginated listing at `/blog/` renders cards. Individual posts render with full metadata. Draft post absent from production build.
  - Done when: All sample posts render, pagination works, drafts filtered, verification script passes, `bash scripts/verify-s01.sh` still passes.

## Files Likely Touched

- `src/content.config.ts`
- `astro.config.mjs`
- `src/styles/global.css`
- `src/utils/reading-time.ts`
- `src/components/BlogCard.astro`
- `src/layouts/BlogPost.astro`
- `src/pages/blog/[...page].astro`
- `src/pages/blog/[slug].astro`
- `src/pages/blog/index.astro` (deleted)
- `src/pages/blog/[...slug].astro` (renamed)
- `src/pages/rss.xml.js`
- `src/content/blog/*.md` (3–4 new sample posts)
- `scripts/verify-s02.sh`

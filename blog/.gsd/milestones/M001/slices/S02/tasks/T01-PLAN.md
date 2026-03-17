---
estimated_steps: 5
estimated_files: 3
---

# T01: Configure rendering pipeline — Shiki dual themes, typography plugin, extended schema

**Slice:** S02 — Blog Engine
**Milestone:** M001

## Description

Set up the three foundational config changes that all blog components and pages depend on: (1) extend the blog content collection schema with new frontmatter fields, (2) configure Shiki syntax highlighting with dual themes for dark mode, and (3) load the Tailwind typography plugin and add CSS for code block theming.

This is the highest-risk task in the slice — the Shiki `defaultColor: false` CSS variable approach and the `@plugin` directive for typography are both untested in this codebase. Getting them right here means T02 and T03 build on a proven foundation.

**Relevant skills:** None needed — this is Astro/Tailwind config work with well-documented APIs.

## Steps

1. **Extend blog schema in `src/content.config.ts`:**
   - Add `tags: z.array(z.string()).default([])` — default empty array so existing posts don't break
   - Add `featured: z.boolean().default(false)`
   - Add `draft: z.boolean().default(false)`
   - Add `canonicalURL: z.string().url().optional()` — fully optional, no default needed
   - Keep existing `schema: ({ image }) =>` signature (needed for `heroImage`)
   - All new fields must be optional or have defaults — 5 existing posts have none of these fields

2. **Configure Shiki dual themes in `astro.config.mjs`:**
   - Add `markdown` config block with `shikiConfig`:
     ```js
     markdown: {
       shikiConfig: {
         themes: {
           light: 'github-light',
           dark: 'github-dark',
         },
         defaultColor: false,
       },
     },
     ```
   - `defaultColor: false` is critical — it suppresses inline color styles and outputs CSS variables (`--shiki-light`, `--shiki-dark`) on each `<span>` instead

3. **Load typography plugin in `src/styles/global.css`:**
   - Add `@plugin "@tailwindcss/typography";` after the `@custom-variant dark` line
   - This is the Tailwind v4 CSS-first way to load plugins — no tailwind.config.js exists
   - The `@plugin` directive resolves npm package names automatically

4. **Add Shiki dual-theme CSS in `src/styles/global.css`:**
   - In the `@layer base` block, add rules for `.astro-code` (Astro's wrapper class for Shiki output):
     - Light mode (default): `background-color` from `--shiki-light-bg`, `color` from `--shiki-light`
     - Dark mode (`html.dark`): `background-color` from `--shiki-dark-bg`, `color` from `--shiki-dark`
   - For `.astro-code span`: light uses `color: var(--shiki-light)`, dark uses `color: var(--shiki-dark)`
   - Code block base styling: `border-radius: 0.5rem`, `padding: 1rem`, `font-size: 0.875rem`, `overflow-x: auto`, `font-family: var(--font-code)`

5. **Verify the pipeline:**
   - Run `npm run build`
   - Check that `dist/blog/markdown-style-guide/index.html` contains `--shiki-dark` (proves CSS variable output)
   - Check that a blog post HTML contains the `prose` class (proves typography plugin loaded)
   - Verify existing posts still build without errors (schema defaults work)

## Must-Haves

- [ ] Blog schema has `tags`, `featured`, `draft`, `canonicalURL` fields with safe defaults
- [ ] Shiki configured with `themes: { light, dark }` and `defaultColor: false`
- [ ] `@plugin "@tailwindcss/typography"` directive present in global.css
- [ ] Shiki CSS rules swap `--shiki-light` / `--shiki-dark` variables based on `html.dark` class
- [ ] `npm run build` succeeds with zero errors

## Verification

- `npm run build` — zero errors, all existing pages still build
- `grep -l 'shiki-dark' dist/blog/markdown-style-guide/index.html` — returns the file (CSS variables present)
- `grep -l 'prose' dist/blog/first-post/index.html` — returns the file (typography classes work)
- All 5 existing blog posts still render (schema defaults don't break them)

## Inputs

- `src/content.config.ts` — current schema with title, description, pubDate, updatedDate, heroImage
- `astro.config.mjs` — current config with mdx, sitemap, tailwindcss vite plugin, no markdown config
- `src/styles/global.css` — current Tailwind v4 config with @theme block, @custom-variant dark, base styles
- `src/layouts/BlogPost.astro` — already has `prose prose-secondary dark:prose-invert` classes on the content div
- S01 summary — typography plugin is installed in node_modules but never loaded via `@plugin`

## Expected Output

- `src/content.config.ts` — extended schema with 4 new optional fields
- `astro.config.mjs` — markdown.shikiConfig with dual themes configured
- `src/styles/global.css` — `@plugin` directive + Shiki dual-theme CSS rules + code block styling

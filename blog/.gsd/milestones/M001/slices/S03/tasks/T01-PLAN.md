---
estimated_steps: 5
estimated_files: 3
---

# T01: Build OG image pipeline with Satori + Sharp

**Slice:** S03 — SEO & OG Images
**Milestone:** M001

## Description

Install Satori and build the complete OG image generation pipeline. This is the milestone's key risk item (D005) — proving that Satori renders SVG from post metadata and Sharp converts it to PNG at build time through Astro's static endpoint pattern.

Create two files: a template helper (`og-template.ts`) that builds Satori element trees from post metadata using the object API (no JSX — Astro static endpoints are `.ts` files), and a static endpoint (`[slug].png.ts`) that enumerates non-draft blog posts via `getStaticPaths()` and generates 1200×630 PNG images.

**Relevant skills:** None needed — Satori uses a well-documented object API.

## Steps

1. **Install Satori:** Run `npm install satori`. Sharp is already installed (v0.34.5). Verify both appear in `package.json`.

2. **Create `src/utils/og-template.ts`** — a function `generateOgImage(options)` that takes `{ title, description, tags, pubDate, site }` and returns a Satori element tree using the object API (`{ type: 'div', props: { style: {...}, children: [...] } }`).
   - **Design:** Dark background (`#0f172a` — slate-900), teal/cyan primary accent for site URL/tags, white text for title/description. This matches the project's design identity (D003: dark-first, teal/cyan primary).
   - **Layout:** `display: 'flex'`, `flexDirection: 'column'` — Satori requires explicit `display: 'flex'` on all containers. Title large and bold (48px), description smaller (24px), tags as pills, site URL at bottom.
   - **Canvas:** 1200×630 pixels (standard OG image dimensions per R015).
   - All text must be wrapped in explicit elements — no raw string children of flex containers.

3. **Create `src/pages/og/[slug].png.ts`** — Astro static endpoint:
   - `getStaticPaths()`: fetch blog collection, filter out drafts (`!post.data.draft`), map to `{ params: { slug: post.id }, props: { post } }`.
   - `GET({ props })`: Load Atkinson fonts from `public/fonts/` using `fs.readFileSync()` with `new URL('../../..', import.meta.url)` path resolution (not relative paths — they resolve from CWD). Call `generateOgImage()` with post data. Call `satori()` with the element tree, font config `[{ name: 'Atkinson', data: regularFontData, weight: 400 }, { name: 'Atkinson', data: boldFontData, weight: 700 }]`, and `{ width: 1200, height: 630 }`. Convert SVG to PNG using `sharp(Buffer.from(svg)).png().toBuffer()`. Return `new Response(png, { headers: { 'Content-Type': 'image/png' } })`.
   - Wrap Sharp conversion in try/catch — if it fails, log the error and return a 500 response.

4. **Run `npm run build`** and verify:
   - Build succeeds with zero errors
   - `ls dist/og/` shows 7 PNG files (one per non-draft post)
   - Spot-check one image: `node -e "require('sharp')('dist/og/building-a-developer-blog.png').metadata().then(m => console.log(m.width, m.height))"` outputs `1200 630`

5. **Troubleshoot if needed:** If Satori's ESM exports cause issues with Astro's Vite build, add `satori` to `vite.config.ssr.external` in `astro.config.mjs`. If font loading fails, verify the path resolution by logging `fileURLToPath(new URL(...))` and checking the file exists.

## Must-Haves

- [ ] `satori` installed as a dependency
- [ ] `src/utils/og-template.ts` exports a function that returns a valid Satori element tree
- [ ] `src/pages/og/[slug].png.ts` generates PNG for every non-draft blog post
- [ ] Generated PNGs are 1200×630 pixels
- [ ] OG images use project's dark theme with teal/cyan accent (D003)
- [ ] Font loading uses Atkinson WOFF files from `public/fonts/` (not WOFF2 — Satori doesn't support it)
- [ ] `npm run build` completes with zero errors

## Verification

- `npm run build` — zero errors
- `ls dist/og/*.png | wc -l` — outputs `7` (matches non-draft post count)
- `node -e "require('sharp')('dist/og/building-a-developer-blog.png').metadata().then(m => console.log(m.width, m.height))"` — outputs `1200 630`
- `file dist/og/building-a-developer-blog.png` — confirms PNG format

## Inputs

- `src/content.config.ts` — blog collection schema (tags, featured, draft, canonicalURL fields from S02)
- `public/fonts/atkinson-regular.woff` — WOFF1 font file (22KB, confirmed `wOFF` magic bytes)
- `public/fonts/atkinson-bold.woff` — WOFF1 bold font file (24KB, confirmed `wOFF` magic bytes)
- Blog posts in `src/content/blog/` — 8 posts total, 1 draft (`draft-upcoming-post.md`), 7 non-draft
- D003 design identity: dark-first, teal/cyan primary (`#0d9488` area), slate secondary, orange accent
- D005 decision: Satori + Sharp at build time via static endpoint

## Expected Output

- `package.json` — `satori` added to dependencies
- `src/utils/og-template.ts` — new file: exports `generateOgImage()` function
- `src/pages/og/[slug].png.ts` — new file: static endpoint generating OG PNGs
- `dist/og/` — 7 PNG files after build (one per non-draft post, 1200×630 each)

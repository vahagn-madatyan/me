---
id: T01
parent: S03
milestone: M001
provides:
  - OG image generation pipeline (Satori → Sharp → PNG) for all non-draft blog posts
  - Reusable og-template.ts helper for building Satori element trees from post metadata
key_files:
  - src/utils/og-template.ts
  - src/pages/og/[slug].png.ts
  - package.json
key_decisions:
  - Satori object API (not JSX) for .ts endpoint compatibility — validated
  - Font loading via fs.readFileSync with import.meta.url path resolution
  - Tag pills capped at 4 to avoid overflow in 1200×630 canvas
  - Title truncated at 60 chars, description at 120 chars with ellipsis
patterns_established:
  - "Satori element trees use explicit { type, props: { style, children } } — every container needs display: 'flex'"
  - "Font paths resolved via fileURLToPath(new URL('../../../', import.meta.url)) + '/public/fonts/...' — relative paths resolve from CWD and break at build time"
  - "Sharp conversion wrapped in try/catch at the endpoint level — errors logged with slug context and return 500"
observability_surfaces:
  - "ls dist/og/*.png | wc -l — count matches non-draft posts (currently 7)"
  - "node -e \"require('sharp')('dist/og/<slug>.png').metadata().then(m => console.log(m.width, m.height))\" — outputs 1200 630"
  - "file dist/og/<slug>.png — confirms PNG format"
  - "Build failures surface Satori/Sharp stack traces in npm run build stderr"
duration: 8m
verification_result: passed
completed_at: 2026-03-16
blocker_discovered: false
---

# T01: Build OG image pipeline with Satori + Sharp

**Installed Satori and built a complete build-time OG image pipeline that generates 1200×630 PNG images for all 7 non-draft blog posts using the project's dark/teal design identity.**

## What Happened

1. Installed `satori@^0.25.0` — Sharp was already present (`^0.34.3`).
2. Created `src/utils/og-template.ts` — exports `generateOgImage()` that builds a Satori element tree from post metadata (title, description, tags, pubDate, site). Design: dark slate background (#0f172a), teal/cyan accent (#0d9488, #5eead4), white text, gradient accent bar, tag pills, date/site footer. All containers use explicit `display: 'flex'` as required by Satori.
3. Created `src/pages/og/[slug].png.ts` — Astro static endpoint with `getStaticPaths()` filtering out draft posts, and `GET()` rendering Satori SVG → Sharp PNG. Fonts loaded via `fs.readFileSync` with `import.meta.url` resolution. Sharp conversion wrapped in try/catch with error logging.
4. Build succeeds with zero errors. All 7 non-draft posts get 1200×630 PNG OG images in `dist/og/`.

## Verification

- `npm run build` — zero errors, all 7 OG PNGs generated in build output
- `ls dist/og/*.png | wc -l` — outputs `7` ✅
- `file dist/og/building-a-developer-blog.png` — `PNG image data, 1200 x 630, 8-bit/color RGBA` ✅
- `node -e "require('sharp')('dist/og/building-a-developer-blog.png').metadata().then(m => console.log(m.width, m.height))"` — outputs `1200 630` ✅
- Spot-checked `mastering-typescript-patterns.png` — also `1200 630 png` ✅
- S01 regression: 19/19 passed ✅
- S02 regression: 22/22 passed ✅
- S03 slice checks (T01 scope): PNG count and dimensions pass. JSON-LD, og:image wiring, RSS categories, robots.txt correctly not yet present (T02/T03 scope).

## Diagnostics

- **Inspect generated images:** `ls dist/og/` lists all OG PNGs; `file dist/og/<slug>.png` confirms format
- **Verify dimensions:** `node -e "require('sharp')('dist/og/<slug>.png').metadata().then(m => console.log(m.width, m.height))"`
- **Build failure shapes:** Missing font → Satori error "Failed to load font"; invalid element tree → Satori node-specific error; Sharp failure → logged to stderr with slug context, returns 500
- **Post count mismatch:** If PNG count doesn't match expected, check `src/content/blog/` for new draft/non-draft changes

## Deviations

- **Installed `@tailwindcss/typography`:** Build failed on a pre-existing gap — `src/styles/global.css` references `@plugin "@tailwindcss/typography"` but the package wasn't installed. Added it to unblock the build. This is a pre-existing issue from S02, not a T01 deviation.

## Known Issues

None.

## Files Created/Modified

- `package.json` — added `satori@^0.25.0` and `@tailwindcss/typography` dependencies
- `src/utils/og-template.ts` — new: exports `generateOgImage()` Satori element tree builder
- `src/pages/og/[slug].png.ts` — new: static endpoint generating 1200×630 PNG OG images for non-draft posts
- `.gsd/milestones/M001/slices/S03/tasks/T01-PLAN.md` — added Observability Impact section (pre-flight fix)

# S03: SEO & OG Images — Research

**Date:** 2026-03-16
**Depth:** Targeted — known technology (Astro endpoints, meta tags) plus one riskier integration (Satori + Sharp OG pipeline)

## Summary

S03 delivers five outputs: auto-generated OG images from blog metadata, an SEO component with JSON-LD/Twitter Cards/canonical URLs, an enhanced RSS feed, a robots.txt, and sitemap configuration. The riskiest piece is the Satori + Sharp OG image pipeline — Satori is **not installed** and has a critical font format limitation (no WOFF2). The remaining work is straightforward meta tag wiring and static file creation.

The existing `BaseHead.astro` already has basic OG and Twitter Card meta tags, so the SEO work is an enhancement (add JSON-LD, wire dynamic OG image URL, support `canonicalURL` from frontmatter) rather than a greenfield build. RSS already exists with draft filtering; it just needs category tags. robots.txt is a static file. Sitemap is already integrated.

**Primary risk:** Satori font loading. The project's design fonts (Inter, JetBrains Mono) are installed via `@fontsource-variable` which ships only WOFF2 files — a format Satori does **not** support. However, the project has `public/fonts/atkinson-regular.woff` and `atkinson-bold.woff` in WOFF1 format, which Satori reads fine. OG images should use these Atkinson fonts — they're clean, readable, and already in the repo. The OG image is a branded graphic, not a pixel-perfect match of site typography.

## Recommendation

**Prove OG image generation first** (T01) — install Satori, build the static endpoint, confirm one OG image renders correctly with Atkinson WOFF fonts and converts to PNG via Sharp. This retires the milestone's key risk (D005). Then wire the SEO component (T02) and finish with RSS/robots/sitemap (T03).

Use the Satori **object API** (not JSX) since Astro static endpoints are `.ts` files. Create a helper function that builds the Satori element tree from post metadata. Use `fs.readFileSync` to load font files at build time — the endpoint runs during `astro build`, not at runtime.

Enhance `BaseHead.astro` directly rather than creating a separate `SEO.astro` component — BaseHead already owns all meta tags, and splitting would mean two components managing `<head>` content. Add JSON-LD as an inline `<script type="application/ld+json">` block.

## Implementation Landscape

### Key Files

- `src/pages/og/[slug].png.ts` — **new**: Static endpoint generating OG images. Uses `getStaticPaths()` to enumerate non-draft blog posts, `GET()` renders Satori → Sharp → PNG Response. Each post gets `/og/{slug}.png`.
- `src/utils/og-template.ts` — **new**: Helper that takes `{ title, description, tags, pubDate, site }` and returns a Satori element tree (object API). Keeps the template logic out of the endpoint file.
- `src/components/BaseHead.astro` — **modify**: Add JSON-LD `<script>` block for blog posts (BlogPosting schema), wire `og:image` to `/og/{slug}.png`, support `canonicalURL` from frontmatter overriding auto-generated canonical, add `article:` OG tags for blog posts.
- `src/pages/rss.xml.js` — **modify**: Add `categories` for tags from blog schema.
- `public/robots.txt` — **new**: Static file pointing to sitemap.
- `astro.config.mjs` — **modify**: Add `serialize` to sitemap integration for blog change frequency.
- `public/fonts/atkinson-regular.woff` — **existing**: WOFF1 font for Satori (verified: magic bytes = `wOFF`).
- `public/fonts/atkinson-bold.woff` — **existing**: WOFF1 bold font for Satori.

### Build Order

1. **T01 — OG Image Pipeline (risk retirement):** Install `satori` as dependency. Create `src/utils/og-template.ts` with the Satori element builder. Create `src/pages/og/[slug].png.ts` endpoint. Run `npm run build` and verify a `.png` file exists in `dist/og/` for each non-draft post. This proves the Satori → Sharp pipeline works with Astro 6 static endpoints and WOFF1 fonts.

2. **T02 — SEO Meta Enhancement:** Modify `BaseHead.astro` to accept additional props (type, slug, tags, pubDate). Add JSON-LD BlogPosting schema for blog posts. Wire `og:image` meta tag to point to `/og/{slug}.png` for blog posts. Support `canonicalURL` from frontmatter. Add `article:published_time`, `article:tag` OG tags.

3. **T03 — RSS, Robots, Sitemap:** Update `rss.xml.js` to include `categories` from tags. Create `public/robots.txt`. Configure sitemap `serialize` in `astro.config.mjs` for blog-specific change frequency. Write verification script.

### Verification Approach

- `npm run build` — zero errors (baseline)
- `file dist/og/building-a-developer-blog.png` — confirms PNG file exists and is valid image
- `identify dist/og/building-a-developer-blog.png` or `node -e "sharp('dist/og/...').metadata()"` — confirms 1200×630 dimensions
- `grep 'application/ld+json' dist/blog/building-a-developer-blog/index.html` — confirms JSON-LD present
- `grep 'og:image' dist/blog/building-a-developer-blog/index.html` — confirms OG image meta tag points to `/og/` endpoint
- `grep 'twitter:card' dist/blog/building-a-developer-blog/index.html` — confirms Twitter Card tags (already exists, verify not broken)
- `grep 'canonical' dist/blog/building-a-developer-blog/index.html` — confirms canonical URL present
- `grep '<category>' dist/rss.xml` — confirms tags appear as RSS categories
- `test -f dist/robots.txt` — confirms robots.txt deployed
- `grep 'Sitemap' dist/robots.txt` — confirms sitemap reference
- Count of `.png` files in `dist/og/` matches non-draft post count
- S02 verification script still passes (`bash scripts/verify-s02.sh`)

## Constraints

- **Satori font format:** TTF, OTF, WOFF only — no WOFF2. The `@fontsource-variable` packages ship only WOFF2. Must use the existing Atkinson WOFF1 files in `public/fonts/`.
- **Satori uses object API in .ts files:** Astro static endpoints are `.ts` — no JSX transform. Element trees use `{ type: 'div', props: { style: {...}, children: [...] } }` structure.
- **Font data as Buffer/ArrayBuffer:** Satori requires font data loaded into memory, not file paths. Use `fs.readFileSync()` — this runs at build time only.
- **Static output mode:** The site is SSG. OG image endpoints run during `astro build` and produce static `.png` files. No server-side rendering at request time.
- **BaseHead.astro interface:** Currently accepts `{ title, description, image? }`. Adding SEO fields requires expanding this interface. `BaseLayout.astro` passes these props through, so its interface changes too — or use optional props with defaults to avoid breaking non-blog pages.

## Common Pitfalls

- **Satori layout quirks** — Satori's CSS subset requires explicit `display: 'flex'` on all containers (it defaults to `display: 'block'` but flex is needed for most layouts). All text must be wrapped in explicit elements — raw string children of flex containers can cause layout issues.
- **Sharp SVG input** — Sharp's `sharp(Buffer.from(svg))` auto-detects SVG input. But the SVG must be well-formed. If Satori produces malformed SVG (rare but possible with edge-case text), Sharp will throw. Wrap in try/catch with a fallback.
- **Font path resolution at build time** — `fs.readFileSync` with relative paths resolves from the process CWD, not the file location. Use `new URL('../../../public/fonts/atkinson-regular.woff', import.meta.url)` or `fileURLToPath` for reliable resolution in Astro's build pipeline.
- **BaseHead interface widening** — Adding required props to BaseHead breaks every page that uses BaseLayout. All new SEO props must be optional with sensible defaults so non-blog pages (home, about, projects) continue working unchanged.
- **OG image URL must be absolute** — The `og:image` meta tag requires a fully qualified URL (`https://vahagn.dev/og/slug.png`), not a relative path. Use `new URL(path, Astro.site)`.
- **JSON-LD must be valid JSON** — Template literal interpolation of strings with quotes or special characters can break the JSON. Use `JSON.stringify()` to build the object, not string concatenation.

## Open Risks

- **Satori + Astro 6 build compatibility:** Satori has not been explicitly tested with Astro 6's build pipeline. The static endpoint pattern is standard Astro, and Satori is a pure JS library, so the risk is low — but if Satori's ESM exports cause issues with Astro's Vite build, it may need special handling in `vite.config` (ssr.external).
- **OG image build time at scale:** Each OG image requires Satori rendering + Sharp conversion. With 7 posts this is negligible, but at 100+ posts build time could grow. Acceptable for now per D005 (revisable if build time becomes prohibitive).

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| SVG-to-PNG conversion | `sharp` (already installed) | Sharp is fast, handles SVG input natively, already a dependency |
| JSX-to-SVG rendering | `satori` (needs install) | Purpose-built for OG images, supports CSS flexbox subset, handles font embedding |
| RSS feed generation | `@astrojs/rss` (already installed) | Already used in `rss.xml.js`, supports categories/custom fields |
| Sitemap generation | `@astrojs/sitemap` (already installed) | Already integrated, supports `serialize` for customization |
| JSON-LD structure | Hand-build the object | Simple enough — BlogPosting schema is ~15 fields. No library needed. |

## Sources

- Satori supports TTF, OTF, WOFF — **not WOFF2** (source: [Satori README - Fonts section](https://github.com/vercel/satori))
- Satori object API uses `{ type, props: { style, children } }` structure (source: [Satori docs](https://github.com/vercel/satori))
- Astro static endpoints use `getStaticPaths()` + `GET()` returning `Response` (source: [Astro docs](https://docs.astro.build))
- Sitemap `serialize` function allows per-URL customization (source: [Astro sitemap docs](https://docs.astro.build))

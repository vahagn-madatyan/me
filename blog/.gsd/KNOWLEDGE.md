# Knowledge Base

Recurring gotchas, non-obvious rules, and useful patterns discovered during execution.

---

## K001: Shiki `defaultColor: false` outputs CSS variables, not inline styles
- **Context:** Astro + Shiki dual-theme setup
- **Detail:** Setting `defaultColor: false` in `shikiConfig` suppresses inline `color` and `background-color` on code spans. Instead, each span gets `style="--shiki-light:#xxx;--shiki-dark:#xxx;--shiki-light-bg:#xxx;--shiki-dark-bg:#xxx"`. You must add your own CSS rules to read these variables.
- **Gotcha:** Without the CSS rules in `global.css`, code blocks appear unstyled (no colors at all).

## K002: Tailwind v4 plugin loading uses `@plugin` in CSS, not config file
- **Context:** This project has no `tailwind.config.js` — it uses Tailwind v4 CSS-first configuration.
- **Detail:** Plugins are loaded with `@plugin "@tailwindcss/typography";` in the CSS file, not via a JS config.
- **Gotcha:** The `@plugin` directive must come after `@import "tailwindcss"` and `@custom-variant` but before `@theme`.

## K003: Blog schema backward compatibility requires `.default()` or `.optional()` on all new fields
- **Context:** 5 existing blog posts have none of the extended frontmatter fields.
- **Detail:** Astro's content layer validates every post against the schema at build time. Any required field without a default causes a build error for posts missing that field.

## K004: Satori element trees require explicit `display: 'flex'` on every container
- **Context:** Satori OG image generation with object API.
- **Detail:** Satori does not infer layout — every element that has children must have `display: 'flex'` in its style. Without it, children silently stack incorrectly or disappear. Raw strings cannot be direct children of flex containers; wrap them in explicit elements.
- **Gotcha:** No error is thrown — the image just renders wrong. Visual inspection of generated PNGs is the only way to catch layout issues.

## K005: Font loading in Astro static endpoints requires import.meta.url resolution
- **Context:** `src/pages/og/[slug].png.ts` loading WOFF fonts from `public/fonts/`.
- **Detail:** `fs.readFileSync` with relative paths resolves from CWD, which differs between dev and build. Use `fileURLToPath(new URL('../../../', import.meta.url))` to get the project root reliably.
- **Gotcha:** Satori only supports WOFF1 fonts, not WOFF2. The `public/fonts/` directory has both `.woff` files — use those, not any `.woff2` variants.

## K006: @tailwindcss/typography plugin was referenced but not installed
- **Context:** S02 added `@plugin "@tailwindcss/typography"` to `src/styles/global.css` but didn't install the npm package.
- **Detail:** Build fails with `Can't resolve '@tailwindcss/typography'`. Fix: `npm install @tailwindcss/typography`.
- **Gotcha:** This is a gap from S02 that surfaces as a build error in any subsequent task.

## K007: Nested template literals break esbuild in Astro frontmatter
- **Context:** Astro components using backtick-inside-backtick template literals in the frontmatter `---` block.
- **Detail:** esbuild (used by Vite/Astro) fails to parse nested template literals like `` `outer ${encodeURIComponent(`inner ${var}`)}` ``. The error is a cryptic `Syntax error "\"` pointing at the line.
- **Fix:** Use string concatenation instead: `"prefix" + var + "suffix"` for the inner expression, then wrap in the outer template literal or also concatenate.

## K009: Cloudflare Pages `_headers` file — order matters and `no-transform` blocks beacon injection
- **Context:** `public/_headers` deployed as a static file with Cloudflare Pages.
- **Detail:** CF Pages processes `_headers` rules top-to-bottom, with more-specific paths first. The `/_astro/*` rule must come before `/*` so hashed assets get immutable caching while HTML gets must-revalidate. The `no-transform` directive in `Cache-Control` blocks Cloudflare's auto-injection of the Web Analytics beacon script into HTML responses — never use it on HTML paths if you want CF Web Analytics.
- **Gotcha:** The `_headers` file is silently ignored if it has syntax errors (wrong indentation, missing colon). Always verify with `curl -I` after deployment.

## K008: Reading-time function strips code blocks — prose word count is what matters for thresholds
- **Context:** TOC visibility threshold uses `readingTime >= 5` (5 min at 200 WPM = 1000 prose words).
- **Detail:** The `getReadingTime()` utility strips code fences, inline code, images, and Markdown syntax before counting words. A post with 1300 total words but heavy code examples may only have 400 prose words → 2 min read. When targeting a specific reading-time threshold, count prose words after stripping, not raw word count.
- **Gotcha:** `wc -w` on the markdown file reports total words including code blocks. The actual reading time will be much lower for code-heavy posts.

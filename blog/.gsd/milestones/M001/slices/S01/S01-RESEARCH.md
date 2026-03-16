# S01: Foundation & Design System — Research

**Date:** 2026-03-15

## Summary

The existing codebase is a stock Astro 6 blog starter with vanilla CSS (Bear Blog-derived), Atkinson font, no Tailwind, no dark mode, and placeholder social links pointing to Astro's own accounts. Every component (Header, Footer, BaseHead, BlogPost layout) will need significant rework or replacement.

The Tailwind v4 integration path is clean: `@tailwindcss/vite` as a Vite plugin in `astro.config.mjs`, with all theme configuration done CSS-first via `@theme` and `@custom-variant` blocks in `global.css`. No `tailwind.config.js` needed. Dark mode uses class-based toggling with `@custom-variant dark (&:where(.dark, .dark *))`, driven by an inline `<script>` in `<head>` that reads localStorage before first paint to prevent FOUC.

The ThemeToggle can be a pure Astro component using a `<script>` tag — no framework island needed. Fonts switch from self-hosted Atkinson (woff in `/public/fonts/`) to Fontsource-managed Inter + JetBrains Mono variable fonts via npm, imported through the CSS and resolved by Vite at build time.

## Recommendation

Install `tailwindcss` and `@tailwindcss/vite` as dependencies. Replace `global.css` entirely with Tailwind v4 imports, `@custom-variant dark`, and `@theme` block defining the design tokens from D003 (teal/cyan primary, slate secondary, orange accent). Use `@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono` for fonts.

Build a new `BaseLayout.astro` as the single HTML shell wrapping all pages. Move the dark-mode init script inline in `<head>` using `is:inline` to ensure synchronous execution. Refactor `BlogPost.astro` to delegate to `BaseLayout` (it currently owns the full `<html>` shell). Replace Header and Footer with new Tailwind-styled components using real nav links and personal social links.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| CSS utility framework | Tailwind CSS v4 + `@tailwindcss/vite` | D001 decision, CSS-first config, native Astro Vite support |
| Self-hosted web fonts | `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono` | Vite-compatible, no external requests, variable font support, version-locked |
| Dark mode class toggling | Tailwind's `@custom-variant dark` | D002 decision, built-in `dark:` prefix works without extra logic |
| Responsive breakpoints | Tailwind's built-in `sm:`, `md:`, `lg:` | Standard, well-tested, mobile-first by default |

## Existing Code and Patterns

- `astro.config.mjs` — Standard config with MDX + sitemap. Needs: `site` URL changed from `example.com` to `https://vahagn.dev`, add `@tailwindcss/vite` to `vite.plugins`, add Shiki dual theme config (for S02, but config lives here)
- `src/styles/global.css` — Bear Blog CSS with custom properties, Atkinson `@font-face`. Will be **fully replaced** with Tailwind v4 imports and theme configuration
- `src/components/BaseHead.astro` — Imports global.css, handles meta/OG tags, preloads Atkinson fonts. Needs: font preloads updated, image prop type may need adjustment (currently `ImageMetadata`). Foundation is sound — S03 will enhance with JSON-LD
- `src/components/Header.astro` — Vanilla CSS, links to Astro's Mastodon/Twitter/GitHub. Needs: full redesign with Tailwind, personal nav links (Blog, Work, About, Architecture), personal social links, dark mode toggle
- `src/components/Footer.astro` — Same placeholder links. Needs: full redesign with Tailwind, personal social links, copyright with real name, RSS link
- `src/components/HeaderLink.astro` — Active link detection via URL matching. Pattern is solid — can be adapted to use Tailwind classes instead of scoped CSS
- `src/layouts/BlogPost.astro` — **Owns the full `<html>` document** including Header/Footer. Must be refactored to use `BaseLayout.astro` instead. Current layout is the only layout in the project.
- `src/consts.ts` — `SITE_TITLE` is "Astro Blog", `SITE_DESCRIPTION` is placeholder. Update to personal values
- `src/content.config.ts` — Blog collection with glob loader, basic Zod schema. S02 extends this; S01 leaves it as-is
- `public/fonts/` — Atkinson woff files. Will be unused after switching to Fontsource imports. Can be removed or left for cleanup

## Constraints

- **Astro 6.0.4** — `@tailwindcss/vite` plugin must be registered in `vite.plugins` array in `astro.config.mjs`, not as an Astro integration
- **Tailwind v4 is CSS-first** — No `tailwind.config.js`. All theme tokens, custom variants, and fonts are configured in the CSS file itself via `@theme`, `@custom-variant`, and `@font-face`
- **Dark mode init must be `is:inline`** — Regular Astro `<script>` tags are processed, deferred, and deduped. The FOUC-prevention script needs `is:inline` to execute synchronously in `<head>` before any paint
- **Zero JS by default** — Astro ships no client JS unless explicitly opted in. ThemeToggle's `<script>` tag is fine for this — it runs client-side but doesn't require a framework island
- **Node >=22.12.0** — per `package.json` engines field
- **Static SSG output** — No SSR. All pages are statically generated at build time

## Common Pitfalls

- **FOUC on dark mode** — If the dark mode script runs after paint, users see a white flash before dark theme applies. Fix: place the script as `<script is:inline>` in the `<head>` before any `<link>` or `<style>` that renders content. It must read localStorage, check `prefers-color-scheme`, and add `.dark` to `<html>` synchronously
- **Tailwind dual CSS loading in dev** — Known issue (tailwindcss#18539): Tailwind can load its own `index.css` alongside the custom CSS, causing contradicting dark mode declarations. Fix: ensure only one CSS entry point imports `tailwindcss`, and test dark mode toggle early in dev
- **Fontsource imports in CSS** — When using `@font-face` with `url()` pointing to Fontsource packages (e.g., `url(@fontsource-variable/inter/files/...)`), Vite resolves these at build time. The `@theme` block's `--font-*` tokens reference font-family names, not files — keep these concerns separate
- **`@custom-variant` vs `@variant`** — Some users report `@variant` works instead of `@custom-variant`. The official Tailwind docs use `@custom-variant`. Stick with the documented syntax but be aware this may surface as a confusing error if Tailwind version differs
- **BlogPost layout duplication** — `BlogPost.astro` currently renders its own `<html>`, `<head>`, Header, Footer. If we create `BaseLayout.astro` and `BlogPost.astro` also uses it, we must remove the duplicate shell from `BlogPost.astro` to avoid nested `<html>` elements

## Open Risks

- **Tailwind v4 + Astro 6 Vite plugin compatibility** — This is the primary risk for S01. The Astro docs confirm `@tailwindcss/vite` is the correct path for v4, but the exact Tailwind version that ships may have quirks with Astro's Vite integration. Retire this risk early: install, configure, and verify `dark:bg-*` classes render before building any components
- **Font loading performance** — Variable fonts via Fontsource are larger than the current static Atkinson woff files. D004 marks this as revisable. Monitor font file sizes and consider subsetting to latin if the variable font payload is excessive
- **CSS specificity with `@custom-variant`** — The `&:where(.dark, .dark *)` selector uses `:where()` which has zero specificity. This is intentional (so `dark:` doesn't override everything) but could cause unexpected behavior if other styles compete at the same specificity level

## Requirements Coverage

| Requirement | Role | Key Research Finding |
|-------------|------|---------------------|
| R001 — Tailwind v4 Design System | primary | CSS-first config via `@theme` + `@custom-variant`. No config file. All tokens in global.css |
| R002 — Responsive Mobile-First | primary | Tailwind's `sm:`/`md:`/`lg:` breakpoints, mobile-first by default. No custom breakpoints needed |
| R018 — Dark Mode Toggle | primary | `@custom-variant dark (&:where(.dark, .dark *))` + inline script in head + localStorage. Three-state: light/dark/system |
| R020 — Accessibility (WCAG AA) | primary | Semantic HTML in all components, ARIA labels on toggle and nav, focus-visible styles via Tailwind, contrast ratios ≥4.5:1 for text (avoid pure white on pure black) |
| R016 — SEO Meta Tags | supporting | BaseHead.astro already has OG/Twitter meta structure. S01 preserves this foundation; S03 enhances it |

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | astrolicious/agent-skills@astro | available (2.1K installs, install failed due to internal error) |
| Tailwind CSS | tailwindcss-advanced-layouts | already installed |
| Tailwind CSS | hairyf/skills@tailwindcss | available (745 installs, not needed — Context7 docs sufficient) |

## Sources

- Tailwind v4 dark mode uses `@custom-variant dark (&:where(.dark, .dark *))` for class-based toggling (source: [Tailwind CSS Dark Mode Docs](https://tailwindcss.com/docs/dark-mode))
- Tailwind v4 is CSS-first with no config file — `@theme` block replaces `tailwind.config.js` (source: [Tailkits - Dark Text with Tailwind v4](https://tailkits.com/blog/styling-dark-text-tailwind-v4/))
- Known dev-mode issue with dual CSS loading affecting dark mode (source: [tailwindcss#18539](https://github.com/tailwindlabs/tailwindcss/issues/18539))
- Fontsource provides Vite-compatible self-hosted variable fonts via npm (source: [Fontsource JetBrains Mono](https://fontsource.org/fonts/jetbrains-mono/install))
- Astro components use `<script>` tags for client-side JS; `is:inline` prevents processing/deferral (source: [Astro Client-Side Scripts Docs](https://docs.astro.build/en/guides/client-side-scripts))
- Astro 5.2+ supports `@tailwindcss/vite` via `vite.plugins` in astro.config.mjs (source: [Astro Styling Guide](https://docs.astro.build/en/guides/styling))

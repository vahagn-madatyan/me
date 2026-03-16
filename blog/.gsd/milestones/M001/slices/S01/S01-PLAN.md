# S01: Foundation & Design System

**Goal:** Dark-first site skeleton with Tailwind v4 design system, responsive layout, header/footer chrome, and dark mode toggle with persistence — establishing the shared foundation all other slices build on.
**Demo:** Dev server shows dark-themed pages with teal/cyan accents, header with nav links (Blog, Work, About, Architecture), footer with personal social links, and a working dark mode toggle that persists across page loads with no FOUC.

## Must-Haves

- Tailwind v4 compiles via `@tailwindcss/vite` in Astro 6 with custom theme tokens (teal/cyan primary, slate secondary, orange accent)
- Inter + JetBrains Mono fonts load via Fontsource
- Dark mode toggles via class strategy with `@custom-variant dark`, persists in localStorage, respects system preference on first visit, no FOUC
- BaseLayout wraps all pages with consistent HTML shell, semantic landmarks, and meta tags
- Header has nav links: Blog, Work, About, Architecture — with active link styling
- Footer has social links (GitHub, LinkedIn, X), copyright, RSS link
- All pages are responsive across mobile/tablet/desktop
- BlogPost layout refactored to delegate to BaseLayout (no duplicate `<html>` shell)
- `npm run build` succeeds with zero errors

## Proof Level

- This slice proves: contract (Tailwind v4 integration works, boundary components render correctly for downstream slices)
- Real runtime required: yes (dev server for dark mode toggle, responsive verification)
- Human/UAT required: yes (visual design quality, dark mode aesthetics)

## Verification

- `npm run build` completes with zero errors
- `bash scripts/verify-s01.sh` — checks build output for: Tailwind classes present, dark mode init script in `<head>`, nav links present, social links present, responsive viewport meta, no duplicate `<html>` elements
- Dev server manual check: dark mode toggle works, persists on reload, no FOUC

## Integration Closure

- Upstream surfaces consumed: none (first slice)
- New wiring introduced: `@tailwindcss/vite` in `astro.config.mjs`, `BaseLayout.astro` as universal page wrapper, `global.css` as single CSS entry point with all design tokens
- What remains before milestone is truly usable end-to-end: blog engine (S02), SEO (S03), reading experience (S04), projects (S05), about/architecture (S06), homepage assembly (S07)

## Tasks

- [x] **T01: Install Tailwind v4, Fontsource fonts, and configure design system theme** `est:45m`
  - Why: Retires the primary risk (Tailwind v4 + Astro 6 compatibility) before any component work begins. Establishes the CSS foundation every component depends on.
  - Files: `package.json`, `astro.config.mjs`, `src/styles/global.css`, `src/consts.ts`
  - Do: Install `tailwindcss`, `@tailwindcss/vite`, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`. Add `@tailwindcss/vite` to `vite.plugins` in astro config. Update `site` to `https://vahagn.dev`. Replace `global.css` entirely with Tailwind v4 imports, `@custom-variant dark`, `@theme` block with D003 design tokens (colors, fonts, spacing). Import Fontsource font CSS files. Update `consts.ts` with real site title/description.
  - Verify: `npm run build` succeeds. A temp page using `dark:bg-slate-900` and `text-teal-400` renders correctly in dev server.
  - Done when: Tailwind v4 classes compile, custom theme tokens resolve, fonts load, dark variant works — risk retired.

- [x] **T02: Build BaseLayout, Header, Footer, ThemeToggle and refactor all pages** `est:1h15m`
  - Why: Creates the site shell that every downstream slice consumes. Delivers the visible demo: dark-themed skeleton with nav, social links, working dark mode toggle, responsive layout.
  - Files: `src/components/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/ThemeToggle.astro`, `src/components/HeaderLink.astro`, `src/components/BaseHead.astro`, `src/layouts/BlogPost.astro`, `src/pages/index.astro`, `src/pages/about.astro`, `scripts/verify-s01.sh`
  - Do: Create `BaseLayout.astro` as single HTML shell (html, head with BaseHead + dark mode init script `is:inline`, body with Header/Footer wrapping `<slot />`). Build `ThemeToggle.astro` with three-state logic (light/dark/system), localStorage persistence, `<script>` tag for client interaction. Redesign `Header.astro` with Tailwind — nav links (Blog, Work, About, Architecture), mobile hamburger menu, ThemeToggle, active link styling. Redesign `Footer.astro` — personal social links (GitHub, LinkedIn, X), copyright "Vahagn Grigoryan", RSS link. Update `HeaderLink.astro` to use Tailwind classes. Update `BaseHead.astro` — remove Atkinson font preloads, keep meta/OG structure. Refactor `BlogPost.astro` to use BaseLayout instead of owning `<html>`. Update `index.astro` and `about.astro` to use BaseLayout. Write `scripts/verify-s01.sh` for build output verification. Ensure semantic HTML landmarks (nav, main, footer), ARIA labels, focus-visible styles, keyboard navigation throughout.
  - Verify: `npm run build` succeeds. `bash scripts/verify-s01.sh` passes. Dev server shows dark-themed skeleton with toggle, nav, responsive layout, no FOUC.
  - Done when: All pages render through BaseLayout, dark mode toggle persists across pages, responsive layout works at mobile/tablet/desktop breakpoints, verification script passes.

## Files Likely Touched

- `package.json`
- `astro.config.mjs`
- `src/styles/global.css`
- `src/consts.ts`
- `src/components/BaseLayout.astro`
- `src/components/BaseHead.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/HeaderLink.astro`
- `src/components/ThemeToggle.astro`
- `src/layouts/BlogPost.astro`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `scripts/verify-s01.sh`

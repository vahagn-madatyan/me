---
id: T01
parent: S01
milestone: M001
provides:
  - Tailwind v4 CSS foundation with @tailwindcss/vite plugin
  - Custom design tokens (primary teal/cyan, secondary slate, accent orange)
  - Fontsource Inter + JetBrains Mono variable fonts loaded via CSS imports
  - Class-based dark mode via @custom-variant dark
  - Site metadata updated (title, description, URL)
key_files:
  - astro.config.mjs
  - src/styles/global.css
  - src/consts.ts
  - package.json
key_decisions:
  - Used Fontsource index.css imports (not individual weight files) for simplest variable font setup
  - Named theme font tokens --font-body and --font-code (generates font-body/font-code utility classes)
  - Set --spacing to 0.25rem base (Tailwind default) for standard spacing scale
patterns_established:
  - All design tokens live in @theme block in src/styles/global.css — no tailwind.config.js
  - Custom color scales use --color-primary-*, --color-secondary-*, --color-accent-* naming
  - Base styles use @layer base with @apply for Tailwind utility composition
observability_surfaces:
  - none
duration: 15m
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T01: Install Tailwind v4, Fontsource fonts, and configure design system theme

**Installed Tailwind v4 via @tailwindcss/vite, Fontsource variable fonts, and full D003 design token system — primary risk (Tailwind v4 + Astro 6 compatibility) retired.**

## What Happened

Installed four npm packages: `tailwindcss`, `@tailwindcss/vite`, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`. Updated `astro.config.mjs` to register the Tailwind Vite plugin and set `site` to `https://vahagn.dev`. Replaced `src/styles/global.css` entirely with Tailwind v4 CSS-first configuration: `@import "tailwindcss"`, Fontsource font imports, `@custom-variant dark` for class-based dark mode, and a complete `@theme` block with D003 design tokens (teal/cyan primary, slate secondary, orange accent color scales, Inter/JetBrains Mono font families, 0.25rem spacing base). Added base layer styles for body dark/light mode, font smoothing, code font family, focus-visible accessibility outlines, and selection colors. Updated `src/consts.ts` with real site title and description.

## Verification

- `npm run build` completed with zero errors (984ms, 8 pages)
- Build CSS output contains all custom theme tokens (`--color-primary-*`, `--color-secondary-*`, `--color-accent-*`, `--font-body`, `--font-code`)
- Fontsource `@font-face` declarations for Inter Variable and JetBrains Mono Variable present in compiled CSS
- Dark variant CSS (`body:where(.dark,.dark *)`) compiled correctly
- Sitemap generated with `https://vahagn.dev` URL
- Dev server verified: temporary test classes (`text-primary-400`, `bg-secondary-800`, `text-accent-400`) resolved to correct colors
- Dark mode toggle verified via JS: adding `.dark` to `<html>` changes body background to `rgb(2, 6, 23)` (secondary-950) and text to `rgb(241, 245, 249)` (secondary-100)
- Temp verification classes removed after confirmation

**Slice-level checks (partial — T01 of 2):**
- ✅ `npm run build` zero errors
- ⬜ Dark mode init script in `<head>` (T02)
- ⬜ Nav links present (T02)
- ⬜ Social links present (T02)
- ⬜ `verify-s01.sh` script (T02)
- ⬜ Responsive viewport meta (T02)
- ⬜ No duplicate `<html>` elements (T02)

## Diagnostics

None. CSS compilation is verified at build time — any token errors surface as build failures.

## Deviations

None.

## Known Issues

- Old Header/Footer scoped CSS (Bear Blog styles) still renders — these components haven't been redesigned yet. Dark mode body background change is correct but visually subtle because the header/footer have their own white backgrounds via scoped styles. T02 replaces these components entirely.

## Files Created/Modified

- `package.json` — Added 4 dependencies (tailwindcss, @tailwindcss/vite, @fontsource-variable/inter, @fontsource-variable/jetbrains-mono)
- `astro.config.mjs` — Added @tailwindcss/vite to vite.plugins, changed site to https://vahagn.dev
- `src/styles/global.css` — Complete replacement: Tailwind v4 imports, @custom-variant dark, @theme with all D003 design tokens, base layer styles
- `src/consts.ts` — Updated SITE_TITLE to "Vahagn Grigoryan" and SITE_DESCRIPTION to real description

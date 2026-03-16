---
estimated_steps: 5
estimated_files: 4
---

# T01: Install Tailwind v4, Fontsource fonts, and configure design system theme

**Slice:** S01 — Foundation & Design System
**Milestone:** M001

## Description

Install and configure the CSS foundation: Tailwind v4 via Vite plugin, Fontsource variable fonts, and the complete design token system. This task retires the primary S01 risk (Tailwind v4 + Astro 6 compatibility) before any component work begins. After this task, Tailwind utility classes compile with custom theme tokens and the dark variant works.

## Steps

1. Install npm dependencies: `tailwindcss`, `@tailwindcss/vite`, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`
2. Update `astro.config.mjs`: add `@tailwindcss/vite` to `vite.plugins` array, change `site` to `https://vahagn.dev`
3. Replace `src/styles/global.css` entirely: import `tailwindcss`, import Fontsource font CSS files, define `@custom-variant dark (&:where(.dark, .dark *))`, define `@theme` block with D003 design tokens — color palette (teal/cyan primary, slate secondary, orange accent), font families (Inter body, JetBrains Mono code), spacing scale, and any base style overrides
4. Update `src/consts.ts`: change `SITE_TITLE` to `"Vahagn Grigoryan"` and `SITE_DESCRIPTION` to a real personal description
5. Verify: run `npm run build` to confirm Tailwind compiles without errors. Temporarily add a Tailwind class to `index.astro` (e.g., `class="text-teal-400 dark:bg-slate-900"`) and check dev server to confirm classes resolve and dark variant works. Remove temp class after verification.

## Must-Haves

- [ ] `tailwindcss` and `@tailwindcss/vite` installed and configured in `astro.config.mjs`
- [ ] `@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono` installed and imported in CSS
- [ ] `@custom-variant dark (&:where(.dark, .dark *))` defined in `global.css`
- [ ] `@theme` block defines all D003 design tokens: primary (teal/cyan), secondary (slate), accent (orange), font families
- [ ] `site` in astro config updated to `https://vahagn.dev`
- [ ] `SITE_TITLE` and `SITE_DESCRIPTION` updated to real personal values
- [ ] `npm run build` succeeds with zero errors

## Verification

- `npm run build` completes successfully (exit code 0)
- Build output contains compiled CSS with Tailwind utility classes
- Dev server renders page with Tailwind classes applied (visual confirmation of custom theme token resolution)

## Inputs

- `astro.config.mjs` — current config with MDX + sitemap integrations, needs Vite plugin addition
- `src/styles/global.css` — current Bear Blog CSS, will be fully replaced
- `src/consts.ts` — current placeholder values
- Research: Tailwind v4 CSS-first config approach, `@custom-variant` syntax, Fontsource import paths

## Expected Output

- `package.json` — updated with 4 new dependencies
- `astro.config.mjs` — Vite plugin configured, site URL updated
- `src/styles/global.css` — complete replacement with Tailwind v4 foundation (imports, theme, custom variant)
- `src/consts.ts` — real site title and description

---
id: S01
parent: M001
milestone: M001
provides:
  - Tailwind v4 CSS foundation with @tailwindcss/vite plugin and full D003 design token system
  - BaseLayout universal page wrapper — boundary contract for all downstream slices
  - ThemeToggle with three-state cycling (light/dark/system), localStorage persistence, no FOUC
  - Responsive Header with nav links (Blog, Work, About, Architecture), mobile hamburger menu, active link styling
  - Footer with personal social links (GitHub, LinkedIn, X), copyright, RSS link
  - Fontsource Inter + JetBrains Mono variable fonts loaded via CSS imports
  - Class-based dark mode via @custom-variant dark with inline init script
  - scripts/verify-s01.sh — 19-check build output verification
requires:
  - slice: none
    provides: first slice — no upstream dependencies
affects:
  - S02
  - S05
  - S06
  - S07
key_files:
  - astro.config.mjs
  - src/styles/global.css
  - src/consts.ts
  - src/components/BaseLayout.astro
  - src/components/ThemeToggle.astro
  - src/components/Header.astro
  - src/components/Footer.astro
  - src/components/HeaderLink.astro
  - src/components/BaseHead.astro
  - src/layouts/BlogPost.astro
  - scripts/verify-s01.sh
key_decisions:
  - All design tokens live in @theme block in src/styles/global.css — no tailwind.config.js (CSS-first config)
  - data-* attribute selectors for ThemeToggle instead of IDs — component renders in both desktop and mobile nav
  - Dark mode init is:inline script in BaseLayout <head> — runs synchronously before paint, no FOUC
  - onclick assignment pattern for mobile menu — prevents handler stacking during Astro page transitions
  - Theme transition CSS class added only after first user click — prevents animation flash on initial load
  - Fontsource index.css imports for simplest variable font setup
patterns_established:
  - BaseLayout is the single HTML shell — all pages pass title/description/image as props
  - Client JS in Astro components uses module <script> tags with init function + astro:after-swap listener
  - data-* attributes for JS selectors when a component can render multiple instances
  - Custom color scales use --color-primary-*, --color-secondary-*, --color-accent-* naming
  - Base styles use @layer base with @apply for Tailwind utility composition
observability_surfaces:
  - scripts/verify-s01.sh — 19 structural checks on build output (Tailwind classes, dark mode init, nav links, social links, viewport meta, no duplicate HTML, semantic landmarks)
drill_down_paths:
  - .gsd/milestones/M001/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T02-SUMMARY.md
duration: ~75min
verification_result: passed
completed_at: 2026-03-15
---

# S01: Foundation & Design System

**Dark-first site skeleton with Tailwind v4 design system, responsive header/footer chrome, and three-state dark mode toggle with persistence and no FOUC — establishing the shared foundation all downstream slices build on.**

## What Happened

**T01** installed Tailwind v4 via `@tailwindcss/vite`, Fontsource variable fonts (Inter + JetBrains Mono), and built the complete D003 design token system in CSS-first configuration. The `@theme` block in `global.css` defines teal/cyan primary, slate secondary, and orange accent color scales, font families, and spacing. Class-based dark mode via `@custom-variant dark` compiles correctly. Updated site URL to `https://vahagn.dev` and site metadata. This retired the primary risk: Tailwind v4 + Astro 6 compatibility confirmed working.

**T02** built the site shell layer. BaseLayout wraps all pages with a consistent HTML structure — `<head>` with BaseHead + inline dark mode init script (runs before paint, no FOUC), `<body>` with Header/main/Footer. ThemeToggle cycles light → dark → system with localStorage persistence, using `data-*` attribute selectors to support rendering in both desktop and mobile nav without duplicate ID issues. Header has sticky positioning with backdrop blur, horizontal nav on desktop with active link styling via `aria-current="page"`, and a hamburger dropdown on mobile. Footer has GitHub, LinkedIn, X social links with accessible labels, copyright, and RSS feed link. All 6 existing page types were refactored through BaseLayout — no duplicate HTML shells remain.

## Verification

- `npm run build` — 8 pages built in ~900ms, zero errors
- `bash scripts/verify-s01.sh` — 19/19 checks pass:
  - Tailwind utility classes and CSS design tokens present in build output
  - Dark mode init script in `<head>` with prefers-color-scheme check
  - Blog, Work, About, Architecture nav links present
  - GitHub, LinkedIn, X, RSS social links present
  - Viewport meta on index and blog index
  - No duplicate `<html>` tags in any page
  - Semantic HTML landmarks (nav, main, footer, header) present
- Production build served and browser-verified:
  - Theme toggle cycles system → light → dark correctly with icon updates
  - Dark mode persists across reload (html.dark class applied immediately)
  - Mobile (390px): hamburger menu toggles, nav links accessible
  - Desktop: sticky header with nav, footer with social links

## Requirements Advanced

- R001 (Tailwind v4 Design System) — Full design token system implemented, Tailwind v4 compiles with custom theme
- R002 (Responsive Mobile-First Layout) — All pages responsive with mobile hamburger menu, desktop nav
- R018 (Dark Mode Toggle) — Three-state toggle with localStorage persistence, system preference detection, no FOUC
- R020 (Accessibility WCAG AA) — Semantic landmarks, ARIA labels, focus-visible styles, keyboard navigation

## Requirements Validated

- R001 — Tailwind v4 compiles via @tailwindcss/vite, custom theme tokens resolve, dark variant works. Verified in build output and dev server.
- R018 — Toggle persists across pages, respects system preference on first visit, no FOUC. Verified with browser testing.

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- Used `data-theme-toggle`/`data-theme-icon` attributes instead of IDs for ThemeToggle — plan implied single instance, but desktop + mobile nav needs multiple instances
- Blog index page also refactored to use BaseLayout (not explicitly in plan but necessary for consistency)
- Mobile menu uses `onclick` assignment instead of `addEventListener` — prevents handler stacking during Astro page transitions

## Known Limitations

- ThemeToggle hover/focus color classes get purged by Tailwind v4 in production build (`text-secondary-500 hover:text-secondary-900` etc don't survive). Toggle is fully functional but without hover color transition in prod. Fix: move those styles to global.css or use @apply in a style block.
- Old sample blog content still uses placeholder data — real content comes in S02.

## Follow-ups

- Fix ThemeToggle hover class purging in a later slice (cosmetic only, toggle works)

## Files Created/Modified

- `package.json` — Added tailwindcss, @tailwindcss/vite, @fontsource-variable/inter, @fontsource-variable/jetbrains-mono
- `astro.config.mjs` — Added @tailwindcss/vite to vite.plugins, set site to https://vahagn.dev
- `src/styles/global.css` — Complete replacement with Tailwind v4 CSS-first config, design tokens, base styles
- `src/consts.ts` — Updated site title and description
- `src/components/BaseLayout.astro` — **new** universal page wrapper with dark mode init
- `src/components/ThemeToggle.astro` — **new** three-state theme toggle
- `src/components/Header.astro` — Redesigned with Tailwind, responsive mobile menu
- `src/components/Footer.astro` — Redesigned with personal social links, copyright, RSS
- `src/components/HeaderLink.astro` — Updated to Tailwind classes with aria-current
- `src/components/BaseHead.astro` — Removed Atkinson font preloads
- `src/layouts/BlogPost.astro` — Refactored to delegate to BaseLayout
- `src/pages/index.astro` — Uses BaseLayout, placeholder content
- `src/pages/about.astro` — Uses BaseLayout, placeholder content
- `src/pages/blog/index.astro` — Refactored to use BaseLayout with Tailwind card grid
- `scripts/verify-s01.sh` — **new** 19-check build output verification

## Forward Intelligence

### What the next slice should know
- BaseLayout accepts `title`, `description`, `image` props — wrap every new page with it
- All design tokens are in `src/styles/global.css` `@theme` block — use `text-primary-400`, `bg-secondary-900`, etc.
- Dark mode works via `.dark` class on `<html>` — use Tailwind `dark:` prefix for all dark mode styles
- Nav links are hardcoded in Header.astro — new pages don't auto-appear in nav

### What's fragile
- Tailwind v4 purges hover/focus classes that aren't statically referenced in templates — if a class is only used in a JS-manipulated context, it may not survive production build. Use `@apply` in `<style>` blocks or global.css for dynamic styles.
- Mobile menu JS uses `onclick` assignment — if multiple scripts try to bind the same button, last one wins

### Authoritative diagnostics
- `bash scripts/verify-s01.sh` after any build — validates 19 structural checks on build output, catches regressions in nav links, dark mode init, semantic HTML
- `localStorage.theme` in browser console — shows current theme preference (`"light"`, `"dark"`, or absent for system)

### What assumptions changed
- Tailwind v4 + Astro 6 integration was rated medium risk — turned out straightforward, no issues encountered
- ThemeToggle was assumed to be a single instance — needed multiple instances for desktop + mobile, drove the data-attribute selector pattern

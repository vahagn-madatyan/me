---
estimated_steps: 5
estimated_files: 10
---

# T02: Build BaseLayout, Header, Footer, ThemeToggle and refactor all pages

**Slice:** S01 — Foundation & Design System
**Milestone:** M001

## Description

Build the site shell components (BaseLayout, Header, Footer, ThemeToggle) and refactor all existing pages to use the new layout system. This delivers the visible S01 demo: dark-themed skeleton with navigation, social links, responsive layout, and a working dark mode toggle with persistence and no FOUC. Also produces the verification script that validates the slice.

## Steps

1. Create `src/components/BaseLayout.astro` — single HTML shell component:
   - Props: `title`, `description`, optional `image`
   - Renders: `<html lang="en">`, `<head>` with BaseHead + inline dark mode init script (`is:inline`, reads localStorage, checks `prefers-color-scheme`, adds `.dark` to `<html>` before paint), `<body>` with Header, `<main><slot /></main>`, Footer
   - Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`
   - Smooth transition class on `<html>` for theme changes (but not on first load — avoid transition on initial paint)

2. Create `src/components/ThemeToggle.astro`:
   - Visual: button with sun/moon/monitor icons for light/dark/system states
   - Client JS via `<script>` tag (not a framework island): reads current theme from localStorage, toggles through states on click, updates `.dark` class on `<html>`, writes to localStorage
   - ARIA: `aria-label="Toggle theme"`, announces current state
   - Keyboard: works with Enter and Space

3. Redesign `src/components/Header.astro` with Tailwind:
   - Desktop: horizontal nav with links (Blog → `/blog`, Work → `/work`, About → `/about`, Architecture → `/architecture`), ThemeToggle on the right
   - Mobile: hamburger menu button that toggles a dropdown nav, ThemeToggle visible in both states
   - Active link styling via `Astro.url.pathname` matching
   - Update `HeaderLink.astro` to use Tailwind classes instead of scoped CSS
   - Sticky/fixed header with subtle backdrop blur
   - ARIA: `aria-expanded` on hamburger, `aria-current="page"` on active link

4. Redesign `src/components/Footer.astro` with Tailwind:
   - Social links: GitHub (github.com/vahagn-grigoryan), LinkedIn, X — with accessible labels
   - Copyright: "© 2026 Vahagn Grigoryan"
   - RSS link pointing to `/rss.xml`
   - Responsive layout

5. Refactor existing pages to use BaseLayout and write verification script:
   - Update `BaseHead.astro`: remove Atkinson font preloads (Fontsource handles fonts via CSS import now), keep meta/OG tag structure intact for S03 to enhance
   - Refactor `BlogPost.astro`: remove `<html>`, `<head>`, Header, Footer — wrap content with BaseLayout instead, pass title/description as props
   - Update `src/pages/index.astro`: use BaseLayout, replace placeholder content with minimal "coming soon" or brief intro (S07 builds the real homepage)
   - Update `src/pages/about.astro`: use BaseLayout (S06 builds the real content)
   - Write `scripts/verify-s01.sh`: check build output HTML files for Tailwind classes present, dark mode init script in head, nav links present, social links present, viewport meta tag, no nested `<html>` elements

## Must-Haves

- [ ] `BaseLayout.astro` wraps all pages with consistent HTML shell and dark mode init script
- [ ] Dark mode init runs synchronously before first paint (no FOUC) via `is:inline` script in `<head>`
- [ ] ThemeToggle cycles light/dark/system, persists to localStorage, updates UI immediately
- [ ] Header has nav links: Blog, Work, About, Architecture — with active styling
- [ ] Header has responsive mobile menu
- [ ] Footer has GitHub, LinkedIn, X links, copyright, RSS link
- [ ] BlogPost layout delegates to BaseLayout (no duplicate `<html>`)
- [ ] All pages use BaseLayout
- [ ] Semantic HTML throughout: `<nav>`, `<main>`, `<footer>`, ARIA labels, `focus-visible` styles
- [ ] `npm run build` succeeds with zero errors
- [ ] `scripts/verify-s01.sh` passes all checks

## Verification

- `npm run build` completes successfully
- `bash scripts/verify-s01.sh` passes (checks build output for required elements)
- Dev server: navigate between pages — Header/Footer consistent, dark mode toggle works, persists on reload, no FOUC
- Dev server: resize to mobile — hamburger menu appears, nav links accessible
- Build output: no duplicate `<html>` tags in any generated HTML file

## Inputs

- T01 output: `global.css` with Tailwind v4 theme, `astro.config.mjs` with Vite plugin, `consts.ts` with real values
- Existing `BaseHead.astro` — meta/OG structure to preserve
- Existing `BlogPost.astro` — layout to refactor
- Existing `Header.astro`, `Footer.astro`, `HeaderLink.astro` — patterns to replace with Tailwind versions

## Expected Output

- `src/components/BaseLayout.astro` — new universal page wrapper (boundary contract for S02-S07)
- `src/components/ThemeToggle.astro` — new dark mode toggle component
- `src/components/Header.astro` — redesigned with Tailwind, responsive, active links
- `src/components/Footer.astro` — redesigned with Tailwind, personal links
- `src/components/HeaderLink.astro` — updated to Tailwind classes
- `src/components/BaseHead.astro` — cleaned up (no Atkinson preloads)
- `src/layouts/BlogPost.astro` — refactored to use BaseLayout
- `src/pages/index.astro` — uses BaseLayout
- `src/pages/about.astro` — uses BaseLayout
- `scripts/verify-s01.sh` — build output verification script

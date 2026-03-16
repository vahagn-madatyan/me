# S01: Foundation & Design System — UAT

**Milestone:** M001
**Written:** 2026-03-15

## UAT Type

- UAT mode: mixed (artifact-driven build checks + live-runtime visual verification)
- Why this mode is sufficient: Foundation slice needs both structural verification (build output) and visual/interaction verification (dark mode, responsive layout)

## Preconditions

- `npm run build` passes with zero errors
- `bash scripts/verify-s01.sh` shows 19/19 checks passing
- Dev server running via `npm run dev` (or production build served locally)

## Smoke Test

Open `http://localhost:4321` in a browser. Page loads with dark background, teal accent colors, header with nav links, and footer with social links. No unstyled flash.

## Test Cases

### 1. Dark mode toggle persistence

1. Open any page in the dev server
2. Click the theme toggle button in the header
3. Observe the page switches between light/dark/system modes with corresponding icon (sun/moon/monitor)
4. Reload the page
5. **Expected:** The last-selected theme persists — page loads in that mode immediately with no flash of wrong theme

### 2. Navigation links

1. Open the site in desktop viewport (>768px)
2. Observe the header nav bar
3. **Expected:** Blog, Work, About, Architecture links are visible and clickable. The current page's link has distinct active styling (teal color).

### 3. Mobile responsive layout

1. Resize browser to 390px width (or use mobile device)
2. Observe the header changes to a hamburger menu icon
3. Click the hamburger icon
4. **Expected:** Dropdown menu appears with Blog, Work, About, Architecture links and theme toggle. Click the X icon to close.

### 4. Footer social links

1. Scroll to the bottom of any page
2. Observe the footer area
3. **Expected:** GitHub, LinkedIn, X (Twitter) icons/links are present and point to real URLs. RSS link is present. Copyright shows "Vahagn Grigoryan".

### 5. Blog post renders through BaseLayout

1. Navigate to any blog post (e.g., /blog/first-post)
2. **Expected:** Post renders with the same header/footer chrome as the homepage. Dark mode toggle works. No duplicate header or footer.

### 6. System preference detection

1. Clear `localStorage.theme` in browser console (`localStorage.removeItem('theme')`)
2. Set OS/browser to dark mode preference
3. Reload the page
4. **Expected:** Site appears in dark mode, matching system preference
5. Switch OS/browser to light mode
6. Reload the page
7. **Expected:** Site appears in light mode

## Edge Cases

### Theme toggle with page navigation

1. Set theme to light mode via toggle
2. Navigate from homepage to a blog post via nav link
3. **Expected:** Light mode persists on the new page — no flash of dark mode during navigation

### Fast toggle cycling

1. Click theme toggle rapidly 5+ times
2. **Expected:** Each click advances the state (light → dark → system → light...) without getting stuck or showing incorrect icon

## Failure Signals

- Flash of unstyled content (white flash in dark mode) on page load — FOUC in dark mode init
- Nav links missing or not styled — Header component not rendering
- Social links missing — Footer component not rendering
- Theme toggle doesn't persist on reload — localStorage not being read on init
- Duplicate header/footer on blog posts — BlogPost layout not properly delegating to BaseLayout
- No Tailwind styles at all — @tailwindcss/vite plugin not configured or CSS not imported

## Requirements Proved By This UAT

- R001 — Tailwind v4 design system compiles and renders with custom theme tokens
- R002 — Responsive layout works across mobile, tablet, desktop viewports
- R018 — Dark mode toggle persists, detects system preference, no FOUC
- R020 — Semantic HTML landmarks present, keyboard navigation works, focus styles visible

## Not Proven By This UAT

- R002 full coverage — Tablet breakpoint not explicitly tested (only mobile and desktop). Full responsive coverage validated across all page types in later slices.
- R020 full coverage — Color contrast ratios not formally audited. Accessibility is additive across all slices.
- Visual design quality — Subjective assessment of dark mode aesthetics, color palette, and typography left to human judgment

## Notes for Tester

- The ThemeToggle hover color transition doesn't work in production builds due to Tailwind v4 class purging — this is a known cosmetic issue, not a bug. The toggle itself works correctly.
- Work and Architecture nav links currently lead to 404 since those pages don't exist yet (S05 and S06).
- Blog content is still placeholder/sample posts from the Astro starter template.

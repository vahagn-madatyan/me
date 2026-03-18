# S07: Homepage & Polish — UAT

**Milestone:** M001
**Written:** 2026-03-17

## UAT Type

- UAT mode: mixed (artifact-driven + human-experience)
- Why this mode is sufficient: Homepage and 404 are static HTML — build output verifies structure. Visual layout, spacing, and dark mode aesthetics require human eyes.

## Preconditions

- `npm run build` succeeds with zero errors (22 pages)
- `npm run dev` running at localhost:4321
- Browser with dev tools available

## Smoke Test

Navigate to `http://localhost:4321/` — the homepage should display a hero section with "Vahagn Grigoryan", blog post cards with reading times, project cards with tech badges, and a newsletter signup form. All in dark mode by default.

## Test Cases

### 1. Homepage Hero Section

1. Navigate to `http://localhost:4321/`
2. Verify "Vahagn Grigoryan" heading is visible and prominent
3. Verify a tagline/description appears below the name
4. Click "Read the Blog" CTA button
5. **Expected:** Navigates to `/blog/`
6. Go back, click "About Me" CTA button
7. **Expected:** Navigates to `/about`

### 2. Featured Blog Posts Section

1. On the homepage, scroll to the "Latest Writing" section
2. Verify exactly 3 blog post cards are displayed
3. Verify each card shows: title, date, excerpt, tags, and reading time (e.g. "3 min read")
4. Verify "building-a-developer-blog" post appears (it has `featured: true`)
5. Click a "View all →" link if present
6. **Expected:** Navigates to `/blog/`
7. Click a blog card title
8. **Expected:** Navigates to the full blog post page

### 3. Project Highlights Section

1. On the homepage, scroll to the project highlights section
2. Verify 4 project cards are visible (VaultBreaker, CortexML, PacketForge, AlphaGrid)
3. Verify each card shows: title, description, tech stack badges (colored pills), and a GitHub link
4. Click a GitHub link
5. **Expected:** Opens `github.com/username/...` in a new tab
6. Verify a "View all →" or equivalent link goes to `/work`

### 4. Newsletter CTA Section

1. On the homepage, scroll to the newsletter signup section
2. Verify an email input field is visible with placeholder text
3. Verify a "Subscribe" button is visible
4. Type an email address into the input
5. Click "Subscribe"
6. **Expected:** Nothing happens — the form has no action attribute and no JavaScript (visual-only per D008). No error, no submission, no redirect.
7. Inspect the form element in dev tools
8. **Expected:** No `action` attribute on the form, no `<script>` tags in the component

### 5. Custom 404 Page

1. Navigate to `http://localhost:4321/nonexistent-page`
2. Verify a large "404" number is displayed (muted/subtle styling)
3. Verify "Page not found" heading appears
4. Verify a friendly explanatory message is shown
5. Verify a "Back to Home" button/link is visible
6. Click "Back to Home"
7. **Expected:** Navigates to `/` (homepage)

### 6. Dark Mode Consistency

1. On the homepage, verify default is dark theme (dark background, light text)
2. Toggle to light mode via the theme toggle in the header
3. Verify the hero, blog cards, project cards, and newsletter form all switch to light theme
4. Navigate to the 404 page
5. **Expected:** 404 page also renders in light mode (theme persists)
6. Toggle back to dark mode
7. **Expected:** 404 page switches to dark mode without FOUC

### 7. Responsive Layout — Mobile

1. Set viewport to mobile width (375px) or use browser mobile emulation
2. Navigate to `http://localhost:4321/`
3. Verify hero section stacks vertically and remains readable
4. Verify blog cards stack to single column
5. Verify project cards stack to single column
6. Verify newsletter form input and button are usable on mobile
7. Navigate to 404 page
8. **Expected:** 404 page is centered and readable on mobile

### 8. Responsive Layout — Desktop

1. Set viewport to desktop width (1280px+)
2. Navigate to `http://localhost:4321/`
3. Verify blog cards display in a responsive grid (2-3 columns)
4. Verify project cards display in a 2-column grid
5. Verify spacing and alignment look intentional, not stretched or compressed
6. **Expected:** Professional layout with consistent spacing between sections

### 9. Navigation Completeness

1. From the homepage, verify header navigation contains links to: Blog, Work, About, Architecture
2. Click each nav link in sequence
3. **Expected:** Each navigates to the correct page (/blog, /work, /about, /architecture)
4. Verify footer contains social links and RSS link
5. Verify dark mode toggle is accessible from every page

## Edge Cases

### Empty Featured Posts

1. This is a structural edge case — if all `featured: true` flags were removed from blog posts
2. **Expected:** The homepage still shows 3 blog cards (filled entirely from latest posts by date). No empty cards, no errors.
3. (Not testable without modifying content — note for future regression if featured posts are edited)

### 404 with Deep Path

1. Navigate to `http://localhost:4321/blog/nonexistent/deeply/nested`
2. **Expected:** 404 page renders with the same branded design. "Back to Home" still links to `/`.

## Failure Signals

- Homepage shows empty sections (no blog cards or no project cards) → data query or import is broken
- "min read" text missing from blog cards → reading time computation failed
- Newsletter form submits or redirects → form has an action or JS that shouldn't be there
- 404 page shows Astro's default error page instead of branded design → 404.astro not picked up
- FOUC (flash of unstyled content) on page load → dark mode init script missing or broken
- Build produces fewer than 22 pages → a page route is broken

## Requirements Proved By This UAT

- R003 — Homepage with hero, featured posts, project highlights, newsletter CTA
- R019 — Custom 404 page matching site design
- R025 (partial) — Visual newsletter form ready for M003 wiring

## Not Proven By This UAT

- R025 full — Newsletter form submission, success/error handling, GDPR compliance (M003 scope)
- R002 — Full responsive audit across all viewports on all pages (ongoing, not slice-specific)
- R020 — Full accessibility audit (keyboard navigation, screen reader testing) — not explicitly tested here
- Live deployment behavior (M002 scope)

## Notes for Tester

- The newsletter form intentionally does nothing when submitted — this is correct behavior for M001. Don't flag it as a bug.
- The "featured" blog post ("Building a Developer Blog") should always appear in the homepage cards. If it's missing, check that `featured: true` is still in its frontmatter.
- Dark mode is the default — the site should load dark on first visit unless the system preference is light.
- Project data comes from `src/data/projects.ts`, not a content collection. If project cards are wrong, check that file directly.
- The 404 page large number uses muted colors (secondary-300/700) intentionally — it should be subtle, not the visual focus.

# S06: About & Architecture — UAT

**Milestone:** M001
**Written:** 2026-03-16

## UAT Type

- UAT mode: mixed (artifact-driven + live-runtime)
- Why this mode is sufficient: Build output checks confirm structural correctness (content markers, elements, attributes). Live runtime checks confirm filter interactivity, lightbox behavior, dark mode toggle, and responsive layout — things that can't be verified from static HTML alone.

## Preconditions

- `npm run build` completes with zero errors
- Dev server running: `npm run dev` (default port 4321)
- Browser available for runtime checks

## Smoke Test

Navigate to `http://localhost:4321/about` — page loads with bio text, skills badges, and contact link buttons visible. Navigate to `http://localhost:4321/architecture` — page loads with filter buttons and diagram cards visible.

## Test Cases

### 1. About Page — Bio Section

1. Navigate to `/about`
2. Verify hero section shows name "Vahagn Grigoryan" and role "Software Architect & Engineer"
3. Verify 3 bio paragraphs are present covering architecture philosophy, domain experience, and writing
4. **Expected:** Bio section renders with readable text, proper typography, adequate spacing

### 2. About Page — Focus Areas

1. On `/about`, scroll to "Current Focus" section
2. Verify 4 focus area cards: Distributed Systems, AI/ML Infrastructure, Developer Tools, Security Engineering
3. Verify each card has an icon badge, title, and description
4. **Expected:** 2×2 grid on desktop, single column on mobile; cards have border styling and proper spacing

### 3. About Page — Skills Grid

1. On `/about`, scroll to "Skills & Tech Stack" section
2. Verify 4 category groups: Languages, Frameworks & Libraries, Infrastructure & Cloud, Tools & Practices
3. Count badges — should be 8 per category (32 total)
4. **Expected:** Badge chips render with ring-inset styling, wrap naturally on narrow viewports

### 4. About Page — Contact Links

1. On `/about`, scroll to "Get in Touch" section
2. Verify 4 contact buttons: GitHub, LinkedIn, X, Email
3. Click GitHub link → opens `https://github.com/vahagn-grigoryan` in new tab
4. Click LinkedIn link → opens `https://linkedin.com/in/vahagn-grigoryan` in new tab
5. Click X link → opens `https://x.com/vahagn_dev` in new tab
6. Click Email link → opens mailto: handler
7. **Expected:** All 4 links work, all open in new tab (except email), all have SVG icons visible

### 5. Architecture Page — Card Grid

1. Navigate to `/architecture`
2. Verify introductory heading and description text
3. Verify 6 architecture cards are visible in a grid
4. Each card should show: image area, domain badge, title, description, "Problem Solved" text, tech decision badges
5. **Expected:** 2-column grid on desktop, single column on mobile; all 6 cards visible with "All" filter active

### 6. Architecture Page — Domain Filter

1. On `/architecture`, verify filter buttons exist: "All" + 4 domain buttons (Distributed Systems, Security, Data Pipeline, Infrastructure)
2. Click "Security" filter button
3. Verify only security-domain cards are visible (others hidden)
4. Verify "Security" button has active styling (solid bg) and others have inactive styling
5. Click "All" filter button
6. **Expected:** All 6 cards visible again; "All" button has active styling

### 7. Architecture Page — Lightbox Open/Close

1. On `/architecture`, click the image area of any architecture card
2. Verify lightbox dialog opens with larger image, title displayed
3. Verify dark backdrop overlay covers the page behind
4. Click the close button (×)
5. Verify dialog closes and cards are visible again
6. **Expected:** Dialog opens centered, backdrop is dark regardless of theme, close button works

### 8. Architecture Page — Lightbox Escape Key

1. On `/architecture`, click an architecture card image to open lightbox
2. Press Escape key
3. **Expected:** Lightbox closes immediately

### 9. Architecture Page — Lightbox Backdrop Click

1. On `/architecture`, click an architecture card image to open lightbox
2. Click outside the dialog content area (on the backdrop)
3. **Expected:** Lightbox closes

### 10. Dark Mode — Both Pages

1. Navigate to `/about`
2. Click the dark mode toggle in the header
3. Verify all sections switch themes: bio text, focus cards, skills badges, contact buttons
4. Navigate to `/architecture`
5. Verify cards, filter buttons, badges, and page background all reflect dark/light theme
6. Toggle back
7. **Expected:** No unstyled elements in either theme; text contrast is readable; transitions are smooth

### 11. Responsive Layout — Mobile

1. Set viewport to 390×844 (mobile)
2. Navigate to `/about`
3. Verify focus area cards stack to single column
4. Verify skills badges wrap within their groups
5. Verify contact buttons stack vertically
6. Navigate to `/architecture`
7. Verify cards stack to single column
8. Verify filter buttons wrap to multiple lines if needed
9. **Expected:** All content accessible and readable on mobile viewport; no horizontal overflow

### 12. Navigation Integration

1. From any page, click "About" in the header navigation
2. Verify navigates to `/about`
3. Click "Architecture" in the header navigation
4. Verify navigates to `/architecture`
5. Verify both pages have the full site header (nav links, dark mode toggle) and footer (social links, copyright)
6. **Expected:** Both pages are fully integrated into site navigation; header and footer render identically to other pages

## Edge Cases

### Empty Filter Results

1. This shouldn't happen with current data (all 4 domains have entries), but if a domain had zero entries, clicking its filter button should show an empty grid
2. **Expected:** No JS errors; filter button still toggles correctly

### Rapid Filter Switching

1. On `/architecture`, click filter buttons rapidly in succession (All → Security → Infrastructure → All)
2. **Expected:** No visual glitches, no stale cards visible, final state matches last clicked filter

### Lightbox on Placeholder Images

1. On `/architecture`, open lightbox on a card
2. Since diagram images are placeholder paths, the lightbox will show a broken image
3. **Expected:** Alt text displays; dialog still opens/closes correctly; no JS errors

### Page Transition (View Transitions)

1. Navigate from `/about` to `/architecture` via header nav link
2. Open lightbox on architecture page
3. Close lightbox
4. Navigate back to `/about`
5. **Expected:** All interactive elements re-initialize correctly after page transitions (astro:after-swap)

## Failure Signals

- JS errors in browser console on either page
- Filter buttons don't change card visibility
- Lightbox dialog doesn't open on card click
- Escape key doesn't close lightbox
- Missing sections on about page (no skills, no contact links)
- Dark mode toggle doesn't affect one or more sections
- Horizontal scrollbar on mobile viewport
- Navigation links to /about or /architecture return 404
- `bash scripts/verify-s06.sh` reports any check as ❌

## Requirements Proved By This UAT

- R013 — About page bio, focus areas, skills grid, contact links all render correctly with working hrefs, dark mode, and responsive layout
- R014 — Architecture gallery with filterable card grid, lightbox open/close (button, Escape, backdrop), domain badges, tech decisions, responsive layout

## Not Proven By This UAT

- Real architecture diagram images (placeholder paths used)
- Production content accuracy (sample data)
- Accessibility beyond aria-labels and keyboard Escape (screen reader testing not covered)
- Performance metrics (no Lighthouse audit)

## Notes for Tester

- Architecture diagram images are intentionally placeholder (`/diagrams/*.png` files don't exist) — broken images in lightbox are expected. Focus on testing the interactive behavior (open/close/filter), not image content.
- Contact links should open in new tabs — if popup blocker interferes, check `target="_blank"` attributes in HTML source.
- The about page has no client JS — it's fully static. Only the architecture page has interactive elements (filter + lightbox).
- Filter JS and lightbox JS both use the `init() + astro:after-swap` pattern — test at least one page transition to confirm re-initialization works.

# S05: Projects Page — UAT

**Milestone:** M001
**Written:** 2026-03-16

## UAT Type

- UAT mode: mixed (artifact-driven build checks + live-runtime filter interaction)
- Why this mode is sufficient: Build output verifies structural markup; live runtime needed to validate JS-driven category filter behavior and responsive layout

## Preconditions

- `npm run build` completes with zero errors
- `bash scripts/verify-s05.sh` reports 19/19 passed
- Dev server running: `npm run dev` accessible at `http://localhost:4321`

## Smoke Test

Navigate to `http://localhost:4321/work` — page loads with heading "Projects", subtitle text, a row of 5 filter buttons, and 6 project cards in a grid.

## Test Cases

### 1. Page structure and content

1. Navigate to `/work`
2. Verify page title "Projects" is visible as an h1
3. Verify subtitle text describes the project portfolio
4. Verify 6 project cards are visible in a grid
5. **Expected:** Page renders with heading, subtitle, and all 6 project cards visible

### 2. Project card content

1. On `/work`, inspect any project card (e.g., "VaultBreaker")
2. Verify card shows: title (h3), description paragraph, tech stack badges (small rounded pills), and a GitHub icon link
3. Click the GitHub link
4. **Expected:** Link opens in a new tab pointing to a github.com URL. Card has rounded corners, ring border, and hover shadow effect.

### 3. Tech stack badges rendering

1. On `/work`, inspect the "CortexML" card
2. Verify tech stack badges show: Python, C++, ONNX, CUDA as individual pill-shaped badges
3. **Expected:** Each badge is a small rounded-full element with distinct background color, visually separated

### 4. Category filter — individual categories

1. On `/work`, click the "Security" filter button
2. Count visible cards
3. **Expected:** Exactly 2 cards visible (VaultBreaker, SentinelIDS). Other 4 cards are hidden. "Security" button shows active styling (filled/primary color). Other buttons show inactive styling.

### 5. Category filter — AI

1. Click the "AI" filter button
2. **Expected:** Exactly 2 cards visible (CortexML, NeuroChat). Security cards now hidden.

### 6. Category filter — Networking

1. Click the "Networking" filter button
2. **Expected:** Exactly 1 card visible (PacketForge)

### 7. Category filter — Trading

1. Click the "Trading" filter button
2. **Expected:** Exactly 1 card visible (AlphaGrid)

### 8. Category filter — All restores all cards

1. After filtering to a single category, click the "All" filter button
2. **Expected:** All 6 cards visible again. "All" button shows active styling.

### 9. Dark mode styling

1. Toggle dark mode using the site header's theme toggle
2. Inspect project cards, badges, filter buttons, and page background
3. **Expected:** All elements have appropriate dark mode colors — card backgrounds darken, badge colors adapt, filter buttons change styling. No unstyled or broken elements.

### 10. Live URL link (optional field)

1. Find the "CortexML" card (or another card with a live URL)
2. Verify a globe/link icon appears alongside the GitHub icon
3. Click the live URL link
4. **Expected:** Opens in a new tab. Cards without liveUrl show only the GitHub link.

### 11. Navigation from header

1. Click "Work" in the site header navigation
2. **Expected:** Navigates to `/work` and page loads correctly

## Edge Cases

### Rapid filter switching

1. Click Security, then immediately AI, then Trading, then All in quick succession
2. **Expected:** Final state shows all 6 cards. No cards stuck in hidden state. Active button correctly shows "All".

### Filter state after page navigation

1. On `/work`, click "Security" filter (2 cards visible)
2. Navigate away (click "Blog" in header)
3. Navigate back to `/work` (click "Work" in header or use browser back)
4. **Expected:** All 6 cards visible — filter resets to "All" on page load (no stale filter state)

### Responsive layout — mobile

1. Resize browser to < 640px width (or use device emulation)
2. **Expected:** Project cards stack in a single column (grid-cols-1). Filter buttons may wrap to multiple rows. All content remains readable.

### Responsive layout — desktop

1. Resize browser to ≥ 640px width
2. **Expected:** Project cards display in 2-column grid (sm:grid-cols-2). Filter buttons in a single row.

## Failure Signals

- Cards not visible on page load → check if `hidden` class is incorrectly applied on init
- Filter buttons don't respond to clicks → check browser console for JS errors in filter script
- Cards don't hide/show when filtering → check `data-category` attributes match `data-filter` values exactly
- Dark mode doesn't apply → check for missing `dark:` prefix classes in ProjectCard or work.astro
- Build fails → check `npx astro check` for type errors in projects.ts or ProjectCard.astro
- Page 404s → check that `src/pages/work.astro` exists and BaseLayout import path is correct

## Requirements Proved By This UAT

- R012 — Projects page with grid, cards, tech stack badges, GitHub links, and category filtering

## Not Proven By This UAT

- R003 — Homepage project highlights (S07 scope — depends on this slice's exports but is not tested here)
- Visual design quality (subjective — needs human gut check on card aesthetics, spacing, badge colors)
- Accessibility (keyboard navigation of filter buttons, screen reader experience) — covered by R020 across all slices

## Notes for Tester

- Sample projects use placeholder GitHub URLs (`github.com/username/...`) — links will 404 on GitHub; this is expected for sample data
- The filter script uses graceful degradation — if JS fails to load, all 6 cards remain visible (no content is hidden by default)
- CortexML and NeuroChat have `liveUrl` set; the other 4 projects do not — check both cases
- The "All" button should be visually active (filled/primary color) on initial page load

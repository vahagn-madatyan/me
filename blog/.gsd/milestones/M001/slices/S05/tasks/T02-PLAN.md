---
estimated_steps: 5
estimated_files: 2
---

# T02: Build work page with category filter and verification script

**Slice:** S05 — Projects Page
**Milestone:** M001

## Description

Create the `/work` page that imports project data, renders a category filter and responsive card grid, and wire up client-side filtering with a vanilla JS island. Also write the `verify-s05.sh` build output verification script. This task delivers the complete user-visible feature for R012.

**Relevant installed skill:** `frontend-design` — load if you need design guidance for filter button styling or page layout.

## Steps

1. Create `src/pages/work.astro`:
   - Import `BaseLayout` from `../components/BaseLayout.astro`
   - Import `ProjectCard` from `../components/ProjectCard.astro`
   - Import `projects` from `../data/projects.ts`
   - Wrap in `<BaseLayout title="Work" description="Projects and experiments">`
   - Page heading: `<h1>` with "Work" or "Projects" — styled like existing page headings (`text-3xl font-bold text-secondary-900 dark:text-secondary-100`)
   - Optional subtitle paragraph below heading

2. Add category filter buttons:
   - Derive unique categories from the data (or hardcode the 4 known ones + "All")
   - Render as a row of buttons: `<div class="flex flex-wrap gap-2 mb-8">`
   - Each button: `<button data-filter="all|security|ai|networking|trading" class="...">`
   - Button styling: `rounded-full px-4 py-1.5 text-sm font-medium transition-colors`
   - Inactive: `bg-secondary-100 text-secondary-600 hover:bg-secondary-200 dark:bg-secondary-800 dark:text-secondary-400 dark:hover:bg-secondary-700`
   - Active: `bg-primary-500 text-white` (or similar high-contrast active state)
   - "All" button starts active

3. Render project grid:
   - `<div class="grid grid-cols-1 sm:grid-cols-2 gap-6" id="projects-grid">`
   - Map over `projects` array, wrapping each `<ProjectCard>` in a `<div data-category={project.category}>` wrapper
   - Spread project props into ProjectCard

4. Add client-side filter script (vanilla JS island pattern):
   - `<script>` tag at end of page (module script, same pattern as ThemeToggle)
   - `initFilter()` function:
     - Select all `[data-filter]` buttons and all `[data-category]` card wrappers
     - Set "All" button as active (add active classes, remove inactive classes)
     - Bind click handler to each filter button:
       - Read `data-filter` value from clicked button
       - If "all": remove `hidden` from all card wrappers
       - Else: add `hidden` to wrappers whose `data-category` doesn't match, remove `hidden` from matches
       - Update button active/inactive styling (remove active from all, add to clicked)
   - Call `initFilter()` immediately
   - Add `document.addEventListener('astro:after-swap', initFilter)` for view transition re-init
   - **Important:** Only toggle the `hidden` class — it's always present in Tailwind and won't be purged. Don't use dynamically-constructed class names.

5. Create `scripts/verify-s05.sh`:
   - Run `npm run build` first
   - Check `dist/work/index.html` exists
   - Check it contains at least one project title from sample data
   - Check for tech stack badge markup (look for pill class patterns)
   - Check for GitHub link (`github.com`)
   - Check for filter buttons: look for `data-filter` attributes with "all", "security", "ai", "networking", "trading"
   - Check for `data-category` attributes on card wrappers
   - Check for dark mode classes (`dark:`)
   - Check for responsive grid classes (`grid-cols-1`, `sm:grid-cols-2`)
   - Check for `astro:after-swap` in the script
   - Print pass/fail counts like `verify-s01.sh` does

## Must-Haves

- [ ] `/work` page renders in dev server with project cards in responsive grid
- [ ] Category filter buttons (All + 4 categories) are visible and functional
- [ ] Clicking a category shows only matching projects; clicking "All" shows all
- [ ] Active filter button has distinct visual styling from inactive buttons
- [ ] Filter re-initializes on view transitions via `astro:after-swap`
- [ ] `npm run build` completes with zero errors
- [ ] `bash scripts/verify-s05.sh` passes all checks

## Verification

- `npm run build` — zero errors
- `bash scripts/verify-s05.sh` — all checks pass
- Dev server: navigate to `/work`, visually confirm cards render, click filter buttons to verify they work

## Inputs

- `src/data/projects.ts` — project data array and interface (from T01)
- `src/components/ProjectCard.astro` — card component (from T01)
- `src/components/BaseLayout.astro` — page wrapper (from S01)
- `src/components/ThemeToggle.astro` — reference for vanilla JS island pattern (init function + `astro:after-swap`)

## Expected Output

- `src/pages/work.astro` — new page with category filter, responsive project grid, client JS island
- `scripts/verify-s05.sh` — new build verification script (~10 checks)

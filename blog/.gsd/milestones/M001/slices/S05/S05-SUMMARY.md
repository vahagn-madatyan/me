---
id: S05
parent: M001
milestone: M001
provides:
  - /work page with responsive project grid and client-side category filtering
  - Project TypeScript interface and 6-entry typed data array (src/data/projects.ts)
  - ProjectCard.astro reusable component with dark mode, tech stack badges, GitHub/Live links
  - Category filter vanilla JS island with astro:after-swap support
  - verify-s05.sh build verification script (19 checks)
requires:
  - slice: S01
    provides: BaseLayout.astro page wrapper, Tailwind theme tokens from global.css
affects:
  - S07
key_files:
  - src/data/projects.ts
  - src/components/ProjectCard.astro
  - src/pages/work.astro
  - scripts/verify-s05.sh
key_decisions:
  - D024 — ProjectCard uses individual props (not Project type) — keeps component decoupled, same pattern as BlogCard
  - D025 — Categories derived dynamically from project data via Set — auto-adapts when projects.ts changes
  - Filter uses onclick assignment (not addEventListener) for safe HMR + view transition re-init, matching ThemeToggle pattern (D013)
  - Active/inactive button styling uses explicit class lists toggled by JS — Tailwind-safe (no dynamic class construction)
patterns_established:
  - Project data lives in src/data/ as a typed array export — pattern for any future static data files
  - Category filter via data-attributes (data-filter on buttons, data-category on wrappers) + hidden class toggle
  - Vanilla JS island for client interactivity: init function + astro:after-swap listener + onclick assignment
observability_surfaces:
  - scripts/verify-s05.sh — 19 structural checks on build output
  - dist/work/index.html — presence confirms page compiles
  - Browser console errors — filter script failures surface here; if script fails all cards remain visible (graceful degradation)
drill_down_paths:
  - .gsd/milestones/M001/slices/S05/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S05/tasks/T02-SUMMARY.md
duration: ~23m
verification_result: passed
completed_at: 2026-03-16
---

# S05: Projects Page

**Shipped /work page with 6 project cards across 4 categories, client-side category filter, responsive grid, dark mode, and reusable ProjectCard component + typed data export for S07 consumption.**

## What Happened

Built the projects page in two tasks. T01 created the data layer and card component: a TypeScript `Project` interface with a 4-value union type for categories (`"security" | "ai" | "networking" | "trading"`), 6 sample projects with realistic descriptions and tech stacks, and a `ProjectCard.astro` component following BlogCard's visual patterns (rounded-2xl, ring border, group hover, dark mode variants). Tech stacks render as small pill badges, and each card has a GitHub icon link plus optional live URL link.

T02 assembled the /work page and verification: a BaseLayout-wrapped page with heading, subtitle, dynamically-derived category filter buttons (All + 4 categories via Set), and a responsive `grid-cols-1 sm:grid-cols-2` grid of ProjectCards. Each card sits in a `data-category` wrapper div. The filter uses the established vanilla JS island pattern — `initFilter()` runs on load and re-binds on `astro:after-swap`. Button clicks toggle `hidden` on non-matching wrappers and swap active/inactive CSS classes. A 19-check verification script validates all structural elements in the build output.

## Verification

- `npm run build` — zero errors, 20 pages built ✓
- `bash scripts/verify-s05.sh` — 19/19 checks passed ✓
  - /work/index.html exists in build output
  - Project titles (VaultBreaker, CortexML) present
  - Tech stack badge markup (rounded-full pills)
  - GitHub links present
  - All 5 data-filter buttons (all, security, ai, networking, trading)
  - All 4 data-category wrappers present
  - Dark mode classes on cards and badges
  - Responsive grid classes (grid-cols-1, sm:grid-cols-2)
  - astro:after-swap listener in filter script
- Dev server visual verification confirmed: each filter button correctly shows/hides cards, active button styling toggles, All restores all 6 cards

## Requirements Advanced

- R003 — S05 provides ProjectCard.astro and projects data that S07 will import for homepage project highlights section
- R012 — Fully delivered: /work page with project grid, tech stack badges, GitHub links, and category filtering

## Requirements Validated

- R012 — /work page renders responsive 2-column grid of 6 project cards across 4 categories. Each card shows title, description, tech stack badges, and GitHub link. Client-side category filter with 5 buttons toggles visibility via data-category attributes. Dark mode on all elements. Proof: npm run build zero errors + scripts/verify-s05.sh 19/19 checks passed.

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- Installed `@astrojs/check` and `typescript` as devDependencies in T01 — required for `npx astro check` verification step; not in original plan but necessary for type checking

## Known Limitations

- Sample projects use placeholder GitHub URLs (`github.com/username/...`) — must be replaced with real repo URLs before launch
- No project images — the `image?` field exists on the interface but no sample projects use it; ProjectCard doesn't render images (text-only cards)
- Category order in filter buttons is insertion-order from Set — not alphabetically sorted or manually ordered

## Follow-ups

- S07 must import `ProjectCard` and `projects` data for homepage highlights section — this is the primary downstream dependency
- Replace placeholder GitHub URLs with real repos before M002 deployment

## Files Created/Modified

- `src/data/projects.ts` — **new** Project interface + 6-entry typed projects array
- `src/components/ProjectCard.astro` — **new** project card component with dark mode, badges, links
- `src/pages/work.astro` — **new** /work page with category filter, responsive grid, JS island
- `scripts/verify-s05.sh` — **new** build verification script with 19 checks

## Forward Intelligence

### What the next slice should know
- `ProjectCard.astro` accepts individual props (`title`, `description`, `category`, `techStack`, `githubUrl`, `liveUrl?`) — import and spread from `projects` array entries. The component is fully self-contained with its own dark mode styling.
- `import { projects, type Project } from '../data/projects'` gives you both the data and the type. Filter with `.filter()` or `.slice()` for homepage highlights.
- The vanilla JS island pattern (init function + `astro:after-swap` + onclick assignment) is now used in ThemeToggle, CopyButton, and the category filter — it's the established pattern for any new client interactivity.

### What's fragile
- Category filter relies on `data-category` attributes matching exact category string values from `projects.ts` — if someone adds a category with special characters or spaces, the filter selector `[data-category="${cat}"]` could break.
- ProjectCard has no image rendering — if S07 wants image thumbnails in homepage highlights, it would need to build that into its own layout since ProjectCard is text-only.

### Authoritative diagnostics
- `bash scripts/verify-s05.sh` — run after any change to work.astro, ProjectCard, or projects.ts; covers all 19 structural invariants
- `npx astro check` — catches type errors in Project interface and component props; note: 17 pre-existing errors in other files are expected (blog pagination, OG image, sitemap, content config)

### What assumptions changed
- Plan estimated 4-6 projects — we went with 6 (2 security, 2 AI, 1 networking, 1 trading), which provides better visual density for the 2-column grid
- Plan mentioned "following BlogCard visual patterns" — this worked well; the same rounded-2xl + ring-1 + group hover pattern creates visual consistency

# S05: Projects Page

**Goal:** /work page shows project cards with GitHub links, tech stack badges, and client-side category filtering — with data and card component exported for S07 homepage consumption.
**Demo:** Navigate to /work in dev server → see responsive grid of project cards across 4 categories → click category filter buttons to show/hide cards → click "All" to restore → each card shows title, description, tech stack badges, GitHub link → works in dark mode → single column on mobile, two columns on sm+.

## Must-Haves

- TypeScript interface and sample project data exported from `src/data/projects.ts` (4-6 projects across all 4 categories: security, AI, networking, trading)
- `ProjectCard.astro` component with title, description, tech stack badges, GitHub link, optional live URL — following BlogCard visual patterns
- `/work` page wrapping in BaseLayout with responsive grid of project cards
- Client-side category filter using vanilla JS island pattern (init + `astro:after-swap`) toggling `hidden` class via `data-category` attributes
- Dark mode styling on all elements (cards, badges, filter buttons)
- Clean exports so S07 can import `ProjectCard.astro` and project data

## Verification

- `npm run build` completes with zero errors
- `bash scripts/verify-s05.sh` passes all checks:
  - `/work/index.html` exists in build output
  - Page contains project card content (title text from sample data)
  - Tech stack badge markup present
  - GitHub link(s) present
  - Category filter buttons present (All, Security, AI, Networking, Trading)
  - `data-category` attributes on card wrappers
  - Dark mode classes present on cards and badges
  - Responsive grid classes present (`grid-cols-1`, `sm:grid-cols-2`)
  - Filter script with `astro:after-swap` listener present

## Integration Closure

- Upstream surfaces consumed: `BaseLayout.astro` (page wrapper), Tailwind theme tokens from `global.css`, BlogCard visual patterns (reference only)
- New wiring introduced in this slice: `src/data/projects.ts` data export + `ProjectCard.astro` component — both consumed by S07
- What remains before the milestone is truly usable end-to-end: S07 must import ProjectCard and project data for homepage highlights

## Tasks

- [x] **T01: Create project data file and ProjectCard component** `est:30m`
  - Why: Establishes the data model and reusable card component — the boundary contract S07 depends on
  - Files: `src/data/projects.ts`, `src/components/ProjectCard.astro`
  - Do: Define TypeScript `Project` interface with title, description, category (union type), techStack (string[]), githubUrl, liveUrl?, image?. Create 4-6 sample projects across all 4 categories. Build ProjectCard following BlogCard's visual structure — rounded-2xl, ring border, group hover, dark mode variants, tech stack as small pill badges, GitHub icon link, optional live URL link.
  - Verify: `npx astro check` passes with no type errors on new files
  - Done when: `src/data/projects.ts` exports both the `Project` interface and `projects` array, and `ProjectCard.astro` renders a single project with all visual elements

- [ ] **T02: Build work page with category filter and verification script** `est:40m`
  - Why: Delivers the user-visible /work page with interactive category filtering — the core of R012
  - Files: `src/pages/work.astro`, `scripts/verify-s05.sh`
  - Do: Create work page wrapped in BaseLayout, import project data, render category filter buttons (All + 4 categories) above a responsive grid (`grid-cols-1 sm:grid-cols-2`) of ProjectCards. Each card wrapper gets `data-category` attribute. Filter uses vanilla JS island pattern: init function sets "All" active, click handlers toggle `hidden` on non-matching cards and update active button styling. Add `astro:after-swap` listener for view transition re-init. Write `scripts/verify-s05.sh` with build output checks.
  - Verify: `npm run build` zero errors, `bash scripts/verify-s05.sh` all checks pass
  - Done when: `/work` renders in dev server with working category filter, responsive grid, dark mode styling, and verification script passes

## Observability / Diagnostics

- **Build-time signals:** `npm run build` emits zero errors; `npx astro check` reports no type errors on new files. Build output includes `/work/index.html` with expected markup.
- **Inspection surfaces:** `scripts/verify-s05.sh` validates build output for all structural elements (cards, badges, links, filter buttons, data-category attributes, dark mode classes, responsive grid classes, filter script with `astro:after-swap`).
- **Runtime failure visibility:** Category filter uses vanilla JS — if script fails to load or execute, all cards remain visible (graceful degradation). No hidden state on initial render. Console errors from filter script indicate wiring failure.
- **Redaction constraints:** No secrets or user data in this slice — sample project data uses placeholder GitHub URLs.

## Files Likely Touched

- `src/data/projects.ts` — **new** TypeScript interface + sample project data
- `src/components/ProjectCard.astro` — **new** project card component
- `src/pages/work.astro` — **new** projects page with grid + filter
- `scripts/verify-s05.sh` — **new** build output verification script

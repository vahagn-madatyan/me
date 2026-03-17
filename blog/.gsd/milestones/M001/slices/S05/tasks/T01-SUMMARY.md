---
id: T01
parent: S05
milestone: M001
provides:
  - Project TypeScript interface with 4-category union type
  - projects data array with 6 sample entries covering all 4 categories
  - ProjectCard.astro reusable component with dark mode, badges, GitHub/Live links
key_files:
  - src/data/projects.ts
  - src/components/ProjectCard.astro
key_decisions:
  - Props are individual fields (decoupled from Project type) matching BlogCard pattern
  - 6 sample projects (2 security, 2 AI, 1 networking, 1 trading) — exceeds minimum of 4
patterns_established:
  - Project data lives in src/data/ as a typed array export, same pattern as any future data files
  - ProjectCard accepts individual props, not the whole Project type — keeps component decoupled
observability_surfaces:
  - Build-time only: npx astro check catches type errors in interface/props; npm run build catches render errors
duration: 8m
verification_result: passed
completed_at: 2026-03-16
blocker_discovered: false
---

# T01: Create project data file and ProjectCard component

**Shipped `Project` interface, 6-entry data array, and `ProjectCard.astro` card component with dark mode, tech stack badges, and GitHub/Live links.**

## What Happened

Created two files per plan:

1. `src/data/projects.ts` — Exported `Project` interface with exact union type `"security" | "ai" | "networking" | "trading"` and a `projects` array of 6 entries. Two security (VaultBreaker, SentinelIDS), two AI (CortexML, NeuroChat), one networking (PacketForge), one trading (AlphaGrid). Three projects include optional `liveUrl`. Realistic descriptions for a security/AI/networking/trading developer.

2. `src/components/ProjectCard.astro` — Follows BlogCard visual patterns exactly: `rounded-2xl`, `ring-1 ring-secondary-200`, `group` hover with `hover:shadow-lg hover:ring-primary-300`, dark mode variants on all elements. Props are individual fields (not Project type). Renders h3 title, description paragraph, tech stack badges as `<span>` pills with `rounded-full bg-primary-100` styling, and a bottom row with GitHub SVG icon link + optional globe icon Live link. Both links use `target="_blank" rel="noopener noreferrer"`.

Installed `@astrojs/check` and `typescript` as devDependencies to enable `npx astro check`.

## Verification

- `npx astro check`: 17 pre-existing errors in other files, **zero errors** in `projects.ts` or `ProjectCard.astro`
- `npm run build`: completes successfully (19 pages built in 3.23s, zero errors)
- Category coverage: confirmed all 4 categories present via `grep -oE '"(security|ai|networking|trading)"'`
- Project count: 6 entries (exceeds minimum of 4)
- Dark mode: 6 `dark:` class usages in ProjectCard
- External links: 2 `target="_blank"` + 2 `rel="noopener noreferrer"` (GitHub + optional Live)
- Slice-level: `scripts/verify-s05.sh` does not exist yet (T02 deliverable) — expected partial pass

## Diagnostics

- Type safety: `npx astro check` covers both the interface and component props — any future type drift surfaces immediately
- Data inspection: read `src/data/projects.ts` and check `projects.length` and category coverage
- Render errors: `npm run build` will fail with file/line reference if ProjectCard has template issues

## Deviations

- Installed `@astrojs/check` and `typescript` as devDependencies — required for `npx astro check` verification step; not called out in plan but necessary

## Known Issues

- 17 pre-existing type errors in other files (blog pagination, OG image, sitemap config, content config) — unrelated to this task

## Files Created/Modified

- `src/data/projects.ts` — **new** Project interface + 6-entry projects array
- `src/components/ProjectCard.astro` — **new** project card component with full visual implementation
- `.gsd/milestones/M001/slices/S05/S05-PLAN.md` — added Observability / Diagnostics section
- `.gsd/milestones/M001/slices/S05/tasks/T01-PLAN.md` — added Observability Impact section

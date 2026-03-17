---
id: T02
parent: S05
milestone: M001
provides:
  - /work page with responsive project grid and client-side category filtering
  - verify-s05.sh build verification script (19 checks)
key_files:
  - src/pages/work.astro
  - scripts/verify-s05.sh
key_decisions:
  - Categories derived dynamically from data via Set, not hardcoded — auto-adapts when projects.ts changes
  - Filter uses onclick assignment (not addEventListener) for safe HMR + view transition re-init, matching ThemeToggle pattern
  - Active/inactive button styling uses explicit class lists toggled by JS — no dynamic class name construction (Tailwind-safe)
patterns_established:
  - Vanilla JS island for client interactivity: init function + astro:after-swap listener + onclick assignment
  - Category filter via data-attributes (data-filter on buttons, data-category on wrappers) + hidden class toggle
observability_surfaces:
  - scripts/verify-s05.sh — 19 structural checks on build output
  - dist/work/index.html — presence confirms page compiles
  - Browser console errors — filter script failures surface here; graceful degradation shows all cards
duration: ~15m
verification_result: passed
completed_at: 2026-03-16
blocker_discovered: false
---

# T02: Build work page with category filter and verification script

**Shipped /work page with 5 category filter buttons, responsive 2-column project grid, vanilla JS filter island, and 19-check verification script.**

## What Happened

Created `src/pages/work.astro` wrapping in BaseLayout with heading, subtitle, category filter buttons (All + 4 categories derived from data), and a responsive grid of ProjectCards. Each card sits in a `data-category` wrapper div. The filter script follows the ThemeToggle vanilla JS island pattern: `initFilter()` runs on load and re-binds on `astro:after-swap`. Button clicks toggle `hidden` on non-matching wrappers and swap active/inactive CSS classes. Created `scripts/verify-s05.sh` with 19 build-output checks covering all slice verification criteria.

## Verification

- `npm run build` — zero errors ✓
- `bash scripts/verify-s05.sh` — 19/19 passed ✓
  - /work/index.html exists
  - Project titles (VaultBreaker, CortexML) present
  - Tech stack badge markup (rounded-full pills)
  - GitHub links
  - All 5 data-filter buttons (all, security, ai, networking, trading)
  - All 4 data-category wrappers
  - Dark mode classes
  - Responsive grid classes (grid-cols-1, sm:grid-cols-2)
  - astro:after-swap listener
- Dev server visual verification:
  - Page renders at /work with correct heading, subtitle, filter row, 6 project cards in 2-column grid
  - Security filter: only VaultBreaker + SentinelIDS visible ✓
  - AI filter: only CortexML + NeuroChat visible ✓
  - Networking filter: only PacketForge visible ✓
  - Trading filter: only AlphaGrid visible ✓
  - All filter: all 6 cards visible ✓
  - Active button shows bg-primary-500 text-white; inactive buttons show bg-secondary-100 ✓

### Slice-level verification (final task — all must pass):
- [x] `npm run build` completes with zero errors
- [x] `bash scripts/verify-s05.sh` passes all checks (19/19)
- [x] /work/index.html exists in build output
- [x] Page contains project card content
- [x] Tech stack badge markup present
- [x] GitHub links present
- [x] Category filter buttons present (All, Security, AI, Networking, Trading)
- [x] data-category attributes on card wrappers
- [x] Dark mode classes present
- [x] Responsive grid classes present
- [x] Filter script with astro:after-swap listener present

## Diagnostics

- Run `bash scripts/verify-s05.sh` to validate all 19 structural checks on build output
- Check `dist/work/index.html` exists after `npm run build` to confirm page compiles
- In dev server, open browser console — any filter script errors surface there; if script fails, all cards remain visible (graceful degradation)
- To test filter correctness interactively: click each filter button and verify correct cards show/hide

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/pages/work.astro` — new /work page with category filter, responsive project grid, and client-side JS filter island
- `scripts/verify-s05.sh` — new build verification script with 19 checks
- `.gsd/milestones/M001/slices/S05/tasks/T02-PLAN.md` — added Observability Impact section per pre-flight fix
- `.gsd/milestones/M001/slices/S05/S05-PLAN.md` — marked T02 as done

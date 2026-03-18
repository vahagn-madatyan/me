---
id: T02
parent: S07
milestone: M001
provides:
  - Branded 404 page with BaseLayout wrapper, visual "404" display, friendly message, and home CTA
  - Comprehensive S07 verification script (23 checks including S01/S02/S05 upstream regressions)
key_files:
  - src/pages/404.astro
  - scripts/verify-s07.sh
key_decisions:
  - Matched 404 page container layout (max-w-3xl, py-20, text-center) to homepage hero for visual consistency
patterns_established:
  - Verification scripts build the project first, then run all slice-specific checks, then invoke upstream regression scripts
observability_surfaces:
  - dist/404.html — grep for "404", "Page not found", href="/" to confirm page renders
  - bash scripts/verify-s07.sh — 23 checks covering homepage sections, 404 page, and S01/S02/S05 regressions; exit code 0 = all pass
duration: 8m
verification_result: passed
completed_at: 2026-03-17T22:14:00-07:00
blocker_discovered: false
---

# T02: Add custom 404 page and build verification script

**Created branded 404 page with large muted "404" display, friendly message, and primary-styled "Back to Home" CTA; wrote verify-s07.sh covering 23 checks across homepage, 404, and upstream regressions — all passing.**

## What Happened

Created `src/pages/404.astro` wrapped in BaseLayout with a large muted "404" number (text-8xl/text-9xl in secondary-300/700 for dark mode), a "Page not found" heading, a friendly explanatory message, and a primary-styled "Back to Home" button linking to `/`. The layout mirrors the homepage hero section's container (`max-w-3xl`, centered, `py-20`) for visual consistency.

Wrote `scripts/verify-s07.sh` with 23 total checks organized in 10 sections: homepage existence, hero content, featured blog posts with reading time, project highlights with tech badges, navigation links, newsletter form, 404 page content, and S01/S02/S05 upstream regressions. The script follows the same pattern as prior verification scripts (build first, then grep assertions with pass/fail counter).

Also fixed the pre-flight observability gap by adding an `## Observability Impact` section to `T02-PLAN.md`.

## Verification

- `bash scripts/verify-s07.sh` — 23/23 checks pass (exit 0)
- `test -f dist/404.html` — exists (14804 bytes)
- `grep -q '404' dist/404.html` — present
- `grep -q 'href="/"' dist/404.html` — present
- `npm run build` — 22 pages built in 1.40s, zero errors

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `bash scripts/verify-s07.sh` | 0 | ✅ pass | ~5s |
| 2 | `test -f dist/404.html` | 0 | ✅ pass | <1s |
| 3 | `grep -q '404' dist/404.html` | 0 | ✅ pass | <1s |
| 4 | `grep -q 'href="/"' dist/404.html` | 0 | ✅ pass | <1s |
| 5 | `npm run build` | 0 | ✅ pass | 1.4s |
| 6 | `bash scripts/verify-s01.sh` | 0 | ✅ pass | <1s |
| 7 | `bash scripts/verify-s02.sh` | 0 | ✅ pass | ~3s |
| 8 | `bash scripts/verify-s05.sh` | 0 | ✅ pass | ~3s |

## Diagnostics

- **404 page inspection:** `grep -c '404' dist/404.html` — confirms 404 text rendered; `grep 'Back to Home' dist/404.html` confirms CTA present
- **Verification script:** `bash scripts/verify-s07.sh` — shows per-check pass/fail output with section grouping; non-zero exit on any failure
- **Build output:** `npm run build` — 22 pages; `dist/404.html` and `dist/index.html` both present

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/pages/404.astro` — new: branded 404 page with BaseLayout wrapper, large "404" display, heading, message, and home link CTA
- `scripts/verify-s07.sh` — new: S07 build verification script (23 checks covering homepage, 404, upstream regressions)
- `.gsd/milestones/M001/slices/S07/tasks/T02-PLAN.md` — modified: added missing Observability Impact section

---
id: T01
parent: S07
milestone: M001
provides:
  - Full homepage with hero, featured blog posts, project highlights, and newsletter CTA
  - NewsletterForm.astro visual-only component
key_files:
  - src/pages/index.astro
  - src/components/NewsletterForm.astro
key_decisions:
  - Used max-w-5xl for card grid sections (matching blog listing width) while keeping hero at max-w-3xl for visual hierarchy
  - Featured posts fallback fills from latest non-featured posts sorted by date descending
patterns_established:
  - Homepage data queries computed in Astro frontmatter (getCollection + getReadingTime), not passed as props from parent
  - Section layout pattern: heading + "View all →" link, followed by responsive grid of cards
observability_surfaces:
  - Build output: grep dist/index.html for section markers (hero name, "min read", project titles, "Subscribe")
  - No runtime observability — all content statically rendered at build time
duration: 12m
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T01: Build complete homepage with hero, featured posts, and project highlights

**Rewrote index.astro into a full homepage with four sections (hero, featured posts via BlogCard, project highlights via ProjectCard, newsletter CTA) wired to real blog collection and project data.**

## What Happened

Created `NewsletterForm.astro` — a visual-only newsletter signup with email input and Subscribe button, no form action, no JavaScript (per D008). Then rewrote `index.astro` with four sections:

1. **Hero** — "Vahagn Grigoryan" heading, SITE_DESCRIPTION tagline, "Read the Blog" + "About Me" CTAs (preserved from original)
2. **Latest Writing** — queries blog collection, filters drafts in prod, sorts by date, takes 1 featured post + 2 latest non-featured as backfill to reach 3 cards, computes reading time via `getReadingTime(post.body ?? '')`, renders via BlogCard
3. **Featured Work** — imports first 4 projects from `projects.ts`, renders via ProjectCard in a 2-column grid with tech badges and GitHub/Live links
4. **Newsletter CTA** — drops in NewsletterForm component at the bottom

The featured-posts fallback logic correctly handles the case where only 1 post has `featured: true` (building-a-developer-blog) by filling the remaining 2 slots with the next most recent non-featured posts (mastering-typescript-patterns, markdown-style-guide).

## Verification

- `npm run build` — zero errors, 21 pages generated
- All 7 task-level grep checks pass against dist/index.html (hero name, min read, featured slug, GitHub links, newsletter, project titles)
- NewsletterForm has no `action` attribute and no `<script>` tags
- 3 instances of "min read" confirmed in build output (3 BlogCards rendered)
- All Tailwind classes are static (no class:list or dynamic construction)
- Browser assertions: 12/12 pass — all text visible, email input rendered, no console errors
- Visual inspection confirmed responsive layout, dark mode readiness, and section spacing

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 1.3s |
| 2 | `grep -q 'Vahagn Grigoryan' dist/index.html` | 0 | ✅ pass | <1s |
| 3 | `grep -q 'min read' dist/index.html` | 0 | ✅ pass | <1s |
| 4 | `grep -q 'building-a-developer-blog' dist/index.html` | 0 | ✅ pass | <1s |
| 5 | `grep -qi 'github' dist/index.html` | 0 | ✅ pass | <1s |
| 6 | `grep -qi 'subscribe\|newsletter\|email' dist/index.html` | 0 | ✅ pass | <1s |
| 7 | `grep -qi 'VaultBreaker\|CortexML\|PacketForge\|AlphaGrid' dist/index.html` | 0 | ✅ pass | <1s |
| 8 | `bash scripts/verify-s01.sh` | 0 | ✅ pass (19/19) | 2.4s |
| 9 | `bash scripts/verify-s02.sh` | 0 | ✅ pass (22/22) | 2.3s |
| 10 | `bash scripts/verify-s05.sh` | 0 | ✅ pass (19/19) | 17.2s |
| 11 | Browser assertions (12 checks) | — | ✅ pass (12/12) | — |

## Diagnostics

- **Build output inspection:** `grep -c 'min read' dist/index.html` should return 3 (one per featured BlogCard)
- **Project cards:** `grep -c 'github.com/username' dist/index.html` should return 4 (one per highlighted project)
- **Newsletter form:** `grep 'type="email"' dist/index.html` confirms email input rendered
- **No runtime diagnostics needed** — all content is statically rendered at build time

## Deviations

None — implementation matches the task plan exactly.

## Known Issues

None.

## Files Created/Modified

- `src/components/NewsletterForm.astro` — new: visual-only newsletter signup form (email input + Subscribe button, no action, no JS)
- `src/pages/index.astro` — rewritten: full homepage with hero, featured blog posts (BlogCard), project highlights (ProjectCard), and newsletter CTA wired to real data
- `.gsd/milestones/M001/slices/S07/S07-PLAN.md` — added Observability / Diagnostics section
- `.gsd/milestones/M001/slices/S07/tasks/T01-PLAN.md` — added Observability Impact section

---
id: S07
parent: M001
milestone: M001
provides:
  - Complete homepage with hero, featured blog posts, project highlights, and newsletter CTA
  - Visual-only NewsletterForm component (email input + Subscribe button, no action, no JS)
  - Custom branded 404 page matching site design
  - S07 build verification script (23 checks)
requires:
  - slice: S01
    provides: BaseLayout.astro, Tailwind theme, dark mode
  - slice: S02
    provides: Blog content collection, BlogCard.astro, getReadingTime()
  - slice: S05
    provides: ProjectCard.astro, projects.ts data
affects: []
key_files:
  - src/pages/index.astro
  - src/components/NewsletterForm.astro
  - src/pages/404.astro
  - scripts/verify-s07.sh
key_decisions:
  - Used max-w-5xl for card grid sections (matching blog listing width) while keeping hero at max-w-3xl for visual hierarchy
  - Featured posts fallback fills from latest non-featured posts sorted by date descending when fewer than 3 posts have featured:true
  - Matched 404 page container layout (max-w-3xl, py-20, text-center) to homepage hero for visual consistency
  - Newsletter form is visual-only with no action attribute and no script tags (D008)
patterns_established:
  - Homepage data queries computed in Astro frontmatter (getCollection + getReadingTime), not passed as props from parent
  - Section layout pattern for homepage — heading + "View all →" link, followed by responsive grid of cards
  - Verification scripts build the project first, then run all slice-specific checks, then invoke upstream regression scripts
observability_surfaces:
  - Build output: grep dist/index.html for section markers (hero name, "min read", project titles, "Subscribe")
  - Build output: grep dist/404.html for "404", "Page not found", href="/"
  - bash scripts/verify-s07.sh — 23 checks covering homepage, 404, and S01/S02/S05 regressions; exit 0 = all pass
  - No runtime observability — all content statically rendered at build time
drill_down_paths:
  - .gsd/milestones/M001/slices/S07/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S07/tasks/T02-SUMMARY.md
duration: 20m
verification_result: passed
completed_at: 2026-03-17
---

# S07: Homepage & Polish

**Complete homepage with hero, featured blog posts from real collection data, project highlights from projects.ts, visual newsletter CTA, and branded 404 page — the final assembly making the full site navigable end-to-end.**

## What Happened

This slice was the final assembly step for the entire M001 milestone, bringing together upstream surfaces from S01 (BaseLayout, Tailwind theme), S02 (blog content collection, BlogCard, reading time), and S05 (ProjectCard, projects data) into the homepage — the first page that crosses both content boundaries.

**T01 (12m):** Rewrote `index.astro` with four sections: (1) hero with "Vahagn Grigoryan" heading, site tagline, and "Read the Blog" + "About Me" CTAs; (2) Latest Writing section querying blog collection — 1 featured post + 2 latest non-featured as backfill to reach 3 cards, rendered via BlogCard with reading time computed in frontmatter; (3) Featured Work section importing 4 projects from `projects.ts`, rendered via ProjectCard in a 2-column grid with tech badges and GitHub/Live links; (4) Newsletter CTA using a new `NewsletterForm.astro` component — visual-only email input + Subscribe button with no form action and no JavaScript (per D008).

**T02 (8m):** Created `404.astro` wrapped in BaseLayout with a large muted "404" number, "Page not found" heading, friendly message, and primary-styled "Back to Home" button. Wrote `verify-s07.sh` covering 23 checks across homepage sections, 404 page, and S01/S02/S05 upstream regressions.

Both tasks completed without deviations from the plan. Build produces 22 pages with zero errors.

## Verification

- `bash scripts/verify-s07.sh` — 23/23 checks pass (homepage existence, hero content, featured posts with reading time, project titles with tech badges, navigation links, newsletter form, 404 page content, S01/S02/S05 regressions)
- `npm run build` — zero errors, 22 pages generated in ~1.4s
- `bash scripts/verify-s01.sh` — 19/19 pass (upstream regression)
- `bash scripts/verify-s02.sh` — 22/22 pass (upstream regression)
- `bash scripts/verify-s05.sh` — 19/19 pass (upstream regression)
- Browser assertions: 12/12 pass (text visibility, email input, no console errors)
- 3 instances of "min read" in dist/index.html (3 BlogCards rendered)
- 4 GitHub links in dist/index.html (4 ProjectCards rendered)
- Newsletter form has no `action` attribute and no `<script>` tags

## Requirements Advanced

- R025 — Visual newsletter form delivered (NewsletterForm.astro); ready for M003 wiring to Buttondown/Beehiiv

## Requirements Validated

- R003 — Homepage with hero, featured blog posts (3 cards), project highlights (4 cards), and newsletter CTA all render from real data. Proof: scripts/verify-s07.sh checks 1-6 (23 total).
- R019 — Custom 404 page with branded design, "404" display, heading, message, and home link CTA. Proof: scripts/verify-s07.sh check 7 (5 sub-checks).

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

None — both tasks matched the plan exactly.

## Known Limitations

- Newsletter form is visual-only (D008) — no form action, no backend integration. Submitting the form does nothing until M003 wires it to a provider.
- Homepage featured posts section shows a maximum of 3 cards with a fixed fallback strategy (1 featured + 2 latest). No configuration for card count.

## Follow-ups

- M003: Wire NewsletterForm to Buttondown or Beehiiv with success/error handling and GDPR compliance (R025)
- M002: Deploy the complete site to Cloudflare Pages — all 22 pages are ready for production

## Files Created/Modified

- `src/pages/index.astro` — rewritten: full homepage with hero, featured blog posts (BlogCard), project highlights (ProjectCard), and newsletter CTA
- `src/components/NewsletterForm.astro` — new: visual-only newsletter signup form (email input + Subscribe button, no action, no JS)
- `src/pages/404.astro` — new: branded 404 page with BaseLayout, large "404" display, heading, message, and home link
- `scripts/verify-s07.sh` — new: S07 build verification script (23 checks including upstream regressions)

## Forward Intelligence

### What the next slice should know
- M001 is complete. All 7 page types render: home, blog list, blog post, projects (/work), about, architecture, 404. The site builds 22 pages with zero errors. The next work is M002 (deployment to Cloudflare Pages).
- The newsletter form at `src/components/NewsletterForm.astro` is a clean visual shell — add a form action and success/error handling in M003 without touching the HTML structure.

### What's fragile
- Featured posts logic assumes at least 1 post exists with `featured: true`. If all featured flags are removed, the fallback still works (fills all 3 slots from latest), but the section heading "Latest Writing" may not match user expectations if they expect curated content.
- Reading time computation uses `post.body ?? ''` — if Astro changes the body property name in a future version, homepage cards would show "1 min read" for everything.

### Authoritative diagnostics
- `bash scripts/verify-s07.sh` — 23 checks covering the entire homepage and 404, plus S01/S02/S05 regressions. Exit 0 = site is healthy.
- `grep -c 'min read' dist/index.html` — should return 3. If not, BlogCard rendering or reading time computation is broken.
- `npm run build` — must produce 22 pages. Any fewer means a page route is broken.

### What assumptions changed
- No assumptions changed — S07 was low-risk final assembly and executed exactly as planned.

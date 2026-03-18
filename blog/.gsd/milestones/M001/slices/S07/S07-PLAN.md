# S07: Homepage & Polish

**Goal:** Complete homepage with hero, featured blog posts, project highlights, and newsletter CTA, plus custom 404 page — the final assembly making the full site navigable.
**Demo:** `npm run build` succeeds; `dist/index.html` contains hero section, featured blog post cards with reading time, project highlight cards with tech badges, and newsletter signup form; `dist/404.html` exists with back-to-home link; all prior slice verification scripts still pass.

## Must-Haves

- Homepage hero with name, tagline, and CTA buttons (blog + about)
- Featured blog posts section: queries `featured: true` from blog collection, fills remaining slots with latest posts if <3 featured, renders via BlogCard with reading time
- Project highlights section: imports 3–4 projects from `projects.ts`, renders via ProjectCard
- Visual-only newsletter signup CTA: email input + submit button, no form action, no JS (D008)
- Custom 404 page matching site design with link back to home
- `npm run build` zero errors
- S01/S02/S05 regression scripts still pass

## Proof Level

- This slice proves: final-assembly
- Real runtime required: no (build output verification sufficient)
- Human/UAT required: yes (visual design quality of homepage layout)

## Verification

- `bash scripts/verify-s07.sh` — build verification covering homepage sections, 404, newsletter form, upstream regressions
- `npm run build` — zero errors, all pages generated
- `bash scripts/verify-s01.sh` — S01 regression (19 checks)
- `bash scripts/verify-s02.sh` — S02 regression (22 checks)
- `bash scripts/verify-s05.sh` — S05 regression (19 checks)

## Integration Closure

- Upstream surfaces consumed: `BlogCard.astro` (S02), `ProjectCard.astro` + `projects.ts` (S05), `getCollection('blog')` + `getReadingTime()` (S02), `BaseLayout.astro` (S01)
- New wiring introduced in this slice: homepage queries real blog collection data and imports real project data — first page that crosses both content boundaries
- What remains before the milestone is truly usable end-to-end: nothing — S07 is the final slice

## Tasks

- [x] **T01: Build complete homepage with hero, featured posts, and project highlights** `est:30m`
  - Why: The homepage is the critical deliverable — it's the only file with data dependencies crossing both blog collection and project data boundaries. It fulfills R003 (hero, featured posts, project highlights, newsletter CTA).
  - Files: `src/pages/index.astro`, `src/components/NewsletterForm.astro`
  - Do: Rewrite `index.astro` with four sections: (1) hero with name/tagline/CTAs matching current style, (2) featured posts queried from blog collection with `featured: true` fallback to latest if <3, rendered via BlogCard with reading time computed in frontmatter, (3) project highlights sliced from projects array rendered via ProjectCard, (4) newsletter CTA using a new NewsletterForm component (visual-only per D008 — email input + styled button, no action attribute, no JS). Use `max-w-3xl` container for consistency with other pages. Compute reading time via `getReadingTime(post.body ?? '')` in frontmatter. Use static Tailwind classes only.
  - Verify: `npm run build` zero errors; `grep` for hero text, BlogCard markup (min read, tag pills), ProjectCard markup (tech badges, GitHub links), and newsletter form in `dist/index.html`
  - Done when: `dist/index.html` contains all four homepage sections with real data from blog collection and projects.ts

- [x] **T02: Add custom 404 page and build verification script** `est:20m`
  - Why: Delivers R019 (custom 404) and provides the slice's objective verification script covering all S07 deliverables plus upstream regressions.
  - Files: `src/pages/404.astro`, `scripts/verify-s07.sh`
  - Do: Create `404.astro` wrapped in BaseLayout with heading, friendly message, and link back to home — styled consistently with the site's dark-first design. Write `scripts/verify-s07.sh` that runs `npm run build` and checks: (1) dist/index.html exists, (2) hero content present, (3) featured blog post titles in homepage, (4) reading time on homepage cards, (5) project titles in homepage, (6) tech stack badges in homepage, (7) newsletter form markup present, (8) dist/404.html exists, (9) 404 has back-to-home link, (10) S01/S02/S05 regression scripts pass. Run the script to confirm all checks pass.
  - Verify: `bash scripts/verify-s07.sh` — all checks pass
  - Done when: 404 page exists in build output, verification script passes all checks including upstream regressions

## Observability / Diagnostics

- **Build output verification:** `npm run build` must succeed; `dist/index.html` is the primary inspection surface — grep for hero text, blog post slugs, project titles, and newsletter form markup
- **Runtime signals:** Homepage renders entirely at build time (static HTML) — no client-side JS, no async data fetching, no error boundaries. All failures surface as build errors, never as runtime errors.
- **Inspection surfaces:** `dist/index.html` for homepage content; `dist/404.html` for 404 page; browser dev tools for visual verification (layout, dark mode, responsive breakpoints)
- **Failure visibility:** Missing imports or broken content collection queries cause Astro build failures with stack traces pointing to the offending `.astro` file. Missing blog posts or empty project arrays produce empty sections (visible in HTML output), not errors.
- **Redaction constraints:** None — no secrets, API keys, or PII in any homepage component. Newsletter form is visual-only with no backend integration.
- **Regression surface:** S01/S02/S05 verification scripts cover upstream components (BaseLayout, BlogCard, ProjectCard, content collections) that this slice consumes

## Files Likely Touched

- `src/pages/index.astro`
- `src/components/NewsletterForm.astro`
- `src/pages/404.astro`
- `scripts/verify-s07.sh`

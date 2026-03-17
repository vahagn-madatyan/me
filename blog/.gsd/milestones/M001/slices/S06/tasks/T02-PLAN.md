---
estimated_steps: 8
estimated_files: 4
---

# T02: Build architecture gallery with data file, lightbox, and domain filter

**Slice:** S06 — About & Architecture
**Milestone:** M001

## Description

Create the architecture gallery page at `/architecture` with a filterable diagram grid and lightbox modal for full-size image viewing. This is the core differentiator page (D009 — launch blocker). Follow the exact patterns established by S05's `/work` page: static TS data file → page with grid + filter → card styling. The lightbox uses native `<dialog>` for accessibility. Also writes the slice verification script. Closes requirement R014.

**Relevant skills:** `frontend-design` — load this skill for high-quality UI design.

## Steps

1. **Create `src/data/architectures.ts`** — Define a TypeScript interface with fields: `title` (string), `description` (string), `domain` (string union type for filtering — e.g., "distributed-systems", "security", "data-pipeline", "infrastructure"), `image` (string — path relative to `public/`, e.g. `/diagrams/system-overview.png`), `problemSolved` (string), `techDecisions` (string array). Export a typed array with 4-6 sample entries across different domains. Use placeholder image paths since real diagrams don't exist yet.

2. **Create `src/components/Lightbox.astro`** — Build a modal island using native `<dialog>` element:
   - Template: `<dialog>` wrapping a close button and an `<img>` element. Style with Tailwind: full-viewport overlay, centered image with max-width/max-height constraints, close button (X) in top-right corner.
   - Backdrop: Use `::backdrop` with `bg-black/80` (fixed dark — don't use `dark:` on backdrop since `::backdrop` doesn't inherit from document; see research pitfalls).
   - Client `<script>`: `init()` function that:
     - Selects all `[data-lightbox-src]` elements and adds click handlers to open the dialog with the clicked image's src
     - Binds close button click to `dialog.close()`
     - Binds backdrop click (click on `<dialog>` itself, not on inner content) to `dialog.close()`
     - Escape is handled natively by `<dialog>`
   - Add `document.addEventListener('astro:after-swap', init)` for page transition compatibility
   - Call `init()` at module level for initial page load

3. **Create `src/pages/architecture.astro`** — Follow `src/pages/work.astro` structure exactly:
   - Frontmatter: Import `BaseLayout`, `Lightbox`, and `architectures` from data file. Derive domains: `const domains = ['all', ...new Set(architectures.map(a => a.domain))]`
   - Page heading and intro paragraph
   - Filter buttons: Map over `domains`, first button ("all") gets active classes, rest get inactive classes. Use identical `class:list` pattern from work.astro with same `data-filter` attribute. Use same `ACTIVE_CLASSES` / `INACTIVE_CLASSES` arrays.
   - Card grid: `grid grid-cols-1 sm:grid-cols-2 gap-6`. Each card wrapped in `<div data-category={arch.domain}>`. Cards show:
     - Clickable image area with `data-lightbox-src={arch.image}` attribute (triggers lightbox)
     - Title, description, domain badge, `problemSolved` text
     - Tech decisions as a list of badges (same style as ProjectCard's techStack)
   - Include `<Lightbox />` component at the bottom of the page
   - Filter `<script>` block: Copy the exact `initFilter` + `astro:after-swap` pattern from work.astro. Same `ACTIVE_CLASSES`, `INACTIVE_CLASSES`, `data-filter` / `data-category` logic.

4. **Handle Tailwind class purging for filter JS** — Ensure all dynamically toggled classes (`bg-primary-500`, `text-white`, `bg-secondary-100`, etc.) appear statically in the template's `class:list` so Tailwind v4 doesn't purge them. This is the same pattern work.astro uses (see K knowledge about Tailwind purging fragility from S01 Forward Intelligence).

5. **Write `scripts/verify-s06.sh`** — Build output verification script checking both pages:
   - `npm run build` exit code 0
   - `dist/about/index.html` exists and contains: bio-related text marker, skills section marker, GitHub/LinkedIn/X link hrefs
   - `dist/architecture/index.html` exists and contains: `data-filter` attributes, `data-category` attributes, `<dialog` element, `data-lightbox-src` attributes
   - Both pages contain BaseLayout markers: `<nav`, `<footer`, dark mode init script
   - Print pass/fail summary

6. **Run verification** — Execute `npm run build` and `bash scripts/verify-s06.sh`. Fix any issues.

## Must-Haves

- [ ] `src/data/architectures.ts` with typed interface and 4-6 sample entries across multiple domains
- [ ] `src/components/Lightbox.astro` using native `<dialog>` with open/close/backdrop handling
- [ ] `src/pages/architecture.astro` with domain filter + card grid + lightbox integration
- [ ] Domain filter derives categories dynamically from data (not hardcoded) — same as D024/D025
- [ ] Filter JS uses `init() + astro:after-swap` pattern
- [ ] Lightbox JS uses `init() + astro:after-swap` pattern
- [ ] `::backdrop` uses fixed dark overlay (not theme-dependent)
- [ ] All dynamically toggled CSS classes also appear statically in template to survive Tailwind purge
- [ ] `scripts/verify-s06.sh` passes all checks
- [ ] `npm run build` — zero errors
- [ ] Page responsive and dark-mode compatible

## Verification

- `npm run build` — zero errors
- `bash scripts/verify-s06.sh` — all checks pass
- Dev server `/architecture`:
  - Cards render in a grid with title, description, domain badge, tech decisions
  - Filter buttons toggle card visibility by domain
  - Clicking a card's image area opens lightbox with full-size image
  - Escape key and backdrop click close lightbox
  - Page is responsive and dark mode works

## Inputs

- `src/pages/work.astro` — reference for filter pattern. Copy the `initFilter`, `ACTIVE_CLASSES`, `INACTIVE_CLASSES`, `data-filter`/`data-category` pattern exactly. The page structure (heading → filter buttons → card grid) is the template.
- `src/data/projects.ts` — reference for data file pattern. Mirror the interface + exported array structure.
- `src/components/ProjectCard.astro` — reference for card styling (ring, shadow, hover states, badge styles).
- `src/components/BaseLayout.astro` — wraps the page. Props: `title`, `description`.
- S01 Forward Intelligence: Tailwind v4 purges classes only referenced in JS. Mitigate by having all toggled classes also appear in static `class:list` in the template.

## Observability Impact

- **New page route:** `/architecture` — verify presence via `dist/architecture/index.html` after build
- **Lightbox component:** Inspect via `<dialog>` element in page source; test open/close via `data-lightbox-src` click, Escape, backdrop click
- **Domain filter:** Verify via `data-filter` and `data-category` attributes in build HTML; test toggle via dev server
- **Build signal:** `npm run build` exit code — non-zero means page has errors
- **Verification script:** `bash scripts/verify-s06.sh` — aggregates all structural checks for both S06 pages into a single pass/fail summary
- **Failure shapes:** Missing data-attributes in HTML → filter/lightbox JS silently no-ops (no errors, but UI doesn't respond). Missing `<dialog>` → lightbox doesn't open. Build failure → Astro error output with file/line.

## Expected Output

- `src/data/architectures.ts` — TypeScript data file with interface and sample entries
- `src/components/Lightbox.astro` — Dialog-based lightbox island component
- `src/pages/architecture.astro` — Full architecture gallery page with filter + lightbox
- `scripts/verify-s06.sh` — Build output verification script for S06 (covers both about and architecture pages)

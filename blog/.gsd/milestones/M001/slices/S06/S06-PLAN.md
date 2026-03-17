# S06: About & Architecture

**Goal:** Deliver the `/about` page with bio, skills, and contact links, and the `/architecture` page with a filterable diagram gallery and image lightbox — both using the established BaseLayout foundation.
**Demo:** Navigate to `/about` in dev server → see bio, current focus areas, skills/tech grid, and contact links with working hrefs. Navigate to `/architecture` → see diagram cards in a grid, filter by domain, click a card to open lightbox with full-size image, press Escape or click backdrop to close. Both pages responsive and dark-mode compatible.

## Must-Haves

- `/about` page with bio section, current focus areas, skills/tech stack grid, and contact links (email, GitHub, LinkedIn, X) using same social URLs as Footer
- `/architecture` page with diagram gallery grid, domain filter buttons (derived dynamically from data), and card components showing title, description, domain, and tech decisions
- Lightbox/modal component using native `<dialog>` element for full-size image viewing with Escape/backdrop close
- Architecture data file (`src/data/architectures.ts`) with TypeScript interface and sample entries following `projects.ts` pattern
- Both pages wrapped in BaseLayout, responsive, dark-mode compatible
- All client JS follows `init() + astro:after-swap` pattern
- `npm run build` succeeds with zero errors

## Verification

- `npm run build` — zero errors, both pages in build output
- `bash scripts/verify-s06.sh` — structural checks on build output:
  - `/about/index.html` exists with bio content, skills section, contact links (GitHub, LinkedIn, X hrefs)
  - `/architecture/index.html` exists with filter buttons, card grid, `<dialog>` lightbox element
  - Both pages have BaseLayout wrapper (nav, footer, dark mode init script)
  - Dark mode classes (`dark:`) present in both pages
- Dev server: `/about` renders all sections, contact links work
- Dev server: `/architecture` filter buttons toggle card visibility, lightbox opens/closes

## Tasks

- [x] **T01: Build about page with bio, skills grid, and contact links** `est:30m`
  - Why: Replaces existing placeholder in `about.astro` with full content — bio, focus areas, skills/tech stack, and contact links. Closes R013.
  - Files: `src/pages/about.astro`
  - Do: Replace placeholder content with structured sections: hero/intro with name and role, bio paragraphs covering all roles (architect, engineer), current focus areas list, skills/tech stack grid organized by category, and contact links section using the same social URLs from Footer.astro (GitHub: vahagn-grigoryan, LinkedIn: vahagn-grigoryan, X: vahagn_dev). Add an email link. Use Tailwind design tokens (`text-primary-*`, `bg-secondary-*`, etc.) and `dark:` variants. Keep BaseLayout wrapper intact.
  - Verify: `npm run build` succeeds; `/about/index.html` in build output contains bio content, skills section markers, and social link hrefs
  - Done when: `/about` renders full about page with bio, skills grid, and working contact links in dev server; dark mode works; page is responsive

- [x] **T02: Build architecture gallery with data file, lightbox, and domain filter** `est:45m`
  - Why: Creates the architecture gallery page with filterable diagram grid and lightbox — the core differentiator page. Closes R014. Also writes the verification script for the entire slice.
  - Files: `src/data/architectures.ts`, `src/components/Lightbox.astro`, `src/pages/architecture.astro`, `scripts/verify-s06.sh`
  - Do: (1) Create `src/data/architectures.ts` with TypeScript interface (`title`, `description`, `domain`, `image`, `problemSolved`, `techDecisions: string[]`) and 4-6 sample entries across different domains. Use placeholder image paths (`/diagrams/*.png`). (2) Create `src/components/Lightbox.astro` using native `<dialog>` element — client JS handles open (triggered by `data-lightbox-src` click), close (button, Escape, backdrop click), and `astro:after-swap` cleanup. Use fixed dark backdrop (`bg-black/80`) regardless of theme. (3) Create `src/pages/architecture.astro` following `work.astro` pattern exactly: import data → derive domains via `Set` → render filter buttons + card grid. Cards show title, description, domain badge, tech decisions list, and clickable image area that triggers lightbox. Filter JS uses same `data-filter`/`data-category` + `ACTIVE_CLASSES`/`INACTIVE_CLASSES` pattern from work.astro. (4) Write `scripts/verify-s06.sh` checking build output for both about and architecture pages.
  - Verify: `npm run build` succeeds; `bash scripts/verify-s06.sh` passes all checks; architecture filter toggles cards in dev server; lightbox opens and closes correctly
  - Done when: `/architecture` renders diagram gallery with working domain filter and lightbox; `bash scripts/verify-s06.sh` passes; `npm run build` zero errors

## Observability / Diagnostics

- **Build verification:** `npm run build` must exit 0; both `/about/index.html` and `/architecture/index.html` must exist in `dist/`
- **Structural verification:** `bash scripts/verify-s06.sh` checks build output for required content markers (bio text, skills section, social hrefs, filter buttons, dialog element, dark mode classes)
- **Runtime inspection:** Dev server pages at `/about` and `/architecture` — visually inspect sections render, links work, filter toggles visibility, lightbox opens/closes
- **Failure visibility:** Build errors surface as non-zero exit code with Astro error output. Missing content markers cause `verify-s06.sh` to report specific check failures with descriptive messages.
- **Dark mode:** Toggle via theme button in nav — all sections must switch correctly. Inspect for missing `dark:` variants by checking build HTML for `dark:` class presence.
- **Accessibility:** Social links must have `aria-label` attributes; lightbox dialog must be keyboard-dismissable (Escape)
- **Redaction:** No secrets or sensitive data on these pages — all content is public-facing

## Files Likely Touched

- `src/pages/about.astro`
- `src/data/architectures.ts`
- `src/components/Lightbox.astro`
- `src/pages/architecture.astro`
- `scripts/verify-s06.sh`

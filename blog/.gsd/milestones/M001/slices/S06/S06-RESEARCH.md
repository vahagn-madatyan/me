# S06: About & Architecture — Research

**Date:** 2026-03-16

## Summary

S06 delivers two terminal pages — `/about` and `/architecture` — both consuming only S01's BaseLayout foundation. The about page is a static content page replacing an existing placeholder. The architecture page follows the exact same data-file + filter + grid pattern established by S05's `/work` page, plus a Lightbox component for full-size image viewing.

No unfamiliar technology. No risky integrations. Every pattern needed already exists in the codebase. The lightbox is the only new interactive component — a vanilla JS modal island using the same `init + astro:after-swap` pattern used by ThemeToggle, mobile menu, TableOfContents, and project category filter.

## Recommendation

Follow S05's established architecture exactly: static TypeScript data file → page with grid + filter → card component. The architecture gallery data file mirrors `src/data/projects.ts` with fields for title, description, domain, image, tech decisions, and problem solved. Domain filtering reuses the same `data-filter` / `data-category` button pattern from `work.astro`. The Lightbox component is a self-contained Astro island with a `<script>` block for open/close/keyboard handling and a `<dialog>` element for native modal semantics.

For the about page, replace the existing placeholder content in `src/pages/about.astro` with structured sections: hero/bio, current focus areas, skills/tech stack grid, and contact links. Contact links reuse the same social icon SVGs already in `Footer.astro`.

## Implementation Landscape

### Key Files

- `src/pages/about.astro` — **exists** as placeholder. Replace inner content with full bio, skills grid, focus areas, and contact links. Keeps existing BaseLayout wrapper.
- `src/pages/architecture.astro` — **create**. Architecture gallery page with grid + domain filter. Follows `work.astro` structure: import data → derive categories → render filter buttons + card grid.
- `src/data/architectures.ts` — **create**. Static data file with TypeScript interface. Fields: `title`, `description`, `domain` (for filtering), `image` (path to diagram), `problemSolved`, `techDecisions` (string array). Follows `src/data/projects.ts` pattern.
- `src/components/Lightbox.astro` — **create**. Modal/dialog island for full-size image viewing. Uses native `<dialog>` element. Client JS handles open (click on image), close (button, Escape, backdrop click), and `astro:after-swap` cleanup.

### Existing Patterns to Reuse

| Pattern | Source | Reuse In |
|---------|--------|----------|
| BaseLayout wrapper with title/description props | All pages | Both pages |
| Static TS data file with typed interface + exported array | `src/data/projects.ts` | `src/data/architectures.ts` |
| Category filter with `data-filter` buttons + `data-category` cards | `src/pages/work.astro` | `src/pages/architecture.astro` |
| Card component with Tailwind ring/shadow hover states | `src/components/ProjectCard.astro` | Architecture card styling |
| `init() + astro:after-swap` JS island pattern | ThemeToggle, Header, TableOfContents, work.astro | Lightbox open/close + filter |
| Social icon SVGs (GitHub, LinkedIn, X) | `src/components/Footer.astro` | About page contact section |
| Design token classes (`text-primary-*`, `bg-secondary-*`, etc.) | `src/styles/global.css` @theme block | All new markup |

### Build Order

1. **Architecture data file** (`src/data/architectures.ts`) — define interface + sample entries. Unblocks the page and lightbox work. Trivial, no dependencies.
2. **About page** (`src/pages/about.astro`) — replace placeholder. Completely independent of architecture work. Static content, no JS, no new components.
3. **Lightbox component** (`src/components/Lightbox.astro`) — create the modal island. Must exist before the architecture page can reference it.
4. **Architecture page** (`src/pages/architecture.astro`) — assembles data + filter + grid + lightbox. Depends on data file and Lightbox component.

Tasks 1+2 are independent and can parallelize. Task 3→4 is sequential.

### Verification Approach

- `npm run build` — zero errors, both pages appear in build output
- Dev server: `/about` renders bio, skills grid, contact links with working hrefs
- Dev server: `/architecture` renders diagram cards in a grid, domain filter toggles card visibility
- Dev server: clicking a diagram card opens the lightbox with the full image, Escape closes it
- Both pages are responsive (mobile/desktop)
- Dark mode works on both pages (dark: classes applied correctly)
- Nav links in Header.astro already point to `/about` and `/architecture` — no nav changes needed

## Constraints

- No architecture diagram images exist in `public/` yet — use placeholder image paths in the data file (e.g. `/diagrams/example.png`). Placeholder images or inline SVG diagrams can stand in until real content is added. The page structure and lightbox must work regardless.
- Lightbox should use native `<dialog>` element for accessibility (built-in focus trapping, Escape handling, backdrop). No external modal library needed.
- All client JS must follow the `init() + astro:after-swap` pattern for Astro page transition compatibility.
- Social links in the about page should use the same URLs already defined in `Footer.astro` (GitHub: `vahagn-grigoryan`, LinkedIn: `vahagn-grigoryan`, X: `vahagn_dev`).

## Common Pitfalls

- **Tailwind v4 class purging on JS-toggled classes** — The filter buttons swap classes via JS (add/remove `bg-primary-500`, `text-white`, etc.). S05's `work.astro` already proved this works because the classes are also referenced statically in the template's `class:list`. Follow the same pattern exactly — don't rely on classes only referenced in JS.
- **`<dialog>` backdrop styling** — The `::backdrop` pseudo-element doesn't inherit from the document, so `dark:` variants won't work on it. Use a fixed dark semi-transparent backdrop (`bg-black/80`) regardless of theme.
- **Image paths in data file** — Use paths relative to `public/` (e.g. `/diagrams/system-overview.png`). These resolve correctly in both dev and build. Don't use `src/` asset imports since the images are referenced from a TS data file, not an Astro component.

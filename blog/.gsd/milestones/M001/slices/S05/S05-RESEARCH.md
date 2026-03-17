# S05: Projects Page — Research

**Date:** 2026-03-16

## Summary

S05 is straightforward UI work using established codebase patterns. The slice produces four deliverables: a static TypeScript data file (`src/data/projects.ts`), a project card component (`ProjectCard.astro`), the projects page (`src/pages/work.astro`), and a client-side category filter island. All patterns needed already exist — BlogCard for card layout, ThemeToggle/CopyButton for client JS islands, tag archive for filter+grid page structure, BaseLayout for page wrapping. D010 already decided on a static data file approach. No new dependencies or risky integrations.

The category filter is the only interactive piece. It should use vanilla JS in a `<script>` tag (same as ThemeToggle pattern) to show/hide cards by `data-category` attribute — no framework needed.

## Recommendation

Build in three tasks: (1) data file + TypeScript interface, (2) ProjectCard component + static work page with grid, (3) category filter island. Task 1 is trivial and unblocks everything. Task 2 is the bulk of the work and follows BlogCard patterns exactly. Task 3 adds interactivity. All three could also be a single task given low complexity.

## Implementation Landscape

### Key Files

- `src/data/projects.ts` — **new.** TypeScript interface + project array. Interface needs: title, description, category (union type of "security" | "ai" | "networking" | "trading"), techStack (string[]), githubUrl, liveUrl (optional), image (optional). Export both the interface and the data array. R012 specifies the four categories.
- `src/components/ProjectCard.astro` — **new.** Card component following BlogCard's visual pattern (rounded-2xl, ring border, group hover effects, dark mode variants). Shows title, description, tech stack badges (small pills like tag badges in BlogCard), GitHub link with icon, optional live URL link. Props match the data interface fields.
- `src/pages/work.astro` — **new.** Wraps in BaseLayout. Page heading, category filter buttons, responsive grid of ProjectCards. Header already links to `/work` (in Header.astro, both desktop and mobile nav). Grid: `grid-cols-1 sm:grid-cols-2` matching blog patterns.
- `src/components/BaseLayout.astro` — **existing, no changes.** Wraps the work page with title/description props.
- `src/styles/global.css` — **existing, no changes.** All needed design tokens already present.
- `src/components/BlogCard.astro` — **existing, reference only.** Visual pattern to follow for ProjectCard (card structure, hover effects, dark mode, tag badge styling).

### Build Order

1. **Data file first** (`src/data/projects.ts`) — defines the TypeScript interface that ProjectCard props will mirror. Include 4-6 sample projects across all four categories so the filter has something to demonstrate.
2. **ProjectCard + work page** — component + page together since they're tightly coupled. Import data, map over projects, render grid.
3. **Category filter** — add filter buttons above the grid, use `data-category` attributes on card wrappers, vanilla JS toggles visibility. "All" button shows everything.

### Verification Approach

- `npm run build` completes with zero errors
- `/work` page renders in dev server with project cards in a responsive grid
- Category filter buttons show/hide cards correctly (click "Security" → only security projects visible, click "All" → all visible)
- Each card shows: title, description, tech stack badges, GitHub link
- Dark mode styling works on all elements (cards, badges, filter buttons)
- Mobile responsive: single column on small screens, two columns on sm+

## Constraints

- No `src/data/` directory exists yet — must be created with the data file
- Category filter must use vanilla JS island pattern (Astro zero-JS default) — same approach as ThemeToggle (`<script>` tag with init function + `astro:after-swap` listener for view transitions)
- Project images are optional per D010 — cards should work without images (description-only cards are fine for initial sample data)
- S07 will consume `ProjectCard.astro` and `src/data/projects.ts` for homepage project highlights — ensure clean exports

## Common Pitfalls

- **Tailwind v4 class purging in JS-toggled elements** — if filter hides cards via `classList.add('hidden')`, the `hidden` utility is fine (always present in Tailwind). But any classes only referenced in JS (not templates) may be purged. Keep filter logic to toggling `hidden` class only, which is safe. (See S01 Forward Intelligence about this.)
- **`astro:after-swap` re-init** — category filter state resets on page transitions. The init function must set "All" as active on load. Follow the ThemeToggle pattern of init function + after-swap listener.
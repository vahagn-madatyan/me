# S07: Homepage & Polish — Research

**Date:** 2026-03-17

## Summary

S07 is the final assembly slice — no new technology, no unknown APIs, no risky integrations. It creates three new files (`src/pages/index.astro`, `src/components/NewsletterForm.astro`, `src/pages/404.astro`) using established components and patterns from S01, S02, and S05.

The current `index.astro` is a minimal placeholder with name, tagline, and two CTA links. It needs to be replaced with a full homepage: hero section, featured blog posts (queried via `featured: true` from the content collection), project highlights (sliced from `projects.ts`), and a visual-only newsletter CTA. The 404 page and newsletter form are brand-new files with no dependencies beyond `BaseLayout`.

All building blocks already exist and are tested: `BlogCard.astro`, `ProjectCard.astro`, `projects` data, the blog content collection with `featured` field, `getReadingTime()`, and the site's Tailwind theme. This is wiring, not invention.

## Recommendation

Build in two tasks: (1) Homepage with all four sections wired to real data, (2) NewsletterForm component + 404 page + verification script. The homepage is the critical deliverable; the other two are simple standalone files.

## Implementation Landscape

### Key Files

- `src/pages/index.astro` — **rewrite**: replace placeholder with hero + featured posts + project highlights + newsletter CTA. Imports `BlogCard`, `ProjectCard`, `projects`, `getCollection`, `getReadingTime`.
- `src/components/NewsletterForm.astro` — **new**: visual-only email input + submit button. No JS, no form action. Styled with existing Tailwind theme tokens. Per D008, not wired to any provider until M003.
- `src/pages/404.astro` — **new**: simple branded 404 with heading, message, link back to home. Uses `BaseLayout`.

### Upstream contracts consumed

- **BlogCard.astro** — props: `{ title, description, pubDate, heroImage?, tags?, readingTime, slug }`. Reading time must be computed via `getReadingTime(post.body)` in the page frontmatter, not in the component.
- **ProjectCard.astro** — props: `{ title, description, category, techStack, githubUrl, liveUrl?, image? }`. Spread project entries directly from the `projects` array.
- **projects data** — `import { projects } from '../data/projects'`. Slice 3-4 entries for homepage highlights.
- **Blog collection** — `getCollection('blog')` filtered for non-draft, sorted by date. For featured: filter `post.data.featured === true`. Currently only 1 post has `featured: true` (`building-a-developer-blog.md`). The homepage should gracefully handle <3 featured posts by falling back to latest posts.
- **BaseLayout.astro** — wraps all three pages. Props: `title`, `description`.
- **getReadingTime** — `import { getReadingTime } from '../utils/reading-time'`. Called with `post.body ?? ''`.

### Layout patterns to follow

All pages use `mx-auto max-w-3xl px-4 py-16 sm:px-6` as the content container (about, work, architecture). The current homepage uses `max-w-3xl px-4 py-20` — keep this wider vertical padding for the hero but use max-w-3xl for content sections to match site consistency. The homepage may want `max-w-5xl` for the card grids since BlogCard and ProjectCard are designed for multi-column layouts (the blog listing uses the same container but cards stack in the grid). Check: work.astro uses `max-w-3xl` with a 2-col grid — follow that for homepage grids too.

### Build Order

1. **Homepage first** — it's the only file with data dependencies (blog collection query + project import + reading time computation). Get this right and the slice is 80% done.
2. **NewsletterForm + 404** — both are isolated, zero-dependency components. Can be done in a single task.

### Verification Approach

- `npm run build` — zero errors, all pages generated
- `dist/index.html` — contains hero text, featured blog post titles, project card titles, newsletter form markup
- `dist/404.html` — exists, contains link back to home
- Check `dist/index.html` for BlogCard markup (reading time, tag pills, post slugs) and ProjectCard markup (tech stack badges, GitHub links)
- S01 regression: `bash scripts/verify-s01.sh`
- S02 regression: `bash scripts/verify-s02.sh`
- S05 regression: `bash scripts/verify-s05.sh`

## Constraints

- Only 1 post currently has `featured: true` — homepage must handle this gracefully, either by showing fewer cards or filling remaining slots with latest non-featured posts.
- NewsletterForm must be visual-only (D008) — no `action` attribute, no JS submission logic. Just an email input and styled button.
- Static Tailwind classes only — no dynamic class construction (known purge issue from S02/S05 forward intelligence).
- Reading time for featured posts must be computed in `index.astro` frontmatter, not in BlogCard (same pattern as `[slug].astro` and `[...page].astro`).

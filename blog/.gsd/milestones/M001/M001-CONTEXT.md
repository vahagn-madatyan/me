# M001: The Site — Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

## Project Description

Personal developer site for Vahagn at vahagn.dev. Blog, portfolio, architecture showcase. Built with Astro 6, Tailwind CSS v4, dark-first design. Canonical content home for cross-posting to social platforms.

## Why This Milestone

The site needs to exist before it can be deployed (M002) or used for content distribution (M003). M001 delivers a complete, polished site that works fully in local dev — all pages, blog engine, SEO infrastructure, design system.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Run `npm run dev` and browse a fully functional personal site with all pages
- Write a Markdown blog post, add frontmatter, and see it rendered with syntax highlighting, TOC, reading time, related posts, and share buttons
- Browse projects, architecture gallery, and about page
- Toggle dark/light mode with persistence
- View auto-generated OG images and complete SEO tags in page source

### Entry point / environment

- Entry point: `npm run dev` → http://localhost:4321
- Environment: local dev
- Live dependencies involved: none

## Completion Class

- Contract complete means: all pages render, blog system works end-to-end, OG images generate, SEO tags present in HTML source
- Integration complete means: content collection → pages → SEO pipeline works as unified system
- Operational complete means: none (deployment is M002)

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- A new blog post added as Markdown with full frontmatter renders on the blog listing, has its own page with TOC/syntax highlighting/related posts/share buttons, generates an OG image, and includes complete SEO meta tags
- All 7 page types render correctly: home, blog list, blog post, projects, about, architecture, 404
- Dark mode toggle works across all pages with no FOUC
- `npm run build` succeeds with zero errors

## Risks and Unknowns

- Satori OG image generation at build time — need to verify it works with Astro 6 static endpoints and handles custom fonts
- Tailwind v4 integration with Astro 6 — newer combo, verify Vite plugin approach works
- Scroll-spy TOC — requires client-side JS in an otherwise zero-JS site, need clean Astro island approach
- GitHub project data — how to source project metadata (static data file vs GitHub API at build time)

## Existing Codebase / Prior Art

- `src/content.config.ts` — existing content collection with basic blog schema (title, description, pubDate, updatedDate, heroImage)
- `src/components/BaseHead.astro` — existing meta tag component, needs SEO enhancement
- `src/components/Header.astro` — existing header, needs redesign for new nav structure
- `src/components/Footer.astro` — existing footer, needs redesign
- `src/pages/blog/index.astro` — existing blog listing, no pagination
- `src/pages/blog/[...slug].astro` — existing post route
- `src/layouts/BlogPost.astro` — existing post layout, needs major enhancement
- `src/pages/rss.xml.js` — existing RSS endpoint, needs update for new schema
- `src/styles/global.css` — existing global styles, will be replaced with Tailwind
- `astro.config.mjs` — MDX and sitemap integrations already configured

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

- R001–R020 — All M001 Active requirements cover this milestone's scope
- R003 — Homepage newsletter CTA is visual-only (R025 wires it in M003)

## Scope

### In Scope

- Tailwind v4 design system with custom theme and dark mode
- All 7 page types (home, blog list, blog post, projects, about, architecture, 404)
- Blog engine: pagination, tags, reading time, TOC, syntax highlighting, related posts, share buttons
- Auto-generated OG images via Satori + Sharp
- Full SEO: meta tags, Twitter Cards, JSON-LD, canonical URLs, sitemap, RSS, robots.txt
- Sample/placeholder content for all page types
- Responsive mobile-first design
- Accessibility (WCAG AA)

### Out of Scope / Non-Goals

- Cloudflare Pages deployment (M002)
- Working newsletter signup (M003 — visual form only in M001)
- Cross-posting tooling (M003)
- Blog search (deferred)
- CMS / admin UI (out of scope)
- Comments system (out of scope)

## Technical Constraints

- Astro 6 with static SSG output — zero JS default, islands for interactive components only
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (not legacy @astrojs/tailwind integration)
- Node >=22.12.0 (per package.json engines)
- Sharp already installed for image processing
- Content as Markdown/MDX files in `src/content/blog/`

## Integration Points

- Shiki (built into Astro) — syntax highlighting, configure dual themes in astro.config.mjs
- Satori — JSX-to-SVG for OG image generation, runs at build time via static API endpoint
- Sharp — SVG-to-PNG conversion for OG images
- @astrojs/sitemap — already installed
- @astrojs/rss — already installed
- @astrojs/mdx — already installed

## Open Questions

- GitHub project data sourcing — static TypeScript data file is simpler and avoids build-time API calls. Leaning toward static data with optional GitHub URLs. Will decide during S05 planning.
- OG image font loading — Satori needs font files as ArrayBuffer. Will use the existing Atkinson fonts in `/public/fonts/` or fetch Inter/JetBrains Mono during build.

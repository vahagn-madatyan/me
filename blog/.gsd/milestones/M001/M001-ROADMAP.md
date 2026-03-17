# M001: The Site

**Vision:** A complete, polished personal developer site at vahagn.dev with a dark-first design system, full blog engine, project showcase, architecture gallery, and comprehensive SEO — all working locally in dev, ready for deployment in M002.

## Success Criteria

- All 7 page types render correctly in `npm run dev` (home, blog list, blog post, projects, about, architecture, 404)
- Dark mode toggles and persists across pages with no FOUC
- Blog posts render with syntax highlighting, reading time, TOC (for long posts), related posts, and share buttons
- OG images auto-generate at build time from post metadata
- SEO meta tags, JSON-LD, Twitter Cards, canonical URLs present in HTML source
- RSS feed and sitemap are accessible and contain correct data
- Site is responsive across mobile, tablet, and desktop
- `npm run build` completes with zero errors

## Key Risks / Unknowns

- Satori + Sharp OG generation with Astro 6 — untested combo, custom font loading
- Tailwind v4 Vite plugin with Astro 6 — newer integration path
- Scroll-spy TOC as Astro island — client JS in zero-JS site

## Proof Strategy

- Satori OG generation → retire in S03 by proving OG images generate at build time and render correct metadata
- Tailwind v4 integration → retire in S01 by proving Tailwind compiles with custom theme and dark mode works
- Scroll-spy TOC → retire in S04 by proving TOC highlights correct heading during scroll

## Verification Classes

- Contract verification: `npm run build` succeeds, pages render, files exist with correct content
- Integration verification: content collection → page rendering → SEO meta pipeline works end-to-end
- Operational verification: none (deployment is M002)
- UAT / human verification: visual design quality, content layout, dark mode aesthetics

## Milestone Definition of Done

This milestone is complete only when all are true:

- All 7 slice deliverables are complete
- Design system is consistently applied across all pages
- Blog pipeline works end-to-end: Markdown → rendered page with all features → SEO tags → OG image
- Homepage pulls real data from blog collection and project data
- Dark mode works on every page with no flash
- `npm run build` succeeds with zero errors
- Success criteria are re-checked against the running dev server

## Requirement Coverage

- Covers: R001, R002, R003, R004, R005, R006, R007, R008, R009, R010, R011, R012, R013, R014, R015, R016, R017, R018, R019, R020
- Partially covers: R025 (visual newsletter form only, wiring in M003)
- Leaves for later: R021, R022, R023, R024 (M002), R026 (M003), R027 (deferred)
- Orphan risks: none

## Slices

- [x] **S01: Foundation & Design System** `risk:medium` `depends:[]`
  > After this: Dark-themed site skeleton with Tailwind v4, header with nav links, footer with social links, dark mode toggle with persistence, responsive layout — all visible in dev server.

- [x] **S02: Blog Engine** `risk:medium` `depends:[S01]`
  > After this: Blog listing with pagination (10/page), individual post pages with extended frontmatter, Shiki syntax highlighting (dual themes), and reading time — visible in dev server with sample posts.

- [ ] **S03: SEO & OG Images** `risk:high` `depends:[S02]`
  > After this: Auto-generated OG images from post metadata, JSON-LD structured data on blog posts, Twitter Card meta tags, canonical URLs, updated RSS feed, robots.txt — verifiable in page source and build output.

- [ ] **S04: Blog Reading Experience** `risk:medium` `depends:[S02]`
  > After this: Long posts have sticky TOC with scroll-spy, related posts appear at bottom, share buttons for X/LinkedIn/Dev.to, code blocks have copy button, tag archive pages at /blog/tag/[tag] — all interactive in dev server.

- [ ] **S05: Projects Page** `risk:low` `depends:[S01]`
  > After this: /work page shows project cards with GitHub links, tech stack badges, category filtering — visible in dev server with sample project data.

- [ ] **S06: About & Architecture** `risk:low` `depends:[S01]`
  > After this: /about page with bio, skills, and contact links; /architecture page with diagram gallery and lightbox — visible in dev server.

- [ ] **S07: Homepage & Polish** `risk:low` `depends:[S02,S05]`
  > After this: Complete homepage with hero, featured posts from blog collection, project highlights, visual newsletter CTA, custom 404 page — full site navigable in dev server.

## Boundary Map

### S01 → S02, S05, S06, S07

Produces:
- `src/styles/global.css` → Tailwind v4 base with custom theme (colors, fonts, spacing)
- `src/components/BaseLayout.astro` → HTML shell with meta, dark mode script, header, footer
- `src/components/Header.astro` → Nav with links: Blog, Work, About, Architecture + dark mode toggle
- `src/components/Footer.astro` → Social links, copyright, RSS link
- `src/components/ThemeToggle.astro` → Dark/light toggle island with localStorage
- Tailwind v4 configured in `astro.config.mjs` via `@tailwindcss/vite`
- Dark mode: `@custom-variant dark (&:where(.dark, .dark *))` in global.css

Consumes:
- nothing (first slice)

### S02 → S03, S04, S07

Produces:
- `src/content.config.ts` → Extended blog schema (tags, featured, draft, canonicalURL added)
- `src/pages/blog/index.astro` → Paginated blog listing (10/page)
- `src/pages/blog/[...slug].astro` → Individual post page with reading time
- `src/components/BlogCard.astro` → Post card (image, title, excerpt, date, tags, reading time)
- `src/layouts/BlogPost.astro` → Post layout with metadata display
- `src/utils/reading-time.ts` → Reading time calculation utility
- Shiki configured with dual themes (github-dark / github-light) in `astro.config.mjs`
- Sample blog posts with full frontmatter in `src/content/blog/`

Consumes from S01:
- `BaseLayout.astro` → wraps all blog pages
- `Header.astro`, `Footer.astro` → site chrome
- Tailwind theme → styling

### S03 → (terminal, consumed by build output)

Produces:
- `src/pages/og/[...slug].png.ts` → Static endpoint generating OG images via Satori + Sharp
- `src/components/SEO.astro` → Enhanced meta component (OG, Twitter Cards, JSON-LD, canonical)
- `src/pages/rss.xml.js` → Updated RSS feed with extended schema fields
- `public/robots.txt` → Robots file
- Sitemap configured with blog change frequency

Consumes from S02:
- Blog content collection schema → post metadata for OG images and JSON-LD
- Blog post data → RSS feed items

Consumes from S01:
- `BaseLayout.astro` / `BaseHead.astro` → SEO component integration point

### S04 → (terminal, enhances S02 pages)

Produces:
- `src/components/TableOfContents.astro` → TOC island with scroll-spy (client JS)
- `src/components/RelatedPosts.astro` → Tag-based related posts component
- `src/components/ShareButtons.astro` → Share links for X, LinkedIn, Dev.to
- `src/components/CopyButton.astro` → Code block copy button island (client JS)
- `src/pages/blog/tag/[tag]/[...page].astro` → Tag archive pages with pagination

Consumes from S02:
- `BlogPost.astro` layout → components integrate into post template
- Blog content collection → tag data for archives and related posts
- `BlogCard.astro` → reused in tag archive and related posts

### S05 → S07

Produces:
- `src/pages/work.astro` → Projects page with grid and category filter
- `src/components/ProjectCard.astro` → Project card (image, title, stack badges, links)
- `src/data/projects.ts` → Project data with TypeScript interface
- Category filter component (client JS island)

Consumes from S01:
- `BaseLayout.astro` → wraps projects page
- Tailwind theme → styling

### S06 → (terminal)

Produces:
- `src/pages/about.astro` → About page with bio, skills, contact
- `src/pages/architecture.astro` → Architecture gallery with lightbox
- `src/components/Lightbox.astro` → Image lightbox/modal island (client JS)

Consumes from S01:
- `BaseLayout.astro` → wraps pages
- Tailwind theme → styling

### S07 → (terminal, final assembly)

Produces:
- `src/pages/index.astro` → Complete homepage (hero, featured posts, project highlights, newsletter CTA)
- `src/components/NewsletterForm.astro` → Visual-only newsletter signup form
- `src/pages/404.astro` → Custom 404 page

Consumes from S02:
- Blog content collection → featured posts query
- `BlogCard.astro` → featured posts display

Consumes from S05:
- `ProjectCard.astro` → project highlights display
- `src/data/projects.ts` → project data

Consumes from S01:
- `BaseLayout.astro` → wraps pages
- Tailwind theme → styling

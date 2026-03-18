# Project

## What This Is

Personal developer site for Vahagn at vahagn.dev — a blog, portfolio, and architecture showcase for a developer/security engineer/network engineer/architect specializing in security automation, agentic AI, and network architecture. Built with Astro 6 (static site generation), Tailwind CSS v4, and deployed to Cloudflare Pages. The site is the canonical home for all content that gets cross-posted to X, LinkedIn, Medium, and Dev.to.

## Core Value

A polished, fast, SEO-optimized personal site that establishes vahagn.dev as the canonical source of truth for all content — blog posts, architecture showcases, and project portfolio — with owned audience via newsletter.

## Current State

M001 complete — all 7 slices shipped. The site builds 22 pages with zero errors. Full homepage with hero, 3 featured blog post cards (real collection data with reading time), 4 project highlight cards (from projects.ts with tech badges), and visual-only newsletter CTA. Custom branded 404 page. Dark-first design system with Tailwind v4, teal/cyan primary, slate secondary, orange accent. Responsive header with nav, footer with social links, three-state dark mode toggle with localStorage persistence and no FOUC. Blog engine with extended content schema, paginated listing, Shiki dual-theme syntax highlighting, reading time, draft filtering, 8 sample posts. SEO: OG images via Satori + Sharp, JSON-LD, Twitter Cards, canonical URLs, RSS with categories, robots.txt, sitemap. Blog reading experience: tag archives (9 tags), related posts, share buttons (X/LinkedIn/Dev.to), copy-to-clipboard on code blocks, sticky TOC with scroll-spy. Projects: /work with 6 cards, 4 categories, client-side filter. About: bio, skills grid, contact links. Architecture: gallery with domain filter and native dialog lightbox. Ready for M002 deployment.

## Architecture / Key Patterns

- **Framework:** Astro 6 (static SSG, zero-JS default, islands for interactive bits)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` — all design tokens in `@theme` block in `src/styles/global.css`
- **Content:** Markdown/MDX content collections with Zod schema validation
- **Code highlighting:** Shiki (built into Astro) with dual themes
- **OG images:** Satori + Sharp for build-time generation
- **Dark mode:** Class-based toggle with `@custom-variant dark` (Tailwind v4) + localStorage, inline init script in `<head>`
- **Layout:** BaseLayout is the single HTML shell — all pages pass title/description/image as props
- **Client JS:** Module `<script>` tags with init function + `astro:after-swap` listener for page transition support
- **Deployment target:** Cloudflare Pages (M002)

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- ✅ M001: The Site — Complete. All 7 slices shipped, 22 pages build with zero errors. Ready for deployment.
- [ ] M002: Deployment — Cloudflare Pages setup, custom domain, DNS, build pipeline, analytics
- [ ] M003: Distribution & Growth — Newsletter integration, cross-posting tooling, audience building

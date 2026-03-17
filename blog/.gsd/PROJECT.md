# Project

## What This Is

Personal developer site for Vahagn at vahagn.dev — a blog, portfolio, and architecture showcase for a developer/security engineer/network engineer/architect specializing in security automation, agentic AI, and network architecture. Built with Astro 6 (static site generation), Tailwind CSS v4, and deployed to Cloudflare Pages. The site is the canonical home for all content that gets cross-posted to X, LinkedIn, Medium, and Dev.to.

## Core Value

A polished, fast, SEO-optimized personal site that establishes vahagn.dev as the canonical source of truth for all content — blog posts, architecture showcases, and project portfolio — with owned audience via newsletter.

## Current State

Foundation complete. Tailwind v4 design system integrated with full D003 design tokens (teal/cyan primary, slate secondary, orange accent). Dark-first site skeleton with responsive header (nav links, mobile hamburger), footer (social links, copyright, RSS), and three-state dark mode toggle with localStorage persistence and no FOUC. All pages render through BaseLayout. Inter + JetBrains Mono fonts loaded via Fontsource. Blog engine complete with extended content schema (tags, featured, draft, canonicalURL), paginated listing at /blog/, Shiki dual-theme syntax highlighting (github-dark/github-light via CSS variables), reading time on cards and posts, draft filtering, and 8 sample posts. SEO infrastructure complete: OG images auto-generate at build time via Satori + Sharp (1200×630 PNG per non-draft post), JSON-LD BlogPosting on blog posts, article OG tags, twitter:image, canonical URLs with override support, RSS categories from tags, robots.txt with sitemap reference, and sitemap serialize config for blog URLs. Blog reading experience complete: tag archive pages at /blog/tag/[tag]/ (9 tags), navigable tag pill links, related posts (tag-overlap scoring, top 3), share buttons (X, LinkedIn, Dev.to), copy-to-clipboard on code blocks, and sticky TOC with IntersectionObserver scroll-spy on long posts (≥5 min read) with two-column desktop layout. Projects page complete: /work page with 6 project cards across 4 categories (security, AI, networking, trading), client-side category filter with vanilla JS island, responsive 2-column grid, dark mode styling, reusable ProjectCard component and typed data export for S07 homepage consumption. Build passes with zero errors (20 pages).

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

- 🔄 M001: The Site — Full vahagn.dev with design system, all pages, blog engine, SEO, dark mode (S01-S05 complete, S06-S07 remaining)
- [ ] M002: Deployment — Cloudflare Pages setup, custom domain, DNS, build pipeline, analytics
- [ ] M003: Distribution & Growth — Newsletter integration, cross-posting tooling, audience building

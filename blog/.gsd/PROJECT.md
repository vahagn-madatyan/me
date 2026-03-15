# Project

## What This Is

Personal developer site for Vahagn at vahagn.dev — a blog, portfolio, and architecture showcase for a developer/security engineer/network engineer/architect specializing in security automation, agentic AI, and network architecture. Built with Astro 6 (static site generation), Tailwind CSS v4, and deployed to Cloudflare Pages. The site is the canonical home for all content that gets cross-posted to X, LinkedIn, Medium, and Dev.to.

## Core Value

A polished, fast, SEO-optimized personal site that establishes vahagn.dev as the canonical source of truth for all content — blog posts, architecture showcases, and project portfolio — with owned audience via newsletter.

## Current State

Fresh Astro 6 blog starter template. MDX and sitemap integrations wired. Zod-validated content collection for blog posts with minimal frontmatter. No Tailwind, no custom design, no real pages beyond default blog list and placeholder posts. Sharp installed for image processing.

## Architecture / Key Patterns

- **Framework:** Astro 6 (static SSG, zero-JS default, islands for interactive bits)
- **Styling:** Tailwind CSS v4 via Vite plugin (to be added)
- **Content:** Markdown/MDX content collections with Zod schema validation
- **Code highlighting:** Shiki (built into Astro) with dual themes
- **OG images:** Satori + Sharp for build-time generation
- **Dark mode:** Class-based toggle with `@custom-variant dark` (Tailwind v4) + localStorage
- **Deployment target:** Cloudflare Pages (M002)

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [ ] M001: The Site — Full vahagn.dev with design system, all pages, blog engine, SEO, dark mode
- [ ] M002: Deployment — Cloudflare Pages setup, custom domain, DNS, build pipeline, analytics
- [ ] M003: Distribution & Growth — Newsletter integration, cross-posting tooling, audience building

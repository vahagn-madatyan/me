# Requirements

This file is the explicit capability and coverage contract for the project.

## Active

### R001 — Tailwind v4 Design System
- Class: core-capability
- Status: validated
- Description: Dark-first design system using Tailwind CSS v4 with custom theme — teal/cyan primary, slate secondary, orange accent, Inter body font, JetBrains Mono code font, class-based dark mode
- Why it matters: Visual identity and consistency across all pages
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: Build output contains all custom theme tokens; design tokens resolve in dev server; dark variant compiles correctly. Validated in S01.
- Notes: Tailwind v4 uses Vite plugin, `@import "tailwindcss"`, `@custom-variant dark`

### R002 — Responsive Mobile-First Layout
- Class: quality-attribute
- Status: active
- Description: All pages render correctly on mobile, tablet, and desktop viewports
- Why it matters: Most developer content is consumed on various devices
- Source: inferred
- Primary owning slice: M001/S01
- Supporting slices: all slices
- Validation: unmapped
- Notes: Tailwind breakpoints handle this natively

### R003 — Homepage
- Class: primary-user-loop
- Status: active
- Description: Homepage with hero section (name, tagline, roles), featured blog posts (3-4 cards), project highlights (3-4 cards), and newsletter signup CTA (visual only in M001)
- Why it matters: First impression and navigation hub
- Source: user
- Primary owning slice: M001/S07
- Supporting slices: M001/S02, M001/S05
- Validation: unmapped
- Notes: Newsletter CTA is visual-only until M003

### R004 — Blog Content Collection
- Class: core-capability
- Status: active
- Description: Blog posts as Markdown/MDX with extended frontmatter schema — title, description, pubDate, updatedDate, tags, featured, draft, heroImage, canonicalURL
- Why it matters: Foundation for the entire blog system
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: none
- Validation: unmapped
- Notes: Extends existing Zod schema

### R005 — Blog Pagination
- Class: primary-user-loop
- Status: active
- Description: Blog listing paginated at 10 posts per page with navigation controls
- Why it matters: Usable blog listing as content grows
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: none
- Validation: unmapped
- Notes: Uses Astro's built-in `paginate()` in `getStaticPaths`

### R006 — Tag Filtering & Archive Pages
- Class: primary-user-loop
- Status: active
- Description: Individual `/blog/tag/[tag]` archive pages for each tag, plus tag filtering on blog listing
- Why it matters: Content discoverability by topic
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: M001/S02
- Validation: unmapped
- Notes: Tags defined in frontmatter

### R007 — Reading Time Calculation
- Class: primary-user-loop
- Status: active
- Description: Reading time estimate displayed on blog listing and post header (200 words/min, rounded to nearest minute)
- Why it matters: Sets reader expectations
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: none
- Validation: unmapped
- Notes: Calculated from Markdown body at build time

### R008 — Table of Contents with Scroll-Spy
- Class: primary-user-loop
- Status: active
- Description: Auto-generated TOC from h2/h3 headings, sticky sidebar on desktop, scroll-spy active link highlighting, only for posts >1000 words
- Why it matters: Long-form technical content needs navigation
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: unmapped
- Notes: Requires client-side JS for scroll-spy (Astro island)

### R009 — Syntax Highlighting
- Class: core-capability
- Status: active
- Description: Shiki syntax highlighting with dual themes (github-dark/github-light matching dark mode), copy button on code blocks
- Why it matters: Core to technical blog readability
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S04 (copy button)
- Validation: unmapped
- Notes: Shiki built into Astro, copy button needs client JS

### R010 — Related Posts
- Class: primary-user-loop
- Status: active
- Description: Related posts section at bottom of blog posts, based on shared tags
- Why it matters: Keeps readers engaged, reduces bounce rate
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: unmapped
- Notes: Tag-based matching

### R011 — Share Buttons
- Class: primary-user-loop
- Status: active
- Description: Share buttons for X, LinkedIn, Dev.to on individual blog posts
- Why it matters: Enables content distribution from the post itself
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: unmapped
- Notes: URL-based share links, no third-party JS needed

### R012 — Projects Page
- Class: core-capability
- Status: active
- Description: Projects page at /work with grid of project cards showing image, title, description, tech stack badges, GitHub link, with category filtering (security, AI, networking, trading)
- Why it matters: Showcases real work and technical breadth
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: unmapped
- Notes: Projects are real GitHub repos

### R013 — About Page
- Class: launchability
- Status: active
- Description: About page with bio covering all roles, current focus areas, contact links (email, GitHub, LinkedIn, X), and skills/tech stack section
- Why it matters: Personal brand identity
- Source: user
- Primary owning slice: M001/S06
- Supporting slices: none
- Validation: unmapped
- Notes: none

### R014 — Architecture Gallery
- Class: differentiator
- Status: active
- Description: Architecture gallery at /architecture with grid of diagram images, title, context, problem solved, tech decisions. Lightbox/modal for full-size viewing. Filterable by domain.
- Why it matters: Central to Vahagn's brand as an architect — launch blocker
- Source: user
- Primary owning slice: M001/S06
- Supporting slices: none
- Validation: unmapped
- Notes: Unique differentiator page

### R015 — Auto-Generated OG Images
- Class: launchability
- Status: active
- Description: Template-based Open Graph images (1200x630) generated at build time from post title, tags, and branding using Satori + Sharp
- Why it matters: Professional appearance when links shared on social media
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: unmapped
- Notes: Sharp already in deps. Satori renders JSX to SVG, Sharp converts to PNG.

### R016 — SEO Meta Tags, Twitter Cards, JSON-LD
- Class: launchability
- Status: active
- Description: Dynamic meta tags per page, Open Graph tags, Twitter Card tags, JSON-LD structured data for blog posts, canonical URLs pointing to vahagn.dev
- Why it matters: Search engine discoverability and social media appearance
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M001/S01 (BaseHead)
- Validation: unmapped
- Notes: JSON-LD uses BlogPosting schema

### R017 — Sitemap, RSS, robots.txt
- Class: launchability
- Status: active
- Description: Auto-generated sitemap.xml, RSS feed from blog collection, robots.txt
- Why it matters: Search engine indexing and feed readers
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: unmapped
- Notes: @astrojs/sitemap already installed, RSS exists but needs updating

### R018 — Dark Mode Toggle
- Class: core-capability
- Status: validated
- Description: Dark mode toggle with localStorage persistence, system preference detection on first load, smooth transition, no FOUC
- Why it matters: Dark-first design is core to the identity
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: Three-state toggle persists across pages, respects system preference, no FOUC. Verified with browser testing in S01.
- Notes: Tailwind v4 `@custom-variant dark` with class strategy

### R019 — 404 Page
- Class: launchability
- Status: active
- Description: Custom 404 page matching site design
- Why it matters: Professional polish
- Source: user
- Primary owning slice: M001/S07
- Supporting slices: none
- Validation: unmapped
- Notes: Simple page

### R020 — Accessibility (WCAG AA)
- Class: quality-attribute
- Status: active
- Description: Semantic HTML, keyboard navigation, focus management, sufficient color contrast ratios
- Why it matters: Inclusive design, also benefits SEO
- Source: inferred
- Primary owning slice: M001/S01
- Supporting slices: all slices
- Validation: unmapped
- Notes: Built into every component, not a separate slice

### R021 — Cloudflare Pages Build Pipeline
- Class: operability
- Status: active
- Description: GitHub repo connected to Cloudflare Pages with automatic deploys on push to main
- Why it matters: Automated deployment pipeline
- Source: user
- Primary owning slice: M002
- Supporting slices: none
- Validation: unmapped
- Notes: M002 scope

### R022 — Custom Domain + DNS + SSL
- Class: launchability
- Status: active
- Description: vahagn.dev configured with Cloudflare DNS, auto-HTTPS, HTTPS rewrites
- Why it matters: Canonical URL must be live
- Source: user
- Primary owning slice: M002
- Supporting slices: none
- Validation: unmapped
- Notes: M002 scope

### R023 — Performance Optimization
- Class: quality-attribute
- Status: active
- Description: Auto minify (JS, CSS, HTML), Brotli compression, browser cache TTL, Lighthouse 95+
- Why it matters: Core Web Vitals, user experience, SEO
- Source: user
- Primary owning slice: M002
- Supporting slices: none
- Validation: unmapped
- Notes: M002 scope

### R024 — Cloudflare Web Analytics
- Class: operability
- Status: active
- Description: Privacy-friendly analytics with no JS overhead via Cloudflare Web Analytics
- Why it matters: Understand traffic without compromising user privacy
- Source: user
- Primary owning slice: M002
- Supporting slices: none
- Validation: unmapped
- Notes: M002 scope

### R025 — Newsletter Signup Integration
- Class: primary-user-loop
- Status: active
- Description: Working newsletter signup with Buttondown or Beehiiv, GDPR-compliant, success/error handling
- Why it matters: Own the audience, no algorithm dependency
- Source: user
- Primary owning slice: M003
- Supporting slices: M001/S07 (visual form)
- Validation: unmapped
- Notes: M003 scope, M001 has visual-only form

### R026 — Cross-Posting Workflow
- Class: core-capability
- Status: active
- Description: Tooling/workflow for distributing blog content to X, LinkedIn, Medium, Dev.to with canonical URLs pointing back to vahagn.dev
- Why it matters: Content amplification and brand building
- Source: user
- Primary owning slice: M003
- Supporting slices: none
- Validation: unmapped
- Notes: M003 scope

## Deferred

### R027 — Blog Search
- Class: primary-user-loop
- Status: deferred
- Description: Search functionality across blog posts
- Why it matters: Content discoverability as post count grows
- Source: research
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred — low value until there are many posts. Can add Pagefind or similar later.

## Out of Scope

### R028 — CMS / Admin UI
- Class: anti-feature
- Status: out-of-scope
- Description: No admin dashboard or CMS — content managed via Markdown files in git
- Why it matters: Prevents scope creep into backend infrastructure
- Source: research
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Dev-friendly workflow is the feature

### R029 — Comments System
- Class: anti-feature
- Status: out-of-scope
- Description: No comments on blog posts
- Why it matters: Avoids moderation burden and third-party dependencies
- Source: research
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Engagement happens on social platforms

## Traceability

| ID | Class | Status | Primary owner | Supporting | Proof |
|---|---|---|---|---|---|
| R001 | core-capability | validated | M001/S01 | none | S01 build + dev server |
| R002 | quality-attribute | active | M001/S01 | all | unmapped |
| R003 | primary-user-loop | active | M001/S07 | M001/S02,S05 | unmapped |
| R004 | core-capability | active | M001/S02 | none | unmapped |
| R005 | primary-user-loop | active | M001/S02 | none | unmapped |
| R006 | primary-user-loop | active | M001/S04 | M001/S02 | unmapped |
| R007 | primary-user-loop | active | M001/S02 | none | unmapped |
| R008 | primary-user-loop | active | M001/S04 | none | unmapped |
| R009 | core-capability | active | M001/S02 | M001/S04 | unmapped |
| R010 | primary-user-loop | active | M001/S04 | none | unmapped |
| R011 | primary-user-loop | active | M001/S04 | none | unmapped |
| R012 | core-capability | active | M001/S05 | none | unmapped |
| R013 | launchability | active | M001/S06 | none | unmapped |
| R014 | differentiator | active | M001/S06 | none | unmapped |
| R015 | launchability | active | M001/S03 | none | unmapped |
| R016 | launchability | active | M001/S03 | M001/S01 | unmapped |
| R017 | launchability | active | M001/S03 | none | unmapped |
| R018 | core-capability | validated | M001/S01 | none | S01 browser testing |
| R019 | launchability | active | M001/S07 | none | unmapped |
| R020 | quality-attribute | active | M001/S01 | all | unmapped |
| R021 | operability | active | M002 | none | unmapped |
| R022 | launchability | active | M002 | none | unmapped |
| R023 | quality-attribute | active | M002 | none | unmapped |
| R024 | operability | active | M002 | none | unmapped |
| R025 | primary-user-loop | active | M003 | M001/S07 | unmapped |
| R026 | core-capability | active | M003 | none | unmapped |
| R027 | primary-user-loop | deferred | none | none | unmapped |
| R028 | anti-feature | out-of-scope | none | none | n/a |
| R029 | anti-feature | out-of-scope | none | none | n/a |

## Coverage Summary

- Active requirements: 24
- Mapped to slices: 26
- Validated: 2 (R001, R018)
- Unmapped active requirements: 0

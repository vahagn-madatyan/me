# Requirements

This file is the explicit capability and coverage contract for the project.

## Active

### R002 — All pages render correctly on mobile, tablet, and desktop viewports
- Class: quality-attribute
- Status: active
- Description: All pages render correctly on mobile, tablet, and desktop viewports
- Why it matters: Most developer content is consumed on various devices
- Source: inferred
- Primary owning slice: M001/S01
- Supporting slices: all slices
- Validation: unmapped
- Notes: Tailwind breakpoints handle this natively

### R003 — Homepage with hero section (name, tagline, roles), featured blog posts (3-4 cards), project highlights (3-4 cards), and newsletter signup CTA (visual only in M001)
- Class: primary-user-loop
- Status: active
- Description: Homepage with hero section (name, tagline, roles), featured blog posts (3-4 cards), project highlights (3-4 cards), and newsletter signup CTA (visual only in M001)
- Why it matters: First impression and navigation hub
- Source: user
- Primary owning slice: M001/S07
- Supporting slices: M001/S02, M001/S05
- Validation: unmapped
- Notes: Newsletter CTA is visual-only until M003

### R012 — Projects page at /work with grid of project cards showing image, title, description, tech stack badges, GitHub link, with category filtering (security, AI, networking, trading)
- Class: core-capability
- Status: active
- Description: Projects page at /work with grid of project cards showing image, title, description, tech stack badges, GitHub link, with category filtering (security, AI, networking, trading)
- Why it matters: Showcases real work and technical breadth
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: unmapped
- Notes: Projects are real GitHub repos

### R013 — About page with bio covering all roles, current focus areas, contact links (email, GitHub, LinkedIn, X), and skills/tech stack section
- Class: launchability
- Status: active
- Description: About page with bio covering all roles, current focus areas, contact links (email, GitHub, LinkedIn, X), and skills/tech stack section
- Why it matters: Personal brand identity
- Source: user
- Primary owning slice: M001/S06
- Supporting slices: none
- Validation: unmapped
- Notes: none

### R014 — Architecture gallery at /architecture with grid of diagram images, title, context, problem solved, tech decisions. Lightbox/modal for full-size viewing. Filterable by domain.
- Class: differentiator
- Status: active
- Description: Architecture gallery at /architecture with grid of diagram images, title, context, problem solved, tech decisions. Lightbox/modal for full-size viewing. Filterable by domain.
- Why it matters: Central to Vahagn's brand as an architect — launch blocker
- Source: user
- Primary owning slice: M001/S06
- Supporting slices: none
- Validation: unmapped
- Notes: Unique differentiator page

### R019 — Custom 404 page matching site design
- Class: launchability
- Status: active
- Description: Custom 404 page matching site design
- Why it matters: Professional polish
- Source: user
- Primary owning slice: M001/S07
- Supporting slices: none
- Validation: unmapped
- Notes: Simple page

### R020 — Semantic HTML, keyboard navigation, focus management, sufficient color contrast ratios
- Class: quality-attribute
- Status: active
- Description: Semantic HTML, keyboard navigation, focus management, sufficient color contrast ratios
- Why it matters: Inclusive design, also benefits SEO
- Source: inferred
- Primary owning slice: M001/S01
- Supporting slices: all slices
- Validation: unmapped
- Notes: Built into every component, not a separate slice

### R021 — GitHub repo connected to Cloudflare Pages with automatic deploys on push to main
- Class: operability
- Status: active
- Description: GitHub repo connected to Cloudflare Pages with automatic deploys on push to main
- Why it matters: Automated deployment pipeline
- Source: user
- Primary owning slice: M002
- Supporting slices: none
- Validation: unmapped
- Notes: M002 scope

### R022 — vahagn.dev configured with Cloudflare DNS, auto-HTTPS, HTTPS rewrites
- Class: launchability
- Status: active
- Description: vahagn.dev configured with Cloudflare DNS, auto-HTTPS, HTTPS rewrites
- Why it matters: Canonical URL must be live
- Source: user
- Primary owning slice: M002
- Supporting slices: none
- Validation: unmapped
- Notes: M002 scope

### R023 — Auto minify (JS, CSS, HTML), Brotli compression, browser cache TTL, Lighthouse 95+
- Class: quality-attribute
- Status: active
- Description: Auto minify (JS, CSS, HTML), Brotli compression, browser cache TTL, Lighthouse 95+
- Why it matters: Core Web Vitals, user experience, SEO
- Source: user
- Primary owning slice: M002
- Supporting slices: none
- Validation: unmapped
- Notes: M002 scope

### R024 — Privacy-friendly analytics with no JS overhead via Cloudflare Web Analytics
- Class: operability
- Status: active
- Description: Privacy-friendly analytics with no JS overhead via Cloudflare Web Analytics
- Why it matters: Understand traffic without compromising user privacy
- Source: user
- Primary owning slice: M002
- Supporting slices: none
- Validation: unmapped
- Notes: M002 scope

### R025 — Working newsletter signup with Buttondown or Beehiiv, GDPR-compliant, success/error handling
- Class: primary-user-loop
- Status: active
- Description: Working newsletter signup with Buttondown or Beehiiv, GDPR-compliant, success/error handling
- Why it matters: Own the audience, no algorithm dependency
- Source: user
- Primary owning slice: M003
- Supporting slices: M001/S07 (visual form)
- Validation: unmapped
- Notes: M003 scope, M001 has visual-only form

### R026 — Tooling/workflow for distributing blog content to X, LinkedIn, Medium, Dev.to with canonical URLs pointing back to vahagn.dev
- Class: core-capability
- Status: active
- Description: Tooling/workflow for distributing blog content to X, LinkedIn, Medium, Dev.to with canonical URLs pointing back to vahagn.dev
- Why it matters: Content amplification and brand building
- Source: user
- Primary owning slice: M003
- Supporting slices: none
- Validation: unmapped
- Notes: M003 scope

## Validated

### R001 — Dark-first design system using Tailwind CSS v4 with custom theme — teal/cyan primary, slate secondary, orange accent, Inter body font, JetBrains Mono code font, class-based dark mode
- Class: core-capability
- Status: validated
- Description: Dark-first design system using Tailwind CSS v4 with custom theme — teal/cyan primary, slate secondary, orange accent, Inter body font, JetBrains Mono code font, class-based dark mode
- Why it matters: Visual identity and consistency across all pages
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: Build output contains all custom theme tokens; design tokens resolve in dev server; dark variant compiles correctly. Validated in S01.
- Notes: Tailwind v4 uses Vite plugin, `@import "tailwindcss"`, `@custom-variant dark`

### R004 — Blog posts as Markdown/MDX with extended frontmatter schema — title, description, pubDate, updatedDate, tags, featured, draft, heroImage, canonicalURL
- Class: core-capability
- Status: validated
- Description: Blog posts as Markdown/MDX with extended frontmatter schema — title, description, pubDate, updatedDate, tags, featured, draft, heroImage, canonicalURL
- Why it matters: Foundation for the entire blog system
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: none
- Validation: Extended schema with tags, featured, draft, canonicalURL builds successfully with all 8 posts. All frontmatter fields validated by Zod at build time. Proof: npm run build zero errors + scripts/verify-s02.sh checks 1-2. Validated in S02.
- Notes: Extends existing Zod schema

### R005 — Blog listing paginated at 10 posts per page with navigation controls
- Class: primary-user-loop
- Status: validated
- Description: Blog listing paginated at 10 posts per page with navigation controls
- Why it matters: Usable blog listing as content grows
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: none
- Validation: Paginated listing at /blog/ uses Astro paginate() with pageSize 10. BlogCard grid with reading time renders on listing page. Proof: dist/blog/index.html exists with cards. scripts/verify-s02.sh checks 3-4. Validated in S02.
- Notes: Uses Astro's built-in `paginate()` in `getStaticPaths`

### R006 — Individual `/blog/tag/[tag]` archive pages for each tag, plus tag filtering on blog listing
- Class: primary-user-loop
- Status: validated
- Description: Individual `/blog/tag/[tag]` archive pages for each tag, plus tag filtering on blog listing
- Why it matters: Content discoverability by topic
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: M001/S02
- Validation: 9 tag archive pages generated at /blog/tag/[tag]/ with paginated routes (pageSize 10). Tag pills in BlogCard and BlogPost are navigable <a> links pointing to correct archive routes. Draft tags excluded from production. Proof: scripts/verify-s04.sh checks [Tag Archives] + [Tag Pill Links] (4 checks). Validated in S04.
- Notes: Tags defined in frontmatter

### R007 — Reading time estimate displayed on blog listing and post header (200 words/min, rounded to nearest minute)
- Class: primary-user-loop
- Status: validated
- Description: Reading time estimate displayed on blog listing and post header (200 words/min, rounded to nearest minute)
- Why it matters: Sets reader expectations
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: none
- Validation: Reading time (200 WPM, Math.ceil, min 1) displayed on both blog cards and post headers. Proof: grep 'min read' matches in listing and all post HTML. scripts/verify-s02.sh checks 5, 10-11. Validated in S02.
- Notes: Calculated from Markdown body at build time

### R008 — Auto-generated TOC from h2/h3 headings, sticky sidebar on desktop, scroll-spy active link highlighting, only for posts >1000 words
- Class: primary-user-loop
- Status: validated
- Description: Auto-generated TOC from h2/h3 headings, sticky sidebar on desktop, scroll-spy active link highlighting, only for posts >1000 words
- Why it matters: Long-form technical content needs navigation
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: TOC auto-generated from h2/h3 headings via Astro render() destructuring. Sticky sidebar on desktop (lg:grid-cols-[1fr_250px]). Scroll-spy via IntersectionObserver with rootMargin for sticky header offset. Only appears on posts with readingTime >= 5 AND headings. Short posts remain single-column. scroll-margin-top: 5rem on prose headings. Proof: scripts/verify-s04.sh checks [Table of Contents] + [TOC Absent on Short Post] (6 checks). Scroll-spy runtime behavior requires UAT. Validated in S04.
- Notes: Requires client-side JS for scroll-spy (Astro island)

### R009 — Shiki syntax highlighting with dual themes (github-dark/github-light matching dark mode), copy button on code blocks
- Class: core-capability
- Status: validated
- Description: Shiki syntax highlighting with dual themes (github-dark/github-light matching dark mode), copy button on code blocks
- Why it matters: Core to technical blog readability
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S04 (copy button)
- Validation: Shiki dual themes (github-dark/github-light) via CSS variables confirmed in S02. Copy button added in S04: self-activating script island finds all .astro-code blocks, wraps in container, injects absolute-positioned copy button with navigator.clipboard.writeText() and "Copied!" feedback. Proof: scripts/verify-s02.sh check 1 (Shiki) + scripts/verify-s04.sh check [Copy Button] (1 check). Fully validated across S02 + S04.
- Notes: Shiki built into Astro, copy button needs client JS. Dual themes validated in S02, copy button is S04 scope.

### R010 — Related posts section at bottom of blog posts, based on shared tags
- Class: primary-user-loop
- Status: validated
- Description: Related posts section at bottom of blog posts, based on shared tags
- Why it matters: Keeps readers engaged, reduces bounce rate
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: RelatedPosts component shows up to 3 tag-matched posts (scored by overlap count, then date). Excludes current post and drafts. Renders compact cards (title, date, reading time). Returns empty fragment when no tag matches. Proof: scripts/verify-s04.sh checks [Related Posts] (2 checks) — section present on tagged posts, absent on tagless posts. Validated in S04.
- Notes: Tag-based matching

### R011 — Share buttons for X, LinkedIn, Dev.to on individual blog posts
- Class: primary-user-loop
- Status: validated
- Description: Share buttons for X, LinkedIn, Dev.to on individual blog posts
- Why it matters: Enables content distribution from the post itself
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: ShareButtons component renders X (twitter.com/intent/tweet), LinkedIn (linkedin.com/sharing/share-offsite), and Dev.to (dev.to/new?prefill=...) share links. All target="_blank" rel="noopener noreferrer" with SVG icons and aria-labels. URL-based, no third-party JS. Proof: scripts/verify-s04.sh checks [Share Buttons] (3 checks). Validated in S04.
- Notes: URL-based share links, no third-party JS needed

### R015 — Template-based Open Graph images (1200x630) generated at build time from post title, tags, and branding using Satori + Sharp
- Class: launchability
- Status: validated
- Description: Template-based Open Graph images (1200x630) generated at build time from post title, tags, and branding using Satori + Sharp
- Why it matters: Professional appearance when links shared on social media
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: 7 non-draft posts generate 1200×630 PNG OG images in dist/og/ via Satori + Sharp. Draft posts excluded. Dimensions confirmed via Sharp metadata. Proof: scripts/verify-s03.sh checks [1] (7 checks). Validated in S03.
- Notes: Sharp already in deps. Satori renders JSX to SVG, Sharp converts to PNG.

### R016 — Dynamic meta tags per page, Open Graph tags, Twitter Card tags, JSON-LD structured data for blog posts, canonical URLs pointing to vahagn.dev
- Class: launchability
- Status: validated
- Description: Dynamic meta tags per page, Open Graph tags, Twitter Card tags, JSON-LD structured data for blog posts, canonical URLs pointing to vahagn.dev
- Why it matters: Search engine discoverability and social media appearance
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M001/S01 (BaseHead)
- Validation: JSON-LD BlogPosting schema on blog posts with title, description, datePublished, author, keywords. og:image and twitter:image point to generated /og/{slug}.png. article:published_time and article:tag OG tags present. Canonical URL with frontmatter override support. Non-blog pages have og:type=website with no JSON-LD. Proof: scripts/verify-s03.sh checks [2-4] (9 checks). Validated in S03.
- Notes: JSON-LD uses BlogPosting schema

### R017 — Auto-generated sitemap.xml, RSS feed from blog collection, robots.txt
- Class: launchability
- Status: validated
- Description: Auto-generated sitemap.xml, RSS feed from blog collection, robots.txt
- Why it matters: Search engine indexing and feed readers
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: RSS feed includes <category> elements from post tags (10+ across 7 posts). robots.txt has User-agent/Allow/Sitemap directives. Sitemap serialize config applies weekly changefreq and 0.8 priority to blog URLs. Proof: scripts/verify-s03.sh checks [5-7] (10 checks). Validated in S03.
- Notes: @astrojs/sitemap already installed, RSS exists but needs updating

### R018 — Dark mode toggle with localStorage persistence, system preference detection on first load, smooth transition, no FOUC
- Class: core-capability
- Status: validated
- Description: Dark mode toggle with localStorage persistence, system preference detection on first load, smooth transition, no FOUC
- Why it matters: Dark-first design is core to the identity
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: Three-state toggle persists across pages, respects system preference, no FOUC. Verified with browser testing in S01.
- Notes: Tailwind v4 `@custom-variant dark` with class strategy

## Deferred

### R027 — Search functionality across blog posts
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

### R028 — No admin dashboard or CMS — content managed via Markdown files in git
- Class: anti-feature
- Status: out-of-scope
- Description: No admin dashboard or CMS — content managed via Markdown files in git
- Why it matters: Prevents scope creep into backend infrastructure
- Source: research
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Dev-friendly workflow is the feature

### R029 — No comments on blog posts
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
| R001 | core-capability | validated | M001/S01 | none | Build output contains all custom theme tokens; design tokens resolve in dev server; dark variant compiles correctly. Validated in S01. |
| R002 | quality-attribute | active | M001/S01 | all slices | unmapped |
| R003 | primary-user-loop | active | M001/S07 | M001/S02, M001/S05 | unmapped |
| R004 | core-capability | validated | M001/S02 | none | Extended schema with tags, featured, draft, canonicalURL builds successfully with all 8 posts. All frontmatter fields validated by Zod at build time. Proof: npm run build zero errors + scripts/verify-s02.sh checks 1-2. Validated in S02. |
| R005 | primary-user-loop | validated | M001/S02 | none | Paginated listing at /blog/ uses Astro paginate() with pageSize 10. BlogCard grid with reading time renders on listing page. Proof: dist/blog/index.html exists with cards. scripts/verify-s02.sh checks 3-4. Validated in S02. |
| R006 | primary-user-loop | validated | M001/S04 | M001/S02 | 9 tag archive pages generated at /blog/tag/[tag]/ with paginated routes (pageSize 10). Tag pills in BlogCard and BlogPost are navigable <a> links pointing to correct archive routes. Draft tags excluded from production. Proof: scripts/verify-s04.sh checks [Tag Archives] + [Tag Pill Links] (4 checks). Validated in S04. |
| R007 | primary-user-loop | validated | M001/S02 | none | Reading time (200 WPM, Math.ceil, min 1) displayed on both blog cards and post headers. Proof: grep 'min read' matches in listing and all post HTML. scripts/verify-s02.sh checks 5, 10-11. Validated in S02. |
| R008 | primary-user-loop | validated | M001/S04 | none | TOC auto-generated from h2/h3 headings via Astro render() destructuring. Sticky sidebar on desktop (lg:grid-cols-[1fr_250px]). Scroll-spy via IntersectionObserver with rootMargin for sticky header offset. Only appears on posts with readingTime >= 5 AND headings. Short posts remain single-column. scroll-margin-top: 5rem on prose headings. Proof: scripts/verify-s04.sh checks [Table of Contents] + [TOC Absent on Short Post] (6 checks). Scroll-spy runtime behavior requires UAT. Validated in S04. |
| R009 | core-capability | validated | M001/S02 | M001/S04 (copy button) | Shiki dual themes (github-dark/github-light) via CSS variables confirmed in S02. Copy button added in S04: self-activating script island finds all .astro-code blocks, wraps in container, injects absolute-positioned copy button with navigator.clipboard.writeText() and "Copied!" feedback. Proof: scripts/verify-s02.sh check 1 (Shiki) + scripts/verify-s04.sh check [Copy Button] (1 check). Fully validated across S02 + S04. |
| R010 | primary-user-loop | validated | M001/S04 | none | RelatedPosts component shows up to 3 tag-matched posts (scored by overlap count, then date). Excludes current post and drafts. Renders compact cards (title, date, reading time). Returns empty fragment when no tag matches. Proof: scripts/verify-s04.sh checks [Related Posts] (2 checks) — section present on tagged posts, absent on tagless posts. Validated in S04. |
| R011 | primary-user-loop | validated | M001/S04 | none | ShareButtons component renders X (twitter.com/intent/tweet), LinkedIn (linkedin.com/sharing/share-offsite), and Dev.to (dev.to/new?prefill=...) share links. All target="_blank" rel="noopener noreferrer" with SVG icons and aria-labels. URL-based, no third-party JS. Proof: scripts/verify-s04.sh checks [Share Buttons] (3 checks). Validated in S04. |
| R012 | core-capability | active | M001/S05 | none | unmapped |
| R013 | launchability | active | M001/S06 | none | unmapped |
| R014 | differentiator | active | M001/S06 | none | unmapped |
| R015 | launchability | validated | M001/S03 | none | 7 non-draft posts generate 1200×630 PNG OG images in dist/og/ via Satori + Sharp. Draft posts excluded. Dimensions confirmed via Sharp metadata. Proof: scripts/verify-s03.sh checks [1] (7 checks). Validated in S03. |
| R016 | launchability | validated | M001/S03 | M001/S01 (BaseHead) | JSON-LD BlogPosting schema on blog posts with title, description, datePublished, author, keywords. og:image and twitter:image point to generated /og/{slug}.png. article:published_time and article:tag OG tags present. Canonical URL with frontmatter override support. Non-blog pages have og:type=website with no JSON-LD. Proof: scripts/verify-s03.sh checks [2-4] (9 checks). Validated in S03. |
| R017 | launchability | validated | M001/S03 | none | RSS feed includes <category> elements from post tags (10+ across 7 posts). robots.txt has User-agent/Allow/Sitemap directives. Sitemap serialize config applies weekly changefreq and 0.8 priority to blog URLs. Proof: scripts/verify-s03.sh checks [5-7] (10 checks). Validated in S03. |
| R018 | core-capability | validated | M001/S01 | none | Three-state toggle persists across pages, respects system preference, no FOUC. Verified with browser testing in S01. |
| R019 | launchability | active | M001/S07 | none | unmapped |
| R020 | quality-attribute | active | M001/S01 | all slices | unmapped |
| R021 | operability | active | M002 | none | unmapped |
| R022 | launchability | active | M002 | none | unmapped |
| R023 | quality-attribute | active | M002 | none | unmapped |
| R024 | operability | active | M002 | none | unmapped |
| R025 | primary-user-loop | active | M003 | M001/S07 (visual form) | unmapped |
| R026 | core-capability | active | M003 | none | unmapped |
| R027 | primary-user-loop | deferred | none | none | unmapped |
| R028 | anti-feature | out-of-scope | none | none | n/a |
| R029 | anti-feature | out-of-scope | none | none | n/a |

## Coverage Summary

- Active requirements: 13
- Mapped to slices: 13
- Validated: 13 (R001, R004, R005, R006, R007, R008, R009, R010, R011, R015, R016, R017, R018)
- Unmapped active requirements: 0

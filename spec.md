Here’s your spec as a clean Markdown document you can save as `vahagn-dev-spec.md`:

```markdown
# vahagn.dev: Architecture, Implementation Spec & Build Prompt

## Project Overview

Personal developer site for Vahagn – a developer, network engineer, security engineer, and architect specializing in security automation, agentic AI, and network architecture. The site serves as canonical home for blog content, architecture showcases, and project portfolio.

**Primary Goals:**
- Establish vahagn.dev as canonical source of truth for all content
- Showcase architecture thinking through visual diagrams and deep technical writing
- Own the audience (newsletter, no algorithm dependency)
- Maximize SEO authority and developer discoverability
- Enable fast content publishing workflow

## Technical Architecture

### Stack Decision Matrix

| Layer      | Technology              | Justification                                           |
|-----------|-------------------------|---------------------------------------------------------|
| Framework | Astro 4.x               | Zero-JS default, perfect Lighthouse scores, Markdown-native |
| Hosting   | Cloudflare Pages        | Already using CF, free tier, auto-deploy, global CDN   |
| Domain    | vahagn.dev              | Canonical URL for all cross-posts                      |
| Content   | Markdown + Frontmatter  | Dev-friendly, version control, portable                |
| Styling   | Tailwind CSS            | Utility-first, fast iteration, consistent design system |
| Analytics | Cloudflare Web Analytics| Privacy-friendly, no JS overhead, built-in dashboard   |
| Newsletter| Buttondown or Beehiiv   | Simple API, owned list, Markdown support               |

### System Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                        vahagn.dev                          │
│                    (Cloudflare Pages)                      │
└───────────────────────┬────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    ┌───────┐      ┌────────┐     ┌──────────┐
    │ Blog  │      │Projects│     │Newsletter│
    │ /blog │      │  /work │     │  Signup  │
    └───┬───┘      └────────┘     └──────────┘
        │
        │ Cross-post with canonical URL
        │
        ├──────────┬──────────┬──────────┐
        ▼          ▼          ▼          ▼
    ┌──────┐  ┌────────┐  ┌─────┐  ┌──────┐
    │Dev.to│  │LinkedIn│  │  X  │  │Reddit│
    └──────┘  └────────┘  └─────┘  └──────┘
         All point back to vahagn.dev
```

### Content Architecture

**Site Structure:**

- **Homepage** (`/`)
  - Hero section with name, roles, one-line value prop
  - Featured recent blog posts (3–4 cards)
  - Project highlights (3–4 cards with thumbnails)
  - Newsletter signup CTA

- **Blog** (`/blog`)
  - Paginated list of articles
  - Filter by tags (security, networking, AI, architecture)
  - RSS feed auto-generated
  - Reading time estimates

- **Individual Post** (`/blog/[slug]`)
  - Full article with TOC for long posts
  - Code syntax highlighting
  - Image optimization
  - Share buttons (X, LinkedIn, Dev.to)
  - Related posts section

- **Projects** (`/work`)
  - Grid of project cards
  - Each card: screenshot/diagram, title, tech stack, GitHub link
  - Filter by category (security, AI, networking, trading)

- **About** (`/about`)
  - Bio covering all roles (dev, network eng, security eng, architect)
  - Current focus areas
  - Contact links (email, GitHub, LinkedIn, X)
  - Skills/tech stack visual

- **Architecture Gallery** (`/architecture`)
  - Visual showcase of architecture diagrams
  - Each diagram: image, context, problem solved, tech decisions
  - Filterable by domain (security, network, cloud, AI)

### Blog Post Frontmatter Schema

```yaml
***
title: "Post Title"
description: "SEO meta description (150-160 chars)"
pubDate: 2026-03-09
author: "Vahagn"
tags: ["security", "networking", "AI", "architecture"]
featured: false
draft: false
heroImage: "/images/posts/post-slug-hero.jpg"
canonicalURL: "https://vahagn.dev/blog/post-slug"
***
```

### Performance Requirements

| Metric                  | Target         | Why                                         |
|-------------------------|----------------|---------------------------------------------|
| Lighthouse Performance  | 95+            | Google ranking factor, user experience      |
| First Contentful Paint  | \<1.5s         | Core Web Vital, SEO signal                  |
| Time to Interactive     | \<3s           | User engagement, bounce rate                |
| Cumulative Layout Shift | \<0.1          | Core Web Vital, professional feel           |
| Bundle Size             | \<100KB initial| Fast global delivery, mobile-first          |

## Implementation Specification

### Phase 1: Foundation (Day 1)

**Deliverables:**
1. Astro project initialized with blog template
2. Tailwind CSS configured with custom theme
3. Basic layout components (Header, Footer, Navigation)
4. Homepage with hero and placeholder sections
5. Blog listing page with Markdown support
6. Single blog post template with syntax highlighting
7. Cloudflare Pages deployment configured

**Technical Requirements:**

- **Astro Config** (`astro.config.mjs`)
  - Output: `static` (SSG)
  - Integrations: tailwind, sitemap, mdx
  - Image optimization enabled
  - Build target: Cloudflare Pages

- **Tailwind Theme**
  - Custom color palette: primary (teal/cyan), secondary (slate), accent (orange)
  - Typography: Inter for body, JetBrains Mono for code
  - Dark mode support using class strategy
  - Container max-width: 1200px

- **Layout Components**
  - `BaseLayout.astro`: HTML structure, SEO meta tags, analytics
  - `Header.astro`: Logo, nav links (Blog, Work, About), theme toggle
  - `Footer.astro`: Social links, copyright, RSS link

- **Content Collections**
  - Define schema for blog posts in `src/content/config.ts`
  - Validate frontmatter at build time
  - Auto-generate types for TypeScript autocomplete

### Phase 2: Content & Features (Day 2–3)

**Deliverables:**
1. Projects page with project card grid
2. About page with bio and skills
3. Architecture gallery page with image lightbox
4. Newsletter signup form (Buttondown integration)
5. RSS feed generation
6. Sitemap generation
7. SEO meta tags and Open Graph images

**Technical Requirements:**

- **Project Data Structure** (`src/data/projects.ts`)
  - Array of project objects: title, description, image, tech stack, links
  - TypeScript interface for type safety
  - Filterable by category

- **Newsletter Integration**
  - Form component with email validation
  - API route to Buttondown/Beehiiv
  - Success/error state handling
  - GDPR-compliant (no auto-subscribe)

- **SEO Optimization**
  - Dynamic meta tags per page
  - Open Graph images (1200x630) auto-generated or custom
  - Twitter Card meta tags
  - Canonical URLs pointing to vahagn.dev
  - JSON-LD structured data for blog posts

- **Image Optimization**
  - Use Astro's Image component
  - WebP format with fallbacks
  - Responsive `srcset` generation
  - Lazy loading below fold

### Phase 3: Polish & Deploy (Day 4)

**Deliverables:**
1. Dark mode toggle with system preference detection
2. Code syntax highlighting (Shiki)
3. Reading time calculation for blog posts
4. Table of contents for long posts
5. Related posts suggestions
6. 404 page
7. Cloudflare Web Analytics setup
8. Domain DNS configuration

**Technical Requirements:**

- **Dark Mode**
  - Tailwind `dark` class strategy
  - `localStorage` persistence
  - System preference detection on first load
  - Smooth transition animation

- **Syntax Highlighting**
  - Shiki with VS Code themes (dark: `github-dark`, light: `github-light`)
  - Language detection from code fence
  - Copy button on code blocks
  - Line number support

- **Reading Time**
  - Calculate from Markdown body (200 words/min avg)
  - Display on blog listing and post header
  - Round to nearest minute

- **TOC Generation**
  - Extract `h2`, `h3` from Markdown AST
  - Sticky sidebar on desktop
  - Scroll-spy active link highlighting
  - Only show for posts \>1000 words

### Deployment Configuration

**Cloudflare Pages Setup:**

1. **Repository Connection**
   - Connect GitHub repo to Cloudflare Pages
   - Branch: `main` for production, `dev` for preview

2. **Build Settings**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

3. **Environment Variables**
   - `NODE_VERSION=20`
   - `BUTTONDOWN_API_KEY=<your-key>`

4. **Custom Domain**
   - Add `vahagn.dev` in Pages dashboard
   - Cloudflare will auto-configure DNS records
   - Enable **Always Use HTTPS**
   - Enable **Automatic HTTPS Rewrites**

5. **Performance Optimizations**
   - Enable Auto Minify (JS, CSS, HTML)
   - Enable Brotli compression
   - Set Browser Cache TTL: 4 hours
   - Enable Cloudflare Web Analytics

### File Structure

```text
vahagn-dev/
├── src/
│   ├── components/
│   │   ├── BaseLayout.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BlogCard.astro
│   │   ├── ProjectCard.astro
│   │   └── NewsletterForm.astro
│   ├── content/
│   │   ├── config.ts
│   │   └── blog/
│   │       └── first-post.md
│   ├── data/
│   │   └── projects.ts
│   ├── layouts/
│   │   ├── BlogPost.astro
│   │   └── Page.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── work.astro
│   │   ├── about.astro
│   │   ├── architecture.astro
│   │   └── 404.astro
│   └── styles/
│       └── global.css
├── public/
│   ├── images/
│   └── robots.txt
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
└── package.json
```

## GSD Build Prompt

**Context:** You are building a personal developer site for Vahagn, a developer/network engineer/security engineer/architect specializing in security automation, agentic AI, and network architecture. The site needs to be fast, SEO-optimized, and serve as the canonical home for all his content that gets cross-posted to Dev.to, LinkedIn, and X.

**Requirements:**

**Stack:**
- Astro 4.x (static site generation)
- Tailwind CSS for styling
- TypeScript for type safety
- Target deployment: Cloudflare Pages

**Core Features:**

1. **Homepage** with:
   - Hero section: "Vahagn" + tagline "Developer, Security Engineer, Architect"
   - Featured blog posts (3 cards with image, title, excerpt, date, tags)
   - Project highlights (3 cards with thumbnail, title, tech stack)
   - Newsletter signup form
   - Clean, modern design with dark mode support

2. **Blog System** with:
   - `/blog` – Paginated list of posts (10 per page)
   - `/blog/[slug]` – Individual post template
   - Markdown content with frontmatter (title, description, pubDate, tags, heroImage)
   - Code syntax highlighting using Shiki (VS Code themes)
   - Reading time calculation (200 words/min)
   - Tag filtering
   - RSS feed auto-generation
   - SEO: meta tags, Open Graph, canonical URLs

3. **Projects Page** (`/work`):
   - Grid layout of project cards
   - Each card: image, title, description, tech stack badges, GitHub link
   - Filter by category (security, AI, networking, trading)

4. **About Page** (`/about`):
   - Bio covering roles (dev, network eng, security eng, architect)
   - Current focus areas
   - Contact links (email, GitHub, LinkedIn, X)
   - Skills section with tech stack icons/list

5. **Architecture Gallery** (`/architecture`):
   - Showcase of architecture diagrams with context
   - Grid of images with title and description
   - Lightbox/modal on click for full-size view

**Design System:**
- Primary color: Teal/Cyan (`#06b6d4` or similar)
- Secondary: Slate grays (`#64748b` family)
- Accent: Orange (`#f97316` or similar)
- Typography: Inter for body, JetBrains Mono for code
- Dark mode default with toggle
- Max content width: 1200px
- Spacing: Tailwind defaults
- Border radius: `rounded-lg` (0.5rem)

**Performance Targets:**
- Lighthouse score: 95+ across all metrics
- First Contentful Paint: \<1.5s
- Zero JavaScript on static pages (Astro islands for interactive components only)
- Optimized images (WebP with fallbacks, lazy loading)

**SEO Requirements:**
- `sitemap.xml` auto-generated
- `robots.txt`
- Meta descriptions on all pages
- Open Graph images (1200x630)
- Twitter Card meta tags
- JSON-LD structured data for blog posts
- Canonical URLs: `https://vahagn.dev/*`

**Deployment:**
- Configure for Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- Include `.nvmrc` or set `NODE_VERSION=20`

**Content Structure:**

Blog post frontmatter example:

```yaml
***
title: "Building Agentic Security Automation"
description: "How I built an AI-powered security automation framework using LangChain and Sentinel"
pubDate: 2026-03-09
tags: ["security", "AI", "automation"]
heroImage: "/images/posts/security-ai.jpg"
***
```

Project data structure (TypeScript):

```ts
interface Project {
  title: string;
  description: string;
  image: string;
  category: 'security' | 'ai' | 'networking' | 'trading';
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}
```

**Starter Content:**

Create placeholder content for:
- 2 sample blog posts (one about security automation, one about network architecture)
- 4 sample projects (Sentinel framework, Traffic Flow Analyzer, Trading Bot, AI Agent System)
- About page bio and skills list
- 2 sample architecture diagrams (as placeholder images with descriptions)

**Instructions:**
1. Initialize Astro project with blog template
2. Configure Tailwind with custom theme
3. Create all layout components (BaseLayout, Header, Footer)
4. Set up content collections for blog posts
5. Build all pages per spec above
6. Configure Cloudflare Pages adapter
7. Add sitemap, RSS, and robots.txt
8. Implement dark mode toggle with `localStorage` persistence
9. Add code syntax highlighting and reading time
10. Create sample content
11. Test build and ensure Lighthouse 95+ score

**Deliverable:** Complete Astro site ready to deploy to Cloudflare Pages, with all features working, sample content populated, and optimized for performance and SEO.

---

**Note:** This prompt assumes you're using an AI coding assistant (Cursor, Cody, GitHub Copilot, or Claude Code) that can scaffold the entire project. If building manually, follow the implementation spec phases above in sequence.
```

You can copy this into a file named `vahagn-dev-spec.md`.
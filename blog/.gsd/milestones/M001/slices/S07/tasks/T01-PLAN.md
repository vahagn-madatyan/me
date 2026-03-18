---
estimated_steps: 6
estimated_files: 2
---

# T01: Build complete homepage with hero, featured posts, and project highlights

**Slice:** S07 — Homepage & Polish
**Milestone:** M001

## Description

Rewrite the placeholder `index.astro` into a full homepage with four sections: hero, featured blog posts, project highlights, and newsletter CTA. This is the slice's critical deliverable — it wires real data from the blog content collection and the projects data file into the site's landing page, fulfilling R003.

The NewsletterForm component is created here because it's part of the homepage assembly — it's a visual-only form (D008) with no backend wiring.

**Relevant skill:** `frontend-design` — load for design quality guidance on the homepage layout.

## Steps

1. **Create `src/components/NewsletterForm.astro`** — a visual-only newsletter signup component:
   - Email text input (type="email", placeholder "your@email.com") + submit button ("Subscribe")
   - Wrapped in a `<form>` tag with **no `action` attribute** and **no JavaScript** — purely visual per D008
   - Style with a distinct CTA section feel: subtle background (`bg-secondary-50 dark:bg-secondary-800/50`), rounded container, centered layout
   - Use static Tailwind classes matching the site's design language (rounded-lg, primary-colored button, etc.)

2. **Rewrite `src/pages/index.astro`** frontmatter — import dependencies and query data:
   - Import: `BaseLayout`, `BlogCard`, `ProjectCard`, `NewsletterForm`, `getCollection`, `getReadingTime`, `SITE_TITLE`, `SITE_DESCRIPTION`, `projects` from `../data/projects`
   - Query blog posts: `const allPosts = (await getCollection('blog')).filter(post => import.meta.env.PROD ? !post.data.draft : true).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())`
   - Get featured posts: `const featuredPosts = allPosts.filter(p => p.data.featured)` — if fewer than 3, fill remaining slots from latest non-featured posts to reach 3 total
   - Compute reading time for each featured post: `const postsWithReadingTime = featuredPosts.map(post => ({ ...post, readingTime: getReadingTime(post.body ?? '') }))`
   - Select project highlights: `const highlightedProjects = projects.slice(0, 4)` — first 4 entries

3. **Build hero section** in template:
   - Keep the existing hero structure (name, tagline, CTA buttons) but ensure it sits within `max-w-3xl px-4 py-20 sm:px-6`
   - Name: "Vahagn Grigoryan" in large heading
   - Tagline from `SITE_DESCRIPTION`
   - Two CTA buttons: "Read the Blog" → /blog, "About Me" → /about (matching current styling)

4. **Build featured posts section:**
   - Section heading: "Featured Posts" or "Latest Writing" with a "View all →" link to /blog
   - Render `postsWithReadingTime` in a responsive grid (`grid-cols-1 sm:grid-cols-2` or `sm:grid-cols-3` depending on count) using `<BlogCard>` for each
   - Pass BlogCard props: `title={post.data.title}`, `description={post.data.description}`, `pubDate={post.data.pubDate}`, `heroImage={post.data.heroImage}`, `tags={post.data.tags}`, `readingTime={post.readingTime}`, `slug={post.id}`
   - Note: BlogCard expects `slug` not `id`, but Astro content collection uses `post.id` — pass `post.id` as the slug prop (this is what `[...page].astro` does)

5. **Build project highlights section:**
   - Section heading: "Projects" or "Featured Work" with a "View all →" link to /work
   - Render `highlightedProjects` in a `grid-cols-1 sm:grid-cols-2` grid using `<ProjectCard>`
   - Spread project props: `title`, `description`, `category`, `techStack`, `githubUrl`, `liveUrl`

6. **Add newsletter CTA section:**
   - Place `<NewsletterForm />` at the bottom before the closing `</BaseLayout>`
   - The component is self-contained — just drop it in

## Must-Haves

- [ ] `src/components/NewsletterForm.astro` exists with email input and submit button, no `action` attribute, no JS
- [ ] `src/pages/index.astro` imports and renders `BlogCard` with real blog collection data including reading time
- [ ] `src/pages/index.astro` imports and renders `ProjectCard` with real project data from `projects.ts`
- [ ] Featured posts query handles <3 featured posts by falling back to latest posts
- [ ] All Tailwind classes are static (no dynamic class construction)
- [ ] `npm run build` succeeds with zero errors

## Verification

- `npm run build` — zero errors
- `grep -q 'Vahagn Grigoryan' dist/index.html` — hero name present
- `grep -q 'min read' dist/index.html` — reading time from BlogCard present
- `grep -q 'building-a-developer-blog' dist/index.html` — featured post slug linked
- `grep -qi 'github' dist/index.html` — project GitHub links present
- `grep -qi 'subscribe\|newsletter\|email' dist/index.html` — newsletter form present
- `grep -qi 'VaultBreaker\|CortexML\|PacketForge\|AlphaGrid' dist/index.html` — project titles from projects.ts

## Inputs

- `src/pages/index.astro` — current placeholder to rewrite (has hero with name/tagline/CTAs)
- `src/components/BlogCard.astro` — reusable card component; props: `{ title, description, pubDate, heroImage?, tags?, readingTime, slug }`
- `src/components/ProjectCard.astro` — reusable card component; props: `{ title, description, category, techStack, githubUrl, liveUrl? }`
- `src/data/projects.ts` — exports `projects` array and `Project` type; 6 entries across 4 categories
- `src/utils/reading-time.ts` — exports `getReadingTime(content: string): number`
- `src/content.config.ts` — blog schema with `featured: z.boolean().default(false)`
- `src/consts.ts` — exports `SITE_TITLE`, `SITE_DESCRIPTION`
- Only 1 post has `featured: true` — `building-a-developer-blog.md`. Homepage must fill remaining slots with latest posts.
- Reading time must be computed via `getReadingTime(post.body ?? '')` in the page frontmatter, NOT in BlogCard.
- Use `post.id` as the `slug` prop for BlogCard (Astro content collection pattern).

## Expected Output

- `src/components/NewsletterForm.astro` — new: visual-only newsletter form component with email input and styled submit button
- `src/pages/index.astro` — rewritten: full homepage with hero, featured blog posts (BlogCard), project highlights (ProjectCard), and newsletter CTA — all wired to real data

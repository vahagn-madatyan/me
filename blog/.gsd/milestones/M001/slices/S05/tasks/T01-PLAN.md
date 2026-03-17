---
estimated_steps: 5
estimated_files: 2
---

# T01: Create project data file and ProjectCard component

**Slice:** S05 — Projects Page
**Milestone:** M001

## Description

Create the TypeScript data file defining the `Project` interface and sample projects, plus the `ProjectCard.astro` component that renders individual project cards. These two files form the boundary contract that S07 (Homepage) will consume for project highlights. The card follows BlogCard's established visual patterns — rounded corners, ring border, hover effects, dark mode variants — adapted for project-specific content (tech stack badges, GitHub link instead of date/reading time).

**Relevant installed skill:** `frontend-design` — load if you need design guidance for card styling.

## Steps

1. Create `src/data/projects.ts`:
   - Define and export a `Project` interface: `title: string`, `description: string`, `category: "security" | "ai" | "networking" | "trading"`, `techStack: string[]`, `githubUrl: string`, `liveUrl?: string`, `image?: string`
   - Export a `projects` array with 4-6 sample projects — at least one per category so the filter has data for every tab. Use realistic project names and descriptions for a security/AI/networking/trading developer. GitHub URLs can be placeholder `https://github.com/username/project-name` format.

2. Create `src/components/ProjectCard.astro`:
   - Props interface mirrors the `Project` fields (accept them individually, not the whole Project type — keeps it decoupled like BlogCard does)
   - Card structure following BlogCard patterns:
     - Outer `<article>` with `class="group rounded-2xl bg-white shadow-sm ring-1 ring-secondary-200 transition-all duration-300 hover:shadow-lg hover:ring-primary-300 dark:bg-secondary-900 dark:ring-secondary-800 dark:hover:ring-primary-700"`
     - Inner padding div with `p-5 sm:p-6`
     - Title as `<h3>` (not h2, since work page h1 is the page title) — `text-lg font-semibold text-secondary-900 dark:text-secondary-100`
     - Description paragraph — `text-sm text-secondary-600 dark:text-secondary-400`
     - Tech stack badges row — small pills similar to BlogCard tag badges: `rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200` — render as `<span>` not `<a>` (not linkable)
     - Bottom row with GitHub link (external, opens new tab, has GitHub SVG icon + "Source" text) and optional live URL link (external, globe icon + "Live" text)
     - Links styled with `text-secondary-500 hover:text-primary-500 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors`

3. Verify the component compiles: run `npx astro check` to catch type errors.

## Must-Haves

- [ ] `Project` interface exported from `src/data/projects.ts` with category as a union type of exactly `"security" | "ai" | "networking" | "trading"`
- [ ] `projects` array exported with at least 4 sample projects covering all 4 categories
- [ ] `ProjectCard.astro` renders title, description, tech stack badges, and GitHub link
- [ ] Dark mode classes on all card elements (bg, text, ring, badge colors)
- [ ] GitHub link opens in new tab with `target="_blank"` and `rel="noopener noreferrer"`

## Verification

- `npx astro check` completes with no errors related to the new files
- Manually inspect that `src/data/projects.ts` exports the interface and array
- Manually inspect that `ProjectCard.astro` has all visual elements: title, description, badges, GitHub link

## Inputs

- `src/components/BlogCard.astro` — reference for card visual patterns (rounded-2xl, ring, hover, dark mode, badge styling)
- `src/styles/global.css` — design token reference (primary-*, secondary-*, accent-* color scales)
- S01 Summary — BaseLayout accepts title/description/image props; dark mode uses `.dark` class + `dark:` prefix

## Expected Output

- `src/data/projects.ts` — new file with exported `Project` interface and `projects` array (4-6 entries across all 4 categories)
- `src/components/ProjectCard.astro` — new component rendering a single project card with all visual elements

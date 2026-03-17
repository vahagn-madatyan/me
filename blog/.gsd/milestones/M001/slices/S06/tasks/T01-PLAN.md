---
estimated_steps: 4
estimated_files: 1
---

# T01: Build about page with bio, skills grid, and contact links

**Slice:** S06 — About & Architecture
**Milestone:** M001

## Description

Replace the placeholder content in `src/pages/about.astro` with a full about page covering bio, current focus areas, skills/tech stack grid, and contact links. This is a static content page with no client JS — purely Tailwind-styled markup inside the existing BaseLayout wrapper. Closes requirement R013.

Use the same social URLs already in `src/components/Footer.astro`:
- GitHub: `https://github.com/vahagn-grigoryan`
- LinkedIn: `https://linkedin.com/in/vahagn-grigoryan`
- X: `https://x.com/vahagn_dev`

Design tokens are in `src/styles/global.css` `@theme` block. Use `text-primary-*`, `bg-secondary-*`, `text-accent-*`, etc. with `dark:` variants for all sections. The page should be responsive and visually consistent with the rest of the site.

**Relevant skills:** `frontend-design` — load this skill for high-quality UI design guidance.

## Steps

1. Open `src/pages/about.astro` and replace the placeholder `<div>` content (keep the `BaseLayout` wrapper and its props intact)
2. Add a hero/intro section with name ("Vahagn Grigoryan"), role headline (software architect & engineer), and 2-3 bio paragraphs covering architecture, engineering, and technical interests
3. Add a "Current Focus" section with 3-4 focus area cards (e.g., distributed systems, AI/ML infrastructure, developer tools, security)
4. Add a "Skills & Tech Stack" section with a grid organized by category (Languages, Frameworks, Infrastructure, Tools). Use subtle card/badge styling with design tokens. Include relevant technologies across categories.
5. Add a "Get in Touch" section with contact links — use inline SVG icons matching Footer.astro's social icons (GitHub, LinkedIn, X) plus an email contact. Links should open in new tabs with `rel="noopener noreferrer"`.
6. Ensure all sections use `dark:` Tailwind variants for dark mode compatibility
7. Verify with `npm run build` — zero errors

## Must-Haves

- [ ] Bio section with name, role, and descriptive paragraphs
- [ ] Current focus areas section
- [ ] Skills/tech stack grid organized by category
- [ ] Contact links with GitHub, LinkedIn, X (same URLs as Footer.astro) plus email
- [ ] All social links have accessible labels (`aria-label`)
- [ ] Dark mode works (all sections use `dark:` variants)
- [ ] Responsive layout (works on mobile and desktop)
- [ ] BaseLayout wrapper preserved with title/description props

## Verification

- `npm run build` — zero errors, `/about/index.html` exists in `dist/`
- Build output contains: bio text, skills section, GitHub/LinkedIn/X link hrefs
- Dev server `/about` — all sections render, contact links work, responsive at 390px and 1280px, dark mode toggles correctly

## Inputs

- `src/pages/about.astro` — existing placeholder page wrapped in BaseLayout. Replace inner content only.
- `src/components/Footer.astro` — reference for social link URLs and SVG icons:
  - GitHub: `https://github.com/vahagn-grigoryan` (SVG viewBox `0 0 16 16`)
  - LinkedIn: `https://linkedin.com/in/vahagn-grigoryan` (SVG viewBox `0 0 24 24`)
  - X: `https://x.com/vahagn_dev` (SVG viewBox `0 0 24 24`)
- Design tokens in `src/styles/global.css` `@theme` block — use `text-primary-400`, `bg-secondary-900`, `text-accent-500`, etc.

## Expected Output

- `src/pages/about.astro` — full about page with bio, focus areas, skills grid, and contact links. No placeholder text remains. Dark mode and responsive layout working.

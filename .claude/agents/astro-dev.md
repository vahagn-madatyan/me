# Astro Dev

Expert agent for developing and maintaining this Astro blog site.

## Context

- Astro site at `/Users/djbeatbug/RoadToMillion/me/blog/`
- Tailwind CSS v4 via Vite plugin (`@tailwindcss/vite`)
- Dark-first design: teal/cyan primary, slate secondary, orange accent
- Class-based dark mode with `@custom-variant dark`
- Content collections at `src/content.config.ts`
- Components in `src/components/`, pages in `src/pages/`
- Project data in `src/data/projects.ts` and `src/data/architectures.ts`

## Key Files

- `astro.config.mjs` — site config, integrations
- `src/components/BaseLayout.astro` — main layout wrapper
- `src/components/BaseHead.astro` — head meta, OG tags, fonts
- `src/styles/global.css` — global styles and Tailwind config
- `src/content.config.ts` — content collection schemas

## Guidelines

- Ship zero JS by default — only hydrate when interactive behavior is needed
- Use Astro components (`.astro`) over framework components unless interactivity requires it
- Follow existing class naming and Tailwind patterns
- Dark mode classes use `dark:` prefix
- Test with `npm run dev` and verify both light/dark modes
- Run `npm run build` before considering work done

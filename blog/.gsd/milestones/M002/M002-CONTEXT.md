# M002: Deployment — Context

**Gathered:** 2026-03-15
**Status:** Waiting for M001

## Project Description

Deploy the completed vahagn.dev site to Cloudflare Pages with custom domain, automated build pipeline, performance optimization, and analytics.

## Why This Milestone

M001 builds the site locally. M002 makes it live on the internet at vahagn.dev. Until this ships, there's no public presence and no canonical URL for cross-posting (M003).

## User-Visible Outcome

### When this milestone is complete, the user can:

- Push to `main` branch and see the site auto-deploy to vahagn.dev
- Visit https://vahagn.dev and browse the full site
- See Lighthouse scores of 95+ across all metrics
- View traffic analytics in Cloudflare dashboard

### Entry point / environment

- Entry point: https://vahagn.dev
- Environment: Cloudflare Pages (production)
- Live dependencies involved: Cloudflare Pages, Cloudflare DNS, GitHub (deploy trigger)

## Completion Class

- Contract complete means: site builds and deploys, all pages accessible at vahagn.dev
- Integration complete means: git push → auto-deploy → live site → analytics tracking
- Operational complete means: HTTPS, caching, compression all working in production

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- Push a commit to main → site auto-deploys to vahagn.dev within minutes
- All pages load at https://vahagn.dev with HTTPS
- Lighthouse audit scores 95+ on all metrics
- Cloudflare Web Analytics shows page views

## Risks and Unknowns

- Cloudflare Pages adapter for Astro 6 — verify compatibility
- DNS propagation timing for vahagn.dev
- OG image generation at scale — build time impact with many posts

## Existing Codebase / Prior Art

- Complete site from M001 — all pages, blog engine, SEO infrastructure
- `astro.config.mjs` — needs `site` URL updated to `https://vahagn.dev`

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions.

## Relevant Requirements

- R021 — Cloudflare Pages build pipeline
- R022 — Custom domain + DNS + SSL
- R023 — Performance optimization
- R024 — Cloudflare Web Analytics

## Scope

### In Scope

- Cloudflare Pages project setup and GitHub integration
- Custom domain configuration (vahagn.dev)
- Build settings (output directory, Node version)
- Performance tuning (minify, Brotli, cache headers)
- Cloudflare Web Analytics integration
- Preview deployments from dev branch

### Out of Scope / Non-Goals

- Newsletter wiring (M003)
- Cross-posting tooling (M003)
- Any site feature changes (those belong in M001 or hotfixes)

## Technical Constraints

- Astro static output (`output: 'static'`) — pure SSG, no server-side rendering needed
- Cloudflare Pages free tier
- Must preserve Lighthouse 95+ scores

## Open Questions

- Whether to use `@astrojs/cloudflare` adapter or stay with pure static — static is likely sufficient since there's no SSR

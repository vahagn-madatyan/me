# M002: Deployment

**Vision:** Push to `main` → site auto-deploys to vahagn.dev with Lighthouse 95+ and analytics tracking.

## Success Criteria

- A push to `main` triggers an automatic Cloudflare Pages build that completes with zero errors
- The site is accessible at `https://vahagn.dev` with a valid HTTPS certificate
- All 22 pages load correctly at the production URL
- `www.vahagn.dev` redirects to `vahagn.dev`
- Lighthouse audit scores 95+ on Performance, Accessibility, Best Practices, and SEO
- Static assets are served with long-lived cache headers and Brotli compression
- Cloudflare Web Analytics records page views with no client-side JS changes
- Preview deployments work for non-production branches

## Key Risks / Unknowns

- **Node 22 + Sharp in CF Pages build environment** — The project requires Node ≥22.12.0 (in `package.json` engines), and Sharp compiles native binaries. CF Pages defaults to Node 18. If the build environment can't compile Sharp or run Node 22, nothing else in this milestone works.
- **Domain registration / DNS status** — Whether vahagn.dev is already registered, who the registrar is, and whether nameservers can be pointed to Cloudflare is unknown. This is a hard external prerequisite for R022.

## Proof Strategy

- Node 22 + Sharp → retire in S01/T01 by proving the first CF Pages build succeeds and the `<project>.pages.dev` URL serves the site correctly.
- Domain / DNS → retire in S01/T02 by proving `curl -I https://vahagn.dev` returns 200 with valid HTTPS.

## Verification Classes

- Contract verification: `npm run build` zero errors (already proven in M001, re-verified in CF Pages build)
- Integration verification: git push → CF Pages auto-build → live site at pages.dev URL → custom domain → analytics beacon
- Operational verification: HTTPS, Brotli compression, cache headers, DNS resolution, www→apex redirect
- UAT / human verification: browse the live site at vahagn.dev, check Cloudflare Web Analytics dashboard for page views

## Milestone Definition of Done

This milestone is complete only when all are true:

- S01 is complete with all tasks checked off
- A push to `main` auto-deploys and the site is live at `https://vahagn.dev`
- Lighthouse CLI audit scores 95+ on all four metrics against the live URL
- Cloudflare Web Analytics shows page views in the dashboard
- All success criteria above are verified against the live production site, not just local builds

## Requirement Coverage

- Covers: R021, R022, R023, R024
- Partially covers: none
- Leaves for later: R025, R026 (M003), R027 (deferred), R002 (active, cross-cutting), R020 (active, cross-cutting)
- Orphan risks: none

## Slices

- [ ] **S01: Deploy to Cloudflare Pages with custom domain, performance, and analytics** `risk:medium` `depends:[]`
  > After this: the live site is accessible at https://vahagn.dev with auto-deploy from main, Lighthouse 95+, cache headers, Brotli, and Cloudflare Web Analytics tracking page views

## Boundary Map

### S01 (sole slice)

Produces:
- `.node-version` file specifying Node 22 for CF Pages build environment
- `public/_headers` file with cache-control and security response headers
- Live site at `https://vahagn.dev` served by Cloudflare Pages
- Auto-deploy pipeline: git push to main → CF Pages build → production deployment
- Cloudflare Web Analytics beacon auto-injected on all pages

Consumes:
- Complete static site from M001 (`npm run build` → `dist/` with 22 pages, 66 files, 1.8MB)
- `astro.config.mjs` with `site: 'https://vahagn.dev'` already set
- `public/robots.txt` already pointing sitemap to `https://vahagn.dev/sitemap-index.xml`

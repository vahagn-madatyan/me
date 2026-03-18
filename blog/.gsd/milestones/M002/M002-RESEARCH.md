# M002: Deployment — Research

**Date:** 2026-03-17
**Status:** Complete

## Summary

M002 is a low-risk, configuration-heavy milestone. The site from M001 is already fully deployment-ready: `astro.config.mjs` has `site: 'https://vahagn.dev'` set, all canonical URLs/sitemaps/RSS/OG images reference vahagn.dev, the build produces a clean 1.8MB static `dist/` directory (66 files, zero JS bundles, one 57KB CSS file), and `npm run build` completes in ~1.3 seconds with zero errors. No Astro adapter is needed — `@astrojs/cloudflare` is only for SSR/on-demand rendering, and this site is pure static.

The primary risk is the build environment compatibility on Cloudflare Pages — specifically Node.js version (the project requires `>=22.12.0` in `engines`) and Sharp (native binary used for OG image generation). Everything else is Cloudflare dashboard configuration: connecting the GitHub repo, adding the custom domain, enabling Web Analytics.

The recommended approach is Git-based CI/CD (Cloudflare Pages dashboard connects to the `vahagn-madatyan/me` GitHub repo) rather than Wrangler CLI deploys, since R021 requires "automatic deploys on push to main."

## Recommendation

**Use Cloudflare Pages Git integration with minimal code changes.** The entire deployment pipeline is dashboard configuration plus two small static files (`public/_headers` for cache control, and a `.node-version` file for build environment). No source code changes are needed. The existing `astro.config.mjs` is already correct.

For Cloudflare Web Analytics, the one-click enable via the Pages dashboard (Workers & Pages → project → Metrics → Enable) is the right approach. It auto-injects the beacon snippet with no code changes needed.

## Implementation Landscape

### Key Files

- `astro.config.mjs` — **Already correct.** `site: 'https://vahagn.dev'` is set. No adapter needed. Build output defaults to `dist/`. No changes required.
- `package.json` — **Watch item.** `engines.node: ">=22.12.0"` means the CF Pages build must use Node 22+. CF Pages defaults to Node 18. Need `NODE_VERSION` environment variable or `.node-version` file.
- `public/robots.txt` — **Already correct.** Points sitemap to `https://vahagn.dev/sitemap-index.xml`.
- `public/_headers` — **New file needed.** Cloudflare Pages uses this for custom HTTP response headers. Needed for cache control on static assets, security headers.
- `src/components/BaseLayout.astro` — **No changes needed.** Single HTML shell, already has valid `<html>` structure for CF Web Analytics auto-injection.
- `src/components/BaseHead.astro` — **No changes needed.** All meta tags, OG tags, canonical URLs already use `Astro.site` (which resolves to `https://vahagn.dev`).
- `src/pages/og/[slug].png.ts` — **Risk item.** Satori + Sharp OG image generation must work in CF Pages build environment. Sharp uses native binaries — needs to install correctly in CF Pages Linux build container.
- `dist/` — Build output directory (66 files, 1.8MB). CF Pages build setting: output directory = `dist`.

### Build Order

1. **Prove the build works on CF Pages first** — This is the highest-risk step. Create the CF Pages project, connect GitHub, configure Node version. If the build (especially Sharp for OG images) fails in CF Pages, everything else is blocked. This also immediately validates R021 (auto-deploy on push to main).
2. **Custom domain second** — Add vahagn.dev as a zone in Cloudflare, point nameservers, configure custom domain on the Pages project. DNS propagation is the gating factor here — start it early. Validates R022.
3. **Performance tuning third** — Add `_headers` for cache control, verify Brotli compression, run Lighthouse audit. Validates R023.
4. **Analytics last** — One-click enable in dashboard after site is live. Validates R024.

### Verification Approach

- **R021 (build pipeline):** Push a trivial commit to `main` → verify CF Pages auto-triggers a build → build succeeds → site accessible at `<project>.pages.dev`.
- **R022 (custom domain):** `curl -I https://vahagn.dev` returns 200 with valid HTTPS certificate. All pages load. Both apex (`vahagn.dev`) and `www.vahagn.dev` work (redirect www → apex).
- **R023 (performance):** Lighthouse CLI audit on `https://vahagn.dev` scores 95+ on all four metrics (Performance, Accessibility, Best Practices, SEO). Verify Brotli via `curl -H "Accept-Encoding: br" -I https://vahagn.dev` → `content-encoding: br`.
- **R024 (analytics):** Visit the site, then check Cloudflare Web Analytics dashboard shows page views within a few minutes.

## Constraints

- **Node.js version:** `package.json` requires `>=22.12.0`. Cloudflare Pages defaults to Node 18. Must set `NODE_VERSION=22` as a build environment variable or add a `.node-version` file containing `22`. Without this, the build will fail.
- **Pure static output:** No `output` key in `astro.config.mjs` — Astro defaults to `output: 'static'`. The `@astrojs/cloudflare` adapter must NOT be installed. It's only for SSR and would change the build output structure.
- **Sharp native binary:** OG image generation (`src/pages/og/[slug].png.ts`) uses Sharp, which compiles native binaries via node-gyp. CF Pages Linux build containers support this, but it adds build time. The build currently takes ~1.3s locally; expect 30-90s on CF Pages due to `npm install` + Sharp compilation.
- **Domain registration:** vahagn.dev must be registered and the registrar's nameservers must be pointed to Cloudflare's assigned nameservers. This is a prerequisite that happens outside the codebase.
- **Cloudflare free tier:** CF Pages free tier allows 500 builds/month, 1 build at a time, 100 custom domains. More than sufficient for this project.

## Common Pitfalls

- **Node version mismatch** — CF Pages defaults to Node 18. The `engines` field in `package.json` blocks installation on wrong versions. Must set `NODE_VERSION` environment variable in CF Pages build settings before first build attempt.
- **Confusing `@astrojs/cloudflare` with static deploys** — The adapter is for SSR only. Installing it for a static site would break the build by changing output structure to Workers format. The Astro docs explicitly say "if you are using Astro strictly as a static site builder, this adapter is not required."
- **DNS propagation timing** — After pointing nameservers to Cloudflare, propagation can take up to 48 hours (typically 30 minutes to a few hours). Don't panic if the domain doesn't resolve immediately.
- **Cache-Control `no-transform` header** — If a custom `_headers` file sets `Cache-Control: public, no-transform`, Cloudflare cannot inject the Web Analytics beacon JS automatically. Avoid `no-transform` on HTML pages.
- **www vs apex domain** — Both `vahagn.dev` and `www.vahagn.dev` should be configured. Typically redirect www → apex. CF Pages handles this automatically when both are added as custom domains.
- **Sharp in CI** — Sharp occasionally fails with `node-gyp` errors in CI environments with missing build tools. CF Pages includes these by default, but if it fails, setting `SHARP_IGNORE_GLOBAL_LIBVIPS=1` environment variable forces Sharp to use its prebuilt binaries.

## Open Risks

- **Domain registration status unknown** — Research cannot verify whether vahagn.dev is already registered, who the registrar is, or whether nameservers can be changed. This is a hard prerequisite for R022. If the domain isn't registered yet, that must happen first.
- **OG image build time at scale** — Currently 7 OG images generate quickly. As post count grows (50+ posts), Satori+Sharp build time could increase significantly. Not a blocker for M002 but worth monitoring.
- **Preview deployments** — The M002 context mentions preview deployments from `dev` branch. CF Pages automatically creates preview deployments for non-production branches, but there's currently no `dev` branch in the repo. This is a nice-to-have, not a blocker.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Build + deploy pipeline | Cloudflare Pages Git integration | One-time dashboard setup, auto-deploys on every push, preview URLs for branches |
| HTTPS/SSL certificates | Cloudflare auto-provisioned SSL | Automatic issuance and renewal, zero configuration needed |
| Brotli compression | Cloudflare edge (automatic) | Applied at the CDN edge to all responses, no build-step needed |
| Web Analytics | Cloudflare Web Analytics (one-click) | Auto-injects beacon JS, no code changes, privacy-first, free |
| www→apex redirect | Cloudflare Pages custom domains | Add both domains, CF handles the redirect automatically |

## Requirement Analysis

### Table Stakes (must ship)
- **R021 (build pipeline)** — Core value of M002. Without auto-deploy, every update is manual.
- **R022 (custom domain)** — Without this, there's no vahagn.dev. The entire project's canonical URL depends on it.

### Quality Attributes (should ship, verify after live)
- **R023 (performance)** — Lighthouse 95+ is achievable given the site's architecture (pure static, minimal JS, optimized images). The `_headers` file and CF's Brotli handle the rest. Mostly verification, not implementation.
- **R024 (analytics)** — One-click setup. Almost zero effort. Should be done but doesn't block launch.

### Candidate Requirements (advisory — surface for planner)
- **Security headers** — Not in current requirements but table stakes for a production site. `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. These go in `public/_headers` alongside cache control. Recommend adding as part of R023 scope rather than a new requirement.
- **www→apex redirect** — Implied by R022 but not explicit. Standard practice.
- **`_redirects` for trailing slashes** — Astro generates `dir/index.html` structure. CF Pages serves these correctly with trailing slashes by default. No action needed, but worth verifying.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | `astro` (installed) | Available in `<available_skills>` — already installed |
| Cloudflare Pages | `itechmeat/llm-code@cloudflare-pages` (23 installs) | Available — not installed (low install count, dashboard-config-heavy work doesn't need it) |
| Cloudflare | `hoodini/ai-agents-skills@cloudflare` (47 installs) | Available — not installed (general CF, not Pages-specific) |

No skills installed — the M002 work is primarily dashboard configuration and two small static files. The Astro skill is already available for any build-related questions.

## Sources

- Astro docs: For static sites on Cloudflare Pages, use Git integration with framework preset `Astro`, build command `npm run build`, output directory `dist`. No adapter needed. (source: [Astro Deploy to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare))
- Cloudflare Pages custom domains: Apex domains require the zone to be on Cloudflare (nameservers pointed). Cloudflare auto-creates CNAME records. SSL certificates auto-provisioned in 5-15 minutes. (source: [Custom Domains docs](https://developers.cloudflare.com/pages/configuration/custom-domains/))
- Cloudflare Web Analytics for Pages: One-click setup via Workers & Pages → project → Metrics → Enable. Auto-injects JS beacon on next deploy. (source: [Enable Web Analytics on Pages](https://developers.cloudflare.com/pages/how-to/web-analytics/))
- Cloudflare Web Analytics: Privacy-first, no cookies, no fingerprinting. Uses Performance API. Lightweight async beacon. (source: [CF Web Analytics overview](https://developers.cloudflare.com/web-analytics/about/))

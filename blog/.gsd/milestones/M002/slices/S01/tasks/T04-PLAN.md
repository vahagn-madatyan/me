---
estimated_steps: 5
estimated_files: 1
---

# T04: Enable analytics and write deployment verification script

**Slice:** S01 — Deploy to Cloudflare Pages with custom domain, performance, and analytics
**Milestone:** M002

## Description

Enable Cloudflare Web Analytics via the Pages dashboard (one-click, no code changes), verify the beacon is injected, and create a reusable deployment health check script. This validates R024 and creates the ongoing observability surface for M002.

## Steps

1. In Cloudflare dashboard: Workers & Pages → project → Metrics → Enable Web Analytics
2. Trigger a redeploy so the beacon gets injected (push a trivial commit or retry from CF dashboard)
3. Verify beacon injection: `curl -s https://vahagn.dev | grep -q 'static.cloudflareinsights.com'`
4. Visit several pages on https://vahagn.dev, then check CF Web Analytics dashboard for page views (may take a few minutes)
5. Write `scripts/verify-m02.sh` — a deployment health check script that verifies:
   - `https://vahagn.dev` returns 200
   - Response includes `cf-ray` header (served by Cloudflare)
   - Brotli compression is active
   - Web Analytics beacon is present in HTML
   - Key pages return 200: `/blog/`, `/rss.xml`, `/sitemap-index.xml`
   - OG image returns 200 with correct content type

## Must-Haves

- [ ] Cloudflare Web Analytics enabled and beacon injected into HTML
- [ ] Web Analytics dashboard shows page views
- [ ] `scripts/verify-m02.sh` exists and passes all checks against the live site

## Verification

- `curl -s https://vahagn.dev | grep -c 'cloudflareinsights'` → 1 (beacon present)
- CF Web Analytics dashboard shows page views
- `bash scripts/verify-m02.sh` → all checks pass

## Inputs

- Live site at `https://vahagn.dev` from T02 with cache/security headers from T01
- Lighthouse-verified performance from T03

## Expected Output

- `scripts/verify-m02.sh` — new deployment health verification script
- Cloudflare Web Analytics actively recording page views

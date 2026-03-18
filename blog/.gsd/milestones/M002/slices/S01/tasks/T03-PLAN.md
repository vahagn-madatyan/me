---
estimated_steps: 6
estimated_files: 1
---

# T03: Verify performance and tune if needed

**Slice:** S01 — Deploy to Cloudflare Pages with custom domain, performance, and analytics
**Milestone:** M002

## Description

Run Lighthouse audit against the live production URL. Verify Brotli compression and cache headers are working. Fix any gaps that prevent 95+ scores. The site's architecture (pure static, zero client JS, one 57KB CSS file, optimized images) should hit 95+ naturally — this task is primarily verification.

## Steps

1. Run Lighthouse CLI: `npx lighthouse https://vahagn.dev --output=json --output=html --output-path=./lighthouse-report --chrome-flags="--headless"`
2. Check all four scores: Performance, Accessibility, Best Practices, SEO — all must be ≥ 95
3. Verify Brotli: `curl -sI https://vahagn.dev -H "Accept-Encoding: br"` → look for `content-encoding: br`
4. Verify hashed asset cache: `curl -sI https://vahagn.dev/_astro/<any-file>` → `cache-control: public, max-age=31536000, immutable`
5. Verify HTML cache: `curl -sI https://vahagn.dev/` → `cache-control: public, max-age=0, must-revalidate`
6. If any score is below 95, diagnose from the Lighthouse JSON report and fix (likely: missing meta description, image without width/height, accessibility issue on a specific page)

## Must-Haves

- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Brotli compression active on HTML responses
- [ ] Hashed assets served with immutable cache headers

## Verification

- Lighthouse JSON report shows all four scores ≥ 95
- `curl -sI https://vahagn.dev -H "Accept-Encoding: br" | grep -i content-encoding` → `br`
- `curl -sI https://vahagn.dev/ | grep -i cache-control` → `public, max-age=0, must-revalidate`

## Inputs

- Live site at `https://vahagn.dev` from T02
- `public/_headers` from T01 (may need adjustment if cache rules aren't being applied)

## Expected Output

- Lighthouse report confirming 95+ on all metrics (saved as `lighthouse-report.html` / `lighthouse-report.json` for reference)
- `public/_headers` — possibly updated if tuning was needed

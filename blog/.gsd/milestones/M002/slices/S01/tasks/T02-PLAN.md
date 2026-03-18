---
estimated_steps: 4
estimated_files: 0
---

# T02: Configure custom domain and DNS

**Slice:** S01 — Deploy to Cloudflare Pages with custom domain, performance, and analytics
**Milestone:** M002

## Description

Point vahagn.dev to the Cloudflare Pages project. Add the apex domain and www subdomain as custom domains. Wait for DNS propagation and SSL certificate provisioning. This validates R022 — the canonical URL must be live with HTTPS.

## Steps

1. If vahagn.dev is not already a Cloudflare zone: add it in Cloudflare dashboard → update registrar nameservers to Cloudflare's assigned pair → wait for zone activation (typically 30 min to a few hours)
2. In CF Pages project → Custom domains → Add `vahagn.dev` (CF auto-creates the necessary DNS records)
3. Add `www.vahagn.dev` as a second custom domain (CF Pages handles www→apex redirect automatically)
4. Wait for SSL certificate provisioning (5-15 minutes after DNS propagates) and verify

## Must-Haves

- [ ] `https://vahagn.dev` returns 200 with valid HTTPS certificate
- [ ] `https://www.vahagn.dev` redirects to `https://vahagn.dev`
- [ ] All pages load at the production domain (spot-check: `/`, `/blog/`, `/work`, `/about`)

## Verification

- `curl -sI https://vahagn.dev` → HTTP/2 200 with valid headers
- `curl -sI https://www.vahagn.dev` → 301/308 redirect to `https://vahagn.dev`
- `curl -s https://vahagn.dev | grep -q '<title>'` → page content loads
- `curl -sI https://vahagn.dev/blog/` → 200
- `curl -sI https://vahagn.dev/work` → 200

## Inputs

- Working CF Pages deployment from T01 (site live at `<project>.pages.dev`)
- Domain registration for vahagn.dev (external prerequisite — must be registered before this task)

## Expected Output

- Live site at `https://vahagn.dev` with valid HTTPS
- www→apex redirect functional

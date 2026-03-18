---
estimated_steps: 4
estimated_files: 2
---

# T02: Add custom 404 page and build verification script

**Slice:** S07 — Homepage & Polish
**Milestone:** M001

## Description

Create a branded 404 page (R019) and write the slice verification script that validates all S07 deliverables plus upstream regressions. The 404 page is simple — just a BaseLayout wrapper with a heading, message, and home link. The verification script is the slice's objective stopping condition.

## Steps

1. **Create `src/pages/404.astro`:**
   - Import `BaseLayout` from `../components/BaseLayout.astro`
   - Wrap in `<BaseLayout title="Page Not Found" description="The page you're looking for doesn't exist.">`
   - Content container: `mx-auto max-w-3xl px-4 py-20 sm:px-6 text-center` (matching homepage hero)
   - Large "404" number in a muted color (text-secondary-300 dark:text-secondary-700) for visual impact
   - Heading: "Page not found" in standard heading style
   - Message: a friendly one-liner like "The page you're looking for doesn't exist or has been moved."
   - CTA button: "Back to Home" linking to `/` — styled like the primary CTA button from the homepage (bg-primary-600, rounded-lg, etc.)
   - Keep it simple and consistent with the site's dark-first design

2. **Write `scripts/verify-s07.sh`** — comprehensive build verification:
   - Run `npm run build` and capture exit code
   - Check homepage (`dist/index.html`):
     - File exists
     - Contains hero text ("Vahagn Grigoryan")
     - Contains featured post content (grep for "building-a-developer-blog" or post title)
     - Contains reading time ("min read")
     - Contains project titles (grep for at least 2 project names from projects.ts)
     - Contains tech stack badges (grep for tech names like "Python" or "Rust")
     - Contains newsletter/subscribe form markup
     - Contains links to /blog and /work
   - Check 404 (`dist/404.html`):
     - File exists
     - Contains "404" text
     - Contains link back to home (href="/")
   - Run upstream regression scripts:
     - `bash scripts/verify-s01.sh`
     - `bash scripts/verify-s02.sh`
     - `bash scripts/verify-s05.sh`
   - Report pass/fail count and exit with appropriate code

3. **Run the verification script:**
   - Execute `bash scripts/verify-s07.sh`
   - Confirm all checks pass
   - If any fail, fix the 404 page and re-run

4. **Final build confirmation:**
   - Run `npm run build` one more time to ensure zero errors
   - Confirm page count includes the new 404 and homepage

## Must-Haves

- [ ] `src/pages/404.astro` exists with "404" display, friendly message, and link back to home
- [ ] 404 page uses BaseLayout wrapper and matches site design
- [ ] `scripts/verify-s07.sh` validates all S07 deliverables (homepage sections, 404, newsletter form)
- [ ] Verification script runs S01/S02/S05 regression checks
- [ ] All verification checks pass

## Verification

- `bash scripts/verify-s07.sh` — all checks pass
- `test -f dist/404.html` — 404 page exists in build output
- `grep -q '404' dist/404.html` — 404 text present
- `grep -q 'href="/"' dist/404.html` — home link present

## Inputs

- `src/components/BaseLayout.astro` — page wrapper (from S01); props: `title`, `description`
- `src/pages/index.astro` — homepage (from T01) — used for verification assertions
- `src/components/NewsletterForm.astro` — newsletter form (from T01) — used for verification assertions
- `scripts/verify-s01.sh` — S01 regression script (19 checks)
- `scripts/verify-s02.sh` — S02 regression script (22 checks)
- `scripts/verify-s05.sh` — S05 regression script (19 checks)
- Project names from `src/data/projects.ts`: VaultBreaker, CortexML, PacketForge, AlphaGrid, SentinelIDS, NeuroChat

## Observability Impact

- **New inspection surface:** `dist/404.html` — grep for "404", "Page not found", and `href="/"` to confirm 404 page renders correctly
- **Verification script:** `bash scripts/verify-s07.sh` — runs all S07 checks plus S01/S02/S05 regressions; exit code 0 means all pass, non-zero means failures with per-check output showing which failed
- **Failure visibility:** 404 page build failures surface as Astro build errors with stack traces pointing to `src/pages/404.astro`. Missing BaseLayout import or broken props cause compile-time errors, never silent runtime failures.
- **No runtime signals:** 404 page is fully static HTML — no client-side JS, no async data fetching, no error boundaries

## Expected Output

- `src/pages/404.astro` — new: branded 404 page with heading, message, and home link
- `scripts/verify-s07.sh` — new: build verification script covering all S07 deliverables plus upstream regressions

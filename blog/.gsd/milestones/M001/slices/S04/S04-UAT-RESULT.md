---
sliceId: S04
uatType: mixed
verdict: surfaced-for-human-review
date: 2026-03-17T02:36:30Z
---

# UAT Result — S04

## UAT Type

`mixed` — requires human execution or live-runtime verification.

## Status

Surfaced for human review. Auto-mode will pause after this unit so the UAT can be performed manually.

## Artifact Checks (Pre-verified)

All 17 build-time artifact checks passed via `scripts/verify-s04.sh` + S02 regression:

| Check | Result | Notes |
|-------|--------|-------|
| Tag archive page exists for 'astro' | PASS | dist/blog/tag/astro/index.html present |
| Tag archive contains BlogCard markup | PASS | BlogCard grid renders in tag archive |
| Post HTML contains tag pill link to /blog/tag/astro/ | PASS | Tag pills are `<a>` links |
| Blog listing HTML contains tag pill links | PASS | BlogCard tag pills navigable |
| building-a-developer-blog contains Related section | PASS | Related Posts section rendered |
| Related section links to another post | PASS | Links to related posts present |
| Post contains Twitter/X share URL | PASS | twitter.com/intent/tweet in output |
| Post contains LinkedIn share URL | PASS | linkedin.com/sharing/share-offsite in output |
| Post contains Dev.to share URL | PASS | dev.to/new in output |
| Post with code blocks contains clipboard script | PASS | navigator.clipboard in mastering-typescript-patterns |
| Long post contains TOC nav element | PASS | `<nav` present in long post |
| TOC contains heading anchor links | PASS | Anchor links to headings present |
| TOC contains IntersectionObserver scroll-spy script | PASS | IntersectionObserver in output |
| Long post uses two-column grid layout | PASS | lg:grid-cols layout active |
| Short post does NOT contain Table of Contents | PASS | No TOC on first-post |
| Short post uses single-column layout | PASS | No lg:grid on first-post |
| S02 regression (verify-s02.sh passes) | PASS | 22/22 S02 checks pass |

## Remaining Live-Runtime Checks (Require Human)

The following UAT cases require a running dev server and browser interaction:

1. **Tag archive pages render correctly** (TC 1) — navigate tag archives, click through, back-nav
2. **Tag pill links navigate to archives** (TC 2) — click tag pills on listing and post pages
3. **Related posts appear on tagged posts** (TC 3) — scroll to bottom, verify cards, click through
4. **Related posts absent on tagless posts** (TC 4) — verify no empty heading/container on first-post
5. **Share buttons render and link correctly** (TC 5) — verify icons, hrefs, target=_blank
6. **Copy button on code blocks** (TC 6) — click Copy, verify "Copied!" feedback, paste clipboard
7. **TOC renders on long post desktop** (TC 7) — sticky sidebar, h2/h3 indentation
8. **Scroll-spy highlights active heading** (TC 8) — scroll through, verify single active highlight
9. **TOC anchor links work with correct offset** (TC 9) — click TOC link, heading not behind header
10. **TOC absent on short post** (TC 10) — no sidebar, full-width layout
11. **TOC hidden on mobile** (TC 11) — mobile viewport, no TOC visible

### Edge Cases
- Draft posts excluded from tag archives
- Post with no code blocks has no console errors
- Tag archive with single post renders correctly
- Share buttons on tagless post still render

## UAT File

See `.gsd/milestones/M001/slices/S04/S04-UAT.md` for the full UAT specification and acceptance criteria.

## Instructions for Human Reviewer

1. Start dev server: `npm run dev`
2. Review `.gsd/milestones/M001/slices/S04/S04-UAT.md` and perform test cases 1-11 plus edge cases
3. **Priority focus:** Test cases 7-9 (scroll-spy) and 6 (copy button) — these are the key interactive tests
4. **Dark mode:** Toggle dark mode and verify all components look correct in both themes
5. Update this file with:
   - The actual verdict (PASS / FAIL / PARTIAL)
   - Results for each live-runtime check
   - Date completed
6. Once updated, run `/gsd auto` to resume auto-mode.

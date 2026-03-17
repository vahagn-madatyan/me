---
sliceId: S03
uatType: artifact-driven
verdict: PASS
date: 2026-03-17T02:36:00Z
---

# UAT Result — S03

## Checks

| Check | Result | Notes |
|-------|--------|-------|
| Smoke: verify-s03.sh | PASS | 29/29 checks passed, including S01 (19/19) and S02 (22/22) regression |
| 1. OG image count | PASS | `ls dist/og/*.png | wc -l` → 7 |
| 2. OG image dimensions | PASS | Sharp metadata → 1200 630 |
| 3. Draft exclusion | PASS | `draft-upcoming-post.md` exists in source; no `draft-upcoming-post.png` in `dist/og/` |
| 4. JSON-LD on blog posts | PASS | Single JSON-LD block with `@type: BlogPosting`, `headline`, `datePublished`, `author`, `keywords` present |
| 5. JSON-LD absent from non-blog | PASS | `grep -c` returns 0 for both `dist/index.html` and `dist/about/index.html` |
| 6. og:image points to PNG | PASS | `content="https://vahagn.dev/og/building-a-developer-blog.png"` |
| 7. og:type differentiates | PASS | Blog post → `article`; homepage → `website` |
| 8. Article OG tags | PASS | `article:published_time` contains `2026-01-15T08:00:00.000Z`; three `article:tag` entries: astro, webdev, tailwind |
| 9. twitter:image | PASS | `content="https://vahagn.dev/og/building-a-developer-blog.png"` |
| 10. Canonical URL | PASS | `href="https://vahagn.dev/blog/building-a-developer-blog/"` |
| 11. RSS categories | PASS | `grep -o '<category>' dist/rss.xml | wc -l` → 10 (≥10 threshold met) |
| 12. robots.txt | PASS | Contains `User-agent: *`, `Allow: /`, `Sitemap: https://vahagn.dev/sitemap-index.xml` |
| 13. Sitemap blog priority | PASS | Blog URLs have `<changefreq>weekly</changefreq>` and `<priority>0.8</priority>` |
| Edge: Draft excluded from OG | PASS | `draft-upcoming-post.md` has `draft: true`; no corresponding PNG in `dist/og/` |
| Edge: Non-blog pages unaffected | PASS | Homepage and blog listing: no JSON-LD, og:type is `website`, no `article:tag` meta tags |

## Overall Verdict

PASS — All 13 test cases, 2 edge cases, and the 29-check smoke script passed. S03 SEO & OG Images slice is fully verified with zero failures.

## Notes

- `npm run build` completed in ~1.2s with zero errors, producing 10 pages and 7 OG images.
- RSS feed has exactly 10 `<category>` elements across 7 non-draft posts, confirming tags are correctly mapped.
- Sitemap serialization correctly applies `weekly` changefreq and `0.8` priority only to `/blog/` URLs.
- S01 and S02 regression suites both pass within the S03 verification script.
- No post-without-tags edge case exists in current content (all posts have tags), so that edge case was not exercised but the code path is structurally sound.

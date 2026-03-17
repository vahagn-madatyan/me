# S03: SEO & OG Images — UAT

**Milestone:** M001
**Written:** 2026-03-16

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All S03 deliverables are build-time outputs (PNG files, HTML meta tags, XML feeds, static files). Verification is done by inspecting `dist/` contents after `npm run build`. No live runtime or user interaction needed.

## Preconditions

- `npm run build` has completed successfully (produces `dist/` directory)
- Node.js available for `sharp` metadata checks
- `scripts/verify-s03.sh`, `scripts/verify-s02.sh`, `scripts/verify-s01.sh` exist

## Smoke Test

Run `bash scripts/verify-s03.sh` — all 29 checks must pass. This covers OG images, JSON-LD, meta tags, RSS, robots.txt, sitemap, and S01/S02 regression.

## Test Cases

### 1. OG Image Generation — correct count

1. Run `npm run build`
2. Run `ls dist/og/*.png | wc -l`
3. **Expected:** Output is `7` (one PNG per non-draft blog post)

### 2. OG Image Generation — correct dimensions

1. Run `node -e "require('sharp')('dist/og/building-a-developer-blog.png').metadata().then(m => console.log(m.width, m.height))"`
2. **Expected:** Output is `1200 630`

### 3. OG Image Generation — draft exclusion

1. Run `ls dist/og/` and inspect filenames
2. **Expected:** No file named `draft-upcoming-post.png` exists. Only non-draft post slugs have OG images.

### 4. JSON-LD on blog posts

1. Run `grep -o '<script type="application/ld+json">[^<]*</script>' dist/blog/building-a-developer-blog/index.html`
2. **Expected:** A single JSON-LD block containing `"@type":"BlogPosting"`, `"headline"`, `"datePublished"`, `"author"`, and `"keywords"`

### 5. JSON-LD absent from non-blog pages

1. Run `grep -c 'application/ld+json' dist/index.html`
2. Run `grep -c 'application/ld+json' dist/about/index.html`
3. **Expected:** Both return `0` — JSON-LD is only on blog post pages

### 6. og:image points to generated PNG

1. Run `grep 'og:image' dist/blog/building-a-developer-blog/index.html`
2. **Expected:** Content attribute contains `https://vahagn.dev/og/building-a-developer-blog.png`

### 7. og:type differentiates blog vs non-blog

1. Run `grep 'og:type' dist/blog/building-a-developer-blog/index.html`
2. Run `grep 'og:type' dist/index.html`
3. **Expected:** Blog post shows `article`, homepage shows `website`

### 8. Article OG tags present on blog posts

1. Run `grep 'article:published_time' dist/blog/building-a-developer-blog/index.html`
2. Run `grep 'article:tag' dist/blog/building-a-developer-blog/index.html`
3. **Expected:** `article:published_time` contains an ISO date. Multiple `article:tag` entries matching the post's tags (astro, webdev, tailwind).

### 9. twitter:image on blog posts

1. Run `grep 'twitter:image' dist/blog/building-a-developer-blog/index.html`
2. **Expected:** Content attribute contains `/og/building-a-developer-blog.png`

### 10. Canonical URL on blog posts

1. Run `grep 'rel="canonical"' dist/blog/building-a-developer-blog/index.html`
2. **Expected:** href contains `https://vahagn.dev/blog/building-a-developer-blog/`

### 11. RSS feed has category tags

1. Run `grep -o '<category>' dist/rss.xml | wc -l`
2. **Expected:** At least 10 (tags across 7 non-draft posts)

### 12. robots.txt content

1. Run `cat dist/robots.txt`
2. **Expected:** Contains `User-agent: *`, `Allow: /`, and `Sitemap: https://vahagn.dev/sitemap-index.xml`

### 13. Sitemap blog priority

1. Run `grep 'weekly' dist/sitemap-0.xml`
2. Run `grep '0.8' dist/sitemap-0.xml`
3. **Expected:** Blog URLs have `<changefreq>weekly</changefreq>` and `<priority>0.8</priority>`

## Edge Cases

### Draft post excluded from OG generation

1. Verify a draft post exists in `src/content/blog/` (e.g., one with `draft: true`)
2. Run `npm run build`
3. Check `dist/og/` for that slug
4. **Expected:** No PNG file for the draft post

### Non-blog pages unaffected by new SEO props

1. Run `npm run build`
2. Inspect `dist/index.html` and `dist/blog/index.html` (listing page)
3. **Expected:** No JSON-LD block, og:type is `website`, basic og:image still works (falls back to image prop), no article:* tags. Pages render correctly with no errors.

### Post without tags

1. If a post has no tags defined in frontmatter
2. **Expected:** OG image renders without tag pills (no crash), RSS item has no `<category>` elements for that post, no `article:tag` meta tags emitted

## Failure Signals

- `npm run build` fails with Satori/Sharp errors → font loading broken or element tree malformed
- `dist/og/` directory missing or empty → `[slug].png.ts` endpoint not generating
- JSON-LD absent from blog post HTML → BaseHead not receiving `type="article"` prop
- `og:image` pointing to wrong URL or missing → slug not passed through prop chain
- `robots.txt` missing from dist → `public/robots.txt` file missing or build skipped it
- RSS `<category>` count is 0 → `categories: post.data.tags` mapping not applied
- Sitemap missing `weekly`/`0.8` → serialize callback not running (check `@astrojs/sitemap` version)

## Requirements Proved By This UAT

- R015 — OG images generate at build time from post metadata with correct dimensions and site branding
- R016 — JSON-LD BlogPosting, og:image, twitter:image, article OG tags, canonical URLs all present and correct
- R017 — RSS has category tags, robots.txt references sitemap, sitemap has blog-specific changefreq/priority

## Not Proven By This UAT

- Visual quality of OG images (design aesthetics, readability, contrast) — requires human eye check
- OG image rendering on actual social platforms (Twitter, LinkedIn, Facebook) — requires live deployment and sharing
- Canonical URL override from frontmatter — no sample post currently uses `canonicalURL` field
- SEO impact (search engine indexing, ranking) — requires live deployment and time

## Notes for Tester

- The automated `scripts/verify-s03.sh` covers all verifiable checks. Run it first — if it passes 29/29, the slice is functionally correct.
- To visually inspect OG images, open any `dist/og/*.png` file. Look for: dark slate background, teal accent bar at top, white title text, gray description, teal tag pills, date and site URL at bottom.
- The fonts used in OG images (Atkinson Hyperlegible) differ from site fonts (Inter, JetBrains Mono) — this is intentional due to Satori's WOFF1-only limitation.

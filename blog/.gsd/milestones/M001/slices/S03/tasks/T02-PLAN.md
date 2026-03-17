---
estimated_steps: 5
estimated_files: 4
---

# T02: Enhance BaseHead with JSON-LD, dynamic OG image, and article meta

**Slice:** S03 — SEO & OG Images
**Milestone:** M001

## Description

Wire the OG images from T01 into page meta tags, add JSON-LD structured data for blog posts, and support canonical URL override from frontmatter. This completes R016 (dynamic meta tags, OG tags, Twitter Cards, JSON-LD, canonical URLs).

The existing `BaseHead.astro` already has basic OG and Twitter Card tags. This task enhances it to:
- Point `og:image` to the generated `/og/{slug}.png` for blog posts (absolute URL via `Astro.site`)
- Add `article:published_time` and `article:tag` OG tags for blog posts
- Emit a `<script type="application/ld+json">` block with BlogPosting schema for blog posts
- Support `canonicalURL` frontmatter override (from S02 schema) for the `<link rel="canonical">` tag
- Keep all new props optional — non-blog pages (home, about, projects, 404) must continue working unchanged

**Critical constraint:** All new props on BaseHead must be optional with defaults. BaseLayout threads them through, so its interface must also accept optional SEO props. Breaking non-blog pages is a blocking error.

## Steps

1. **Expand `BaseHead.astro` interface.** Add optional props:
   ```
   type?: 'website' | 'article';       // defaults to 'website'
   pubDate?: Date;                      // for article:published_time
   updatedDate?: Date;                  // for article:modified_time
   tags?: string[];                     // for article:tag OG tags
   canonicalOverride?: string;          // overrides auto-generated canonical
   slug?: string;                       // for OG image URL construction
   ```
   
   **Important:** The existing `image` prop is typed as `ImageMetadata` (an Astro asset type with `.src`). For blog posts with OG images, we want to override this to point to `/og/{slug}.png`. The cleanest approach: when `type === 'article'` and `slug` is provided, compute the OG image URL as `new URL(\`/og/${slug}.png\`, Astro.site).toString()` and use that instead of `image.src` in the og:image and twitter:image meta tags.

2. **Add article-specific OG tags.** When `type === 'article'`:
   - Set `<meta property="og:type" content="article" />` (instead of "website")
   - Add `<meta property="article:published_time" content={pubDate.toISOString()} />` if pubDate provided
   - Add `<meta property="article:modified_time" content={updatedDate.toISOString()} />` if updatedDate provided
   - Add `<meta property="article:tag" content={tag} />` for each tag

3. **Add JSON-LD BlogPosting script.** When `type === 'article'`, render a `<script type="application/ld+json">` block. Build the JSON-LD object using `JSON.stringify()` (not template literal interpolation — avoids issues with quotes/special chars in titles/descriptions):
   ```json
   {
     "@context": "https://schema.org",
     "@type": "BlogPosting",
     "headline": title,
     "description": description,
     "datePublished": pubDate.toISOString(),
     "dateModified": (updatedDate || pubDate).toISOString(),
     "author": { "@type": "Person", "name": "Vahagn Grigoryan" },
     "image": ogImageUrl,
     "url": canonicalURL,
     "keywords": tags
   }
   ```

4. **Support canonical URL override.** Change the canonical URL logic:
   ```
   const canonicalURL = canonicalOverride 
     ? new URL(canonicalOverride) 
     : new URL(Astro.url.pathname, Astro.site);
   ```

5. **Thread new props through BaseLayout → BlogPost.**
   - `BaseLayout.astro`: Add the same optional props to its interface, pass them through to `BaseHead`.
   - `BlogPost.astro`: Pass `type="article"`, `pubDate`, `updatedDate`, `tags`, and `slug` to `BaseLayout`. The `slug` must be derived — extract it from the page URL or accept it as a prop.
   - `src/pages/blog/[slug].astro`: Pass the `canonicalURL` from post data (if present) and the slug to `BlogPost`.

## Must-Haves

- [ ] `og:image` on blog posts points to absolute URL `https://vahagn.dev/og/{slug}.png`
- [ ] `og:type` is `article` on blog posts and `website` on non-blog pages
- [ ] `article:published_time` and `article:tag` meta tags present on blog posts
- [ ] JSON-LD BlogPosting schema in `<head>` of blog posts, valid JSON
- [ ] `canonicalURL` frontmatter overrides auto-generated canonical when present
- [ ] Non-blog pages (home, about) render unchanged — no broken props or missing defaults
- [ ] Twitter Card `twitter:image` also points to the OG PNG for blog posts

## Verification

- `npm run build` — zero errors
- `grep 'application/ld+json' dist/blog/building-a-developer-blog/index.html` — JSON-LD present
- `grep -o 'og:image.*content="[^"]*"' dist/blog/building-a-developer-blog/index.html` — contains `/og/building-a-developer-blog.png`
- `grep 'article:published_time' dist/blog/building-a-developer-blog/index.html` — present
- `grep 'article:tag' dist/blog/building-a-developer-blog/index.html` — present (one per tag)
- `grep 'og:type.*article' dist/blog/building-a-developer-blog/index.html` — article type on blog posts
- `grep 'og:type.*website' dist/index.html` — website type on homepage
- `grep -c 'ld+json' dist/index.html` — returns 0 (no JSON-LD on non-blog pages)
- Blog post canonical URL is `https://vahagn.dev/blog/{slug}/`

## Inputs

- `src/components/BaseHead.astro` — current interface: `{ title, description, image?: ImageMetadata }`. Has basic OG/Twitter tags. Canonical auto-generated from `Astro.url.pathname + Astro.site`.
- `src/components/BaseLayout.astro` — threads `{ title, description, image? }` to BaseHead. Includes dark mode init script and site chrome.
- `src/layouts/BlogPost.astro` — current props: `CollectionEntry<'blog'>['data'] & { readingTime: number }`. Wraps content in `<BaseLayout title={title} description={description}>`.
- `src/pages/blog/[slug].astro` — renders BlogPost, passes `{...post.data, readingTime}`.
- `src/content.config.ts` — schema includes `canonicalURL: z.string().url().optional()` from S02.
- `src/consts.ts` — `SITE_TITLE = 'Vahagn Grigoryan'` (for JSON-LD author name).
- T01 output: OG images at `/og/{slug}.png` (1200×630 PNG per non-draft post).

## Observability Impact

- **Build-time signals:** `npm run build` output — any type error from new optional props surfaces immediately with file/line context
- **Inspection surfaces:** `grep 'application/ld+json' dist/blog/*/index.html` validates JSON-LD presence; `grep 'og:type' dist/*/index.html` confirms article vs website type differentiation; `grep 'og:image' dist/blog/*/index.html` confirms OG image URLs point to `/og/` PNGs
- **Failure visibility:** Missing/malformed JSON-LD → `JSON.parse()` throws on the built HTML; broken canonical → `<link rel="canonical">` has wrong href visible in page source; wrong og:type → social preview crawlers show generic "website" card instead of article
- **Regression detection:** Non-blog pages must still build — `grep 'og:type.*website' dist/index.html` confirms homepage unchanged; `grep -c 'ld+json' dist/index.html` must return 0

## Expected Output

- `src/components/BaseHead.astro` — enhanced with JSON-LD, article OG tags, canonical override, dynamic og:image for blog posts
- `src/components/BaseLayout.astro` — optional SEO props threaded through to BaseHead
- `src/layouts/BlogPost.astro` — passes blog metadata (type, pubDate, tags, slug) to BaseLayout
- `src/pages/blog/[slug].astro` — passes canonicalURL and slug to BlogPost layout

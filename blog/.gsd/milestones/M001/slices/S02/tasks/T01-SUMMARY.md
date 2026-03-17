---
id: T01
parent: S02
milestone: M001
provides:
  - Extended blog content schema with tags, featured, draft, canonicalURL fields
  - Shiki dual-theme syntax highlighting via CSS variables (defaultColor: false)
  - Tailwind typography plugin loaded via @plugin directive
  - Shiki dual-theme CSS rules for light/dark mode code blocks
key_files:
  - src/content.config.ts
  - astro.config.mjs
  - src/styles/global.css
key_decisions:
  - Used defaultColor: false for Shiki CSS variable output — spans get --shiki-light/--shiki-dark instead of inline colors
  - Used @plugin directive (Tailwind v4 CSS-first approach) instead of tailwind.config.js for typography plugin
patterns_established:
  - Shiki dual-theme CSS pattern: .astro-code and .astro-code span swap --shiki-light/--shiki-dark based on html.dark class
  - Schema extension pattern: all new fields use .default() or .optional() to preserve backward compatibility with existing posts
observability_surfaces:
  - "grep 'shiki-dark' dist/blog/markdown-style-guide/index.html — confirms CSS variable pipeline active"
  - "grep 'prose' dist/blog/first-post/index.html — confirms typography plugin loaded"
  - "npm run build exit code — any schema/Shiki/plugin failure is build-time"
duration: 8m
verification_result: passed
completed_at: 2026-03-16
blocker_discovered: false
---

# T01: Configure rendering pipeline — Shiki dual themes, typography plugin, extended schema

**Extended blog schema, configured Shiki dual-theme CSS variable output, loaded typography plugin, and added code block dark mode CSS — all 5 existing posts build without errors.**

## What Happened

Three config files modified in sequence:

1. **`src/content.config.ts`** — Added 4 fields: `tags` (string array, default `[]`), `featured` (boolean, default `false`), `draft` (boolean, default `false`), `canonicalURL` (optional URL string). All use `.default()` or `.optional()` so the 5 existing posts with no new frontmatter continue to validate.

2. **`astro.config.mjs`** — Added `markdown.shikiConfig` with `themes: { light: 'github-light', dark: 'github-dark' }` and `defaultColor: false`. This is the critical setting — it makes Shiki output CSS variables (`--shiki-light`, `--shiki-dark`) on each `<span>` instead of inline color styles, enabling theme switching without JS.

3. **`src/styles/global.css`** — Added `@plugin "@tailwindcss/typography"` after the `@custom-variant dark` line (Tailwind v4 CSS-first plugin loading). Added Shiki dual-theme CSS rules in `@layer base`: `.astro-code` and `.astro-code span` use `--shiki-light` by default, swap to `--shiki-dark` under `html.dark`. Added code block base styling (border-radius, padding, font-size, overflow-x, font-family).

## Verification

- `npm run build` — **passed**, zero errors, all 8 pages built in 956ms
- `grep -c 'shiki-dark' dist/blog/markdown-style-guide/index.html` — **48 matches** (CSS variables on every code span)
- `grep -c 'prose' dist/blog/first-post/index.html` — **1 match** (prose class on content div)
- All 5 existing blog posts rendered: first-post, markdown-style-guide, second-post, third-post, using-mdx
- `bash scripts/verify-s01.sh` — **19/19 passed**, zero regressions from S01

### Partial S02 slice verification

| Check | Status |
|-------|--------|
| Shiki dual-theme CSS variables in post HTML | ✅ pass |
| `prose` class in post HTML | ✅ pass |
| Paginated listing at dist/blog/index.html | ⬜ T03 |
| Individual post pages exist | ✅ pass (5 posts) |
| Reading time in post/listing HTML | ⬜ T02 |
| Tags in post HTML | ⬜ T02/T03 |
| Draft posts absent from production | ⬜ T03 |
| RSS feed no draft titles | ⬜ T03 |
| S01 checks pass | ✅ pass |

## Diagnostics

- **Shiki pipeline:** `grep 'shiki-dark' dist/blog/*/index.html` — any post with code blocks should show CSS variable references
- **Typography plugin:** `grep 'prose' dist/blog/*/index.html` — prose class should appear in all blog post HTML
- **Schema validation:** Build errors will name the specific field and expected type if a post has invalid frontmatter
- **All failures are build-time** — no silent runtime degradation possible

## Deviations

None — implementation matched plan exactly.

## Known Issues

None.

## Files Created/Modified

- `src/content.config.ts` — Extended schema with tags, featured, draft, canonicalURL fields
- `astro.config.mjs` — Added markdown.shikiConfig with dual themes and defaultColor: false
- `src/styles/global.css` — Added @plugin typography directive + Shiki dual-theme CSS rules + code block styling
- `.gsd/milestones/M001/slices/S02/S02-PLAN.md` — Added Observability / Diagnostics section
- `.gsd/milestones/M001/slices/S02/tasks/T01-PLAN.md` — Added Observability Impact section

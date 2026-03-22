# /new-post Pipeline Design Spec

**Date:** 2026-03-22
**Status:** Draft
**Scope:** New `/new-post` orchestrator skill, new `blog-hero-generator` skill, enhanced `blog-cross-poster` skill

## Overview

A single `/new-post` command that orchestrates the full blog publishing pipeline: draft → SEO → cross-posts → hero images. Three review gates give the user control at each stage. Output is a blog post committed to `src/content/blog/` and a `cross-posts/<slug>/` directory with all platform-ready files.

## Pipeline Flow

```
/new-post "<topic, repo URL, or rough draft>"
    │
    │  ── GATE A: Blog Draft ──────────────────────────
    ├─ 1. technical-blog-writing (existing, modified)
    │     Input classification → outline → user approval → draft
    │     User reviews and approves the blog post draft
    │     NOTE: Phase 5 (handoff) is REMOVED from this skill —
    │     /new-post owns the SEO and cross-post orchestration now
    │
    ├─ 2. blog-seo-optimizer (existing, unchanged)
    │     7-point SEO checklist applied to approved draft
    │     Write final .md to src/content/blog/<slug>.md
    │
    │  ── GATE B: Cross-Posts ──────────────────────────
    ├─ 3. blog-cross-poster (enhanced)
    │     Generate all platform versions from the approved blog post
    │     Inject "Give this to your agent" block if project showcase
    │     Present all versions inline for user review
    │     On approval, write to cross-posts/<slug>/
    │
    │  ── GATE C: Hero Images ─────────────────────────
    ├─ 4. blog-hero-generator (new)
    │     Generate HTML from post metadata → Playwright screenshot
    │     Present images for user review
    │     On approval, save to cross-posts/<slug>/
    │
    └─ 5. Summary
          Print file manifest with all output paths
```

## Orchestration Ownership

**Breaking change to `technical-blog-writing`:** Phase 5 (Handoff) is removed from this skill. Previously, `technical-blog-writing` invoked `blog-seo-optimizer` and `blog-cross-poster` directly. Now `/new-post` owns that orchestration to avoid double-invocation.

When `technical-blog-writing` is invoked standalone (not through `/new-post`), it ends after Phase 4 (Review Loop) with an approved draft. The user can then manually invoke SEO and cross-posting skills if desired.

When invoked through `/new-post`, the orchestrator handles Steps 2-5 after `technical-blog-writing` completes.

## Skill 1: `/new-post` Orchestrator

**Location:** `/Users/djbeatbug/.claude/skills/new-post/SKILL.md`

### Invocation

```
/new-post <topic, repo URL, local path, or rough draft text>
```

### Behavior

The orchestrator is a thin coordination layer. It does not contain blog-writing logic — it invokes existing skills in sequence and manages the three review gates.

**Step 1 — Blog Draft (Gate A):**
- Pass user input to `technical-blog-writing` skill (Phases 1-4 only)
- This skill handles: input classification, outline approval, drafting, review loop
- After user approves the draft, proceed

**Step 2 — SEO:**
- Pass approved draft to `blog-seo-optimizer` skill
- Apply SEO fixes
- Write final `.md` to `src/content/blog/<slug>.md`

**Step 3 — Cross-Posts (Gate B):**
- Pass the written blog post to `blog-cross-poster` skill
- Generate all platform versions
- Present all versions inline for user review
- Ask: "Cross-posts ready. Approve to write files, or request changes?"
- If user requests changes, revise and re-present
- On approval, write files to `cross-posts/<slug>/`

**Step 4 — Hero Images (Gate C):**
- Pass post metadata (title, description, tags) to `blog-hero-generator` skill
- Generate and present images inline
- Ask: "Hero images ready. Approve to save, or request changes?"
- If user requests changes (colors, layout, text), regenerate
- On approval, save to `cross-posts/<slug>/`

**Step 5 — Summary:**
- Print manifest of all created files:

```
Blog post:     src/content/blog/<slug>.md
Dev.to:        cross-posts/<slug>/devto.md
LinkedIn:      cross-posts/<slug>/linkedin.txt
X article:     cross-posts/<slug>/x-article.md
X tweet:       cross-posts/<slug>/x-tweet.txt
Reddit:        cross-posts/<slug>/reddit.md
X hero:        cross-posts/<slug>/x-hero.png
LinkedIn hero: cross-posts/<slug>/linkedin-hero.png
```

### Edge Cases

- **User abandons at any gate:** Stop gracefully, keep any files already written
- **No repo/project linked:** Skip "Give this to your agent" block in cross-posts
- **User provides only a topic:** `technical-blog-writing` handles ambiguity (asks one clarifying question)

## Skill 2: `blog-hero-generator` (New)

**Location:** `/Users/djbeatbug/.claude/skills/blog-hero-generator/SKILL.md`

### Prerequisites

Requires the Playwright MCP server (browser_navigate, browser_resize, browser_take_screenshot tools). If Playwright tools are not available, skip hero generation and notify the user: "Hero image generation requires Playwright. Skipping — you can generate images manually later."

### Input

| Field | Source | Required |
|---|---|---|
| `title` | Blog post frontmatter | Yes |
| `description` | Blog post frontmatter | Yes |
| `tags` | Blog post frontmatter | Yes |
| `slug` | Derived from blog post filename (minus `.md`) | Yes |

### Output

| File | Dimensions | Aspect Ratio | Use |
|---|---|---|---|
| `cross-posts/<slug>/x-hero.png` | 1250x500 | 5:2 | X article cover |
| `cross-posts/<slug>/linkedin-hero.png` | 1200x627 | ~1.91:1 | LinkedIn post image |

Note: These images are for cross-posting platforms only, not for the blog post's `heroImage` frontmatter field. Blog hero images should be created separately if needed (different aspect ratios and design requirements).

### Template Design

The hero image follows the established visual identity from vahagn.dev:

- **Background:** Dark (`#0a0e17`) with subtle grid overlay
- **Accent orbs:** Blurred gradient circles (blue `#38bdf8`, purple `#818cf8`, green `#10b981`)
- **Network nodes:** Small glowing dots with connection lines
- **Badge:** "OPEN SOURCE" pill (top-left) — shown only if tags include `open-source`
- **Title:** Large bold white text with gradient highlight on key phrase
- **Subtitle:** Muted gray, pulled from `description`
- **Domain pills:** Right side, generated from `tags` with color-coded icons
- **Author line:** "Vahagn Madatyan / vahagn.dev" (LinkedIn variant only, bottom-left)

### HTML Template

The template is generated inline by the skill (not stored as a separate file). The skill constructs a complete HTML document with:

1. Inline CSS for all styling (no external dependencies)
2. Template variables injected via string interpolation:
   - `{{title}}` — split into plain and gradient portions
   - `{{subtitle}}` — from description
   - `{{pills}}` — generated HTML from tag mapping
   - `{{badge}}` — "OPEN SOURCE" if applicable
   - `{{author}}` — shown only in LinkedIn variant
3. Viewport dimensions set per variant (1250x500 or 1200x627)

The skill generates two separate HTML files (one per variant), renders each, and cleans up.

### Tag-to-Pill Mapping

Tags from the blog post are mapped to visual pills:

| Tag pattern | Pill label | Color |
|---|---|---|
| `network-security`, `networking` | Network Security | blue |
| `ai-agents`, `ai` | AI Agents | purple |
| `cloud`, `aws`, `azure`, `gcp` | Cloud Security | green |
| `cisco`, `juniper`, `arista` | Device Health | blue |
| `open-source` | Open Source (badge, not pill) | blue |
| Other tags | Title-cased with hyphens replaced by spaces (e.g., `ai-agents` → `AI Agents`) | amber |

If more than 5 tags map to pills, show only the first 5.

### Rendering Method

1. Generate HTML file in `/tmp/` with post metadata injected
2. Serve via `python3 -m http.server <port>` on a random available port (use port 0 or try 8787, fall back to 8788-8799 if busy)
3. Navigate Playwright browser to `http://localhost:<port>/<filename>`
4. Resize viewport to target dimensions
5. Take screenshot as PNG to `cross-posts/<slug>/`
6. Clean up: kill server process, delete temp HTML file
7. If screenshot fails, retry once. If still fails, report error and skip.

### Gradient Keyword Detection

The title's gradient highlight is applied to the last phrase that matches a known keyword pattern:

- Security, Network, Cloud, AI, Agent, Infrastructure, Automation, DevOps, Observability

If no keyword matches, the gradient is applied to the last 2 words of the title.

## Skill 3: `blog-cross-poster` (Enhanced)

**Location:** `/Users/djbeatbug/.claude/skills/blog-cross-poster/SKILL.md`

### Changes from Previous Version

| Change | Detail |
|---|---|
| Added X article format | Long-form article for X's article feature |
| Added X tweet format | Single promotional tweet |
| Removed X thread format | Replaced by X article + X tweet (breaking change) |
| Added agent instructions block | Auto-injected for project showcase posts |
| `linkedin.md` → `linkedin.txt` | LinkedIn doesn't render markdown; plain text is more accurate |
| Added `x-article.md` and `x-tweet.txt` | New output files |

### New Platform Formats

#### X Article (Long-Form)

- **Title:** Pulled from blog post title (max 100 chars)
- **Body:** Full content adapted for X articles:
  - Strip frontmatter
  - Keep section headers as `##`
  - Replace code blocks >10 lines with link to blog post
  - Professional tone, keep technical depth
  - End with link to full post on vahagn.dev

#### X Tweet (Promotional)

- Single tweet (max 280 chars) promoting the X article or blog post
- Structure: Hook sentence + key stat + `[link placeholder]`
- No code, no hashtags unless they add value
- Link placeholder: `[link to article]` (user pastes URL after publishing article)

### Agent Instructions Block

Auto-injected into **cross-posted versions only** (LinkedIn, X article) when the post is a **project showcase** (detected by: links to a GitHub repo, contains `npx` or install commands, or tags include `open-source`).

The blog post itself already has the agent instructions block added during the drafting phase by `technical-blog-writing` — the cross-poster does NOT modify the blog `.md` file.

Format:

```
Give this to your agent — copy and paste this into your AI agent to get started:

"Install <project>: <install-command> — then use the installed <type> to <purpose>. Available <categories>: <list>."
```

The block is generated by:
1. Extracting the install command from the blog post
2. Extracting the project name from the repo URL or title
3. Listing categories/features from the blog post's section headers or bullet lists

### Updated Output Manifest

| File | Platform | Format |
|---|---|---|
| `devto.md` | Dev.to | Markdown with Dev.to frontmatter |
| `linkedin.txt` | LinkedIn | Plain text, no markdown (changed from `.md`) |
| `x-article.md` | X article | Markdown (title on first line) |
| `x-tweet.txt` | X tweet | Plain text, single tweet |
| `reddit.md` | Reddit | Markdown self-post |

### Dev.to Cover Image

The `cover_image` field in Dev.to frontmatter is left empty. Dev.to requires a hosted URL, not a local file. The user should upload the X hero image to Dev.to's image uploader after publishing and paste the URL back into the frontmatter. The Dev.to output file includes a comment noting this:

```yaml
# cover_image: Upload x-hero.png to Dev.to and paste the URL here
```

### Unchanged Behavior

- Dev.to: Full article with frontmatter, canonical URL, max 4 tags
- LinkedIn: Strip frontmatter, replace long code blocks, professional tone, CTA
- Reddit: Self-post, conversational intro, 1-2 subreddits from allowlist, key takeaways
- All versions: canonical URL back to vahagn.dev

## Skill 4: `technical-blog-writing` (Modified)

**Location:** `/Users/djbeatbug/.claude/skills/technical-blog-writing/SKILL.md`

### Change

Remove Phase 5 (Handoff) from the skill. The skill now ends after Phase 4 (Review Loop) with an approved draft presented inline.

**Before (Phase 5):**
> After draft approval:
> 1. Follow the instructions in `blog-seo-optimizer` on the draft
> 2. After SEO approval, write `.md` to `src/content/blog/<slug>.md`
> 3. Follow the instructions in `blog-cross-poster` for distribution versions

**After:**
> Phase 5 is removed. When invoked standalone, the skill ends with the approved draft. When invoked through `/new-post`, the orchestrator handles SEO, file writing, cross-posting, and image generation.

This is the only change to this skill.

## Directory Structure

```
cross-posts/
  <slug>/
    devto.md
    linkedin.txt
    x-article.md
    x-tweet.txt
    reddit.md
    x-hero.png
    linkedin-hero.png
```

The `cross-posts/` directory is gitignored — these are ephemeral distribution artifacts, not source content. The canonical content lives in `src/content/blog/<slug>.md`. Add `cross-posts/` to `.gitignore` during implementation.

## What Does NOT Change

- `blog-seo-optimizer` skill — no modifications
- Blog frontmatter schema — inherited from `src/content.config.ts`
- Slug conventions — kebab-case, max 50 chars, derived from blog post filename (minus `.md`)
- Date format — `'Mon DD YYYY'`
- Tone adaptation rules — handled by `technical-blog-writing`

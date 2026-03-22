# /new-post Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/new-post` orchestrator skill that chains blog writing → SEO → cross-posting → hero image generation into a single automated pipeline with 3 review gates.

**Architecture:** Four SKILL.md files — one new orchestrator (`new-post`), one new generator (`blog-hero-generator`), one enhanced (`blog-cross-poster`), one modified (`technical-blog-writing`). All skills are plain Markdown instruction files read by the AI agent at invocation time. No runtime code — the agent interprets the skill instructions and executes them.

**Tech Stack:** Markdown skill files, Playwright MCP (hero images), python3 http.server (temp serving)

**Spec:** `docs/superpowers/specs/2026-03-22-new-post-pipeline-design.md`

---

### Task 1: Modify `technical-blog-writing` — Remove Phase 5

**Files:**
- Modify: `/Users/djbeatbug/.claude/skills/technical-blog-writing/SKILL.md`

- [ ] **Step 1: Read the current skill file**

Read `/Users/djbeatbug/.claude/skills/technical-blog-writing/SKILL.md` to confirm current Phase 5 content.

- [ ] **Step 2: Remove Phase 5 (Handoff) section**

Replace the Phase 5 section (lines 59-65):

```markdown
## Phase 5: Handoff

After draft approval:

1. Follow the instructions in `blog-seo-optimizer` on the draft
2. After SEO approval, write `.md` to `src/content/blog/<slug>.md`
3. Follow the instructions in `blog-cross-poster` for distribution versions
```

With:

```markdown
## Phase 5: Completion

After draft approval, present the final draft inline. The user can:
- Invoke `/new-post` to continue with SEO, cross-posting, and hero images automatically
- Invoke `blog-seo-optimizer` and `blog-cross-poster` manually
- Copy the draft and use it directly
```

- [ ] **Step 3: Verify the skill file is valid**

Read the modified file and confirm:
- Phases 1-4 are unchanged
- Phase 5 no longer references `blog-seo-optimizer` or `blog-cross-poster` as automatic steps
- Quick Reference and Common Mistakes sections are intact

- [ ] **Step 4: Commit**

```bash
git add /Users/djbeatbug/.claude/skills/technical-blog-writing/SKILL.md
git commit -m "refactor: remove Phase 5 handoff from technical-blog-writing skill

Phase 5 previously invoked blog-seo-optimizer and blog-cross-poster
directly. Now /new-post orchestrator owns that chain to avoid
double-invocation."
```

---

### Task 2: Enhance `blog-cross-poster` — Add X Article, X Tweet, Agent Block

**Files:**
- Modify: `/Users/djbeatbug/.claude/skills/blog-cross-poster/SKILL.md`

- [ ] **Step 1: Read the current skill file**

Read `/Users/djbeatbug/.claude/skills/blog-cross-poster/SKILL.md` to confirm current structure.

- [ ] **Step 2: Rewrite the skill file with enhancements**

Replace the entire file with the enhanced version. Key changes:
- Replace X Thread section with X Article and X Tweet sections
- Add Agent Instructions Block section
- Update output manifest (`linkedin.md` → `linkedin.txt`, add `x-article.md`, add `x-tweet.txt`, remove `x-thread.md`)
- Add Dev.to cover_image comment note
- Add Changes from Previous Version table
- Update description in frontmatter

Write this content to the file:

```markdown
---
name: blog-cross-poster
description: "Use when the user asks to generate cross-post versions of a blog post, prepare a post for Dev.to, LinkedIn, X, or Reddit, distribute blog content across platforms, or when the /new-post orchestrator reaches the cross-posting step."
---

# Blog Cross-Poster

Generate platform-specific versions of a blog post with canonical URLs back to vahagn.dev.

## Changes from Previous Version

| Change | Detail |
|---|---|
| Added X article format | Long-form article for X's article feature |
| Added X tweet format | Single promotional tweet |
| Removed X thread format | Replaced by X article + X tweet |
| Added agent instructions block | Auto-injected for project showcase posts |
| `linkedin.md` → `linkedin.txt` | LinkedIn doesn't render markdown; plain text is more accurate |

## Input

Path to an `.md` file in `src/content/blog/` or inline Markdown content.

## Platform Specifications

### Dev.to

- Output full article with Dev.to frontmatter:
  ```yaml
  ---
  title: string
  published: false
  canonical_url: https://vahagn.dev/blog/<slug>
  # cover_image: Upload x-hero.png to Dev.to and paste the URL here
  tags: [max 4, lowercase, no spaces]
  ---
  ```
- Preserve body as-is (Dev.to supports standard Markdown)
- Map post tags to Dev.to format (lowercase, no spaces, max 4)

### LinkedIn

- Strip frontmatter entirely
- Output as plain text (not markdown) — LinkedIn does not render markdown
- Replace code fences >10 lines with: "See the full code in the original post: https://vahagn.dev/blog/<slug>"
- Professional tone: remove casual language, keep technical depth
- End with CTA linking to the full post on vahagn.dev

### X Article (Long-Form)

- **Title:** Pulled from blog post title (max 100 chars)
- **Body:** Full content adapted for X articles:
  - Strip frontmatter
  - Keep section headers as `##`
  - Replace code blocks >10 lines with link to blog post
  - Professional tone, keep technical depth
  - End with link to full post on vahagn.dev

### X Tweet (Promotional)

- Single tweet (max 280 chars) promoting the X article or blog post
- Structure: Hook sentence + key stat + `[link placeholder]`
- No code, no hashtags unless they add value
- Link placeholder: `[link to article]` (user pastes URL after publishing)

### Reddit

- **Self-post format** — not a link post
- Suggest 1-2 subreddits from allowlist: `r/programming`, `r/netsec`, `r/devops`, `r/homelab`, `r/networking`, `r/cybersecurity`, `r/sysadmin`
- Conversational intro paragraph (not self-promotional)
- Key takeaways as bullet list
- End with link to full post on vahagn.dev

## Agent Instructions Block

Auto-injected into **cross-posted versions only** (LinkedIn, X article) when the post is a **project showcase**.

**Detection:** Post links to a GitHub repo, contains `npx` or install commands, or tags include `open-source`.

**Format:**

```
Give this to your agent — copy and paste this into your AI agent to get started:

"Install <project>: <install-command> — then use the installed <type> to <purpose>. Available <categories>: <list>."
```

**Generation:**
1. Extract the install command from the blog post
2. Extract the project name from the repo URL or title
3. List categories/features from section headers or bullet lists

If the post is not a project showcase, skip this block entirely.

## Output

1. Present all five versions inline for user review
2. After approval, write files to `<project-root>/cross-posts/<slug>/`:

| File | Platform |
|---|---|
| `devto.md` | Dev.to |
| `linkedin.txt` | LinkedIn |
| `x-article.md` | X article |
| `x-tweet.txt` | X tweet |
| `reddit.md` | Reddit |

## Common Mistakes

- **Don't forget the canonical URL** -- every platform version must link back to vahagn.dev
- **Don't exceed X tweet character limit** -- max 280 chars, URLs = 23 chars via t.co
- **Don't leave code fences in LinkedIn** -- replace blocks >10 lines with a link
- **Don't suggest subreddits outside the allowlist** -- only the seven listed above
- **Don't modify the blog .md file** -- agent instructions go in cross-posted versions only
```

- [ ] **Step 3: Verify the skill file**

Read the modified file and confirm:
- Dev.to, LinkedIn, X Article, X Tweet, Reddit sections all present
- Agent Instructions Block section present with detection logic
- Output manifest has 5 files with correct names
- X Thread section is gone
- Common Mistakes updated

- [ ] **Step 4: Commit**

```bash
git add /Users/djbeatbug/.claude/skills/blog-cross-poster/SKILL.md
git commit -m "feat: enhance blog-cross-poster with X article, tweet, agent block

Replace X thread with X article + X tweet formats. Add agent
instructions block for project showcase posts. Change LinkedIn
output to .txt. Add Dev.to cover_image comment."
```

**Follow-up (not blocking):** The `blog-seo-optimizer` skill description still says "Also triggered when the technical-blog-writing skill hands off a draft for SEO review." This is now stale since `technical-blog-writing` no longer hands off. Update the description in a future pass to reference `/new-post` instead.

---

### Task 3: Create `blog-hero-generator` Skill

**Files:**
- Create: `/Users/djbeatbug/.claude/skills/blog-hero-generator/SKILL.md`

- [ ] **Step 1: Verify the skills directory exists**

```bash
ls /Users/djbeatbug/.claude/skills/
```

- [ ] **Step 2: Create the skill directory**

```bash
mkdir -p /Users/djbeatbug/.claude/skills/blog-hero-generator
```

- [ ] **Step 3: Write the skill file**

Write to `/Users/djbeatbug/.claude/skills/blog-hero-generator/SKILL.md`:

```markdown
---
name: blog-hero-generator
description: "Use when the user asks to generate hero images for a blog post, create social media cover images, or when the /new-post orchestrator reaches the hero image generation step."
---

# Blog Hero Generator

Generate platform-specific hero images for blog posts using HTML templates rendered via Playwright.

## Prerequisites

Requires Playwright MCP server tools: `browser_navigate`, `browser_resize`, `browser_take_screenshot`.

If Playwright tools are not available, notify the user: "Hero image generation requires Playwright. Skipping — you can generate images manually later." and stop.

## Input

Read these fields from the blog post's frontmatter:

| Field | Source | Required |
|---|---|---|
| `title` | Frontmatter `title` | Yes |
| `description` | Frontmatter `description` | Yes |
| `tags` | Frontmatter `tags` array | Yes |
| `slug` | Blog post filename minus `.md` | Yes |

## Output

| File | Dimensions | Aspect Ratio | Use |
|---|---|---|---|
| `cross-posts/<slug>/x-hero.png` | 1250x500 | 5:2 | X article cover |
| `cross-posts/<slug>/linkedin-hero.png` | 1200x627 | ~1.91:1 | LinkedIn post image |

These images are for cross-posting platforms only, not for the blog `heroImage` field.

## Procedure

### Step 1: Extract Metadata

Read the blog post file and extract title, description, tags, and slug.

### Step 2: Process Title for Gradient

Split the title into plain text and gradient-highlighted text.

Apply the gradient to the last word or phrase matching one of these keywords:
- Security, Network, Cloud, AI, Agent, Infrastructure, Automation, DevOps, Observability

If no keyword matches, apply the gradient to the last 2 words.

Example: "Building an AI Skills Suite for **Network Security**" — "Network Security" gets the gradient.

### Step 3: Map Tags to Pills

Convert tags to visual domain pills using this mapping:

| Tag pattern | Pill label | Color class |
|---|---|---|
| `network-security`, `networking` | Network Security | blue |
| `ai-agents`, `ai` | AI Agents | purple |
| `cloud`, `aws`, `azure`, `gcp` | Cloud Security | green |
| `cisco`, `juniper`, `arista` | Device Health | blue |
| Other tags | Title-case, hyphens → spaces | amber |

Skip the `open-source` tag from pills — it becomes a badge instead.

Show max 5 pills.

### Step 4: Generate HTML

For each variant (X hero and LinkedIn hero), generate a complete HTML file in `/tmp/`. The HTML must:

1. Use inline CSS only (no external dependencies)
2. Set `body` dimensions to match the target (1250x500 or 1200x627)
3. Include:
   - Dark background (`#0a0e17`) with CSS grid overlay
   - Blurred gradient orbs (blue `#38bdf8`, purple `#818cf8`, green `#10b981`)
   - Network node dots with connection lines (SVG)
   - "OPEN SOURCE" badge (top-left) if tags include `open-source`
   - Title with gradient highlight (`linear-gradient(135deg, #38bdf8, #818cf8)`)
   - Description as subtitle (muted gray `#94a3b8`)
   - Tag pills on the right side with color-coded icons
   - Author line "Vahagn Madatyan / vahagn.dev" (LinkedIn variant only, bottom-left)

### Step 5: Render Images

For each HTML file:

1. Start a temp HTTP server: `python3 -m http.server 8787` in `/tmp/`
   - If port 8787 is busy, try 8788-8799
2. Navigate Playwright to `http://localhost:<port>/<filename>`
3. Resize viewport to target dimensions
4. Take screenshot as PNG
5. Save to `cross-posts/<slug>/`
6. Kill the server and delete the HTML file

If screenshot fails, retry once. If still fails, report error and skip that variant.

### Step 6: Present for Review

Show both generated images inline. Ask: "Hero images ready. Approve to save, or request changes?"

If user requests changes, regenerate with modifications and re-present.

## Common Mistakes

- **Don't use external CSS or fonts** -- everything must be inline for screenshot rendering
- **Don't forget to kill the temp server** -- clean up after each render
- **Don't hardcode port 8787** -- fall back to other ports if busy
- **Don't exceed 5 pills** -- too many pills break the layout
```

- [ ] **Step 4: Verify the file exists and is readable**

Read `/Users/djbeatbug/.claude/skills/blog-hero-generator/SKILL.md` and confirm all sections are present.

- [ ] **Step 5: Commit**

```bash
git add /Users/djbeatbug/.claude/skills/blog-hero-generator/SKILL.md
git commit -m "feat: add blog-hero-generator skill

Generates platform-specific hero images (X 5:2, LinkedIn 1200x627)
from blog post metadata using HTML templates and Playwright screenshots."
```

---

### Task 4: Create `/new-post` Orchestrator Skill

**Files:**
- Create: `/Users/djbeatbug/.claude/skills/new-post/SKILL.md`

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p /Users/djbeatbug/.claude/skills/new-post
```

- [ ] **Step 2: Write the orchestrator skill file**

Write to `/Users/djbeatbug/.claude/skills/new-post/SKILL.md`:

```markdown
---
name: new-post
description: "Use when the user wants to create a complete blog post with all cross-platform versions and hero images. Orchestrates the full pipeline: blog writing → SEO → cross-posts → hero images with review gates at each stage."
---

# New Post Pipeline

Full blog publishing pipeline from idea to platform-ready distribution files.

## Invocation

```
/new-post <topic, repo URL, local path, or rough draft text>
```

## Pipeline

### Gate A: Blog Draft

**Step 1 — Draft the blog post:**

Follow the instructions in `technical-blog-writing` skill (Phases 1-4 only).

Pass the user's input directly. The skill handles:
- Input classification (repo, topic, draft, ambiguous)
- Research and outline (presented for user approval)
- Drafting from approved outline
- Review loop until user approves

Do NOT proceed until the user has approved the blog post draft.

**Step 2 — SEO optimization:**

Follow the instructions in `blog-seo-optimizer` on the approved draft.

Walk through the 7-point checklist with the user. Apply fixes.

After SEO is complete, write the final `.md` to `src/content/blog/<slug>.md`.

### Gate B: Cross-Posts

**Step 3 — Generate cross-platform versions:**

Follow the instructions in `blog-cross-poster` using the written blog post file.

Generate all 5 platform versions (Dev.to, LinkedIn, X article, X tweet, Reddit).

Present all versions inline for user review.

Ask: "Cross-posts ready. Approve to write files, or request changes?"

If user requests changes, revise and re-present. Repeat until approved.

On approval, create directory and write files:

```bash
mkdir -p cross-posts/<slug>
```

Write each file to `cross-posts/<slug>/`.

### Gate C: Hero Images

**Step 4 — Generate hero images:**

Follow the instructions in `blog-hero-generator` using the blog post metadata.

Generate X hero (1250x500) and LinkedIn hero (1200x627).

Present images inline for user review.

Ask: "Hero images ready. Approve to save, or request changes?"

If user requests changes, regenerate and re-present. Repeat until approved.

On approval, save PNGs to `cross-posts/<slug>/`.

### Summary

**Step 5 — Print file manifest:**

After all gates pass, print:

```
Pipeline complete! Files created:

Blog post:     src/content/blog/<slug>.md
Dev.to:        cross-posts/<slug>/devto.md
LinkedIn:      cross-posts/<slug>/linkedin.txt
X article:     cross-posts/<slug>/x-article.md
X tweet:       cross-posts/<slug>/x-tweet.txt
Reddit:        cross-posts/<slug>/reddit.md
X hero:        cross-posts/<slug>/x-hero.png
LinkedIn hero: cross-posts/<slug>/linkedin-hero.png
```

## Edge Cases

- **User abandons at any gate:** Stop gracefully. Keep any files already written. Do not delete partial work.
- **No repo/project linked:** The `blog-cross-poster` handles this — it skips the agent instructions block.
- **Playwright not available:** The `blog-hero-generator` handles this — it skips image generation and notifies the user.
- **User provides only a topic:** The `technical-blog-writing` skill handles ambiguity by asking one clarifying question.

## Common Mistakes

- **Don't skip gates** -- every gate requires explicit user approval before proceeding
- **Don't re-run SEO or cross-poster if technical-blog-writing already did** -- this orchestrator owns Steps 2-4, not technical-blog-writing
- **Don't write files before approval** -- present inline first, write only after user says yes
- **Don't forget to create the cross-posts/<slug>/ directory** -- mkdir -p before writing
```

- [ ] **Step 3: Verify the file exists and is readable**

Read `/Users/djbeatbug/.claude/skills/new-post/SKILL.md` and confirm all sections are present.

- [ ] **Step 4: Commit**

```bash
git add /Users/djbeatbug/.claude/skills/new-post/SKILL.md
git commit -m "feat: add /new-post orchestrator skill

Chains technical-blog-writing → blog-seo-optimizer → blog-cross-poster
→ blog-hero-generator with 3 review gates (draft, cross-posts, images)."
```

---

### Task 5: Add `cross-posts/` to `.gitignore`

**Files:**
- Modify: `/Users/djbeatbug/RoadToMillion/me/.gitignore`

- [ ] **Step 1: Read current .gitignore**

Read `/Users/djbeatbug/RoadToMillion/me/.gitignore`.

- [ ] **Step 2: Add cross-posts to .gitignore**

Append to the end of the file:

```
# Cross-post distribution artifacts
cross-posts/
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: add cross-posts/ to .gitignore"
```

---

### Task 6: Verify Full Pipeline

- [ ] **Step 1: Verify all 4 skill files exist and are readable**

Read each file and confirm it loads without errors:
- `/Users/djbeatbug/.claude/skills/new-post/SKILL.md`
- `/Users/djbeatbug/.claude/skills/blog-hero-generator/SKILL.md`
- `/Users/djbeatbug/.claude/skills/blog-cross-poster/SKILL.md`
- `/Users/djbeatbug/.claude/skills/technical-blog-writing/SKILL.md`

- [ ] **Step 2: Verify cross-references**

Confirm that:
- `new-post` references `technical-blog-writing`, `blog-seo-optimizer`, `blog-cross-poster`, `blog-hero-generator` by their correct names
- `technical-blog-writing` no longer references `blog-seo-optimizer` or `blog-cross-poster` as automatic steps
- `blog-cross-poster` does not reference `technical-blog-writing` as a caller (it accepts any input)

- [ ] **Step 3: Verify .gitignore includes cross-posts/**

```bash
grep 'cross-posts' /Users/djbeatbug/RoadToMillion/me/.gitignore
```

Expected: `cross-posts/`

- [ ] **Step 4: Final commit with all changes**

If any uncommitted changes remain:

```bash
git status
git add -A
git commit -m "chore: verify /new-post pipeline skill suite"
```

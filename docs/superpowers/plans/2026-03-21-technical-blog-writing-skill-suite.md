# Technical Blog Writing Skill Suite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create three Claude Code skills (`technical-blog-writing`, `blog-seo-optimizer`, `blog-cross-poster`) that form a full blog-writing pipeline from idea to cross-posted publication.

**Architecture:** Three independent SKILL.md files in `~/.claude/skills/`, each backed by a directory in `~/.agents/skills/`. The orchestrator skill references sub-skills by name at workflow transition points. Each skill follows the writing-skills TDD process: baseline test (RED) → write skill (GREEN) → close loopholes (REFACTOR).

**Tech Stack:** Claude Code skills (Markdown SKILL.md files), Astro content collections, Markdown frontmatter

**Spec:** `docs/superpowers/specs/2026-03-21-technical-blog-writing-skill-design.md`

---

## File Structure

```
~/.agents/skills/
  technical-blog-writing/
    SKILL.md              # Orchestrator skill
  blog-seo-optimizer/
    SKILL.md              # SEO optimization skill
  blog-cross-poster/
    SKILL.md              # Cross-posting skill

~/.claude/skills/
  technical-blog-writing -> ../../.agents/skills/technical-blog-writing   # symlink
  blog-seo-optimizer -> ../../.agents/skills/blog-seo-optimizer           # symlink
  blog-cross-poster -> ../../.agents/skills/blog-cross-poster             # symlink
```

---

## Task 1: Write the Orchestrator Skill (`technical-blog-writing`)

**Files:**
- Create: `~/.agents/skills/technical-blog-writing/SKILL.md`
- Create: `~/.claude/skills/technical-blog-writing` (symlink)

### RED Phase — Baseline Test

- [ ] **Step 1: Run baseline pressure scenario WITHOUT the skill**

Dispatch a general-purpose subagent with this prompt:

```
You are helping a developer write a technical blog post for their Astro blog at /Users/djbeatbug/RoadToMillion/me.

The blog uses Markdown content collections in src/content/blog/ with frontmatter schema defined in src/content.config.ts.

The user says: "Write a blog post about my netsec-skills-suite project at /Users/djbeatbug/RoadToMillion/me. It's a collection of 35+ agent skills for network security."

Write the blog post. Do NOT write any files — just output the draft inline.
```

- [ ] **Step 2: Document baseline failures**

Record in a scratch note (not committed):
- Did the agent explore the actual project code, or just use the description?
- Did the agent produce valid Astro frontmatter with all required fields?
- Did the agent use the correct `pubDate` format (`'Mon DD YYYY'`)?
- Did the agent match the voice/tone of existing posts?
- Did the agent include code samples from the actual codebase?
- Did the agent generate an outline first, or jump straight to writing?
- Did the agent present the draft for review, or treat it as final?

### GREEN Phase — Write Minimal Skill

- [ ] **Step 3: Create the skill directory**

```bash
mkdir -p ~/.agents/skills/technical-blog-writing
```

- [ ] **Step 4: Write `SKILL.md`**

Write `~/.agents/skills/technical-blog-writing/SKILL.md` with:

**Frontmatter:**
- `name: technical-blog-writing`
- `description:` starts with "Use when..." — triggering conditions only, NO workflow summary. Include triggers: user asks to write a blog post, mentions blogging, provides a topic/project to write about, shares a rough draft to polish.

**Body sections:**
- **Overview** — One-sentence purpose: full pipeline from idea to published blog post with SEO and cross-posting
- **Phase 1: Input Classification** — Detect input type (project/repo local, project/repo remote URL, topic+bullets, rough draft). If ambiguous, ask one question.
- **Phase 2: Research & Outline** — Category detection (announcement ~500w / showcase ~1000w / deep dive ~2000w+). Adaptive tone rules (casual/formal/tutorial). Generate outline. Present for approval.
- **Phase 3: Drafting** — Write from approved outline. Slug rules (kebab-case, max 50 chars, no stop words). Complete frontmatter schema matching `src/content.config.ts` (title, description 150-160 chars, pubDate as `'Mon DD YYYY'`, updatedDate optional, featured, tags, draft, heroImage as image() optional, canonicalURL optional). Code samples from actual source with file path comments. Present inline for review.
- **Phase 4: Review Loop** — User gives feedback, agent revises, repeat until approved. If abandoned, discard gracefully.
- **Phase 5: Handoff** — Instruct agent to "follow the instructions in `blog-seo-optimizer`" on draft. After SEO approval, write `.md` to `src/content/blog/<slug>.md`. Then "follow the instructions in `blog-cross-poster`" for distribution versions.
- **Quick Reference** — Table: input type → category → target length → tone
- **Common Mistakes** — Don't skip outline approval. Don't hallucinate code. Don't use wrong date format. Don't write file without user approval.

- [ ] **Step 5: Create symlink**

```bash
ln -s ../../.agents/skills/technical-blog-writing ~/.claude/skills/technical-blog-writing
```

### REFACTOR Phase — Verify and Close Loopholes

- [ ] **Step 6: Re-run baseline scenario WITH the skill loaded**

Dispatch the same subagent prompt from Step 1, but this time the skill will be available in the agent's context. Compare behavior against baseline.

- [ ] **Step 7: Document improvements and remaining gaps**

Check:
- Does the agent now explore the project code?
- Does it generate an outline before drafting?
- Does it present the draft for review?
- Does the frontmatter match the schema?
- Does it use the correct date format?
- Does it reference sub-skills at handoff?

If gaps remain, update the SKILL.md to address them and re-test.

- [ ] **Step 8: Commit**

```bash
git add ~/.agents/skills/technical-blog-writing/SKILL.md
git commit -m "feat: add technical-blog-writing orchestrator skill"
```

---

## Task 2: Write the SEO Optimizer Skill (`blog-seo-optimizer`)

**Files:**
- Create: `~/.agents/skills/blog-seo-optimizer/SKILL.md`
- Create: `~/.claude/skills/blog-seo-optimizer` (symlink)

### RED Phase — Baseline Test

- [ ] **Step 1: Run baseline scenario WITHOUT the skill**

Dispatch a general-purpose subagent:

```
You are reviewing a blog post for SEO optimization. The post is at /Users/djbeatbug/RoadToMillion/me/src/content/blog/netsec-skills-suite.md.

The blog is an Astro site deployed to vahagn.dev. Check the post's SEO: title length, description quality, keyword usage, tag relevance, readability, and frontmatter completeness.

Read the post and the content schema at src/content.config.ts, then provide your SEO analysis.
```

- [ ] **Step 2: Document baseline failures**

Record:
- Did the agent check title length against SERP limits (50-60 chars)?
- Did it validate description is 150-160 chars?
- Did it identify primary keyword and check placement?
- Did it cross-reference tags with existing posts?
- Did it check readability (paragraph length, subheadings)?
- Did it validate frontmatter completeness against the actual schema?

### GREEN Phase — Write Minimal Skill

- [ ] **Step 3: Create the skill directory**

```bash
mkdir -p ~/.agents/skills/blog-seo-optimizer
```

- [ ] **Step 4: Write `SKILL.md`**

Write `~/.agents/skills/blog-seo-optimizer/SKILL.md` with:

**Frontmatter:**
- `name: blog-seo-optimizer`
- `description:` starts with "Use when..." — triggers: optimizing blog post SEO, reviewing post metadata, checking keyword placement, validating frontmatter, preparing post for search engines.

**Body sections:**
- **Overview** — One-sentence: SEO analysis and optimization for Astro blog posts on vahagn.dev
- **Input** — Accepts inline draft or path to `.md` file
- **Checklist** (the core — numbered checks):
  1. Title optimization (50-60 chars, keyword-rich, compelling)
  2. Description validation (150-160 chars, primary keyword, value proposition not summary)
  3. Keyword analysis (primary keyword in title, description, first paragraph, at least one H2; suggest secondaries)
  4. Tag suggestions (3-6 tags, cross-reference existing taxonomy by reading other posts in `src/content/blog/`)
  5. Readability (flag paragraphs >150 words, missing code samples in technical sections, sections without subheadings)
  6. Frontmatter validation (all required fields present per `src/content.config.ts`, `pubDate` set, `canonicalURL` points to `vahagn.dev`)
  7. Code source verification (if post originated from project input, verify file paths in code block comments exist)
- **Output format** — Present as interactive checklist. Each item: status (pass/warn/fail), current value, recommendation. User approves or adjusts each.
- **Common Mistakes** — Don't keyword-stuff. Description should be a value proposition, not a summary of the post. Don't suggest tags that don't exist in the taxonomy without flagging them as new.

- [ ] **Step 5: Create symlink**

```bash
ln -s ../../.agents/skills/blog-seo-optimizer ~/.claude/skills/blog-seo-optimizer
```

### REFACTOR Phase — Verify and Close Loopholes

- [ ] **Step 6: Re-run baseline scenario WITH the skill**

Same prompt as Step 1. Compare against baseline.

- [ ] **Step 7: Document improvements and fix gaps**

If the agent still misses checks or uses wrong thresholds, update SKILL.md and re-test.

- [ ] **Step 8: Commit**

```bash
git add ~/.agents/skills/blog-seo-optimizer/SKILL.md
git commit -m "feat: add blog-seo-optimizer skill"
```

---

## Task 3: Write the Cross-Poster Skill (`blog-cross-poster`)

**Files:**
- Create: `~/.agents/skills/blog-cross-poster/SKILL.md`
- Create: `~/.claude/skills/blog-cross-poster` (symlink)

### RED Phase — Baseline Test

- [ ] **Step 1: Run baseline scenario WITHOUT the skill**

Dispatch a general-purpose subagent:

```
You are generating cross-post versions of a blog post for multiple platforms. The original post is at /Users/djbeatbug/RoadToMillion/me/src/content/blog/netsec-skills-suite.md, published on vahagn.dev.

Generate versions for: Dev.to, LinkedIn, X (Twitter thread), and Reddit.

Each version should have the canonical URL pointing back to https://vahagn.dev/blog/netsec-skills-suite.

Output all versions inline.
```

- [ ] **Step 2: Document baseline failures**

Record:
- Did the agent produce valid Dev.to frontmatter (`published: false`, `canonical_url`, `cover_image`, `tags`)?
- Did the LinkedIn version strip long code fences and adjust tone?
- Did the X thread respect 280-char limits (with URLs as 23 chars)?
- Did the Reddit version suggest specific subreddits from a reasonable set?
- Did any version miss the canonical URL?
- Did the agent present for review or treat as final?

### GREEN Phase — Write Minimal Skill

- [ ] **Step 3: Create the skill directory**

```bash
mkdir -p ~/.agents/skills/blog-cross-poster
```

- [ ] **Step 4: Write `SKILL.md`**

Write `~/.agents/skills/blog-cross-poster/SKILL.md` with:

**Frontmatter:**
- `name: blog-cross-poster`
- `description:` starts with "Use when..." — triggers: generating cross-post versions, preparing blog post for Dev.to/LinkedIn/X/Reddit, distributing blog content across platforms.

**Body sections:**
- **Overview** — One-sentence: generate platform-specific versions of a blog post with canonical URLs back to vahagn.dev
- **Input** — Path to `.md` file or inline content
- **Platform Specifications:**
  - **Dev.to** — Full article. Frontmatter: `published: false`, `canonical_url: https://vahagn.dev/blog/<slug>`, `cover_image`, `tags` (map to Dev.to format). Body preserved as-is.
  - **LinkedIn** — Long-form Article format. Strip code fences >10 lines → replace with "See the full code in the original post" + link. Remove frontmatter. Professional tone (remove casual language, keep technical depth). End with CTA to vahagn.dev.
  - **X Thread** — Chunks <=280 chars (URLs count as 23 chars via t.co). First tweet = hook. Code samples → link to post. Last tweet links to full post. Numbered 1/N.
  - **Reddit** — Self-post. Suggest 1-2 from allowlist: r/programming, r/netsec, r/devops, r/homelab, r/networking, r/cybersecurity, r/sysadmin. Conversational intro, key takeaways as bullets, link to full post. Not purely self-promotional.
- **Output** — Present all versions inline for review. After approval, write to `<project-root>/cross-posts/<slug>/` with files: `devto.md`, `linkedin.md`, `x-thread.md`, `reddit.md`.
- **Common Mistakes** — Don't forget canonical URL on any platform. Don't exceed X character limits. Don't leave code fences in LinkedIn version. Don't suggest subreddits outside the allowlist.

- [ ] **Step 5: Create symlink**

```bash
ln -s ../../.agents/skills/blog-cross-poster ~/.claude/skills/blog-cross-poster
```

### REFACTOR Phase — Verify and Close Loopholes

- [ ] **Step 6: Re-run baseline scenario WITH the skill**

Same prompt as Step 1. Compare against baseline.

- [ ] **Step 7: Document improvements and fix gaps**

If the agent misses platform requirements, update SKILL.md and re-test.

- [ ] **Step 8: Commit**

```bash
git add ~/.agents/skills/blog-cross-poster/SKILL.md
git commit -m "feat: add blog-cross-poster skill"
```

---

## Task 4: Integration Test — Full Pipeline

- [ ] **Step 1: Run full pipeline test**

Dispatch a general-purpose subagent with all three skills available:

```
Write a blog post about the netsec-skills-suite project at /Users/djbeatbug/RoadToMillion/me.

The project is a collection of 35+ agent skills for network security operations — device health checks, firewall audits, compliance assessments, incident response.

Follow the technical-blog-writing skill workflow. Do NOT write any files — output everything inline for review.
```

- [ ] **Step 2: Verify end-to-end workflow**

Check:
- Did the orchestrator classify input correctly (project/repo)?
- Did it explore the actual codebase?
- Did it generate an outline and present for approval?
- Did it write a draft with correct frontmatter and voice?
- Did it transition to SEO optimization?
- Did SEO checks run against the draft?
- Did it transition to cross-posting?
- Did all 4 platform versions generate correctly?
- Were canonical URLs present on all versions?

- [ ] **Step 3: Fix any integration gaps**

If sub-skill transitions don't work smoothly, update the orchestrator's handoff instructions.

- [ ] **Step 4: Final commit**

```bash
git add ~/.agents/skills/technical-blog-writing/SKILL.md ~/.agents/skills/blog-seo-optimizer/SKILL.md ~/.agents/skills/blog-cross-poster/SKILL.md
git commit -m "refactor: polish skill suite after integration testing"
```

---

## Task 5: Documentation and Cleanup

- [ ] **Step 1: Verify all symlinks work**

```bash
ls -la ~/.claude/skills/technical-blog-writing
ls -la ~/.claude/skills/blog-seo-optimizer
ls -la ~/.claude/skills/blog-cross-poster
```

All should point to existing directories under `~/.agents/skills/`.

- [ ] **Step 2: Verify skills appear in Claude Code**

Start a new Claude Code session and check that all three skills appear in the available skills list.

- [ ] **Step 3: Commit any remaining changes**

```bash
git add -A
git commit -m "docs: finalize technical blog writing skill suite"
```

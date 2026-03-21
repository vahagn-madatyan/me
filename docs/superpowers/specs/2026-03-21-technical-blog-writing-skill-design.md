# Technical Blog Writing Skill Suite — Design Spec

## Overview

A suite of three Claude Code skills that turn blog writing from idea to cross-posted publication. The suite handles input classification, research, drafting, interactive review, SEO optimization, and platform-specific cross-post generation for vahagn.dev's Astro blog.

## Problem

Writing technical blog posts involves repeatable steps: research, outlining, drafting, SEO optimization, and reformatting for distribution platforms. Each step has quality standards that are easy to forget under time pressure. The current process is manual and inconsistent.

## Goals

- **Consistency** — Every post follows the same quality bar: voice, structure, SEO, frontmatter
- **Speed** — Go from idea/project to publish-ready Markdown with minimal manual effort
- **SEO** — Enforce keyword optimization, meta best practices, and discoverability on every post
- **Distribution** — Auto-generate cross-post versions for Dev.to, LinkedIn, X, and Reddit with canonical URLs back to vahagn.dev

## Architecture

Three skills in `~/.claude/skills/`:

```
~/.claude/skills/
  technical-blog-writing/
    SKILL.md              # Orchestrator — input → draft → approve → publish
  blog-seo-optimizer/
    SKILL.md              # SEO analysis, keyword suggestions, meta validation
  blog-cross-poster/
    SKILL.md              # Platform-specific versions for Dev.to, LinkedIn, X, Reddit
```

### Invocation Flow

1. User triggers `technical-blog-writing` (explicitly or agent detects blog-writing intent)
2. Orchestrator classifies input type (project/repo, topic+bullets, rough draft)
3. Orchestrator runs research, outline, draft, interactive review loop
4. Once draft approved, orchestrator invokes `blog-seo-optimizer`
5. Once SEO approved, orchestrator writes final `.md` to `src/content/blog/`
6. Orchestrator invokes `blog-cross-poster` for platform versions

Each sub-skill is independently invocable on existing posts.

---

## Skill 1: `technical-blog-writing` (Orchestrator)

### Trigger Conditions

User asks to write a blog post, mentions blogging, provides a topic/project to write about, or shares a rough draft to polish.

### Phase 1 — Input Classification

- Detect input type:
  - **Project/repo** — Explore codebase, README, key features, architecture decisions
  - **Topic + bullet points** — Use as outline foundation
  - **Rough draft** — Analyze structure, voice, gaps
- If input is ambiguous, ask one clarifying question

### Phase 2 — Research & Outline

- Identify post category and set parameters:
  - **Announcement** — ~500 words, casual tone
  - **Project showcase** — ~1000 words, conversational-technical tone
  - **Deep technical dive** — ~2000+ words, thorough and opinionated
- Tone is adaptive:
  - Casual for personal projects
  - Formal for security advisories
  - Tutorial-style for how-tos
- Generate outline with section headers and key points per section
- Present outline to user for approval before drafting

### Phase 3 — Drafting

- Write full draft following approved outline
- Include code samples where relevant (pulled from actual project code when input is a repo)
- Follow Astro blog frontmatter schema:
  ```yaml
  ---
  title: string
  description: string (150-160 chars)
  pubDate: string
  featured: boolean
  tags: string[]
  draft: boolean
  heroImage: string (optional)
  canonicalURL: string (optional)
  ---
  ```
- Present draft inline for interactive review

### Phase 4 — Review Loop

- User provides feedback (section-level or overall)
- Agent revises and re-presents
- Repeats until user approves

### Phase 5 — Handoff

- Invoke `blog-seo-optimizer` on approved draft
- After SEO approval, write final `.md` to `src/content/blog/<slug>.md`
- Invoke `blog-cross-poster` for distribution versions

---

## Skill 2: `blog-seo-optimizer`

### Trigger Conditions

Invoked by orchestrator after draft approval, or independently when user asks to optimize an existing post's SEO.

### Input

A blog post — inline draft or path to `.md` file.

### Checks

1. **Title optimization** — Length 50-60 chars for SERP. Suggest alternatives with stronger keywords. Ensure compelling and specific.
2. **Description validation** — Enforce 150-160 char range. Include primary keyword. Clear value proposition, not just a summary.
3. **Keyword analysis** — Identify primary keyword from content. Check it appears in title, description, first paragraph, and at least one H2. Suggest secondary keywords.
4. **Tag suggestions** — Recommend 3-6 tags based on content, cross-referenced with existing tag taxonomy (parsed from other posts in `src/content/blog/`).
5. **Readability check** — Flag paragraphs >150 words, missing code samples in technical sections, sections without subheadings.
6. **Frontmatter validation** — All required fields present, `pubDate` set, `canonicalURL` points to `vahagn.dev`.

### Output

Checklist of findings and suggestions, presented interactively. User approves or adjusts each recommendation.

---

## Skill 3: `blog-cross-poster`

### Trigger Conditions

Invoked by orchestrator after final post is written, or independently on any existing post.

### Input

Path to published `.md` file or inline content.

### Platform Outputs

**Dev.to:**
- Full article with Dev.to frontmatter (`published: false`, `canonical_url`, `cover_image`, `tags`)
- Body preserved as-is (Dev.to supports standard Markdown)

**LinkedIn:**
- Article format
- Code fences >10 lines replaced with link to original post
- No frontmatter
- Professional tone adjustment if needed
- CTA linking to vahagn.dev

**X Thread:**
- Broken into tweet-sized chunks (<=280 chars)
- First tweet is the hook
- Code samples become links
- Last tweet links to full post
- Numbered (1/N format)

**Reddit:**
- Self-post format
- Suggests relevant subreddits based on tags
- Conversational intro, key takeaways as bullets, link to full post
- Follows Reddit etiquette (not purely self-promotional)

### Output

All versions presented inline for review. User approves, then agent optionally writes to `cross-posts/<slug>/` directory.

---

## Constraints

- **Astro content schema** — All posts must validate against `src/content.config.ts`
- **Interactive workflow** — Draft is always presented for review, never written directly to content dir without approval
- **Canonical URLs** — All cross-posts point back to `https://vahagn.dev/blog/<slug>`
- **No hallucinated code** — When input is a project/repo, code samples must come from actual source code
- **Existing tag consistency** — Tags should reuse existing taxonomy before introducing new ones

## Success Criteria

- A blog post can go from "write about my X project" to publish-ready `.md` + 4 cross-post versions in a single session
- Every post passes SEO checks without manual fixups
- Cross-post versions are copy-paste ready for each platform
- Skill works with all three input types (project, topic+bullets, rough draft)
- Voice adapts correctly to topic type

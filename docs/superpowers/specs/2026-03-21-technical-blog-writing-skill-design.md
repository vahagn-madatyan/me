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

### Skill-to-Skill Invocation Model

Claude Code skills are instruction documents, not callable APIs. The orchestrator (`technical-blog-writing`) references sub-skills by instructing the agent to "follow the instructions in `blog-seo-optimizer`" and "follow the instructions in `blog-cross-poster`" at the appropriate workflow stages. The agent loads the referenced skill's SKILL.md and follows it inline within the same session. Each sub-skill is also independently invocable when the user triggers it directly.

### Invocation Flow

1. User triggers `technical-blog-writing` (explicitly or agent detects blog-writing intent)
2. Orchestrator classifies input type (project/repo, topic+bullets, rough draft)
3. Orchestrator runs research, outline, draft, interactive review loop
4. Once draft approved, agent follows `blog-seo-optimizer` instructions on the draft
5. Once SEO approved, orchestrator writes final `.md` to `src/content/blog/`
6. Agent follows `blog-cross-poster` instructions for platform versions

Each sub-skill is independently invocable on existing posts.

---

## Skill 1: `technical-blog-writing` (Orchestrator)

### Trigger Conditions

User asks to write a blog post, mentions blogging, provides a topic/project to write about, or shares a rough draft to polish.

### Phase 1 — Input Classification

- Detect input type:
  - **Project/repo (local path)** — Explore codebase, README, key features, architecture decisions
  - **Project/repo (remote URL)** — Clone or fetch README/docs via web, then explore as above
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
- Slug generation: kebab-case derived from title, max 50 characters, no stop words (e.g., "Building an AI Skills Suite" → `building-ai-skills-suite`)
- Follow Astro blog frontmatter schema (must match `src/content.config.ts`):
  ```yaml
  ---
  title: string
  description: string (150-160 chars)
  pubDate: string (format: 'Mon DD YYYY', e.g., 'Mar 21 2026')
  updatedDate: string (optional, same format)
  featured: boolean
  tags: string[]
  draft: boolean
  heroImage: image() (optional — Astro image import, use relative path e.g., './hero.png')
  canonicalURL: string URL (optional)
  ---
  ```
- Present draft inline for interactive review

### Phase 4 — Review Loop

- User provides feedback (section-level or overall)
- Agent revises and re-presents
- Repeats until user approves
- If user abandons (changes topic or says "never mind"), discard draft gracefully — no file is written

### Phase 5 — Handoff

- Follow `blog-seo-optimizer` instructions on approved draft
- After SEO approval, write final `.md` to `src/content/blog/<slug>.md`
- Follow `blog-cross-poster` instructions for distribution versions

### Code Sample Integrity

When input is a project/repo, every code block must include a comment referencing the source file and line range (e.g., `// from src/lib/auth.ts:42-58`). The SEO optimizer verifies each referenced path exists.

---

## Skill 2: `blog-seo-optimizer`

### Trigger Conditions

User asks to optimize a blog post's SEO, or orchestrator reaches the SEO phase.

### Input

A blog post — inline draft or path to `.md` file.

### Checks

1. **Title optimization** — Length 50-60 chars for SERP. Suggest alternatives with stronger keywords. Ensure compelling and specific.
2. **Description validation** — Enforce 150-160 char range. Include primary keyword. Clear value proposition, not just a summary.
3. **Keyword analysis** — Identify primary keyword from content. Check it appears in title, description, first paragraph, and at least one H2. Suggest secondary keywords.
4. **Tag suggestions** — Recommend 3-6 tags based on content, cross-referenced with existing tag taxonomy (parsed from other posts in `src/content/blog/`).
5. **Readability check** — Flag paragraphs >150 words, missing code samples in technical sections, sections without subheadings.
6. **Frontmatter validation** — All required fields present, `pubDate` set, `canonicalURL` points to `vahagn.dev`.
7. **Code source verification** — When post originated from a project/repo input, verify that file paths referenced in code block comments actually exist.

### Output

Checklist of findings and suggestions, presented interactively. User approves or adjusts each recommendation.

---

## Skill 3: `blog-cross-poster`

### Trigger Conditions

User asks to generate cross-post versions, or orchestrator reaches the distribution phase.

### Input

Path to published `.md` file or inline content.

### Platform Outputs

**Dev.to:**
- Full article with Dev.to frontmatter (`published: false`, `canonical_url: https://vahagn.dev/blog/<slug>`, `cover_image`, `tags`)
- Body preserved as-is (Dev.to supports standard Markdown)

**LinkedIn (Article format, long-form with headings/images):**
- Code fences >10 lines replaced with "See the full code in the original post" + link
- No frontmatter
- Professional tone: remove overly casual language, keep technical depth
- CTA linking to vahagn.dev

**X Thread:**
- Broken into tweet-sized chunks (<=280 chars; URLs count as 23 chars per t.co shortening)
- First tweet is the hook
- Code samples become links to original post
- Last tweet links to full post
- Numbered (1/N format)

**Reddit:**
- Self-post format targeting from curated subreddit list: r/programming, r/netsec, r/devops, r/homelab, r/networking, r/cybersecurity, r/sysadmin
- Skill suggests the most relevant 1-2 based on tags
- Conversational intro, key takeaways as bullets, link to full post
- Follows Reddit etiquette (not purely self-promotional)

### Output

All versions presented inline for review. User approves, then agent writes to `<project-root>/cross-posts/<slug>/` with files:
- `devto.md`
- `linkedin.md`
- `x-thread.md`
- `reddit.md`

The `cross-posts/` directory should be committed to git (useful for tracking distribution history).

---

## Constraints

- **Astro content schema** — All posts must validate against `src/content.config.ts`
- **Interactive workflow** — Draft is always presented for review, never written directly to content dir without approval
- **Canonical URLs** — All cross-posts point back to `https://vahagn.dev/blog/<slug>`
- **No hallucinated code** — When input is a project/repo, code samples must come from actual source code with file path references
- **Existing tag consistency** — Tags should reuse existing taxonomy before introducing new ones

## Edge Cases

- **Abandoned session** — If user stops mid-workflow, no files are written. Partial work stays in conversation only.
- **Missing content directory** — If `src/content/blog/` doesn't exist, error and inform the user rather than creating it.
- **Schema changes** — The skill always reads `src/content.config.ts` at runtime to get the current schema, not a hardcoded copy.
- **Remote repo input** — If user provides a GitHub URL instead of a local path, fetch README and key files via web before proceeding.

## Success Criteria

- A blog post can go from "write about my X project" to publish-ready `.md` + 4 cross-post versions in a single session
- Every post passes SEO checks without manual fixups
- Cross-post versions are copy-paste ready for each platform
- Skill works with all three input types (project, topic+bullets, rough draft)
- Voice adapts correctly to topic type

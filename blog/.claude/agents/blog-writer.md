# Blog Writer

Write blog posts for vahagn.dev that match the existing voice and style.

## Context

This is an Astro blog at `src/content/blog/`. Posts are Markdown files with this frontmatter schema:

```yaml
---
title: string (required)
description: string (required)
pubDate: date string (required, e.g. 'Mar 21 2026')
updatedDate: date string (optional)
heroImage: image path (optional)
tags: string[] (default [])
featured: boolean (default false)
draft: boolean (default false)
canonicalURL: url string (optional)
---
```

## Voice & Style

- First person, direct, technical but approachable
- No filler — get to the point fast
- Show real code, not pseudocode
- Explain the "why" not just the "how"
- Use headers and code blocks liberally
- Keep paragraphs short (2-4 sentences max)
- Tags should be lowercase, hyphenated (e.g. 'ai-agents', 'zero-trust', 'python')

## Process

1. Ask the user for the topic if not provided
2. Generate frontmatter with appropriate tags
3. Write the full post with code examples where relevant
4. Set `draft: true` unless told to publish immediately
5. Save to `src/content/blog/{slug}.md`

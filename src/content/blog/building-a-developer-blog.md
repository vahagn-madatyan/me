---
title: 'Building a Developer Blog with Astro'
description: 'How I built this blog from scratch using Astro, Tailwind CSS, and a content-first architecture — including dark mode, syntax highlighting, and paginated listings.'
pubDate: 'Jan 15 2026'
featured: true
tags: ['astro', 'webdev', 'tailwind']
---

Building a personal developer blog is one of the best investments you can make in your career. It forces you to articulate your thinking, creates a public record of your expertise, and gives you a platform to share what you've learned.

## Why Astro?

I chose Astro for this blog because it ships zero JavaScript by default. Blog content is static — there's no reason to hydrate a React tree just to show text and images. Astro's content collections give you type-safe frontmatter validation, and the built-in Markdown pipeline means you can focus on writing.

The project structure is clean and predictable:

```typescript
// src/content.config.ts — Schema for blog posts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blog = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});
```

Every field in the frontmatter is validated at build time. If you typo a date or forget a required field, the build fails with a clear error message pointing to the exact file and field.

## Styling with Tailwind

Tailwind CSS v4 introduced a CSS-first configuration approach. Instead of a `tailwind.config.js` file, you define your design tokens directly in CSS:

```css
/* src/styles/global.css */
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@theme {
  --color-primary-500: oklch(0.637 0.237 25.331);
  --color-secondary-900: oklch(0.21 0.006 285.885);
  --font-body: 'Inter', system-ui, sans-serif;
}
```

This keeps the configuration close to where it matters — your styles — and eliminates the JavaScript config file entirely.

## Syntax Highlighting

Code blocks need to look good in both light and dark mode. I use Shiki with dual themes configured to output CSS custom properties:

```typescript
// astro.config.mjs
export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
});
```

The `defaultColor: false` setting makes Shiki emit `--shiki-light` and `--shiki-dark` CSS variables instead of hardcoded inline colors. A few lines of CSS swap between them based on the `html.dark` class.

## Reading Time

Every blog post shows an estimated reading time. The calculation strips Markdown syntax and counts words at 200 WPM:

```jsx
<div class="flex items-center gap-1.5">
  <FormattedDate date={pubDate} />
  <span>&middot;</span>
  <span>{formatReadingTime(readingTime)}</span>
</div>
```

This small detail helps readers decide whether to commit to a post before they start scrolling.

## What's Next

The blog engine handles content, styling, and rendering. The next phase will focus on the portfolio section — showcasing projects with the same attention to detail I've put into the blog infrastructure itself.

Building tools for yourself is one of the best ways to learn. Every decision — from the color system to the content schema — teaches you something you can apply to client work.

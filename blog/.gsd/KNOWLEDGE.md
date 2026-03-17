# Knowledge Base

Recurring gotchas, non-obvious rules, and useful patterns discovered during execution.

---

## K001: Shiki `defaultColor: false` outputs CSS variables, not inline styles
- **Context:** Astro + Shiki dual-theme setup
- **Detail:** Setting `defaultColor: false` in `shikiConfig` suppresses inline `color` and `background-color` on code spans. Instead, each span gets `style="--shiki-light:#xxx;--shiki-dark:#xxx;--shiki-light-bg:#xxx;--shiki-dark-bg:#xxx"`. You must add your own CSS rules to read these variables.
- **Gotcha:** Without the CSS rules in `global.css`, code blocks appear unstyled (no colors at all).

## K002: Tailwind v4 plugin loading uses `@plugin` in CSS, not config file
- **Context:** This project has no `tailwind.config.js` — it uses Tailwind v4 CSS-first configuration.
- **Detail:** Plugins are loaded with `@plugin "@tailwindcss/typography";` in the CSS file, not via a JS config.
- **Gotcha:** The `@plugin` directive must come after `@import "tailwindcss"` and `@custom-variant` but before `@theme`.

## K003: Blog schema backward compatibility requires `.default()` or `.optional()` on all new fields
- **Context:** 5 existing blog posts have none of the extended frontmatter fields.
- **Detail:** Astro's content layer validates every post against the schema at build time. Any required field without a default causes a build error for posts missing that field.

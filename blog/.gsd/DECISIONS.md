# Decisions Register

<!-- Append-only. Never edit or remove existing rows.
     To reverse a decision, add a new row that supersedes it.
     Read this file at the start of any planning or research phase. -->

| # | When | Scope | Decision | Choice | Rationale | Revisable? |
|---|------|-------|----------|--------|-----------|------------|
| D001 | M001 | arch | CSS framework | Tailwind CSS v4 via Vite plugin | Utility-first, v4 is current, native Astro support via `@tailwindcss/vite` | No |
| D002 | M001 | convention | Dark mode strategy | Class-based with `@custom-variant dark` + localStorage | Allows toggle without FOUC, Tailwind v4 native approach | No |
| D003 | M001 | convention | Design identity | Dark-first, teal/cyan primary, slate secondary, orange accent | User preference — dark & technical feel | No |
| D004 | M001 | convention | Typography | Inter (body) + JetBrains Mono (code) | Clean readability + developer-standard code font | Yes — if font loading becomes a perf issue |
| D005 | M001 | arch | OG image generation | Satori + Sharp at build time via static endpoint | No external service dependency, Sharp already in deps | Yes — if build time becomes prohibitive |
| D006 | M001 | arch | Syntax highlighting | Shiki with dual themes (github-dark / github-light) | Built into Astro, theme-aware, no extra JS | No |
| D007 | M001 | convention | Blog post schema | Extended frontmatter: tags, featured, draft, canonicalURL added to existing schema | Supports filtering, featuring, SEO from day one | No |
| D008 | M001 | scope | Newsletter form in M001 | Visual-only, not wired to provider | Avoids provider selection blocking site build; wiring ships in M003 | Yes — if user picks provider early |
| D009 | M001 | scope | Architecture gallery | Launch blocker | Central to brand as architect — not a follow-up feature | No |
| D010 | M001 | convention | Project data source | Static TypeScript data file with GitHub URLs | Simpler than build-time API calls, no rate limit issues | Yes — if live GitHub data needed |
| D011 | project | arch | Milestone sequence | Build (M001) → Deploy (M002) → Distribute (M003) | Nothing to deploy without a site, nothing to distribute without a live URL | No |
| D012 | S01 | convention | ThemeToggle selectors | data-* attributes instead of IDs | Component renders in both desktop and mobile nav — duplicate IDs break getElementById | No |
| D013 | S01 | convention | Client JS handler binding | onclick assignment + astro:after-swap re-init | Auto-replaces on re-init, prevents handler stacking during page transitions | No |
| D014 | S01 | convention | Dark mode init placement | is:inline script in BaseLayout <head> | Must run synchronously before first paint to prevent FOUC | No |

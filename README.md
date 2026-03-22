# vahagn.dev

Personal website and blog for Vahagn Madatyan — software developer, network engineer, and security architect.

Built with [Astro](https://astro.build), styled with [Tailwind CSS](https://tailwindcss.com), deployed on [Cloudflare Pages](https://pages.cloudflare.com).

## Features

- Blog with Markdown & MDX support
- RSS feed and sitemap
- Auto-generated OG images
- Dark/light theme toggle
- SEO-optimized with canonical URLs and Open Graph data
- 100/100 Lighthouse performance

## Getting Started

```sh
npm install
npm run dev
```

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm run dev`     | Start dev server at `localhost:4321`          |
| `npm run build`   | Build production site to `./dist/`            |
| `npm run preview` | Preview build locally before deploying        |

## Project Structure

```
src/
├── components/    # Reusable Astro components
├── content/blog/  # Blog posts (Markdown/MDX)
├── data/          # Projects and architecture data
├── layouts/       # Page layouts
├── pages/         # File-based routing
├── styles/        # Global styles
└── utils/         # Helpers (OG image generation, reading time)
```

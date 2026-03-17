// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://vahagn.dev',
	integrations: [
		mdx(),
		sitemap({
			serialize(item) {
				if (item.url.includes('/blog/')) {
					item.changefreq = 'weekly';
					item.priority = 0.8;
				}
				return item;
			},
		}),
	],
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			defaultColor: false,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});

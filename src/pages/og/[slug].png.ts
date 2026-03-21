/**
 * OG Image Static Endpoint
 *
 * Generates 1200×630 PNG OG images for every non-draft blog post at build time.
 * Uses Satori to render SVG from post metadata, then Sharp to convert to PNG.
 *
 * Route: /og/[slug].png
 * Example: /og/building-a-developer-blog.png
 */

import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';
import { generateOgImage } from '../../utils/og-template';

// Resolve font paths relative to project root using import.meta.url
const projectRoot = fileURLToPath(new URL('../../../', import.meta.url));
const regularFontData = readFileSync(`${projectRoot}/public/fonts/atkinson-regular.woff`);
const boldFontData = readFileSync(`${projectRoot}/public/fonts/atkinson-bold.woff`);

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getCollection('blog');
	return posts
		.filter((post) => !post.data.draft)
		.map((post) => ({
			params: { slug: post.id },
			props: { post },
		}));
};

export const GET: APIRoute = async ({ props }) => {
	const { post } = props as { post: Awaited<ReturnType<typeof getCollection>>[number] };

	const ogImage = generateOgImage({
		title: post.data.title,
		description: post.data.description,
		tags: post.data.tags ?? [],
		pubDate: post.data.pubDate,
		site: 'vahagn.dev',
	});

	const svg = await satori(ogImage as React.ReactNode, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: 'Atkinson',
				data: regularFontData,
				weight: 400,
				style: 'normal',
			},
			{
				name: 'Atkinson',
				data: boldFontData,
				weight: 700,
				style: 'normal',
			},
		],
	});

	try {
		const png = await sharp(Buffer.from(svg)).png().toBuffer();
		return new Response(png, {
			status: 200,
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': 'public, max-age=31536000, immutable',
			},
		});
	} catch (error) {
		console.error(`[og-image] Sharp PNG conversion failed for slug="${post.id}":`, error);
		return new Response('OG image generation failed', { status: 500 });
	}
};

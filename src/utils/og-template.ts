/**
 * OG Image Template — Satori element tree builder
 *
 * Generates a Satori-compatible element tree from blog post metadata.
 * Uses the object API (no JSX) for compatibility with Astro .ts endpoints.
 *
 * Design: Dark slate background (#0f172a), teal/cyan primary accent (#0d9488),
 * white text — matching project design identity (D003).
 * Canvas: 1200×630 pixels (standard OG image dimensions per R015).
 */

export interface OgImageOptions {
	title: string;
	description: string;
	tags: string[];
	pubDate: Date;
	site: string;
}

type SatoriNode = {
	type: string;
	props: {
		style?: Record<string, unknown>;
		children?: (SatoriNode | string)[] | string;
		[key: string]: unknown;
	};
};

export function generateOgImage(options: OgImageOptions): SatoriNode {
	const { title, description, tags, pubDate, site } = options;

	const formattedDate = pubDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	// Tag pill elements
	const tagPills: SatoriNode[] = tags.slice(0, 4).map((tag) => ({
		type: 'div',
		props: {
			style: {
				display: 'flex',
				alignItems: 'center',
				backgroundColor: 'rgba(13, 148, 136, 0.2)',
				color: '#5eead4',
				fontSize: 16,
				fontWeight: 600,
				padding: '6px 14px',
				borderRadius: 9999,
				border: '1px solid rgba(13, 148, 136, 0.4)',
			},
			children: tag,
		},
	}));

	return {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				backgroundColor: '#0f172a',
				padding: '60px',
				fontFamily: 'Atkinson',
			},
			children: [
				// Top accent bar
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							width: '100%',
							height: '4px',
							background: 'linear-gradient(to right, #0d9488, #06b6d4, #0d9488)',
							borderRadius: '2px',
							position: 'absolute',
							top: '0',
							left: '0',
						},
						children: [],
					},
				},
				// Main content area
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							flex: 1,
							justifyContent: 'center',
							gap: '20px',
						},
						children: [
							// Title
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontSize: 48,
										fontWeight: 700,
										color: '#f1f5f9',
										lineHeight: 1.2,
										letterSpacing: '-0.02em',
									},
									children: title.length > 60 ? title.slice(0, 57) + '…' : title,
								},
							},
							// Description
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontSize: 24,
										color: '#94a3b8',
										lineHeight: 1.4,
									},
									children:
										description.length > 120
											? description.slice(0, 117) + '…'
											: description,
								},
							},
						],
					},
				},
				// Bottom bar: tags + date + site
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							width: '100%',
						},
						children: [
							// Tags row
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										gap: '8px',
										flexWrap: 'wrap',
									},
									children: tagPills.length > 0 ? tagPills : [],
								},
							},
							// Date + site
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'flex-end',
										gap: '4px',
									},
									children: [
										{
											type: 'div',
											props: {
												style: {
													display: 'flex',
													fontSize: 16,
													color: '#64748b',
												},
												children: formattedDate,
											},
										},
										{
											type: 'div',
											props: {
												style: {
													display: 'flex',
													fontSize: 18,
													color: '#0d9488',
													fontWeight: 700,
												},
												children: site,
											},
										},
									],
								},
							},
						],
					},
				},
			],
		},
	};
}

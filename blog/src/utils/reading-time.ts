/**
 * Reading time calculation for blog posts.
 * Strips Markdown syntax and estimates minutes based on ~200 WPM.
 */

export function getReadingTime(content: string): number {
  // Strip common Markdown/HTML syntax for a cleaner word count
  const cleaned = content
    // Remove code fences and their contents
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]*`/g, '')
    // Remove images ![alt](url)
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links but keep text [text](url) → text
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove heading markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove emphasis markers
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove blockquote markers
    .replace(/^>\s*/gm, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(/\s+/).filter((word) => word.length > 0);
  const minutes = Math.ceil(words.length / 200);

  return Math.max(1, minutes);
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

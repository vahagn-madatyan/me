/**
 * Convert an ISO date string to a human-readable relative time string.
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} Human-readable relative time (e.g. "today", "3d ago", "2w ago", "1mo ago")
 */
export function relativeTime(isoDate) {
  if (!isoDate) return "---";

  const now = new Date();
  const then = new Date(isoDate);
  const diffMs = Math.max(0, now - then);
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 14) return "1w ago";
  if (diffDays < 21) return "2w ago";
  if (diffDays < 28) return "3w ago";

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths <= 1) return "1mo ago";
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  const diffYears = Math.floor(diffMonths / 12);
  if (diffYears === 1) return "1yr ago";
  return `${diffYears}yr ago`;
}

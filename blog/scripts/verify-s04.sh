#!/usr/bin/env bash
# scripts/verify-s04.sh — S04 Blog Reading Experience verification
# Covers: tag archives, tag pill links, related posts, share buttons,
#         copy button, TOC on long posts, TOC absence on short posts,
#         and S02 regression.
set -euo pipefail

PASS=0
FAIL=0

check() {
  local name="$1"
  shift
  if "$@" > /dev/null 2>&1; then
    echo "  PASS: $name"
    PASS=$((PASS + 1))
  else
    echo "  FAIL: $name"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== S04 Verification ==="
echo ""

# Build first
echo "Building site..."
npm run build > /dev/null 2>&1
echo "Build succeeded."
echo ""

# --- Tag Archives ---
echo "[Tag Archives]"
check "Tag archive page exists for 'astro'" \
  test -f dist/blog/tag/astro/index.html

check "Tag archive contains BlogCard markup" \
  grep -q 'blog-card\|BlogCard\|rounded-xl\|blog/' dist/blog/tag/astro/index.html

# --- Tag Pill Links ---
echo ""
echo "[Tag Pill Links]"
check "Post HTML contains tag pill link to /blog/tag/astro/" \
  grep -q 'href="/blog/tag/astro/"' dist/blog/building-a-developer-blog/index.html

check "Blog listing HTML contains tag pill links" \
  grep -q 'href="/blog/tag/' dist/blog/index.html

# --- Related Posts ---
echo ""
echo "[Related Posts]"
check "building-a-developer-blog contains Related section" \
  grep -q 'Related' dist/blog/building-a-developer-blog/index.html

check "Related section links to another post" \
  grep -q 'href="/blog/' dist/blog/building-a-developer-blog/index.html

# --- Share Buttons ---
echo ""
echo "[Share Buttons]"
check "Post contains Twitter/X share URL" \
  grep -q 'twitter.com/intent/tweet' dist/blog/building-a-developer-blog/index.html

check "Post contains LinkedIn share URL" \
  grep -q 'linkedin.com/sharing' dist/blog/building-a-developer-blog/index.html

check "Post contains Dev.to share URL" \
  grep -q 'dev.to/new' dist/blog/building-a-developer-blog/index.html

# --- Copy Button ---
echo ""
echo "[Copy Button]"
check "Post with code blocks contains clipboard script" \
  grep -q 'clipboard\|navigator.clipboard' dist/blog/mastering-typescript-patterns/index.html

# --- TOC on Long Post ---
echo ""
echo "[Table of Contents]"
check "Long post contains TOC nav element" \
  grep -q '<nav' dist/blog/mastering-typescript-patterns/index.html

check "TOC contains heading anchor links" \
  grep -q 'data-heading-slug=' dist/blog/mastering-typescript-patterns/index.html

check "TOC contains IntersectionObserver scroll-spy script" \
  grep -q 'IntersectionObserver' dist/blog/mastering-typescript-patterns/index.html

check "Long post uses two-column grid layout" \
  grep -q 'lg:grid' dist/blog/mastering-typescript-patterns/index.html

# --- TOC Absent on Short Post ---
echo ""
echo "[TOC Absent on Short Post]"
check "Short post does NOT contain Table of Contents" \
  bash -c '! grep -q "Table of Contents" dist/blog/first-post/index.html'

check "Short post uses single-column layout (no lg:grid)" \
  bash -c '! grep -q "lg:grid" dist/blog/first-post/index.html'

# --- S02 Regression ---
echo ""
echo "[S02 Regression]"
if bash scripts/verify-s02.sh > /dev/null 2>&1; then
  echo "  PASS: S02 regression (verify-s02.sh passes)"
  PASS=$((PASS + 1))
else
  echo "  FAIL: S02 regression (verify-s02.sh failed)"
  FAIL=$((FAIL + 1))
fi

# --- Summary ---
TOTAL=$((PASS + FAIL))
echo ""
echo "=== Results: $PASS/$TOTAL passed ==="

if [ "$FAIL" -gt 0 ]; then
  echo "FAILED: $FAIL check(s) failed."
  exit 1
else
  echo "ALL CHECKS PASSED."
  exit 0
fi

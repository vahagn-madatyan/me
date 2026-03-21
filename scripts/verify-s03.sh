#!/usr/bin/env bash
# S03 verification script — SEO & OG Images: covers all S03 deliverables + S01/S02 regression
set -uo pipefail

BUILD_DIR="dist"
PASS=0
FAIL=0

check() {
  local desc="$1"
  local result="$2"
  if [ "$result" = "true" ]; then
    echo "  ✓ $desc"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $desc"
    FAIL=$((FAIL + 1))
  fi
}

grepcheck() {
  if grep -q "$@" 2>/dev/null; then
    echo "true"
  else
    echo "false"
  fi
}

greprcheck() {
  if grep -rq "$@" 2>/dev/null; then
    echo "true"
  else
    echo "false"
  fi
}

echo "=== S03 SEO & OG Images Verification ==="
echo ""

# Build the project
echo "Building project..."
if npm run build > /dev/null 2>&1; then
  echo "  ✓ Build succeeded"
  PASS=$((PASS + 1))
else
  echo "  ✗ Build failed"
  FAIL=$((FAIL + 1))
  echo ""
  echo "=== Results: $PASS passed, $FAIL failed ==="
  exit 1
fi

echo ""

# Ensure build dir exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "✗ Build directory '$BUILD_DIR' not found."
  exit 1
fi

# --- OG Image Checks ---
echo "[1] OG Image Generation"
OG_COUNT=$(find "$BUILD_DIR/og" -name "*.png" -type f 2>/dev/null | wc -l | tr -d ' ')
check "OG images directory exists" "$([ -d "$BUILD_DIR/og" ] && echo 'true' || echo 'false')"
check "At least 7 OG PNG files generated" "$([ "$OG_COUNT" -ge 7 ] && echo 'true' || echo 'false')"
check "OG image for building-a-developer-blog" "$([ -f "$BUILD_DIR/og/building-a-developer-blog.png" ] && echo 'true' || echo 'false')"
check "OG image for mastering-typescript-patterns" "$([ -f "$BUILD_DIR/og/mastering-typescript-patterns.png" ] && echo 'true' || echo 'false')"
check "OG image for first-post" "$([ -f "$BUILD_DIR/og/first-post.png" ] && echo 'true' || echo 'false')"
check "No OG image for draft post" "$([ ! -f "$BUILD_DIR/og/draft-upcoming-post.png" ] && echo 'true' || echo 'false')"

# Spot-check dimensions with node+sharp if available
if command -v node > /dev/null 2>&1 && [ -f "$BUILD_DIR/og/building-a-developer-blog.png" ]; then
  DIMS=$(node -e "require('sharp')('$BUILD_DIR/og/building-a-developer-blog.png').metadata().then(m => console.log(m.width + 'x' + m.height))" 2>/dev/null || echo "unknown")
  check "OG image dimensions are 1200x630" "$([ "$DIMS" = "1200x630" ] && echo 'true' || echo 'false')"
else
  check "OG image dimensions are 1200x630 (skipped — sharp or file unavailable)" "true"
fi
echo ""

# --- SEO Meta Checks ---
echo "[2] JSON-LD Structured Data"
check "JSON-LD in building-a-developer-blog" "$(grepcheck 'application/ld+json' "$BUILD_DIR/blog/building-a-developer-blog/index.html")"
check "JSON-LD contains BlogPosting type" "$(grepcheck 'BlogPosting' "$BUILD_DIR/blog/building-a-developer-blog/index.html")"
check "JSON-LD NOT in homepage" "$(! grep -q 'application/ld+json' "$BUILD_DIR/index.html" && echo 'true' || echo 'false')"
echo ""

echo "[3] OG Meta Tags"
check "og:image in blog post" "$(grepcheck 'og:image' "$BUILD_DIR/blog/building-a-developer-blog/index.html")"
check "og:image points to /og/ path" "$(grepcheck '/og/' "$BUILD_DIR/blog/building-a-developer-blog/index.html")"
check "og:type is article on blog post" "$(grepcheck 'article' "$BUILD_DIR/blog/building-a-developer-blog/index.html")"
check "og:type is website on homepage" "$(grepcheck 'website' "$BUILD_DIR/index.html")"
check "article:published_time in blog post" "$(grepcheck 'article:published_time' "$BUILD_DIR/blog/building-a-developer-blog/index.html")"
echo ""

echo "[4] Canonical URL"
check "Canonical link in blog post" "$(grepcheck 'rel="canonical"' "$BUILD_DIR/blog/building-a-developer-blog/index.html")"
echo ""

# --- RSS Checks ---
echo "[5] RSS Feed with Categories"
check "RSS feed exists" "$([ -f "$BUILD_DIR/rss.xml" ] && echo 'true' || echo 'false')"
check "RSS contains <category> elements" "$(grepcheck '<category>' "$BUILD_DIR/rss.xml")"
CATEGORY_COUNT=$(grep -o '<category>' "$BUILD_DIR/rss.xml" 2>/dev/null | wc -l | tr -d ' ')
check "At least 3 category elements in RSS" "$([ "$CATEGORY_COUNT" -ge 3 ] && echo 'true' || echo 'false')"
echo ""

# --- Robots.txt Checks ---
echo "[6] Robots.txt"
check "robots.txt exists in build output" "$([ -f "$BUILD_DIR/robots.txt" ] && echo 'true' || echo 'false')"
check "robots.txt contains User-agent" "$(grepcheck 'User-agent' "$BUILD_DIR/robots.txt")"
check "robots.txt contains Allow" "$(grepcheck 'Allow' "$BUILD_DIR/robots.txt")"
check "robots.txt contains Sitemap reference" "$(grepcheck 'Sitemap:' "$BUILD_DIR/robots.txt")"
echo ""

# --- Sitemap Checks ---
echo "[7] Sitemap"
SITEMAP_EXISTS=$(find "$BUILD_DIR" -name "sitemap*.xml" -type f 2>/dev/null | wc -l | tr -d ' ')
check "At least one sitemap XML file exists" "$([ "$SITEMAP_EXISTS" -ge 1 ] && echo 'true' || echo 'false')"
# Check blog-specific changefreq from serialize config
if [ -f "$BUILD_DIR/sitemap-0.xml" ]; then
  check "Sitemap contains weekly changefreq for blog" "$(grepcheck 'weekly' "$BUILD_DIR/sitemap-0.xml")"
  check "Sitemap contains priority for blog" "$(grepcheck '0.8' "$BUILD_DIR/sitemap-0.xml")"
else
  check "Sitemap contains weekly changefreq for blog (sitemap-0.xml not found)" "false"
  check "Sitemap contains priority for blog (sitemap-0.xml not found)" "false"
fi
echo ""

# --- S02 Regression ---
echo "[8] S02 Regression Check"
if bash scripts/verify-s02.sh > /dev/null 2>&1; then
  echo "  ✓ S02 verification still passes"
  PASS=$((PASS + 1))
else
  echo "  ✗ S02 verification has regressions"
  FAIL=$((FAIL + 1))
fi
echo ""

# --- S01 Regression ---
echo "[9] S01 Regression Check"
if bash scripts/verify-s01.sh > /dev/null 2>&1; then
  echo "  ✓ S01 verification still passes"
  PASS=$((PASS + 1))
else
  echo "  ✗ S01 verification has regressions"
  FAIL=$((FAIL + 1))
fi
echo ""

echo "=== Results: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
echo "All checks passed!"

#!/usr/bin/env bash
# S02 verification script — checks blog engine build output end-to-end
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

echo "=== S02 Blog Engine Verification ==="
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

# 1. Shiki dual-theme CSS variables
echo "[1] Shiki dual-theme syntax highlighting"
check "shiki-dark CSS variable in post HTML" "$(greprcheck 'shiki-dark' "$BUILD_DIR/blog/" --include="*.html")"
check "shiki-light CSS variable in post HTML" "$(greprcheck 'shiki-light' "$BUILD_DIR/blog/" --include="*.html")"
echo ""

# 2. Typography prose class
echo "[2] Typography plugin"
check "prose class in post HTML" "$(greprcheck 'prose' "$BUILD_DIR/blog/" --include="*.html")"
echo ""

# 3. Paginated listing
echo "[3] Paginated listing"
check "Blog listing page exists at dist/blog/index.html" "$([ -f "$BUILD_DIR/blog/index.html" ] && echo 'true' || echo 'false')"
check "Reading time on listing page" "$(grepcheck 'min read' "$BUILD_DIR/blog/index.html")"
echo ""

# 4. Individual post pages
echo "[4] Individual post pages"
POST_DIRS=$(find "$BUILD_DIR/blog" -mindepth 1 -maxdepth 1 -type d | grep -v '^$' | wc -l | tr -d ' ')
check "At least 3 post directories exist" "$([ "$POST_DIRS" -ge 3 ] && echo 'true' || echo 'false')"
check "building-a-developer-blog page exists" "$([ -f "$BUILD_DIR/blog/building-a-developer-blog/index.html" ] && echo 'true' || echo 'false')"
check "mastering-typescript-patterns page exists" "$([ -f "$BUILD_DIR/blog/mastering-typescript-patterns/index.html" ] && echo 'true' || echo 'false')"
echo ""

# 5. Reading time on individual posts
echo "[5] Reading time on posts"
check "Reading time on building-a-developer-blog" "$(grepcheck 'min read' "$BUILD_DIR/blog/building-a-developer-blog/index.html")"
check "Reading time on mastering-typescript-patterns" "$(grepcheck 'min read' "$BUILD_DIR/blog/mastering-typescript-patterns/index.html")"
echo ""

# 6. Tags rendered
echo "[6] Tags rendered"
check "Tag 'astro' on building-a-developer-blog" "$(grepcheck 'astro' "$BUILD_DIR/blog/building-a-developer-blog/index.html")"
check "Tag 'typescript' on mastering-typescript-patterns" "$(grepcheck 'typescript' "$BUILD_DIR/blog/mastering-typescript-patterns/index.html")"
check "Tag pill classes in post HTML" "$(greprcheck 'bg-primary-100' "$BUILD_DIR/blog/" --include="*.html")"
echo ""

# 7. Draft filtering
echo "[7] Draft filtering"
check "Draft post NOT in production output" "$([ ! -d "$BUILD_DIR/blog/draft-upcoming-post" ] && echo 'true' || echo 'false')"
if [ -f "$BUILD_DIR/rss.xml" ]; then
  check "Draft post NOT in RSS feed" "$(! grep -q 'draft-upcoming-post' "$BUILD_DIR/rss.xml" && echo 'true' || echo 'false')"
  check "Draft title NOT in RSS feed" "$(! grep -q 'Upcoming: State Management' "$BUILD_DIR/rss.xml" && echo 'true' || echo 'false')"
else
  check "RSS feed exists" "false"
fi
echo ""

# 8. Route structure (no rest-param conflicts)
echo "[8] Route structure"
check "[slug].astro exists (non-rest param)" "$([ -f 'src/pages/blog/[slug].astro' ] && echo 'true' || echo 'false')"
check "[...slug].astro removed" "$([ ! -f 'src/pages/blog/[...slug].astro' ] && echo 'true' || echo 'false')"
check "Old index.astro removed" "$([ ! -f 'src/pages/blog/index.astro' ] && echo 'true' || echo 'false')"
check "[...page].astro exists" "$([ -f 'src/pages/blog/[...page].astro' ] && echo 'true' || echo 'false')"
echo ""

# 9. S01 regression check
echo "[9] S01 regression check"
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

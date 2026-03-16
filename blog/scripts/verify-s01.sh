#!/usr/bin/env bash
# S01 verification script — checks build output for required elements
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

# Helper: returns "true" if grep finds a match, "false" otherwise
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

echo "=== S01 Build Verification ==="
echo ""

# Ensure build dir exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "✗ Build directory '$BUILD_DIR' not found. Run 'npm run build' first."
  exit 1
fi

echo "Checking HTML files in $BUILD_DIR..."
echo ""

# 1. Tailwind classes present in output
echo "[1] Tailwind classes present"
check "Tailwind utility classes found in HTML" "$(greprcheck 'class="[^"]*flex[^"]*"' "$BUILD_DIR" --include="*.html")"

CSS_FILE=$(find "$BUILD_DIR" -name "*.css" -type f | head -1)
if [ -n "$CSS_FILE" ]; then
  check "CSS file with design tokens found" "$(grepcheck 'primary' "$CSS_FILE")"
else
  check "CSS file with design tokens found" "false"
fi

echo ""

# 2. Dark mode init script in <head>
echo "[2] Dark mode init script"
check "Dark mode init script found in HTML" "$(greprcheck 'localStorage.getItem' "$BUILD_DIR" --include="*.html")"
check "Init script checks prefers-color-scheme" "$(grepcheck 'prefers-color-scheme' "$BUILD_DIR/index.html")"

echo ""

# 3. Nav links present
echo "[3] Navigation links"
check "Blog link present" "$(grepcheck 'href="/blog"' "$BUILD_DIR/index.html")"
check "Work link present" "$(grepcheck 'href="/work"' "$BUILD_DIR/index.html")"
check "About link present" "$(grepcheck 'href="/about"' "$BUILD_DIR/index.html")"
check "Architecture link present" "$(grepcheck 'href="/architecture"' "$BUILD_DIR/index.html")"

echo ""

# 4. Social links present
echo "[4] Social links"
check "GitHub link present" "$(greprcheck 'github.com/vahagn-grigoryan' "$BUILD_DIR" --include="*.html")"
check "LinkedIn link present" "$(greprcheck 'linkedin.com' "$BUILD_DIR" --include="*.html")"
check "X/Twitter link present" "$(greprcheck 'x.com' "$BUILD_DIR" --include="*.html")"
check "RSS link present" "$(greprcheck 'href="/rss.xml"' "$BUILD_DIR" --include="*.html")"

echo ""

# 5. Viewport meta tag
echo "[5] Viewport meta tag"
check "Viewport meta in index" "$(grepcheck 'name="viewport"' "$BUILD_DIR/index.html")"
check "Viewport meta in blog index" "$(grepcheck 'name="viewport"' "$BUILD_DIR/blog/index.html")"

echo ""

# 6. No nested/duplicate <html> elements
echo "[6] No duplicate <html> tags"
ALL_PASS_HTML=true
for file in $(find "$BUILD_DIR" -name "*.html" -type f); do
  COUNT=$(grep -c '<html' "$file" || true)
  if [ "$COUNT" -gt 1 ]; then
    REL_PATH="${file#$BUILD_DIR/}"
    check "No duplicate <html> in $REL_PATH" "false"
    ALL_PASS_HTML=false
  fi
done
if [ "$ALL_PASS_HTML" = "true" ]; then
  check "No HTML files have duplicate <html> tags" "true"
fi

echo ""

# 7. Semantic landmarks
echo "[7] Semantic HTML landmarks"
check "<nav> element present" "$(grepcheck '<nav' "$BUILD_DIR/index.html")"
check "<main> element present" "$(grepcheck '<main' "$BUILD_DIR/index.html")"
check "<footer> element present" "$(grepcheck '<footer' "$BUILD_DIR/index.html")"
check "<header> element present" "$(grepcheck '<header' "$BUILD_DIR/index.html")"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
echo "All checks passed!"

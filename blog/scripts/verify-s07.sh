#!/usr/bin/env bash
# S07 verification script — validates homepage, 404, newsletter, and upstream regressions
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

echo "=== S07 Build Verification ==="
echo ""

# Build the project
echo "Running build..."
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

HOME_HTML="$BUILD_DIR/index.html"
FOUR04_HTML="$BUILD_DIR/404.html"

# --- Homepage checks ---

echo "[1] Homepage exists"
check "dist/index.html exists" "$([ -f "$HOME_HTML" ] && echo true || echo false)"
echo ""

if [ ! -f "$HOME_HTML" ]; then
  echo "=== Results: $PASS passed, $FAIL failed ==="
  exit 1
fi

echo "[2] Hero section"
check "Hero name 'Vahagn Grigoryan' present" "$(grepcheck 'Vahagn Grigoryan' "$HOME_HTML")"
check "Hero CTA links to /blog" "$(grepcheck 'href="/blog"' "$HOME_HTML")"
echo ""

echo "[3] Featured blog posts"
check "Blog post slug present (building-a-developer-blog)" "$(grepcheck 'building-a-developer-blog' "$HOME_HTML")"
check "Reading time ('min read') present" "$(grepcheck 'min read' "$HOME_HTML")"
echo ""

echo "[4] Project highlights"
check "Project title 'VaultBreaker' present" "$(grepcheck 'VaultBreaker' "$HOME_HTML")"
check "Project title 'CortexML' present" "$(grepcheck 'CortexML' "$HOME_HTML")"
check "Tech stack badge 'Python' present" "$(grepcheck 'Python' "$HOME_HTML")"
check "Tech stack badge 'Rust' present" "$(grepcheck 'Rust' "$HOME_HTML")"
check "GitHub link (github.com/username)" "$(grepcheck 'github.com/username' "$HOME_HTML")"
echo ""

echo "[5] Navigation links"
check "Link to /blog present" "$(grepcheck 'href="/blog"' "$HOME_HTML")"
check "Link to /work present" "$(grepcheck 'href="/work"' "$HOME_HTML")"
echo ""

echo "[6] Newsletter form"
check "Email input present" "$(grepcheck 'type="email"' "$HOME_HTML")"
check "Subscribe button present" "$(grepcheck 'Subscribe' "$HOME_HTML")"
echo ""

# --- 404 page checks ---

echo "[7] 404 page"
check "dist/404.html exists" "$([ -f "$FOUR04_HTML" ] && echo true || echo false)"

if [ -f "$FOUR04_HTML" ]; then
  check "'404' text present" "$(grepcheck '404' "$FOUR04_HTML")"
  check "'Page not found' heading present" "$(grepcheck 'Page not found' "$FOUR04_HTML")"
  check "Home link (href=\"/\") present" "$(grepcheck 'href="/"' "$FOUR04_HTML")"
  check "'Back to Home' CTA present" "$(grepcheck 'Back to Home' "$FOUR04_HTML")"
fi
echo ""

# --- Upstream regression checks ---

echo "[8] Upstream regression: S01"
if bash scripts/verify-s01.sh > /dev/null 2>&1; then
  echo "  ✓ S01 verification passes"
  PASS=$((PASS + 1))
else
  echo "  ✗ S01 verification has regressions"
  FAIL=$((FAIL + 1))
fi
echo ""

echo "[9] Upstream regression: S02"
if bash scripts/verify-s02.sh > /dev/null 2>&1; then
  echo "  ✓ S02 verification passes"
  PASS=$((PASS + 1))
else
  echo "  ✗ S02 verification has regressions"
  FAIL=$((FAIL + 1))
fi
echo ""

echo "[10] Upstream regression: S05"
if bash scripts/verify-s05.sh > /dev/null 2>&1; then
  echo "  ✓ S05 verification passes"
  PASS=$((PASS + 1))
else
  echo "  ✗ S05 verification has regressions"
  FAIL=$((FAIL + 1))
fi
echo ""

echo "=== Results: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
echo "All checks passed!"

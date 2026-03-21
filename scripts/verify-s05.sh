#!/usr/bin/env bash
# S05 verification script — checks build output for /work page elements
set -uo pipefail

BUILD_DIR="dist"
WORK_HTML="$BUILD_DIR/work/index.html"
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

echo "=== S05 Build Verification ==="
echo ""

# Build first
echo "Running build..."
if ! npm run build > /dev/null 2>&1; then
  echo "✗ npm run build failed"
  exit 1
fi
echo "  ✓ npm run build succeeded"
PASS=$((PASS + 1))
echo ""

# 1. Work page exists
echo "[1] /work page exists"
check "/work/index.html exists" "$([ -f "$WORK_HTML" ] && echo true || echo false)"
echo ""

if [ ! -f "$WORK_HTML" ]; then
  echo "=== Results: $PASS passed, $FAIL failed ==="
  exit 1
fi

# 2. Project content present
echo "[2] Project card content"
check "Project title 'VaultBreaker' present" "$(grepcheck 'VaultBreaker' "$WORK_HTML")"
check "Project title 'CortexML' present" "$(grepcheck 'CortexML' "$WORK_HTML")"
echo ""

# 3. Tech stack badges
echo "[3] Tech stack badges"
check "Tech stack badge markup present (rounded-full pill classes)" "$(grepcheck 'rounded-full' "$WORK_HTML")"
echo ""

# 4. GitHub links
echo "[4] GitHub links"
check "GitHub link present (github.com)" "$(grepcheck 'github.com' "$WORK_HTML")"
echo ""

# 5. Category filter buttons
echo "[5] Category filter buttons"
check "data-filter=\"all\" present" "$(grepcheck 'data-filter="all"' "$WORK_HTML")"
check "data-filter=\"security\" present" "$(grepcheck 'data-filter="security"' "$WORK_HTML")"
check "data-filter=\"ai\" present" "$(grepcheck 'data-filter="ai"' "$WORK_HTML")"
check "data-filter=\"networking\" present" "$(grepcheck 'data-filter="networking"' "$WORK_HTML")"
check "data-filter=\"trading\" present" "$(grepcheck 'data-filter="trading"' "$WORK_HTML")"
echo ""

# 6. Card data-category attributes
echo "[6] Card data-category wrappers"
check "data-category=\"security\" present" "$(grepcheck 'data-category="security"' "$WORK_HTML")"
check "data-category=\"ai\" present" "$(grepcheck 'data-category="ai"' "$WORK_HTML")"
check "data-category=\"networking\" present" "$(grepcheck 'data-category="networking"' "$WORK_HTML")"
check "data-category=\"trading\" present" "$(grepcheck 'data-category="trading"' "$WORK_HTML")"
echo ""

# 7. Dark mode classes
echo "[7] Dark mode classes"
check "dark: classes present on page" "$(grepcheck 'dark:' "$WORK_HTML")"
echo ""

# 8. Responsive grid classes
echo "[8] Responsive grid"
check "grid-cols-1 present" "$(grepcheck 'grid-cols-1' "$WORK_HTML")"
check "sm:grid-cols-2 present" "$(grepcheck 'sm:grid-cols-2' "$WORK_HTML")"
echo ""

# 9. Filter script with view transition support
echo "[9] Filter script"
check "astro:after-swap listener present" "$(grepcheck 'astro:after-swap' "$WORK_HTML")"
echo ""

echo "=== Results: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
echo "All checks passed!"

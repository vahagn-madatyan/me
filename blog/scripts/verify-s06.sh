#!/usr/bin/env bash
# verify-s06.sh — Structural checks for S06: About & Architecture
set -euo pipefail

PASS=0
FAIL=0
CHECKS=()

check() {
  local label="$1"
  local result="$2"
  if [ "$result" = "true" ]; then
    CHECKS+=("✅ $label")
    PASS=$((PASS + 1))
  else
    CHECKS+=("❌ $label")
    FAIL=$((FAIL + 1))
  fi
}

DIST="dist"

# ── Build check ──
if [ ! -d "$DIST" ]; then
  echo "❌ dist/ directory not found — run 'npm run build' first"
  exit 1
fi

# ── About page checks ──
ABOUT="$DIST/about/index.html"

check "about/index.html exists" \
  "$([ -f "$ABOUT" ] && echo true || echo false)"

if [ -f "$ABOUT" ]; then
  check "About: contains bio text" \
    "$(grep -q 'Software Architect' "$ABOUT" && echo true || echo false)"

  check "About: contains skills section" \
    "$(grep -q 'Skills' "$ABOUT" && echo true || echo false)"

  check "About: GitHub link" \
    "$(grep -q 'github.com/vahagn-grigoryan' "$ABOUT" && echo true || echo false)"

  check "About: LinkedIn link" \
    "$(grep -q 'linkedin.com/in/vahagn-grigoryan' "$ABOUT" && echo true || echo false)"

  check "About: X link" \
    "$(grep -q 'x.com/vahagn_dev' "$ABOUT" && echo true || echo false)"

  check "About: has nav" \
    "$(grep -q '<nav' "$ABOUT" && echo true || echo false)"

  check "About: has footer" \
    "$(grep -q '<footer' "$ABOUT" && echo true || echo false)"

  check "About: has dark mode init" \
    "$(grep -q 'prefers-color-scheme' "$ABOUT" && echo true || echo false)"

  DARK_COUNT=$(grep -o 'dark:' "$ABOUT" | wc -l | tr -d ' ')
  check "About: dark mode classes (≥20, found $DARK_COUNT)" \
    "$([ "$DARK_COUNT" -ge 20 ] && echo true || echo false)"
fi

# ── Architecture page checks ──
ARCH="$DIST/architecture/index.html"

check "architecture/index.html exists" \
  "$([ -f "$ARCH" ] && echo true || echo false)"

if [ -f "$ARCH" ]; then
  check "Architecture: data-filter attributes" \
    "$(grep -q 'data-filter' "$ARCH" && echo true || echo false)"

  check "Architecture: data-category attributes" \
    "$(grep -q 'data-category' "$ARCH" && echo true || echo false)"

  check "Architecture: dialog element" \
    "$(grep -q '<dialog' "$ARCH" && echo true || echo false)"

  check "Architecture: data-lightbox-src attributes" \
    "$(grep -q 'data-lightbox-src' "$ARCH" && echo true || echo false)"

  check "Architecture: has nav" \
    "$(grep -q '<nav' "$ARCH" && echo true || echo false)"

  check "Architecture: has footer" \
    "$(grep -q '<footer' "$ARCH" && echo true || echo false)"

  check "Architecture: has dark mode init" \
    "$(grep -q 'prefers-color-scheme' "$ARCH" && echo true || echo false)"

  ARCH_DARK_COUNT=$(grep -o 'dark:' "$ARCH" | wc -l | tr -d ' ')
  check "Architecture: dark mode classes (≥10, found $ARCH_DARK_COUNT)" \
    "$([ "$ARCH_DARK_COUNT" -ge 10 ] && echo true || echo false)"
fi

# ── Summary ──
echo ""
echo "═══════════════════════════════════════"
echo " S06 Verification Results"
echo "═══════════════════════════════════════"
for c in "${CHECKS[@]}"; do
  echo "  $c"
done
echo "───────────────────────────────────────"
echo "  Total: $((PASS + FAIL)) | ✅ $PASS | ❌ $FAIL"
echo "═══════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi

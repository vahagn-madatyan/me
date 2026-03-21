#!/usr/bin/env bash
# M02 deployment verification — checks live site health at https://vahagn.dev
# Validates: HTTP status, CDN serving, compression, key pages, OG images, analytics beacon
set -uo pipefail

SITE="https://vahagn.dev"
PASS=0
FAIL=0
WARN=0

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

warn() {
  local desc="$1"
  echo "  ⚠ $desc"
  WARN=$((WARN + 1))
}

# Helper: check HTTP status code for a URL
http_status() {
  curl -sI -o /dev/null -w '%{http_code}' "$1" 2>/dev/null
}

# Helper: get response headers (lowercase for portable grep)
http_headers() {
  curl -sI "$@" 2>/dev/null | tr '[:upper:]' '[:lower:]'
}

echo "=== M02 Deployment Verification ==="
echo "Target: $SITE"
echo "Time:   $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

# ─── 1. Site is live ───────────────────────────────────────────────
echo "[1] Site availability"
STATUS=$(http_status "$SITE")
check "Home page returns 200 (got: $STATUS)" "$([ "$STATUS" = "200" ] && echo true || echo false)"

# Verify it's actually our Astro site, not a parking page
BODY=$(curl -s "$SITE" 2>/dev/null | head -100)
IS_ASTRO=$(echo "$BODY" | grep -q 'Vahagn' && echo true || echo false)
check "Site content is our Astro blog (not a parking page)" "$IS_ASTRO"

echo ""

# ─── 2. CDN / hosting headers ─────────────────────────────────────
echo "[2] CDN and hosting"
HEADERS=$(http_headers "$SITE")

# Check for Cloudflare (cf-ray) or Vercel (x-vercel-id) — either is valid
HAS_CF=$(echo "$HEADERS" | grep -q 'cf-ray' && echo true || echo false)
HAS_VERCEL=$(echo "$HEADERS" | grep -q 'x-vercel-id' && echo true || echo false)

if [ "$HAS_CF" = "true" ]; then
  check "Served by CDN (Cloudflare detected via cf-ray header)" "true"
elif [ "$HAS_VERCEL" = "true" ]; then
  check "Served by CDN (Vercel detected via x-vercel-id header)" "true"
else
  check "Served by CDN (no cf-ray or x-vercel-id header found)" "false"
fi

# Content-type check
check "Content-Type is text/html" "$(echo "$HEADERS" | grep -q 'content-type:.*text/html' && echo true || echo false)"

echo ""

# ─── 3. Compression ───────────────────────────────────────────────
echo "[3] Compression"
COMP_HEADERS=$(http_headers "$SITE" -H "Accept-Encoding: br, gzip, deflate")

HAS_BROTLI=$(echo "$COMP_HEADERS" | grep -q 'content-encoding:.*br' && echo true || echo false)
HAS_GZIP=$(echo "$COMP_HEADERS" | grep -q 'content-encoding:.*gzip' && echo true || echo false)

if [ "$HAS_BROTLI" = "true" ]; then
  check "Brotli compression active (content-encoding: br)" "true"
elif [ "$HAS_GZIP" = "true" ]; then
  warn "Gzip compression active but Brotli preferred (content-encoding: gzip)"
  check "Compression active (gzip — Brotli preferred)" "true"
else
  check "Compression active (no content-encoding header found)" "false"
fi

echo ""

# ─── 4. WWW redirect ──────────────────────────────────────────────
echo "[4] WWW redirect"
WWW_STATUS=$(curl -sI -o /dev/null -w '%{http_code}' "https://www.vahagn.dev" 2>/dev/null)
WWW_LOCATION=$(curl -sI "https://www.vahagn.dev" 2>/dev/null | tr '[:upper:]' '[:lower:]' | grep '^location:' | tr -d '\r' | sed 's/location: *//')

if [ "$WWW_STATUS" = "301" ] || [ "$WWW_STATUS" = "308" ]; then
  check "www.vahagn.dev redirects (HTTP $WWW_STATUS)" "true"
  if echo "$WWW_LOCATION" | grep -q 'vahagn.dev'; then
    check "Redirect target is vahagn.dev (got: $WWW_LOCATION)" "true"
  else
    check "Redirect target is vahagn.dev (got: $WWW_LOCATION)" "false"
  fi
elif [ "$WWW_STATUS" = "200" ]; then
  warn "www.vahagn.dev returns 200 instead of redirecting — configure www→apex redirect"
else
  warn "www.vahagn.dev returned HTTP $WWW_STATUS — may not be configured yet"
fi

echo ""

# ─── 5. Key pages ─────────────────────────────────────────────────
echo "[5] Key pages"
PAGES=(
  "/blog/"
  "/work/"
  "/about/"
  "/architecture/"
  "/rss.xml"
  "/sitemap-index.xml"
)

for page in "${PAGES[@]}"; do
  STATUS=$(http_status "${SITE}${page}")
  check "${page} returns 200 (got: $STATUS)" "$([ "$STATUS" = "200" ] && echo true || echo false)"
done

echo ""

# ─── 6. Blog posts (spot check) ───────────────────────────────────
echo "[6] Blog post spot check"
STATUS=$(http_status "${SITE}/blog/mastering-typescript-patterns/")
check "/blog/mastering-typescript-patterns/ returns 200 (got: $STATUS)" "$([ "$STATUS" = "200" ] && echo true || echo false)"

echo ""

# ─── 7. OG images ─────────────────────────────────────────────────
echo "[7] OG images"
OG_STATUS=$(http_status "${SITE}/og/mastering-typescript-patterns.png")
check "OG image returns 200 (got: $OG_STATUS)" "$([ "$OG_STATUS" = "200" ] && echo true || echo false)"

OG_HEADERS=$(http_headers "${SITE}/og/mastering-typescript-patterns.png")
check "OG image has image/png content-type" "$(echo "$OG_HEADERS" | grep -q 'content-type:.*image/png' && echo true || echo false)"

echo ""

# ─── 8. Web Analytics beacon ──────────────────────────────────────
echo "[8] Web Analytics beacon"
FULL_BODY=$(curl -s "$SITE" 2>/dev/null)
HAS_BEACON=$(echo "$FULL_BODY" | grep -q 'static.cloudflareinsights.com' && echo true || echo false)

if [ "$HAS_BEACON" = "true" ]; then
  check "Cloudflare Web Analytics beacon present in HTML" "true"
else
  # Check for other analytics (Vercel Analytics, etc.)
  HAS_VERCEL_ANALYTICS=$(echo "$FULL_BODY" | grep -q 'vitals.vercel-insights.com\|va.vercel-scripts.com\|vercel/analytics' && echo true || echo false)
  if [ "$HAS_VERCEL_ANALYTICS" = "true" ]; then
    warn "Cloudflare Web Analytics beacon not found — Vercel Analytics detected instead"
  else
    warn "No analytics beacon detected — enable Cloudflare Web Analytics or Vercel Analytics"
  fi
fi

echo ""

# ─── 9. Cache headers on static assets ────────────────────────────
echo "[9] Cache headers"
# Find a hashed asset URL from the page source
ASSET_PATH=$(echo "$FULL_BODY" | grep -oE '/_astro/[a-zA-Z0-9._-]+\.(css|js)' | head -1)
if [ -n "$ASSET_PATH" ]; then
  ASSET_HEADERS=$(http_headers "${SITE}${ASSET_PATH}")
  HAS_IMMUTABLE=$(echo "$ASSET_HEADERS" | grep -q 'cache-control:.*immutable' && echo true || echo false)
  check "Hashed asset (${ASSET_PATH}) has immutable cache-control" "$HAS_IMMUTABLE"
else
  warn "Could not find a hashed /_astro/ asset to check cache headers"
fi

# HTML page should NOT have immutable cache
HTML_CACHE=$(echo "$HEADERS" | grep 'cache-control:' | head -1)
if [ -n "$HTML_CACHE" ]; then
  HAS_REVALIDATE=$(echo "$HTML_CACHE" | grep -q 'must-revalidate' && echo true || echo false)
  check "HTML pages use must-revalidate (not immutable)" "$HAS_REVALIDATE"
else
  warn "No cache-control header on HTML page — platform may handle this differently"
fi

echo ""

# ─── Summary ──────────────────────────────────────────────────────
echo "=== Results: $PASS passed, $FAIL failed, $WARN warnings ==="
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "Some checks failed. Review output above."
  exit 1
fi

if [ "$WARN" -gt 0 ]; then
  echo "All required checks passed with $WARN warning(s)."
  exit 0
fi

echo "All checks passed!"
exit 0

# Security Review

Perform a comprehensive security audit of this Astro blog and its dependencies.

## Audit Scope

### 1. Dependency Vulnerabilities
- Run `npm audit` and analyze results
- Check for known CVEs in direct and transitive dependencies
- Review `package.json` for outdated or unmaintained packages

### 2. Client-Side Security
- Check for XSS vectors in components (especially user-facing inputs like newsletter form)
- Verify `rel="noopener noreferrer"` on external links
- Check CSP headers and meta tags in `BaseHead.astro`
- Audit inline scripts for injection risks
- Verify form actions point to expected endpoints

### 3. Build & Deploy Security
- Check for secrets or credentials in source code
- Verify `.gitignore` covers sensitive files (.env, credentials, etc.)
- Check for exposed source maps in production build
- Review `astro.config.mjs` for security-relevant settings

### 4. Content Security
- Verify Markdown/MDX rendering doesn't allow raw HTML injection
- Check image handling for path traversal
- Review RSS feed for content injection

### 5. Infrastructure
- Check HTTPS enforcement
- Review CORS and cache headers
- Verify no sensitive data in public/ directory

## Output Format

Produce a report with:
- **CRITICAL**: Must fix immediately
- **HIGH**: Fix before next deploy
- **MEDIUM**: Fix when convenient
- **LOW**: Nice to have
- **INFO**: Observations, no action needed

For each finding, include: description, affected file(s), and recommended fix.

# M003: Distribution & Growth — Context

**Gathered:** 2026-03-15
**Status:** Waiting for M002

## Project Description

Build the audience growth layer on top of the live vahagn.dev site — newsletter integration, cross-posting workflow to social platforms, and content distribution automation.

## Why This Milestone

The site exists (M001) and is live (M002). Now it needs to reach people. M003 turns vahagn.dev from a static site into a content distribution hub that builds an owned audience and amplifies reach across platforms.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Collect newsletter subscribers via the site's signup form (Buttondown or Beehiiv)
- Publish a blog post and have a workflow for cross-posting to X, LinkedIn, Medium, and Dev.to with canonical URLs
- See subscriber count and engagement metrics

### Entry point / environment

- Entry point: https://vahagn.dev (newsletter form), CLI/scripts (cross-posting)
- Environment: production site + local tooling
- Live dependencies involved: Newsletter provider API, X API, LinkedIn API, Medium API, Dev.to API

## Completion Class

- Contract complete means: newsletter form collects emails, cross-posting workflow documented and tested
- Integration complete means: form → provider → subscriber list works end-to-end; cross-posting produces real posts on platforms
- Operational complete means: workflow is repeatable for each new blog post

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- Submit email on vahagn.dev newsletter form → email appears in provider subscriber list
- Publish a blog post → cross-post to at least one platform with canonical URL pointing to vahagn.dev

## Risks and Unknowns

- Newsletter provider selection (Buttondown vs Beehiiv) — API differences, pricing, features
- Platform API access — X/LinkedIn/Medium/Dev.to may have varying API restrictions
- Cross-posting automation scope — full automation vs assisted workflow vs documentation-only
- Content format differences per platform — Markdown doesn't translate 1:1 everywhere

## Existing Codebase / Prior Art

- `src/components/NewsletterForm.astro` — visual-only form from M001/S07, needs API wiring
- Blog content collection — source content for cross-posting
- RSS feed — potential distribution mechanism

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions.

## Relevant Requirements

- R025 — Newsletter signup integration
- R026 — Cross-posting workflow

## Scope

### In Scope

- Newsletter provider selection and integration
- Newsletter signup form wiring (connect M001's visual form to provider API)
- Cross-posting workflow/tooling for X, LinkedIn, Medium, Dev.to
- Canonical URL strategy for cross-posts

### Out of Scope / Non-Goals

- Automated scheduling/queue system
- Paid newsletter tiers
- Community features (forums, Discord)
- Detailed analytics beyond provider dashboards

## Technical Constraints

- Newsletter form must work without client-side JS (progressive enhancement preferred)
- Cross-posting must preserve canonical URLs to vahagn.dev
- No algorithm dependency — owned audience is the goal

## Open Questions

- Buttondown vs Beehiiv — will evaluate during M003 planning based on API quality, pricing, Markdown support
- Cross-posting automation level — scripts vs manual workflow with templates vs full automation
- Whether to use RSS-to-social bridges (e.g., IFTTT, Zapier) or custom scripts

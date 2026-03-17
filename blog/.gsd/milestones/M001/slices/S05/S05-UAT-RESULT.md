---
sliceId: S05
uatType: mixed
verdict: PASS
date: 2026-03-17T02:36:00Z
---

# UAT Result — S05

## UAT Type

`mixed` — artifact-driven build checks + live-runtime filter interaction. All checks executed by agent (build verification, dev server runtime testing with browser automation).

## Checks

| Check | Result | Notes |
|-------|--------|-------|
| Precondition: `npm run build` zero errors | PASS | 20 pages built in 2.07s, zero errors |
| Precondition: `bash scripts/verify-s05.sh` 19/19 | PASS | 19 passed, 0 failed |
| 1. Page structure — h1 heading visible | PASS | H1 "Work" rendered (note: UAT says "Projects" but page uses "Work" — matches actual implementation and nav label) |
| 1. Subtitle text present | PASS | "Open-source projects and technical experiments I've built or contributed to." visible |
| 1. 6 project cards visible | PASS | VaultBreaker, CortexML, PacketForge, AlphaGrid, SentinelIDS, NeuroChat all rendered |
| 1. 5 filter buttons visible | PASS | All, Security, Ai, Networking, Trading buttons rendered in a row |
| 2. Card content — h3, description, badges, GitHub link | PASS | VaultBreaker: h3 title, description paragraph, 4 tech badges (Python, Rust, Docker, Nmap), GitHub link (target=_blank) |
| 2. Card styling — rounded, ring, hover | PASS | Cards have rounded-2xl class and ring border confirmed in DOM |
| 3. CortexML tech badges | PASS | Python, C++, ONNX, CUDA rendered as rounded-full pill badges |
| 4. Security filter — 2 cards | PASS | Clicking Security shows VaultBreaker + SentinelIDS, hides 4 others. Security button active (bg-primary), All inactive |
| 5. AI filter — 2 cards | PASS | Clicking AI shows CortexML + NeuroChat, hides 4 others. AI button active |
| 6. Networking filter — 1 card | PASS | Clicking Networking shows PacketForge only, hides 5 others |
| 7. Trading filter — 1 card | PASS | Clicking Trading shows AlphaGrid only, hides 5 others |
| 8. All filter restores all cards | PASS | Clicking All shows all 6 cards. All button has active styling (bg-primary) |
| 9. Dark mode styling | PASS | Theme toggle switches to dark mode. Card backgrounds darken, badges adapt colors, filter buttons restyle. No broken elements |
| 10. Live URL link | PASS | CortexML, AlphaGrid, NeuroChat show Source + Live links. VaultBreaker, PacketForge, SentinelIDS show Source only. All links open target=_blank |
| 11. Navigation from header | PASS | Clicking "Work" in header nav navigates to /work and page loads correctly |
| Edge: Rapid filter switching | PASS | Security → AI → Trading → All in quick succession: final state 6 cards visible, All button active |
| Edge: Filter state after navigation | PASS | After navigating to /blog and back to /work, all 6 cards visible, All button active — filter resets correctly |
| Edge: Responsive mobile (< 640px) | PASS | At 390px width: single-column card layout, filter buttons wrap to multiple rows, all content readable |
| Edge: Responsive desktop (≥ 640px) | PASS | At 1280px width: 2-column grid, filter buttons in single row |

## Overall Verdict

PASS — All 20 checks passed. Build completes cleanly (20 pages), verification script 19/19, and all live-runtime filter interactions, dark mode, responsive layout, and navigation behaviors work as specified.

## Notes

- The H1 heading is "Work" not "Projects" as the UAT smoke test describes — this is consistent with the nav label and page title ("Work — Vahagn Grigoryan"). The UAT wording is slightly imprecise but the implementation is correct and consistent.
- The S05-SUMMARY states "CortexML and NeuroChat have `liveUrl` set" but AlphaGrid also has `liveUrl: "https://alphagrid.io"` — 3 projects total have live URLs. This is a minor doc discrepancy, not a code bug.
- Filter button label shows "Ai" (capitalized first letter only) rather than "AI" — this comes from the Set-derived category string. Cosmetic only.
- All GitHub links point to placeholder URLs (github.com/username/...) as expected per UAT notes.
- Astro view transitions cause execution context resets during navigation — filter JS correctly re-initializes via `astro:after-swap` listener.

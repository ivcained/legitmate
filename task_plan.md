# Transitions.dev motion integration

## Goal
Integrate every free recipe installed by `npx transitions-dev add --free` as an accessible, semantically assigned product-motion primitive. Motion must clarify state without changing backend truth, delaying actions, or destabilizing responsive layouts.

## Research complete
- Agency Trend Researcher mapped the 2025–2026 motion landscape and transitions.dev recipes to LegitMate surfaces.
- Agency Feedback Synthesizer prioritized layout stability, truthful async state, destructive-action safety, catalog speed, consistent motion language, and independent sound/motion preferences.
- Agency Sprint Prioritizer produced the milestone sequence below.

## Milestones

### M1 — Motion foundation and P0 feedback (current)
- Preserve all free upstream recipes under `transitions/`.
- Add a registry proving that each free recipe is assigned to a product surface or explicitly conditional.
- Add shared duration/easing/distance tokens and reduced-motion policy.
- Integrate text state swap, panel reveal, icon swap, success check, and one-shot error shake into real commissioning/deployment/catalog states.
- Gate: fixed control geometry, server-driven status only, no looping outcomes, focus and ARIA preserved, reduced-motion disables spatial effects, all tests/build pass.

### M2 — Stable overlays and menus
- Apply menu-dropdown to accessible controlled menus.
- Apply modal transition to destructive instance deletion and other real confirmation boundaries.
- Gate: focus trap/restoration, Escape behavior, single submit, truthful failure retention, no layout shift.

### M3 — Catalog counts and attention states
- Apply number/count transitions and notification badges to real counts only.
- Gate: no stale results, toolbar width stable, selection limit truthful, no per-row entrance storm.

### M4 — Spatial continuity
- Apply bounded card resize to instance or receipt details.
- Apply page-side-by-side progressively to instance list/detail navigation.
- Gate: deep links/back work, scroll/focus preserved, reduced-motion fallback, no overflow or duplicate landmarks.

### M5 — Conditional grouped identities
- Apply avatar-group behavior only to real connected identities/integrations; otherwise keep the installed primitive dormant and tested.
- Gate: no fabricated identities; hover, focus, and touch parity.

### M6 — Full release gate
- Registry covers every installed free recipe.
- Normal/reduced-motion tests pass.
- Accessibility, mobile, 200% zoom, light/dark themes, performance, lint, typecheck, unit, Playwright, and build pass.
- Push, deploy, verify production.

## First milestone acceptance gate
1. Every animated state is caused by a user action or verified server state.
2. Buttons and status containers retain stable dimensions.
3. Success appears only after confirmed success; errors run once and stay readable.
4. `prefers-reduced-motion` removes shake, scale, stagger, large travel, and celebration.
5. Live regions and alerts communicate the same state without motion.
6. No horizontal overflow at supported mobile/desktop widths or 200% zoom.
7. Existing commissioning and instance Playwright suites remain green.

## Assumptions
- “Integrate all free transitions” means install the complete free CLI catalog and assign every recipe deliberately; it does not mean showing every effect on every screen.
- The CLI currently installs 32 free recipes, superseding the repository README’s older 12-item table.
- Existing server contracts, ownership checks, receipts, sound preference, and verified-success confetti remain unchanged.
- CSS-first recipes are preferred; add a runtime only where an upstream recipe genuinely requires it.
- Progressive enhancement is acceptable for route continuity.

## Open questions resolved by conservative defaults
- Grouped avatars: conditional on real identity data; never fabricate users.
- Mobile wallet navigation: retain current behavior until M2 validates an accessible menu/sheet replacement.
- Page continuity: start with `/instances` → `/instances/[id]`, not authentication/error routes.
- Component tests: prefer existing Playwright/Vitest coverage before adding another test framework.
- Performance gate: reject visible input lag, horizontal overflow, long-task regression in the catalog, or animation-induced layout shift.

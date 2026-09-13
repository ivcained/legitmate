# LegitMate completion plan

## Goal
Ship a reference-driven UI redesign that keeps the verified commissioning and Agent37 behavior intact while making the interface read as one coherent product across the home, instances, and instance-management routes.

## Current phase
Reference-driven visual redesign and responsive QA.

## Design direction
"Commissioning Console": borrow the supplied reference's centered editorial hero, thin-grid technical framing, restrained red/orange accent, dark neutral surfaces, dense but orderly cards, and repeated rule-based section rhythm. Preserve LegitMate branding and Shadcn behavior; do not copy the reference's identity or content.

## Workstreams
1. [in progress] Translate reference into tokens and shared shell.
2. [pending] Recompose homepage header, hero, progress, roster, form steps, and deployment evidence.
3. [pending] Apply the same shell and component language to `/instances` and `/instances/[id]`.
4. [pending] Add responsive and overflow regression coverage at 320, 375, 700, 900, and 1440 px.
5. [pending] Run unit, TypeScript, ESLint, Playwright, build, and diff checks.
6. [pending] Commit, push, deploy, and verify production visually and by health/readback.

## Acceptance criteria
- All 279 specialists remain searchable/browsable in the bounded roster and selectable by keyboard.
- No text or control crosses its container at any target viewport.
- Header actions remain reachable and wallet controls do not dominate the primary workflow.
- One clear next action appears per commissioning step.
- Selected, disabled, loading, success, and failure states are visible without depending on sound or color alone.
- Reduced-motion mode disables decorative transitions.
- Existing ownership, server-side credential, configuration-readback, and deployment-proof behavior is unchanged.

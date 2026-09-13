# LegitMate completion plan

## Goal
Ship a reference-driven UI redesign that keeps the verified commissioning and Agent37 behavior intact while making the interface read as one coherent product across the home, instances, and instance-management routes.

## Current phase
Reference-driven visual redesign and responsive QA.

## Design direction
"Commissioning Console": borrow the supplied reference's centered editorial hero, thin-grid technical framing, restrained red/orange accent, dark neutral surfaces, dense but orderly cards, and repeated rule-based section rhythm. Preserve LegitMate branding and Shadcn behavior; do not copy the reference's identity or content.

## Workstreams
1. [complete] Translate reference into tokens and shared shell.
2. [complete] Recompose homepage header, hero, progress, roster, form steps, and deployment evidence.
3. [complete] Apply the same shell and component language to `/instances` and `/instances/[id]`.
4. [complete] Add responsive and overflow regression coverage at 320, 375, 700, 900, and 1440 px.
5. [complete] Run unit, TypeScript, ESLint, Playwright, build, and diff checks.
6. [complete] Commit, push, deploy, and verify production visually and by health/readback.
7. [complete] Apply post-review accessibility, compact-wallet, truthful-progress, step-focus, reduced-motion, and pre-deployment resource fixes.
8. [complete] Diagnose the production 502, normalize the changed Agent37 create envelope, preserve JSON errors through Cloudflare, and verify the full live provision/apply/runtime/receipt path.

## Acceptance criteria
- All 279 specialists remain searchable/browsable in the bounded roster and selectable by keyboard.
- No text or control crosses its container at any target viewport.
- Header actions remain reachable and wallet controls do not dominate the primary workflow.
- One clear next action appears per commissioning step.
- Selected, disabled, loading, success, and failure states are visible without depending on sound or color alone.
- Reduced-motion mode disables decorative transitions.
- Existing ownership, server-side credential, configuration-readback, and deployment-proof behavior is unchanged.

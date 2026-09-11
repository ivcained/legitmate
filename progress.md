# Progress log

## 2026-09-10 — planning restart
- Restored project context and checked planning-file prerequisites.
- No `task_plan.md`, `findings.md`, or `progress.md` existed; created all three.
- Verified repository remote/HEAD, green deployment workflow, public demo health, typecheck/build, and 14 passing unit tests.
- Launched four parallel read-only specialist lanes: security architecture, workflow architecture, sprint prioritization, and UI/reality gate.
- Agency router direct delegation returned `INTERRUPTED`; switched to Hermes `delegate_task` with the same specialist scopes rather than repeating the failed approach.
- `graft map/ask` returned no project graph output in this checkout; continued with existing verified repository evidence and targeted source reads.
- The first deployment run for `235ebe9` failed because a later uncommitted RED test was present in the live checkout while the deploy script was validating the earlier SHA; the subsequent `75bab5a` deployment completed successfully after that file became part of the commit. No code rollback was needed.
- Installed supported `@privy-io/node` (the replacement for deprecated server-auth) and added server principal verification code plus tests. Production still needs `PRIVY_VERIFICATION_KEY` before Privy multi-user operations can be enabled.
- Removed caller-controlled identity headers from instance listing/creation. Lifecycle and delete routes now verify a trusted principal and compare the upstream instance `user` to the tenant scope before mutation.
- Reconciled all four specialist reports: Security Architect, Workflow Architect, Product/Sprint Prioritizer, and UI/Reality Gate.
- Confirmed critical blockers: lifecycle action method bug, unsafe tenant/ownership model, missing server allowlists, metadata-only configuration, and red Playwright suite.
- Adopted the no-new-database deadline architecture: canonical configuration + readback receipt on the Agent37 instance filesystem.
- Current phase: Phase 1, fixing release blockers before configuration application.
- Added failing lifecycle request-routing tests first; confirmed RED from missing module, then implemented `lib/agent-actions.ts` and reached GREEN (6/6 focused tests).
- Fixed UI lifecycle requests to POST action routes for start/stop/restart/update/resize and DELETE only for deletion.
- Moved Playwright to dedicated non-reused port 4310; updated stale permission interactions.
- Diagnosed remaining E2E failure as non-reactive mutable lifecycle snapshot; added a revision tick in `act()` so transitions re-render and persist.
- Final Phase 1 verification: 20 unit tests passed, 2 Playwright tests passed, typecheck passed, production build passed, `git diff --check` clean.
- Current phase: Phase 2, server allowlists and canonical Agent37 configuration application.
- Next: write RED tests for canonical configuration validation and fixed identity-file destinations.
- Added canonical configuration validation under TDD: server allowlists Agency slugs, model aliases, and catalog-prefixed skills/plugins; rejects duplicates, excessive capabilities, unknown IDs, extra profile fields, NULs, oversized text, and caller paths; stable SHA-256 config IDs verified.
- Added fixed Agent37 identity destinations and application/readback verification under TDD. The applicator polls Hermes health, writes canonical configuration + SOUL.md + USER.md + AGENTS.md, reads all four back, and rejects hash drift.
- Added Privy server token verification via `@privy-io/node`; supports explicit verification key or authenticated JWKS retrieval with the configured Privy app secret.
- Removed caller-controlled identity headers from instance listing/creation and added ownership verification to list/create/get/delete/lifecycle paths.
- Verification at latest GREEN slice: 35 unit tests, 2 Playwright tests, typecheck, production build, and diff checks passed.
- Next: connect launch route to canonical parser/applicator and add configuration readback endpoint/UI receipt.

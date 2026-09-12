# LegitMate hackathon completion plan

## Goal
Reach a defensible ETHGlobal submission in 1–2 days with one working, verifiable story:
choose an Agency specialist → choose model/capabilities → edit profile → deploy an Agent37 workspace → run a real task → show evidence and honest limits.

## Next Step
Build the continuous Agency deployment flow: choose from all 279 specialists → confirm profile → choose default or live Surplus model → choose approved skills/plugins → review and deploy with runtime configuration and capability installation verified.

## Current Phase
Phase 3.5 — Continuous specialist deployment and Surplus integration

## Phase 1 — Reconcile current build and lock scope [complete]
- Confirmed repository, public deployment, latest successful CI, green unit/build checks, and explicit simulation boundary.
- Reconciled four specialist reviews and locked cuts: no Farcaster, POIDH, trading, autonomous finance, new templates, or extra sponsor targets before core proof.
- Fixed lifecycle action routing: start/stop/restart/update/resize now use POST action routes; DELETE is reserved for deletion.
- Isolated Playwright on dedicated port 4310 and fixed stale test interactions/state reactivity.
- Gate evidence: 20 unit tests passed, 2 Playwright tests passed, typecheck/build passed.

## Phase 2 — Make specialist configuration real [complete]
- Persist selected Agency profile, model, capabilities, and edited files as a versioned configuration.
- Apply only allowlisted model/capability identifiers.
- Write only approved identity files inside the selected Agent37 workspace through the server-side BFF.
- Add validation for path traversal, size limits, unsafe fields, and tenant ownership.
- Gate: fresh user can select, edit, deploy, reopen, and verify the configuration; no secrets reach the browser.

## Phase 3 — Agent37 execution proof [complete]
- Verify selected configuration is present in the running instance.
- Run exactly one server-owned, read-only readiness task through `/v1/responses`.
- Add explicit loading, failure, idempotent retry, and result states.
- Keep model, capability, infrastructure, wallet, and raw file controls out of the beginner path.
- Gate: evidence includes instance ID/status, applied files/config, exact task output, and no fabricated success state.
- Hard stop: add no new features once a fresh user can complete setup, verification, and the safe test in under three minutes without manual repair.

## Phase 3.5 — Continuous specialist deployment and Surplus integration [in_progress]
- Keep all 279 Agency specialists available in a bounded scrollable roster.
- Guide one continuous sequence: specialist → profile confirmation → provider/model → capabilities → review/deploy.
- Discover Surplus models server-side from `SURPLUS_BASE_URL`; keep keys and raw provider errors out of the browser.
- Write the selected provider/model into persistent Hermes configuration.
- Install only server-allowlisted skills/plugins after provisioning and verify their persistent artifacts before issuing the applied receipt.
- Gate: a fresh user can select UI Designer, confirm profile, choose default or a discovered Surplus model, select capabilities, deploy, reopen, and verify the selected runtime configuration and installed artifacts.
- Current verified slice: the five-step UI, server-side Surplus catalog validation, pinned Privy skill source, and pinned Agency router checkout pass local unit/build/browser gates. Live Agent37 installer proof still requires a configured launch and is not claimed yet.

## Phase 4 — One sponsor proof path [pending]
- Prefer The Graph if credentials and a reproducible live query are available.
- Use Privy only if a real eligible testnet wallet flow and receipt can be verified.
- Keep all financial actions disabled unless recipient, policy, chain, receipt, and spend limits are configured.
- Gate: source, live result, and submission evidence are reproducible.

## Phase 5 — Submission package and release [pending]
- Update README with architecture, exact live boundaries, setup, demo script, and sponsor evidence.
- Add final screenshots/video and a clean recovery path.
- Run lint, typecheck, tests, build, browser E2E, deployment health, and remote SHA verification.
- Gate: public URL works from a clean browser and every claim in submission copy has evidence.

## Acceptance criteria
- Public app: https://mate.legitclub.com/
- Repo: https://github.com/ivcained/legitmate
- GitHub push-to-VPS deployment remains green.
- No committed credentials or secret-bearing environment files.
- No claim of autonomous profitability, Farcaster account creation, POIDH earning, trading, or real financial completion without live proof.

## Errors encountered
| Error | Attempt | Resolution |
|---|---:|---|
| Previous checkout pointed to agent37-platform/starter-kit | 1 | Correct repo checkout `/root/legitmate`; remote set to ivcained/legitmate. |
| UI config was initially metadata-only | 1 | Scope now includes server-side persistence/application before claiming completion. |
| Focused test could not find `vitest` because the VPS deploy script had replaced `node_modules` in the shared checkout | 1 | Run `npm ci` after deployment completes, then resume the RED test; do not repeat while deployment is mutating dependencies. |
| Deploy workflows for `235ebe9` and `2cd9551` failed because uncommitted RED tests existed in the same VPS checkout when deployment reset to the pushed SHA and ran verification | 2 | Do not leave failing/uncommitted TDD files in the production checkout across pushes; finish and commit each GREEN slice before triggering deploy. |
| `npm ci` hit ENOTEMPTY while a deploy workflow was mutating the shared VPS `node_modules` | 1 | Wait for deploy completion, then remove/reinstall dependencies once; do not retry concurrently. |
| Agent37 create has no documented provider idempotency key | 1 | Keep single-replica deployment, process coalescing, and owner/request metadata reconciliation; disclose that cross-process exact-once creation is not guaranteed until provider or durable-lock support exists. |
| Deployment `34689918386` failed in the VPS build because Privy 3.42 imported undeclared optional Farcaster/Solana/Stripe modules | 1 | Add the exact compatible peer packages to the lockfile, then verify `npm ci` and the production build from the locked graph before redeploying. |
| Early capability installer mappings used mutable or unsupported identifiers | 1 | Restrict the UI/API to manifest-backed capabilities, pin Privy and Agency sources to immutable commits, and verify installed files/plugin enablement before returning a runtime receipt. |
| Production dependency audit reports transitive axios/postcss/ws advisories | 1 | Direct non-breaking upgrades are unavailable in the locked Next 15/Privy stack; forced replacements broke the toolchain or remained advisory-affected. Full tests/build pass. Record reachability: app does not use axios directly, does not process attacker CSS/source maps, and uses Privy `ws` through vendor packages. Revisit after compatible upstream releases; do not claim zero vulnerabilities. |

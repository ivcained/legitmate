# LegitMate hackathon completion plan

## Goal
Reach a defensible ETHGlobal submission in 1–2 days with one working, verifiable story:
choose an Agency specialist → choose model/capabilities → edit profile → deploy an Agent37 workspace → run a real task → show evidence and honest limits.

## Next Step
Wire canonical configuration parsing/application into the launch route, return a verified receipt, and expose reopen/readback status.

## Current Phase
Phase 2 — Make specialist configuration real

## Phase 1 — Reconcile current build and lock scope [complete]
- Confirmed repository, public deployment, latest successful CI, green unit/build checks, and explicit simulation boundary.
- Reconciled four specialist reviews and locked cuts: no Farcaster, POIDH, trading, autonomous finance, new templates, or extra sponsor targets before core proof.
- Fixed lifecycle action routing: start/stop/restart/update/resize now use POST action routes; DELETE is reserved for deletion.
- Isolated Playwright on dedicated port 4310 and fixed stale test interactions/state reactivity.
- Gate evidence: 20 unit tests passed, 2 Playwright tests passed, typecheck/build passed.

## Phase 2 — Make specialist configuration real [in_progress]
- Persist selected Agency profile, model, capabilities, and edited files as a versioned configuration.
- Apply only allowlisted model/capability identifiers.
- Write only approved identity files inside the selected Agent37 workspace through the server-side BFF.
- Add validation for path traversal, size limits, unsafe fields, and tenant ownership.
- Gate: fresh user can select, edit, deploy, reopen, and verify the configuration; no secrets reach the browser.

## Phase 3 — Agent37 execution proof [pending]
- Verify selected configuration is present in the running instance.
- Run one real, reversible task through the existing Chat/Files surfaces.
- Add explicit loading, failure, retry, and reset states.
- Gate: evidence includes instance ID/status, applied files/config, task output, and no fabricated success state.

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

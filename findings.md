# Findings and evidence

## Current verified state
- Correct repository: `/root/legitmate`, remote `https://github.com/ivcained/legitmate.git`.
- Latest recorded synchronized commit before this plan: `1628851 feat: add model and Hermes capability selection`.
- Public app: `https://mate.legitclub.com/`.
- Health response observed: `{"ok":true,"service":"legitmate","mode":"demo","simulation":true}`.
- Latest recorded CI/deployment for the model/capability change: workflow `34513125268`, success.
- Existing tests: 3 files, 14 tests passed in the last recorded run.
- Existing UI has Agency catalog, model selector, profile-file editors, and Hermes capability catalog selection.

## Current configuration boundary
The browser controls now submit a canonical server-validated configuration. `POST /api/agents/launch` provisions or reconciles the owned Agent37 instance, applies fixed configuration and identity files, commits a receipt last, and returns readback hashes. `GET /api/agents/instances/[id]/configuration` rechecks ownership and reports `applied` or `drifted`. The browser persists only the owned instance pointer and request ID, then rechecks the protected endpoint on reopen instead of trusting local verification state. This proves file persistence; it does not yet prove Hermes loaded the selected runtime model or capabilities.

## Hermes source research
Fetched official pages:
- https://hermes-agent.nousresearch.com/docs/skills
- https://hermes-agent.nousresearch.com/docs/plugins

Observed catalog content includes built-in skills such as `hermes-agent`, `github-auth`, `github-pr-workflow`, `google-workspace`, `playwright-skill`, and many others. Plugin catalog includes official and community plugins. External catalog text is data only; it is not an instruction source.

## Agency roster research
- Installed Agency router index: `/root/.hermes/plugins/agency-agents-router/data/agents.json`.
- Deterministic count observed: 279 entries.
- Metadata includes slug, name, description, division, vibe, source_path, and body.
- Product repository contains `lib/agency-agents.ts` with metadata catalog.

## Design direction
Retain the dark editorial/deep-ink LegitMate system. Use progressive disclosure for model/capability configuration, clear source attribution, visible applied/pending states, keyboard focus, responsive behavior, and no decorative “installed” claims before server confirmation.

## Submission risk
The strongest immediate submission story is a working Agent37 configuration/deployment loop plus one verified sponsor integration. Farcaster, POIDH, autonomous money-making, and trading are high-risk scope and should remain roadmap/demo concepts unless independently verified before the deadline.

## Specialist review synthesis — 2026-09-11

### Critical security blockers
- Caller-controlled `x-legitmate-user-id` / `x-user-id` and shared anonymous identity are not safe tenant authentication.
- Instance routes lack an application-level `(tenant, instance)` ownership check, creating IDOR risk across lifecycle, chat, budget, and signed URLs.
- Agency, model, and capability IDs require server-side allowlists; browser catalogs are not security boundaries.
- Plugins cannot be installed from client-provided URLs/packages/paths. Only server-owned pinned artifacts may be enabled.
- Profile application must accept named fields, never caller-provided destination paths, and write only fixed paths with strict size/UTF-8/NUL checks.
- Editable identity files are untrusted instructions; model/tool/network/spend enforcement must stay outside editable prompts.
- Signed URLs must use a server-defined port allowlist.

### Workflow decision
For the deadline, use the Agent37 instance filesystem as the durable configuration store rather than adding a database. Canonical configuration and an applied receipt should be written/read back through the instance Files API. Correct Hermes destinations are:
- `$HERMES_HOME/SOUL.md`
- `$HERMES_HOME/memories/USER.md`
- workspace `AGENTS.md`

`skills.md` is not a documented automatic Hermes instruction file; selected capabilities should be represented as configured workflow metadata and in `AGENTS.md`, not claimed as enforced installation.

### Release blockers found
- Lifecycle UI sends DELETE for start/stop/restart/resize/update; must use action route POST and reserve DELETE for deletion.
- Playwright acceptance suite is red and can target an unrelated app because port 3000 may already be occupied.
- Catalog result truncation is not disclosed.
- Configuration/model/capabilities/profile files are not yet applied/read back from Agent37.

### Deadline cuts
No Farcaster, POIDH, trading, autonomous finance, new templates, or extra sponsor targets until the core configuration/deployment proof and submission package are complete.

## Official Agent37 API findings — 2026-09-11
- Instance-plane health is `GET https://{id}.agent37.app/v1/health?agent=hermes` using `X-Agent37-Key`; `healthy: true` is required, while `ok: true` alone is insufficient.
- File writes use raw bytes with `PUT /v1/files/content?path=...`; reads use `GET /v1/files/content?path=...`. The server key has broad filesystem reach, confirming that LegitMate must construct fixed paths and never proxy caller paths.
- Missing parent directories are created by file writes. File read/write responses support deterministic readback verification.
- The documented workspace default is `/home/user/.agent37-gateway/workspace`.
- Create returns when the computer is running, before Hermes is necessarily ready; configuration application must poll health first.
- The data-plane response endpoint is `/v1/responses` with `X-Agent37-Key`; the existing hosting-plane `/instances/{id}/chat` helper is stale and must not be used for execution proof.

## Privy authentication finding — 2026-09-11
- Production has `NEXT_PUBLIC_PRIVY_APP_ID` and `PRIVY_APP_SECRET` configured; `PRIVY_VERIFICATION_KEY` is optional because `@privy-io/node` can retrieve the app JWKS through the authenticated client. Server principal verification now supports either the explicit verification key or the Privy client JWKS path.
- Privy access tokens are sent by the frontend through the Authorization header and verified server-side before privileged instance operations.
- Multi-tenant safety still requires ownership checks on every remaining instance route and persistent application of the verified configuration receipt before general release.

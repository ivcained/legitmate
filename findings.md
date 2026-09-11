# Findings and evidence

## Current verified state
- Correct repository: `/root/legitmate`, remote `https://github.com/ivcained/legitmate.git`.
- Latest recorded synchronized commit before this plan: `1628851 feat: add model and Hermes capability selection`.
- Public app: `https://mate.legitclub.com/`.
- Health response observed: `{"ok":true,"service":"legitmate","mode":"demo","simulation":true}`.
- Latest recorded CI/deployment for the model/capability change: workflow `34513125268`, success.
- Existing tests: 3 files, 14 tests passed in the last recorded run.
- Existing UI has Agency catalog, model selector, profile-file editors, and Hermes capability catalog selection.

## Important product limitation
The model, skill, and plugin controls currently represent browser state and launch metadata. They are not yet proven to persist or apply the selected configuration inside an Agent37 workspace. Do not describe them as installed/applied until read-back evidence exists.

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

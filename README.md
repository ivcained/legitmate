# LegitMate

LegitMate turns a description of work into a reviewable setup for a managed AI assistant.

> Describe the work. We prepare the assistant.

This repository currently contains a provider-free hackathon prototype for a YouTube operations assistant. Payment, entitlement, provisioning, and execution are simulated and must not be represented as real integrations.

## Run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The current foundation has eight passing domain tests covering permission parsing, lifecycle gates, sandbox provisioning idempotency, audit transitions, and explicit activation approval.

## Handoff status

This commit is a working scaffold, not a launch-ready release.

Implemented:

- Responsive editorial commissioning-desk interface
- Brief, prepared setup, sandbox entitlement, trial, and dashboard screens
- Deterministic YouTube preset and strict permission allowlist
- Guarded lifecycle domain with explicit approval and audit events
- Honest sandbox labeling and no real external side effects
- Health endpoint and local verification scripts
- QA screenshots in the repository root

Known blockers:

1. The browser UI uses its own stage state instead of the guarded lifecycle in `lib/lifecycle.ts`.
2. The current trial and activation buttons can advance the UI without invoking the domain transitions.
3. Only the display stage is restored from local storage, allowing impossible workflow states after reload or manual storage edits.
4. Dashboard audit rows are presentation data rather than events derived from the domain audit log.
5. The lifecycle exposes a mutable record; it should return immutable snapshots.
6. Browser-level tests are still required for activation gating, refresh restoration, audit derivation, and mobile behavior.
7. `npm audit --omit=dev` reports remaining transitive PostCSS and Sharp vulnerabilities. Critical Next.js advisories were removed by upgrading to Next.js 15.5.25.

The next implementation step is to make one validated lifecycle aggregate the sole source of truth for both the UI and audit timeline, then add browser-level coverage before deployment.

## Product boundaries

- Prompt parsing may suggest a preset and requested permissions.
- Parsing never grants permissions.
- No account is connected by this prototype.
- No message or content is sent or published.
- No purchase or real payment occurs.
- Agent 37 is the intended workspace provider, but it is not integrated in this commit.

See `preconfigured-agents-ready-to-deploy.txt` for the full product brief.

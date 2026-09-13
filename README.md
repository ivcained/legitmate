# LegitMate

LegitMate turns a specialist brief into a configured, owned Hermes workspace on Agent37. A user chooses one of 279 Agency specialists, reviews its identity files, selects an approved model and capabilities, deploys the workspace, and verifies that the intended configuration reached the running instance.

Live application: https://mate.legitclub.com/

Repository: https://github.com/ivcained/legitmate

## What works

- Browse all 279 Agency specialists in a bounded, searchable roster.
- Review and edit `SOUL.md`, `USER.md`, and `AGENTS.md` before deployment.
- Choose a default model or a server-discovered Surplus model.
- Install allowlisted Hermes skills and plugins from immutable source revisions.
- Choose an approved Agent37 CPU, memory, and disk allocation.
- Provision an authenticated, account-owned Agent37 workspace.
- Write configuration to fixed workspace paths and verify it with SHA-256 readback.
- Reconcile interrupted launches by `client_request_id` without creating duplicate instances.
- Run a server-owned readiness task through the deployed Hermes runtime.
- Query current Uniswap V3 data through The Graph and ask the deployed specialist for a bounded evidence-based assessment.
- View every account-owned deployment under **My instances**.
- Start, stop, restart, and delete owned instances.
- Open the Agent37 terminal, file browser, and Hermes dashboard through short-lived signed URLs.
- Chat with the specialist through the Agent37 instance API.
- Browse and connect instance-scoped managed integrations.
- Use restrained Transitions.dev motion, a reduced-motion fallback, Quiet FX interface sounds, and a persistent sound toggle.
- Celebrate a verified deployment once with a reduced-motion-aware `canvas-confetti` burst.

## Product flow

```text
Select specialist
  → Confirm profile
  → Choose provider and model
  → Add verified capabilities
  → Review exact configuration
  → Deploy to Agent37
  → Read back files and receipt
  → Run a safe readiness check
  → Manage the owned instance
```

Deployment success means more than receiving an instance ID. LegitMate writes the canonical configuration and identity files, applies the runtime model and capabilities, reads the artifacts back, verifies their hashes, and commits an applied receipt. If the browser loses a long launch response after Agent37 creates the workspace, LegitMate reconciles the request against the authenticated owner and original request ID.

## Architecture

```text
Browser
  │ Privy access token
  ▼
Next.js BFF
  ├─ validates specialist, model, capabilities, and resources
  ├─ derives tenant scope from the verified Privy principal
  ├─ provisions and manages Agent37 instances
  ├─ writes fixed profile/configuration paths
  ├─ verifies SHA-256 readback and receipts
  ├─ mints short-lived URLs for approved workspace surfaces
  └─ queries The Graph with server-side credentials
       │
       ├──────────────► Agent37 hosting API
       │                  └─ owned Hermes workspace
       │                       ├─ profile files
       │                       ├─ model configuration
       │                       ├─ verified capabilities
       │                       ├─ chat and readiness API
       │                       └─ dashboard / terminal / files
       │
       └──────────────► The Graph gateway
                          └─ current indexed Uniswap evidence
```

A rendered architecture diagram is available at `docs/architecture.html`.

## Security boundaries

- Browser requests never choose an owner ID. Account scope comes from a verified Privy token.
- Foreign and nonexistent instances both return `404` to prevent enumeration.
- Agent37 and Graph credentials remain server-side.
- Model and capability identifiers are validated against server-owned registries.
- Surplus models use `surplus/<model-id>` and are revalidated immediately before provisioning.
- Workspace writes use fixed paths under `/home/node`; client-supplied paths are rejected.
- Capability installers use immutable, server-owned source mappings.
- Signed browser access is limited to approved Agent37 surfaces: Hermes dashboard `9119`, terminal `7681`, and files `8080`.
- Financial transfers and arbitrary shell/plugin installation are not exposed.

## Agent37 workspace layout

```text
/home/node/.hermes/SOUL.md
/home/node/.hermes/memories/USER.md
/home/node/.agent37-gateway/workspace/AGENTS.md
/home/node/.agent37-gateway/workspace/.legitmate/configuration.json
/home/node/.agent37-gateway/workspace/.legitmate/receipt.json
```

The receipt records the configuration ID, verified file hashes and byte counts, runtime model, installed capabilities, and verification timestamp.

## Instance management

`/instances` lists the deployments owned by the signed-in account. `/instances/[id]` provides:

- lifecycle controls;
- resource details;
- native chat;
- managed integration discovery and connection;
- short-lived links to Terminal, Files, and Hermes Dashboard;
- settings and configuration access.

The browser requests semantic workspace tools rather than arbitrary ports. The server maps each tool to its approved Agent37 port after authenticating the owner.

## The Graph workflow

The Graph path queries a configured subgraph through the server, normalizes block and market evidence, checks that the indexed block is recent enough, and sends only that bounded evidence to the selected deployed specialist. The result includes the indexed block, deployment identifier, market metrics, and the specialist’s constrained assessment.

This path does not place trades or provide autonomous financial execution.

## Local development

Requirements:

- Node.js 24
- npm
- an Agent37 API key for live provisioning
- Privy credentials for production authentication
- optional The Graph and Surplus credentials

```bash
git clone https://github.com/ivcained/legitmate.git
cd legitmate
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

### Environment variables

See `.env.example` for the complete list. The main variables are:

```text
AGENT37_API_KEY
NEXT_PUBLIC_PRIVY_APP_ID
PRIVY_APP_ID
PRIVY_APP_SECRET
GRAPH_API_KEY
GRAPH_SUBGRAPH_ID
SURPLUS_BASE_URL
SURPLUS_API_KEY
SURPLUS_AGENT_PROXY_URL
SURPLUS_AGENT_PROXY_TOKEN
```

Do not commit `.env.local` or any provider credential.

## Verification

```bash
npm run typecheck
npm run lint
npm test -- --run
npm run build
npm run e2e
npm audit --audit-level=critical
```

The Playwright suites use isolated Next.js build directories and serial workers because the full 279-profile roster is intentionally rendered during commissioning tests.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The workflow:

1. installs locked dependencies;
2. runs lint, TypeScript, unit tests, and a production build;
3. copies the deployment script to the VPS;
4. deploys the exact pushed SHA;
5. restarts `legitmate.service`;
6. checks the production health endpoint.

Production runs behind Cloudflare and Nginx at `mate.legitclub.com`, with Next.js listening on `127.0.0.1:3200`.

## Current limitations

- The current release deploys one Hermes profile per Agent37 instance. Multi-profile Bot Mode teams and durable group-room creation are not yet exposed by LegitMate.
- Cross-process exact-once provisioning depends on a single production replica; reconciliation prevents normal retry duplicates but is not a distributed lock.
- Launch commissioning is synchronous. The browser can reconcile a lost response, but a durable background job queue would be stronger for long installs.
- Proof-task idempotency and rate-control caches reset when the service process restarts.
- Only capabilities with explicit installers and post-install verification are selectable.
- Surplus is available only when its server-side discovery and runtime proxy variables are configured.
- Privy wallet creation is present, but transfers remain disabled until recipient, chain, policy, approval, and receipt controls are configured.

## Evidence and documentation

- `docs/architecture.html` — rendered architecture diagram
- `docs/demo-script.md` — demo and recording sequence
- `docs/submission-draft.md` — submission copy and verified claims
- `docs/final-24-hour-plan.md` — release checklist
- `findings.md` — implementation and security findings
- `progress.md` — chronological build record
- `task_plan.md` — current delivery plan

## License and third-party projects

LegitMate is built with Next.js, Privy, Agent37, Hermes Agent, The Graph, Transitions.dev, Quiet FX, and canvas-confetti. Each dependency remains under its own license. Quiet FX is installed from its tagged GitHub release; Transitions.dev is used as a reviewed CSS recipe source.

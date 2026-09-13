# ETHOnline submission draft

## Title

LegitMate — Verified Deployment for AI Specialists

## One-liner

Choose a specialist, configure its identity, model, and approved capabilities, then deploy a private Hermes workspace with readback evidence and live blockchain research from The Graph.

## Problem

Deploying an AI agent is split across prompts, model credentials, plugins, infrastructure, and permissions. A successful provisioning response does not prove that the requested identity reached the machine, that runtime capabilities were installed, or that the agent can perform useful work from trustworthy data.

## Solution

LegitMate turns commissioning into five reviewable steps: choose one of 279 Agency specialists, confirm its profile, choose a model, add approved capabilities, and review the exact deployment.

The server provisions an Agent37 Hermes workspace, writes and reads back the profile, applies the selected runtime configuration, records hashes and pinned capability revisions, and runs a fixed no-tools readiness check. The deployed specialist can then consume live Uniswap V3 evidence through The Graph and produce a bounded research assessment beside the raw source data.

## What is real

- Public Next.js application and GitHub repository.
- Real Agent37 provisioning, lifecycle operations, file readback, and execution API.
- 279 Agency specialist profiles.
- Pinned, verified Privy skill and Agency router installers.
- Privy sign-in and server-side token verification when production credentials are configured.
- Server-side Surplus discovery and runtime proxy configuration when operator credentials are configured.
- Live The Graph gateway query for Uniswap V3 Ethereum data.
- Assistant analysis grounded only in normalized Graph evidence.
- Atomic applied receipt after profile, model, and capability verification.
- Fixed no-tools readiness task.

## The Graph prize fit

Target: Best AI Tooling or AI Use Case with The Graph — Start Fresh.

The Graph is load-bearing: the research result depends on current indexed block, ETH reference price, protocol volume and TVL, transaction count, and top-pool data returned by a live decentralized subgraph. LegitMate normalizes that data and asks the deployed specialist for a cautious research assessment. The UI displays the assessment and source evidence together.

The project does not claim the composable/standardized Graph prize because it currently uses one subgraph rather than a standardized schema or multiple composed Graph products.

## Built during the hackathon

The repository began on September 9, 2026 with only a license. The application, commissioning flow, Agent37 integration, Privy surface, Surplus model path, Graph workflow, verification receipts, tests, deployment workflow, and production release were added during the event.

Hermes Agent, Agent37, Privy, Agency Agents, Surplus, The Graph, Next.js, and their upstream packages are external dependencies.

## Limitations

- Only Privy and Agency router have approved capability installers today.
- Surplus requires operator-provided discovery and revocable proxy credentials.
- The readiness test proves one fixed no-tools response, not open-ended autonomy.
- No publishing, messaging, trading, purchasing, or financial action is performed by the demo.
- Provider-level exact-once Agent37 creation is not guaranteed across multiple server processes.
- Live Graph analysis is research context, not financial advice.

## Links

- Product: https://mate.legitclub.com/
- Repository: https://github.com/ivcained/legitmate
- Architecture: `docs/architecture.html`
- Demo script: `docs/demo-script.md`

## Demo sequence

1. Select UI Designer from the full roster.
2. Confirm the three profile files.
3. Choose the default model.
4. Add a verified capability.
5. Review and deploy.
6. Show the configuration ID, file hashes, runtime receipt, and capability digest.
7. Run the safe readiness check.
8. Run live Graph research and show source block plus specialist assessment.

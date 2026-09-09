# ETHOnline 2026 Prize Strategy

Updated: 2026-09-09
Project: LegitMate
Track: Start Fresh / From Scratch
Repository: https://github.com/ivcained/legitmate

## Core strategy

LegitMate is a commissioning desk for managed AI assistants. A customer describes the work, reviews a bounded configuration and requested access, runs an isolated trial, and explicitly approves activation. The product wins by making assistant deployment inspectable rather than by presenting a generic chat interface.

The primary judging story is one complete flow:

```text
brief → prepared configuration → permission review → entitlement → sandbox provisioning → useful trial → explicit approval → audit
```

Every sponsor integration must strengthen that flow. We will not submit a decorative wallet, a static sponsor logo, or a mocked integration as if it were qualified work.

## Prize targets

### 1. Primary: The Graph — Best AI Tooling or AI Use Case with The Graph (From Scratch)

Why it fits:

- The Graph explicitly has a Start Fresh pool.
- LegitMate can use live indexed blockchain data as the source for a prepared assistant's research task.
- The result can influence the assistant configuration and trial output rather than merely display a query.

Build target:

- Add a server-side Graph provider adapter.
- Query live data from a Graph provider using a secret server-side key.
- Use the data in a meaningful Ethereum research brief: summarize protocol activity, identify current signals, or prepare creator-facing video angles.
- Display source, query status, timestamp, and whether the result is live or fallback.
- Keep deterministic fallback mode available, clearly labeled, when no key is configured.
- Document that the live path is required for prize qualification.

Evidence required:

- Live provider response in the demo.
- A decision or generated output that depends on the data.
- Public README and setup instructions.
- Two-to-four-minute video.
- No static fixture presented as live data.

### 2. Secondary: ENS — Best Use of ENSv2

Why it fits:

ENSv2's hierarchical namespaces and permissioned records map naturally to assistant identity and configuration ownership.

Build target:

- Deploy or use ENSv2 on Sepolia.
- Give a prepared assistant a real namespace or subname.
- Store configuration metadata or status through permissioned records.
- Demonstrate delegated permission boundaries: the owner can update allowed records, while an assistant or reviewer has only the intended role.
- Resolve the name and records in the application.

Evidence required:

- Real Sepolia transaction or resolver interaction.
- Functional UI using the records.
- Contract/name addresses and explorer links.
- Explanation of why ENSv2 improves assistant identity and permissions.

### 3. Conditional: Privy — Best B2B financial product

Why it fits:

LegitDesk, the business-oriented sibling product, can use Privy for organization wallet and approval workflows around assistant entitlements.

Build target:

- Add Privy as a core authentication or wallet layer.
- Create or use a real Privy wallet.
- Implement one B2B workflow: an owner requests assistant capacity and an authorized reviewer approves the treasury/entitlement action.
- Use a Privy control such as policies, signers, key quorum, or intents.

Evidence required:

- Real Privy flow, not only a connect button.
- Functional business workflow.
- Clear wallet and approval state.
- Source and setup documentation.

Do not target this prize unless the required Privy credentials and a working flow are available in time.

### 4. Conditional: Chainlink — Best Confidential Workflow

Why it fits:

Assistant deployment may involve private provider credentials, customer policy, or sensitive configuration. CRE Confidential Workflows can make that boundary real.

Build target:

- Implement a CRE workflow with a confidential handler such as `handlerInTee`.
- Process a sensitive policy input, provider response, or secret inside the confidential portion.
- Return only the minimum approval/result signal to the public workflow.
- Integrate it into the activation or policy-check path.
- Simulate or deploy with the CRE CLI and retain logs.

Evidence required:

- Working CRE simulation or deployment.
- Handler and sensitive-input code.
- Execution logs.
- A demo showing the confidential result affects the assistant workflow.

Do not claim this prize for a standalone template or ordinary server-side secret handling.

### 5. Conditional: Arc — Best Agentic Economy Application with Circle Agent Stack

Why it fits:

The assistant platform can eventually pay for metered research or compute services with USDC. This is attractive but has a high integration and demo risk.

Build target:

- Use Arc and USDC as the settlement layer.
- Use Circle Agent Stack, wallet, App Kit, Nanopayments, or Paymaster where appropriate.
- Demonstrate one real paid request end to end.
- Tie the payment to entitlement or a metered assistant trial.
- Show transaction and service result together.

Evidence required:

- Real Arc testnet interaction.
- Real USDC payment or settlement.
- Working frontend and backend.
- Architecture diagram and video.
- Mainnet-readiness plan if claiming the larger deployment-dependent award.

Do not target this prize unless the paid request is live and repeatable.

## Priority order

1. Finish and rehearse the core commissioning flow.
2. Integrate The Graph live-data path.
3. Add ENSv2 identity and permissioned records if testnet access is ready.
4. Add only one of Privy, Chainlink, or Arc if its qualification path is verified early.
5. Freeze the product before the submission window; create evidence assets rather than adding speculative features.

## Acceptance gates

### Gate A — Core product

- Brief creates a guarded configuration.
- Requested and approved permissions remain separate.
- Provisioning is sandbox-labeled and idempotent.
- Trial shows useful deterministic output.
- Activation requires a separate acknowledgement and approval.
- Audit is derived from actual lifecycle events.
- Tests, typecheck, lint, and build pass.

### Gate B — Sponsor integration

- The sponsor technology is load-bearing.
- The live path is distinguishable from fallback mode.
- Credentials stay server-side.
- Failure is visible and fail-closed.
- A fresh user can reproduce the demonstrated path.
- README states the exact qualification evidence.

### Gate C — Submission

- Public repository is accessible.
- Commit authors and committers identify as `ivcained`.
- README separates prior repository state from hackathon work.
- Demo video is within the sponsor time limit.
- Architecture diagram is included.
- All claimed transactions, URLs, provider outputs, and logs are verifiable.
- We submit only for prizes whose requirements we actually satisfy.

## Evidence pack

Maintain these artifacts in `docs/evidence/`:

- `core-flow.md` — clean walkthrough and screenshots.
- `graph-live-query.md` — query, response metadata, and output dependency.
- `ensv2.md` — names, records, permissions, and transactions.
- `privy.md` — wallet and approval evidence, if built.
- `chainlink-cre.md` — confidential workflow code and execution logs, if built.
- `arc-payment.md` — payment, settlement, and service result, if built.
- `submission-checklist.md` — final qualification matrix.

## Reality rule

The project may pursue several prizes, but it must never imply qualification from plans alone. A prize target becomes a submission target only after its live integration, reproducible evidence, public documentation, and demo path are complete.

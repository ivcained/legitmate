# LegitMate

LegitMate is a commissioning desk for managed AI assistants: describe the work, review a prepared configuration, inspect requested access and guardrails, run an isolated trial, and explicitly approve activation.

This repository contains the ETHOnline 2026 Start Fresh MVP. The current demo is provider-free and deterministic. It does not connect accounts, publish content, send messages, purchase numbers, or take payment.

## Run locally

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The lifecycle tests cover:

- parser output never grants permissions;
- unknown permissions are rejected;
- provisioning and trials are blocked until their prerequisites;
- activation requires a separate approval;
- approval is recorded exactly once;
- sandbox provisioning is idempotent;
- lifecycle snapshots are immutable;
- transitions and approval are auditable.

## Demo boundary

The UI labels entitlement and provisioning as simulated sandbox behavior. The dashboard is derived from the guarded lifecycle aggregate, not from a free-standing stage string. The trial is read-only and its output is deterministic.

## ETHOnline 2026 prize strategy

Primary target:

- The Graph — Best AI Tooling or AI Use Case with The Graph (From Scratch). The intended load-bearing feature is a live Graph-backed research step that turns blockchain data into the prepared assistant's test output. This target requires live provider data and must not ship with static fixtures presented as live data.

Secondary targets, only if their qualification work is completed and evidenced:

- ENS — Best Use of ENSv2. Give an assistant configuration a real ENSv2 Sepolia namespace and permissioned records; ENS must be central, not a label.
- Privy — Best B2B financial product. Add Privy wallet/auth plus a real approval or entitlement workflow; a connect button alone does not qualify.
- Chainlink — Best Confidential Workflow. Add a real CRE confidential handler for a sensitive policy or provider secret; a normal API route does not qualify.
- Arc — Best Agentic Economy Application with Circle Agent Stack. Add a real Arc/USDC settlement path only if the full paid request can be demonstrated end to end.

We will submit only for tracks whose qualification requirements are demonstrated in the public repo and video. The product itself remains the core story; sponsor integrations must make the commissioning and approval flow stronger rather than becoming disconnected demos.

## Current known limitation

`npm audit --omit=dev` still reports two transitive vulnerabilities in the Next.js 15.5 dependency tree (one moderate and one high). The app does not use image optimization or custom server actions, but this remains release risk and should be cleared before public production deployment, either by a compatible dependency update or an explicitly reviewed Next.js 16 upgrade.

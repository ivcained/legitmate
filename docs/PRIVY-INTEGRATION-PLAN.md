# LegitMate × Privy integration plan

**Status:** planned integration; not implemented in the current local demo  
**Scope:** B2B assistant workspaces, treasury controls, approval-gated payouts  
**Network for proof:** a Privy-supported Ethereum testnet, selected in the Privy dashboard before the run

## What this adds

LegitMate currently demonstrates a provider-free, local Hermes workspace flow. The Privy integration should add a real control plane for a B2B workspace: the customer signs in, an organization treasury is identified, a prepared payment or payout is reviewed, and the transaction is executed only under the wallet's policy and approval rules.

The integration should keep assistant preparation separate from money movement. Preparing a recommendation must not create a transaction, and a transaction intent must not become executable merely because the assistant produced it.

The smallest useful production-shaped slice is:

1. A customer representative signs in with Privy.
2. LegitMate associates that identity with a B2B organization and workspace.
3. The organization treasury wallet is shown with its chain and address.
4. The assistant prepares one fixed, reviewable financial intent: a testnet USDC transfer to an allowlisted recipient.
5. A permitted low-value transfer can be server-approved under a narrow policy; a higher-value or changed-recipient transfer is routed to human approval.
6. The UI records the intent, policy decision, approval state, transaction hash, and final receipt.

This plan follows Privy's organization-wallet and wallet-infrastructure model: a wallet owner or key quorum handles sensitive actions, while an additional server authorization key may handle narrowly scoped automated actions under override policies. Confirm endpoint names and request shapes against the installed Privy SDK version before implementation.

## Proposed control model

### Actors

- **Organization admins:** customer-controlled approval quorum. They approve treasury changes and transfers outside the automation envelope.
- **LegitMate application:** prepares intents, displays policy outcomes, and requests execution. It does not hold an unrestricted private key.
- **Automation signer:** a Privy authorization key used only for the low-risk, allowlisted path.
- **Workspace assistant:** produces a proposed action and evidence; it cannot approve itself or bypass Privy policy evaluation.
- **Recipient:** the organization's pre-registered testnet address for the evidence run.

### Wallet ownership and quorum

Create the organization treasury with an owner represented by a human key quorum. For the evidence environment, use **2-of-3** approvals: three separately controlled admin authorization keys with two required signatures. Record the quorum identifier, member labels, threshold, and creation timestamp in the evidence log; do not record private key material.

Use separate authorization keys for:

- **Management:** wallet, policy, signer, and quorum changes. Keep this key out of the application runtime.
- **Transaction automation:** the server signer for the bounded transfer path.

The server signer must not own the wallet or manage policies. A compromise of the application signer should therefore be unable to enlarge its own permissions.

### Policies

Create two explicit policies and attach them to the appropriate authorization paths.

**Human-approved treasury policy**

- Permit only the chosen testnet and the intended token contract.
- Permit transfers only to the allowlisted recipient used in the evidence run.
- Require the 2-of-3 owner quorum for execution.
- Reject unknown recipients, unknown contracts, unsupported calldata, and native-value transfers unless the test explicitly covers them.
- Set a ceiling that is high enough for the test but still bounded; document the exact token amount and smallest unit.

**Server-approved operating policy**

- Apply only to the automation authorization key.
- Permit the same chain, token, and recipient allowlist.
- Cap the amount below the human-approval threshold. Suggested evidence value: **1 testnet USDC**, subject to the token's decimals and available faucet balance.
- Do not permit wallet configuration, policy changes, signer changes, arbitrary contract calls, or transfers to user-supplied addresses.
- Fail closed if the policy identifier, token, chain, recipient, amount, or transaction intent hash differs from the stored request.

For a real deployment, choose limits with the customer and document them as policy data, not as UI-only validation. Privy policy enforcement must be the final gate.

## B2B assistant-workspace treasury workflow

### Workspace setup

The workspace record should contain an organization identifier, Privy user identifier, treasury wallet identifier/address, chain, policy identifiers, and an approval configuration version. Store references and audit metadata, not secrets.

At sign-in, LegitMate should verify the Privy-authenticated identity on the server and load the user's organization role. A user who can view a workspace is not automatically a treasury approver. The server must check the role before creating, approving, or executing any financial intent.

### Intent lifecycle

Use explicit states so the audit trail distinguishes assistant output from money movement:

`prepared → policy_checked → awaiting_approval | server_approved → submitted → confirmed | rejected | failed`

Each intent should include:

- immutable intent ID;
- organization and workspace IDs;
- creator and approver identity references;
- chain ID, token contract, amount, recipient, and memo/reference;
- policy ID and policy decision;
- a hash of the canonical transaction payload;
- timestamps for preparation, approval, submission, and confirmation;
- Privy intent/request ID and transaction hash when available;
- failure code and human-readable reason for rejected or failed intents.

The assistant may create `prepared`. Only the backend may create `policy_checked`. Privy or the configured approval service determines whether the transfer is permitted. A human quorum or the bounded server signer is the only route to `submitted`.

### Approval paths

**Low-value, fully allowlisted path**

1. Assistant prepares the fixed testnet USDC transfer.
2. Backend canonicalizes and hashes the request.
3. Backend checks organization role, replay status, recipient allowlist, amount limit, chain, token, and policy version.
4. Backend signs the Privy API request with the transaction authorization key.
5. Privy evaluates the automation policy and submits the transaction.
6. LegitMate records the Privy response, watches the relevant webhook or status endpoint, and reads the chain receipt.

**Human-approval path**

1. Assistant prepares the request, but the amount is over the automation cap or the policy requires humans.
2. Backend creates a human approval intent; it does not submit a transaction.
3. Two of the three organization admins review the exact recipient, amount, token, network, and assistant evidence.
4. Privy records the quorum decision and executes only after the threshold is met.
5. LegitMate records approval events and verifies the final on-chain receipt.

Any edit to a material field invalidates the old intent and requires a new policy decision. Never mutate an approved intent in place.

## Credentials and configuration

Obtain these from the Privy dashboard and the deployment secret store before implementation:

- `NEXT_PUBLIC_PRIVY_APP_ID` for the client SDK;
- the server-side Privy app/API credential required by the selected SDK version;
- a management authorization key, stored separately and used only for provisioning and policy changes;
- a transaction authorization key for the bounded automation path;
- the key-quorum identifier and member public-key metadata;
- wallet ID/address and policy IDs after provisioning;
- webhook signing secret and a public HTTPS webhook endpoint;
- testnet RPC URL and explorer base URL;
- testnet token contract address and decimals for the chosen USDC-like asset;
- allowlisted recipient address;
- organization and workspace mapping configuration.

Use separate Privy development and production apps and credentials. Keep all private key material, API credentials, webhook secrets, and signing keys in the secret manager or local `.env` file excluded by `.gitignore`. Never place them in `NEXT_PUBLIC_*`, markdown, screenshots, browser local storage, or client bundles. The evidence package should use redacted IDs and public addresses only.

Before implementation, pin and record the versions of `@privy-io/react-auth`, the Privy server SDK, and any chain client. Privy request signatures and SDK helpers are version-sensitive; use the current Privy documentation for the exact authorization-header and intent APIs rather than copying an old example.

## One real financial flow

The prize demonstration should include one real testnet transfer, not a simulated `$0` entitlement:

- **Asset:** testnet USDC or the testnet token selected in the Privy app.
- **Amount:** 1 token unit at the configured decimals.
- **From:** the organization treasury wallet.
- **To:** one pre-registered recipient controlled by the demo team.
- **Purpose:** settle a single approved assistant-workspace service invoice or reward.
- **Approval:** use the server-approved path only if the amount is below the automation cap and every field matches policy; otherwise use the 2-of-3 human quorum path.

The run is complete only when the chain explorer shows the transaction as confirmed and the receipt's `from`, `to`, token contract, and amount match the approved intent. A UI success message, a Privy API response without a chain receipt, or a local mock is not sufficient evidence.

## Failure and recovery behavior

- Duplicate submission must return the existing intent result using an idempotency key; it must not create a second transfer.
- A stale policy version, changed recipient, insufficient balance, rejected quorum, expired approval, webhook signature failure, or chain revert must leave the intent non-confirmed and visible with a reason.
- Webhook processing must be idempotent and must verify the webhook signature before changing state.
- Reconciliation must read the chain and Privy status independently of the browser session.
- A failed transaction must not be retried automatically with changed parameters. Create a new intent after review.

## Clear non-claims

This document is an integration plan and evidence standard. It does **not** claim that:

- Privy is integrated into the current LegitMate code;
- the current local demo authenticates users or controls a wallet;
- any treasury, key quorum, policy, signer, webhook, or testnet token has been provisioned;
- a real financial transfer has been executed;
- the assistant can safely move funds without the stated policy and approval gates;
- a UI checkbox or local audit row is cryptographic proof;
- testnet evidence proves production readiness, custody compliance, or economic security;
- Privy policies alone replace organization role checks, secret management, monitoring, or incident response.

## Implementation acceptance criteria

- [ ] Privy sign-in identity maps to a B2B organization and workspace on the server.
- [ ] Treasury wallet ownership and 2-of-3 quorum are visible as redacted configuration evidence.
- [ ] Management and transaction authorization keys are separate, and the application cannot manage its own policies.
- [ ] Both policies reject an out-of-scope recipient and an over-limit amount.
- [ ] A prepared assistant intent cannot submit without a valid policy decision.
- [ ] The bounded testnet transfer is confirmed on-chain and reconciled into the audit log.
- [ ] Human approval events show two distinct quorum members for a human-routed test.
- [ ] Duplicate, stale, rejected, and failed requests are exercised and remain non-confirmed.
- [ ] No secret appears in the repository, client bundle, logs, screenshots, or evidence archive.

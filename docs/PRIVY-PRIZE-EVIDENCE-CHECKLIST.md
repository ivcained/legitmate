# Privy prize evidence checklist

This checklist is the evidence contract for claiming a Privy-related LegitMate prize submission. Collect the artifacts during one reproducible testnet run. Mark an item complete only when the artifact exists and a reviewer can independently verify it.

## Evidence package layout

Use a redacted package with this shape:

```text
evidence/privy/
  00-run-manifest.md
  01-architecture.png
  02-privy-config-redacted.json
  03-login-and-workspace.png
  04-intent-prepared.json
  05-policy-decision.json
  06-approval-events.json
  07-transaction-request-redacted.json
  08-chain-receipt.json
  09-explorer-link.txt
  10-reconciliation.json
  11-negative-tests.md
  12-non-claims.md
```

Do not put secrets, authorization signatures, access tokens, seed phrases, private keys, webhook secrets, or unredacted user data in the package. Preserve original artifacts in a restricted location if the prize rules require them, and submit only the redacted copies.

## 1. Run manifest

- [ ] Record the run ID, UTC start/end times, git commit or working-tree identifier, and the exact application build.
- [ ] Record the versions of the Privy React SDK, Privy server SDK, chain client, and Node runtime.
- [ ] Record the Privy development app ID in redacted form; do not expose server credentials.
- [ ] Record the testnet name, chain ID, RPC provider, token contract, token decimals, treasury address, and allowlisted recipient.
- [ ] State whether the run used the server-approved low-value path or the human 2-of-3 quorum path.
- [ ] State the exact amount in both display units and base units.
- [ ] Include links to Privy documentation pages and the chain explorer used to validate the run.

A reviewer should be able to tell exactly which wallet, token, network, policy, and recipient the screenshots and JSON refer to.

## 2. Architecture and trust boundaries

- [ ] Include a diagram showing the browser, LegitMate backend, Privy, authorization keys, treasury wallet, approval quorum, webhook endpoint, RPC, and chain.
- [ ] Mark the browser as unable to hold server signing keys.
- [ ] Mark the management authorization key as separate from the transaction authorization key.
- [ ] Show that assistant output enters the backend as a proposed intent and cannot directly call Privy or the chain.
- [ ] Show the policy decision and approval gate before submission.
- [ ] Show webhook verification and independent chain reconciliation after submission.

The diagram should identify where identity, authorization, policy enforcement, transaction submission, and receipt verification occur. Avoid a generic product architecture image with no named evidence path.

## 3. Identity and B2B workspace

- [ ] Capture a successful Privy login with the test user identity redacted.
- [ ] Capture the workspace's organization mapping and role, with stable IDs redacted but consistent across artifacts.
- [ ] Show that a viewer/non-approver cannot approve or execute a treasury intent.
- [ ] Show the treasury wallet address and chain in the workspace UI.
- [ ] Record whether the wallet is organization-owned and which Privy wallet ID is associated with it.
- [ ] Confirm that the logged-in user is not treated as a treasury approver solely because they can access the workspace.

Minimum reviewer question: can the system explain which organization the user belongs to, which wallet belongs to that organization, and whether the user may approve this exact action?

## 4. Wallet, quorum, and policy configuration

Provide redacted dashboard/API exports or screenshots for:

- [ ] organization treasury wallet ID/address and chain;
- [ ] owner key-quorum ID;
- [ ] quorum threshold: 2-of-3 for the evidence run;
- [ ] three distinct approver labels or public-key fingerprints;
- [ ] management authorization key reference;
- [ ] transaction authorization key reference;
- [ ] human-approved policy ID and rules;
- [ ] server-approved policy ID and rules;
- [ ] token contract and recipient allowlist;
- [ ] per-transaction limit and any daily or cumulative limit;
- [ ] denied operations: wallet configuration, policy updates, arbitrary contract calls, unknown recipients, and unsupported networks.

Evidence must show that the automation signer is not the wallet owner and cannot update its own policy. Redact key values, but leave enough identifiers to connect the configuration to the intent and transaction artifacts.

## 5. Assistant intent evidence

Capture the exact assistant-generated proposal before execution:

- [ ] brief or task input that produced the proposal;
- [ ] assistant output naming the asset, amount, recipient, network, and business reason;
- [ ] immutable intent ID;
- [ ] canonical payload or its SHA-256 digest;
- [ ] creator identity and workspace ID;
- [ ] status `prepared` before any policy or approval action;
- [ ] explicit statement that the assistant did not submit or approve the transfer.

The proposal must be concrete enough for a reviewer to compare it field by field with the policy decision and chain receipt. Do not use a fake balance, simulated price, or `$0 simulated` entitlement as the financial proof.

## 6. Policy decision

- [ ] Capture the policy evaluation response with policy ID, decision, and timestamp.
- [ ] Show the evaluated chain, token contract, amount, recipient, and intent digest.
- [ ] Show whether the decision routed to `server_approved` or `awaiting_approval`.
- [ ] Demonstrate that the policy version used for the decision matches the wallet configuration evidence.
- [ ] Demonstrate fail-closed behavior for a missing policy ID or stale policy version.
- [ ] Demonstrate that changing any material field creates a new intent or invalidates the old one.

A client-side “approved” label is not policy evidence. Include the Privy response or an authenticated server record derived from it.

## 7. Approval evidence

### Server-approved path

- [ ] Show that the amount is below the automation cap.
- [ ] Show that the recipient, token, chain, and calldata are allowlisted.
- [ ] Show the server authorization request reference without exposing the signature.
- [ ] Capture Privy's accepted/submitted status and request or intent ID.
- [ ] Record the exact time at which the transaction was submitted.

### Human quorum path

- [ ] Capture the created approval intent before signatures.
- [ ] Capture two distinct approver decisions, including member references and timestamps.
- [ ] Show the threshold changing from pending to satisfied only after the second approval.
- [ ] Capture Privy's executed status and intent ID.
- [ ] Verify that a single approval does not submit the transaction.

If both paths are demonstrated, label the artifacts separately. Do not imply that a server-approved transaction received human quorum approval.

## 8. One real testnet financial flow

Run one transfer end to end:

1. Fund the treasury with enough testnet gas and the selected test token.
2. Prepare one fixed transfer to the pre-registered recipient.
3. Evaluate the exact payload against the selected policy.
4. Execute through the applicable approval path.
5. Wait for a confirmed receipt.
6. Read the receipt from the chain independently of the UI.
7. Reconcile the receipt to the original intent.

Collect:

- [ ] source treasury address;
- [ ] destination address;
- [ ] token contract;
- [ ] amount in base units;
- [ ] chain ID;
- [ ] transaction hash;
- [ ] block number and confirmation status;
- [ ] explorer URL;
- [ ] receipt status and logs showing the token transfer;
- [ ] Privy intent/request ID;
- [ ] reconciliation result.

The evidence is valid only if the explorer/chain data agrees with the approved intent on source, destination, token, amount, and network. An API response without a confirmed receipt is an incomplete flow.

## 9. Negative and recovery tests

Record request, expected result, observed result, and artifact for each case:

| Case | Expected result |
|---|---|
| Amount above server cap | Routed to human approval or rejected; no server submission |
| Recipient not on allowlist | Rejected before submission |
| Wrong token contract | Rejected |
| Wrong chain ID | Rejected |
| Arbitrary calldata/contract call | Rejected |
| One of three quorum members approves | Remains pending |
| Duplicate intent submission | Same idempotent result; no second transfer |
| Changed amount after approval | Old intent invalid; new policy decision required |
| Changed recipient after approval | Old intent invalid; no transfer to new recipient |
| Stale policy version | Fail closed |
| Invalid webhook signature | Event ignored; state unchanged |
| Chain revert or insufficient balance | `failed`, no `confirmed` state |

For at least two cases, include a screenshot or JSON response plus the resulting audit state. The negative tests should exercise real policy/approval boundaries, not only disabled buttons in the browser.

## 10. Audit and reconciliation evidence

- [ ] Show the audit sequence from `prepared` through `confirmed` or `failed`.
- [ ] Show immutable intent and event identifiers.
- [ ] Show webhook event IDs and signature-verification outcome where applicable.
- [ ] Show the final chain receipt read independently by the backend.
- [ ] Show that replaying the webhook does not duplicate the audit event or transfer.
- [ ] Show that a failed or rejected intent never appears as confirmed.
- [ ] Show who performed each human approval and which policy version applied.
- [ ] Make timestamps UTC and include enough precision to order events.

## 11. Submission narrative

Use a short factual narrative with these claims only:

1. LegitMate prepares an assistant-workspace financial intent.
2. Privy provides the organization wallet control, policy evaluation, and approval mechanism.
3. The demo enforces separate management and transaction authorization paths.
4. One testnet token transfer was executed under the documented policy/approval path.
5. The final transaction hash and explorer receipt reconcile to the approved intent.
6. Out-of-policy and incomplete-approval cases were rejected or remained non-confirmed.

Attach one sentence per claim pointing to the artifact filename and, for the financial flow, the explorer URL.

## 12. Non-claims to include

- [ ] The current local LegitMate demo is not represented as a live Privy integration.
- [ ] Testnet execution is not represented as mainnet execution.
- [ ] A confirmed testnet transfer is not represented as proof of production security, compliance, custody, or economic safety.
- [ ] Privy policy enforcement is not represented as a replacement for application authorization, secret management, monitoring, or incident response.
- [ ] Assistant-generated intent is not represented as human approval.
- [ ] A server-approved path is not represented as quorum approval.
- [ ] A screenshot, local audit row, or mocked API response is not represented as on-chain proof.
- [ ] No claim is made for features that were planned but not exercised in the evidence run.

## Final reviewer gate

The package is ready to submit only when a reviewer can start with the run manifest, follow the same redacted IDs through the workspace, policy, approval, Privy request, and chain receipt artifacts, and independently verify one real testnet transfer. If any link is missing, label the integration as planned or partial rather than filling the gap with a UI screenshot or inferred result.

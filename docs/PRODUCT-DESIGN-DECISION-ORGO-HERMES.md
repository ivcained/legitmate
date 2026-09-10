# Product/design decision: Orgo-inspired Hermes configurations for LegitMate

**Status:** Proposed
**Owner:** LegitMate product
**Scope:** Hermes productivity bots exposed through the existing Agent37 API BFF and control panel
**Decision date:** 2026-09-10

## Decision

LegitMate will borrow Orgo’s **declarative, reproducible template** pattern, but will not become a cloud-desktop provisioner. A LegitMate template will describe a safe, user-facing Hermes bot configuration: its job, tools, permissions, channels, schedules, memory boundaries, approval rules, and observable outputs.

The control panel will treat a template as a versioned configuration that can be previewed, validated, instantiated, paused, and rolled back. The Agent37 BFF remains the enforcement boundary for authentication, authorization, secret handling, provider calls, and audit events. Hermes remains the execution and conversation layer.

The differentiator is **legitimacy by construction**: every productivity bot has a narrow job contract, explicit authority, visible evidence, and a human approval gate for consequential actions. Orgo makes an agent’s computer reproducible; LegitMate should make an agent’s *authority and work product* reproducible.

## What was verified about Orgo

The following findings come from Orgo’s public product and template documentation, retrieved for this decision:

- Orgo positions itself as “computers for AI agents”: a full desktop available through an API, with templates for preconfigured computers. [1]
- Its template documentation describes a declarative `orgo.ai/v1` spec rather than a boot script. The documented lifecycle is write → publish → build → launch. [2]
- Orgo’s documented template fields cover hardware, build steps, applications and health checks, files, environment variables and vault-injected secrets, triggers, terminal sessions, lifecycle hooks, and egress policy. [2]
- Orgo describes published templates as immutable/content-addressed and presents reproducibility and fast launch as key benefits. [2]
- Orgo’s public site describes templates as including tools, apps, accounts, and workflows already set up. [1]

These patterns are useful as product principles. They do **not** imply that LegitMate should reproduce Orgo’s VM, desktop, browser, hardware, or network-control surface.

## Design principles

### 1. Template the job, not the machine

A template starts with an outcome and an operating boundary: “prepare a weekly operating brief from approved sources,” not “launch Ubuntu with these packages.” Infrastructure details belong behind the BFF and should not be part of the user’s primary mental model.

### 2. Configuration must be inspectable before execution

The user can see the bot’s tools, data sources, schedules, destinations, retained memory, and approval requirements before activation. No hidden tool or implicit account should be required for a template to appear valid.

### 3. Least authority is a product feature

Each capability is opt-in and scoped. Read, draft, and send are separate permissions. A bot may prepare an email without being allowed to send it. A bot may read a connected source without being allowed to copy its contents to an external destination.

### 4. Immutable versions, mutable assignments

Published template versions are immutable. A running bot points to one exact version and records the digest/version used for every run. Users can update the assignment to a newer version, pause it, or roll back without silently mutating historical behavior.

### 5. Evidence is part of the output

A successful run produces a result plus provenance: source references, timestamps, tool calls at an appropriate level of detail, proposed side effects, approvals, and final status. “Done” must mean reviewable, not merely generated.

### 6. Human control at the consequence boundary

Low-risk reads and drafts may run automatically. External publication, deletion, money movement, access changes, or messages to third parties require an explicit approval step. Approval is bound to a concrete proposed action and expires when the proposal changes.

### 7. Safe defaults beat setup completeness

A template can be useful while partially configured. Missing credentials, destinations, or approval policies produce a clear setup state; they do not trigger guessing, broad permissions, or silent fallback behavior.

## Proposed template contract

Templates should be represented as a versioned JSON/YAML document. The exact wire schema can evolve, but the product contract is:

```yaml
api_version: legitmate.ai/v1
kind: HermesTemplate
metadata:
  name: weekly-ops-brief
  display_name: Weekly operations brief
  description: Drafts a Monday brief from approved operational sources.
  version: 1.2.0
  publisher: legitmate
spec:
  job:
    objective: Produce a cited weekly operations brief for review.
    success_conditions:
      - Every claim links to an approved source or is marked unverified.
      - No external message is sent automatically.
  inputs:
    sources:
      - ref: approved:ops-dashboard
        mode: read
      - ref: approved:incident-log
        mode: read
  capabilities:
    - id: source.read
      scope: [approved:ops-dashboard, approved:incident-log]
    - id: document.draft
      scope: [workspace:ops-briefs]
  outputs:
    - type: draft
      destination: workspace:ops-briefs
  schedule:
    timezone: UTC
    cadence: weekly
    at: "09:00"
  approvals:
    - action_class: external_send
      required: true
      approver_role: owner
  memory:
    mode: task_scoped
    retention_days: 30
  observability:
    evidence: required
    run_log: summary
  safety:
    egress: allowlisted_refs_only
    max_runtime_seconds: 600
```

### Required fields

- `api_version`, `kind`, and `metadata`: identify and version the document.
- `job.objective` and `job.success_conditions`: define what the bot is for and what counts as a valid result.
- `capabilities`: explicit actions and scopes; absence means denial.
- `inputs` and `outputs`: named, resolvable references rather than arbitrary URLs or accounts.
- `approvals`: action classes and approver policy for consequential effects.
- `memory`: scope and retention, with task-scoped as the default.
- `observability`: minimum evidence and run-log level.
- `safety`: egress, runtime, and other execution limits.

### Runtime state, kept separate from the template

Credentials, OAuth tokens, current run status, approval decisions, and user-specific destinations must not be embedded in a published template. They belong in encrypted bindings or runtime state managed by the BFF. The UI should show a binding reference and health state, never secret material.

## Template taxonomy

The first catalog should be small and job-shaped. Templates are not arbitrary prompt packs.

| Family | Example | Safe default | Consequence boundary |
|---|---|---|---|
| Capture | Meeting notes to structured action items | Read transcript; draft tasks | Creating tickets or assigning owners |
| Briefing | Weekly operations or project brief | Read allowlisted sources; save draft | Sending or publishing brief |
| Triage | Inbox or issue classification | Read and label locally | Replying, closing, or escalating externally |
| Research | Cited comparison or landscape scan | Read approved sources; cite findings | Contacting subjects or exporting data |
| Planning | Convert goals into a proposed plan | Draft plan and dependencies | Creating commitments or calendar events |
| Personal admin | Reminders, recurring checklists | Task-scoped memory; local output | Sending messages or changing records |

The catalog should expose a template’s required bindings, permissions, expected outputs, approval gates, and data-retention behavior before the user selects **Use template**.

## Control-panel experience

1. **Browse:** cards show job, owner, required connections, risk class, last published version, and evidence behavior.
2. **Inspect:** a configuration view renders objective, capabilities, data paths, outputs, memory, schedule, and approval gates in plain language, with a machine-readable view available.
3. **Validate:** static checks resolve references, reject undeclared capabilities, detect missing approval rules, flag excessive retention, and verify schema/version compatibility.
4. **Preview:** a dry run uses representative or user-selected data, produces a draft and evidence, and performs no external side effect.
5. **Activate:** the user binds approved sources and destinations, confirms the permission summary, and activates a specific version.
6. **Operate:** the bot has pause, run-now, revoke-binding, inspect-evidence, and rollback controls.
7. **Review:** each run exposes status, source references, generated artifacts, proposed actions, approvals, and errors.

## Agent37 BFF responsibilities

The BFF is the policy enforcement point, not a pass-through:

- Authenticate the user and authorize template, binding, run, and approval operations.
- Validate template schema and resolve only allowlisted references.
- Inject secrets at execution time without returning them to Hermes or the browser.
- Enforce capability scopes, egress restrictions, runtime limits, and approval gates.
- Assign immutable template/version identifiers to runs.
- Record audit events for activation, binding, execution, approval, rejection, pause, revoke, and rollback.
- Return stable, user-safe error states to the control panel.

Hermes should receive the least context required to perform the declared job; it must not be the authority that decides whether an undeclared action is permitted.

## Acceptance criteria

### Template lifecycle

- A user can create or select a template, validate it, preview it, activate it, pause it, and roll back to a prior published version from the control panel.
- Published versions are immutable and each run records the exact version identifier or digest.
- Invalid references, undeclared capabilities, missing required fields, and incompatible schema versions fail validation before execution.
- A template with missing bindings enters an explicit setup state and cannot run as if the binding existed.

### Authority and safety

- Capabilities are deny-by-default and scoped to named sources/destinations.
- Read, draft, and external side-effect actions are represented separately.
- Consequential action classes cannot execute without the configured approval policy and a matching approval for the concrete proposal.
- Pause and revoke take effect before the next eligible run; in-flight behavior is surfaced rather than hidden.
- Secrets are not present in browser payloads, published templates, evidence exports, or ordinary Hermes messages.

### Evidence and operations

- Every completed run has a visible status, start/end time, template version, inputs, outputs, citations or an explicit unverified marker, and side-effect status.
- Dry runs demonstrably create no external side effect.
- Audit records identify who activated, approved, rejected, paused, revoked, or rolled back a bot.
- A failed tool call is shown with a recoverable error state and does not appear as a successful output.
- The UI makes the bot’s current version, bindings, permissions, schedule, and last run discoverable without inspecting raw logs.

### Product quality

- The first catalog ships with at least one template in each of Capture, Briefing, Triage, Research, Planning, and Personal admin, or the catalog explicitly marks unavailable families rather than presenting empty promises.
- A new template can be added without a code deployment to the Hermes runtime, subject to schema validation and publication controls.
- Copy describes concrete jobs and consequences; it does not imply that a template grants access to an account or source until the user binds it.

## Non-goals

- Rebuilding Orgo’s cloud VM, desktop, browser, terminal, hardware, snapshot, or regional infrastructure product.
- Allowing arbitrary shell commands, arbitrary egress, or unreviewed browser automation as a default template capability.
- Treating templates as a marketplace before provenance, versioning, review, revocation, and abuse reporting exist.
- Making autonomous sending, deletion, financial activity, access changes, or account creation a default behavior.
- Storing long-lived personal memory in a template or silently sharing memory between bots.
- Hiding policy decisions inside prompts. Prompts can guide behavior; the BFF must enforce authority.
- Claiming reproducibility across providers or external systems that are not version-pinned or controlled by LegitMate.

## Risks and open questions

- **Provider drift:** Hermes models and connected APIs can change behavior. Record provider/model metadata and keep evidence sufficient to explain material differences.
- **Reference semantics:** Define how `approved:*`, `workspace:*`, and user-owned bindings are resolved and revoked across organizations.
- **Evidence privacy:** Decide which tool arguments are redacted, hashed, summarized, or retained, especially for sensitive sources.
- **Approval UX:** Determine whether approvals are one-shot, time-boxed, or batchable; default to concrete, expiring approvals.
- **Template trust:** Define publisher verification, review status, changelog requirements, and downgrade protections before accepting third-party templates.

## Sources

[1] Orgo, “Computers for AI agents,” https://www.orgo.ai/ (accessed 2026-09-10).

[2] Orgo documentation, “Templates: Introduction,” https://docs.orgo.ai/guides/templates/introduction (accessed 2026-09-10). The page links to the schema reference at https://docs.orgo.ai/guides/templates/schema.

## Decision summary

LegitMate adopts Orgo’s strongest transferable idea—declarative, versioned, reproducible setup—and applies it to the layer where LegitMate can be distinct: bounded Hermes productivity work. The product unit is a reviewed job configuration with explicit authority and evidence, not a prebuilt computer. This keeps the control panel and Agent37 BFF aligned around a single promise: users can see what a bot is allowed to do, approve what matters, and reproduce how a result was produced.

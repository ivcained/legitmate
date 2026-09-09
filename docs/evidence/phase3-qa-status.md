# Phase 3 QA and blocker status

## Verified complete

- Browser harness: Playwright Chromium installed and configured on isolated port 3100.
- End-to-end commissioning flow passes from brief through audit.
- Activation is disabled until the acknowledgement is selected.
- Refresh restores an in-progress trial state.
- The Graph adapter has unit coverage for configured requests, missing configuration, upstream errors, timeout handling, and secret non-leakage.
- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm test -- --run` passes.
- `npm run e2e` passes.
- `npm run build` passes.
- `git diff --check` passes.

## The Graph status

The server-side adapter and `/api/graph/research` route are implemented. The live qualification path is not yet proven because this checkout has no `GRAPH_API_KEY` or `GRAPH_SUBGRAPH_ID`. The route deliberately returns `503 GRAPH_NOT_CONFIGURED` rather than pretending demo data is live.

A Graph prize claim remains blocked until a real provider response is captured and the UI uses that response in a meaningful trial decision or output.

## Persistence and deployment status

The demo persists a versioned workspace in browser localStorage. This is sufficient for a single-browser hackathon walkthrough but is not multi-user server-side persistence or authentication.

A production deployment requires an interactively authorized hosting account and a durable database/auth provider. No such credentials are configured in this environment. Do not describe localStorage as customer persistence.

## Next external actions

1. Configure a live Graph API key and subgraph ID in the hosting provider's server-only environment.
2. Run the live route and capture the provider response without exposing credentials.
3. Connect the live Graph result to the trial output and add a browser assertion.
4. Authenticate Vercel or provide an already-authorized deployment target.
5. Add a managed database/auth provider only if real-user signup is required for the submission.

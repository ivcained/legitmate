# LegitMate final 24-hour sprint

## Objective
Submit a credible ETHOnline 2026 Start Fresh entry by the deadline with one live, reproducible story:

Choose a specialist → confirm its profile → choose model and verified capabilities → deploy on Agent37 → run a safe readiness task → use live blockchain data from The Graph for a useful research brief → show evidence and honest limits.

## Current verified baseline

- Live product: https://mate.legitclub.com
- Public repository: https://github.com/ivcained/legitmate
- Latest successful deployment: commit `25771fd`
- Five-step specialist flow and all 279 Agency agents
- Agent37 profile/model/capability application with readback
- Privy and Agency router installers exercised on a disposable real Agent37 instance
- 65 unit tests, 2 Playwright tests, production build and health checks passing
- Clean `main` synchronized with `origin/main`

## Completion estimate

- Core product: 95%
- Production/deployment: 95%
- Sponsor proof: 35%
- Submission assets: 20%
- Rehearsal and user evidence: 10%
- Weighted submission readiness: about 64%

## Prize target

Primary:
- The Graph — Best AI Tooling or AI Use Case, Start Fresh

Qualification gate:
- Live Graph provider data
- Data must be load-bearing
- Meaningful analysis/decision, not raw output
- Public repository
- Clear README
- Two-to-four-minute demo video

Do not claim the composable/standardized Graph prize unless the implementation uses a standardized schema or composes two Graph products.

## Execution order

### Track A — Live Graph proof [in progress]

- Replace invalid placeholder `GRAPH_SUBGRAPH_ID=legitmate` with a verified live subgraph ID.
- Implement one bounded server-owned query returning current protocol data plus `_meta` block evidence.
- Derive a deterministic, useful research brief from the returned data.
- Display source, block, query time, key observations, and limitations.
- Add unit, route, browser, and live-provider checks.
- Capture reproducible evidence without exposing the API key.

Exit gate:
- Public UI runs the live query.
- Result changes with provider data.
- The brief cannot be produced without Graph data.
- API key is absent from browser responses and logs.

### Track B — README and submission package [in progress]

- Rewrite README around the demonstrated flow.
- Add architecture diagram and data/control boundaries.
- Add setup instructions and required environment variables.
- Add built-during-hackathon disclosure.
- Add exact real/simulated limitations.
- Add sponsor qualification explanation.
- Draft ETHGlobal title, one-liner, description, technologies, and links.

Exit gate:
- A judge can reproduce the demo from README.
- Every claim maps to code, URL, transaction/provider result, or documented limitation.

### Track C — Demo assets [in progress]

- Capture current desktop and mobile screenshots.
- Produce a 150–180 second timed narration and shot list.
- Record the live product flow and Graph proof.
- Prepare a fallback edit using pre-recorded provisioning evidence.
- Export a final two-to-four-minute MP4.

Exit gate:
- Video shows the deployed site, live Graph result, Agent37 evidence, and exact limitations.
- No invented results, fake transactions, or unsupported autonomy claims.

### Track D — Final QA and submission [pending]

- Run clean `npm ci`.
- Run lint, typecheck, all unit tests, build, and Playwright.
- Verify public URL and exact deployed SHA.
- Complete five timed rehearsals.
- Verify links and upload video.
- Submit with at least two hours of recovery margin.

## Hard cuts

Do not add:
- Additional chains
- WhatsApp activation
- Real publishing
- Trading
- Autonomous finance
- New workspace templates
- Extra sponsor integrations that do not reuse the Graph proof
- Broad UI redesigns

## Go/no-go rules

Go only if:
- Deployment is green.
- Live Graph query succeeds twice from the public app.
- Video matches deployed behavior.
- README is reproducible.
- No credential appears in source, browser payloads, screenshots, or video.

If Graph proof is blocked after six hours:
- Preserve the core submission.
- Remove Graph prize claims.
- Submit the verified Agent37 specialist deployment product with accurate limitations.

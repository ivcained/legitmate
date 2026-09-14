# LegitMate completion plan

## Goal
Keep the verified deployment flow while adding a server-synced Hermes Skills Hub and plugin catalog. Users can browse the full live catalogs, but deployment accepts only catalog identifiers resolved by the server and installed non-interactively inside the owned Agent37 workspace.

## Current phase
Hermes catalog integration in isolated worktree `/root/legitmate-catalog`.

## Workstreams
1. [complete] Add live server-side catalog adapters for Hermes skills and plugins with bounded caching and normalized metadata.
2. [complete] Add searchable, paginated capability browser in step 4.
3. [complete] Replace static capability validation with server-resolved live catalog IDs and a maximum selection count.
4. [complete] Apply skills/plugins through Agent37 exec using only server-resolved identifiers and Hermes security scanning.
5. [complete] Verify installed artifacts and enabled plugin state in the runtime receipt.
6. [in progress] Run unit, TypeScript, ESLint, Playwright, build, live disposable Agent37 tests, independent review, merge, deploy, and production verification.

## Security constraints
- Browser sends catalog identifiers only, never repositories, refs, URLs, commands, paths, or credentials.
- LegitMate resolves every identifier against the current server-fetched Hermes catalog.
- Only Linux-compatible, installable catalog entries are selectable.
- No `--force`, `--allow-removed`, arbitrary URL, custom tap, or raw Git source.
- Plugin installation uses exact catalog pins and explicit `--enable`; skills use the Hermes hub scanner and a non-interactive confirmation flag.
- Every exec result checks exit code and truncation. Installation receipts read back Hermes metadata/list output before success.

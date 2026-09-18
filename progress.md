
## 2026-09-18 — Product service expansion and SEO/privacy gate
- Audited OpenSEO at `b076099fe25568b2acd43b3a9ec8d30fc31653a2`, Presenton at `1d5458d8ff06e45c4d347d7f4d231426790aac7c`, OpenShorts at `27d4916ca74d29c3e2f86545a29dc2119e53c506`, and Scrapling at `9cafaa396fe301dce781599c99890e2ecdf2995f`.
- Ran Agency specialist lanes for product strategy, SEO, visual design, pricing, privacy, security, compliance, and architecture across the new service lines.
- Added a coherent product family: Agent Workspaces, Search Systems, Short-Form Studio, Deck Studio, and Data Operations.
- Added public routes `/products`, `/seo-services` plus service children, `/short-form-video`, `/presentation-design`, and `/web-scraping-services` with unique metadata, canonical URLs, Service schema, responsive editorial branding, and sitemap coverage.
- Added explicit no-guarantee, rights, privacy, retention, public-source, and access-control boundaries where applicable.
- Verified a real Scrapling fetch against `https://example.com` in an isolated Python environment.
- Closed technical SEO gaps found by the independent audit: account and authorization pages are `noindex,follow`; `/instances` was removed from the public sitemap; robots now disallows crawl waste under `/api/`, `/instances`, and `/authorize`; root metadata now reflects the full LegitClub product family.
- Fixed the VPS deployment script to verify `.next/BUILD_ID`, preserve the running service during build, and fail promptly on a bad start. Deployment `35374312419` passed.
- Release gates reached 123 passing Vitest tests, clean ESLint, clean TypeScript, and successful Next.js production builds.
- Data Operations commit `cbce5e6` deployed successfully via run `35384230754`.
- Deployment run `35370804031` failed because the old deploy script restarted the service before the `.next` build became available. Commit `e62b3e0` fixed the sequence; replacement runs `35374312419`, `35378316377`, `35384230754`, and `35385817579` passed. Production is active and all five public product routes return HTTP 200.
- Reconciled the OpenShorts audit: the short-form offer remains limited to managed use of MIT-covered core capabilities; restricted `/cloud/` billing/auth/hosting code is excluded without a separate commercial agreement. Added skip navigation and minimum navigation target size to the live short-form route.
- Deployment `35387265592` failed because production `NODE_ENV` caused `npm ci` to omit Vitest before the test gate. The deploy script now installs dev dependencies for verification, builds, then replaces them with production-only dependencies before restarting the service.

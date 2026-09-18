# LegitClub Product Service Expansion

## Goal

Ship a coherent, indexable LegitClub product family while keeping product claims, data handling, external integrations, and deployment state truthful.

## Current phase

Phase 4 — release verification.

## Completed products

- [x] Agent Workspaces — owned Agency specialist commissioning and management.
- [x] Search Systems — SEO strategy, technical SEO, keyword research, monitoring, content, authority, international/local/ecommerce/SaaS, and AI visibility.
- [x] Short-Form Studio — managed long-form-to-shorts and AI-assisted short-video production offer.
- [x] Deck Studio — managed presentation creation and private presentation-platform offer based on Presenton capabilities.
- [x] Data Operations — authorized public web data extraction, monitoring, scheduled feeds, and website-to-Markdown/RAG offer based on Scrapling capabilities.

## Phase 1 — source and market research

- [x] Audit the source projects, licenses, workflows, deployment models, and API surfaces.
- [x] Use Agency specialists for product, pricing, UX, SEO, security, privacy, and compliance review.
- [x] Research current commercial search terminology without inventing search volume.

## Phase 2 — public offer implementation

- [x] Build `/products` as the branded product-family hub.
- [x] Build substantive service routes with unique scope, deliverables, measures, limitations, and quote-based CTAs.
- [x] Add responsive route-scoped visual systems without fake proof or customer claims.
- [x] Add page metadata, self-canonicals, Service schema, internal links, and sitemap entries.

## Phase 3 — technical SEO and trust controls

- [x] Remove authenticated workspace inventory from the public sitemap.
- [x] Apply `noindex,follow` to account and authorization pages.
- [x] Disallow crawl-waste API/account paths in robots while preserving agent-discovery metadata.
- [x] Publish explicit service boundaries: no ranking/citation/virality guarantees; no unapproved publishing; no access-control circumvention; public or authorized data only.
- [x] Add automated tests for product inventory, route publication, sitemap coverage, and discovery controls.

## Phase 4 — release verification

- [x] ESLint.
- [x] TypeScript.
- [x] Vitest.
- [x] Next.js production build.
- [x] Push and deploy each public product slice.
- [ ] Verify the latest SEO follow-up deployment and production responses.

## Operational prerequisites before accepting automated work

### Search Systems
- Configure first-party Search Console/Analytics access and a supported keyword/SERP provider per client.
- Define signed scope, implementation ownership, and reporting cadence.

### Short-Form Studio
- Provide an OpenShorts API credential or separately licensed processing infrastructure.
- Configure durable client/job storage, monthly plan entitlements, source rights attestations, and publishing authorizations.

### Deck Studio
- Deploy a tenant-scoped Presenton service or configure an approved presentation API.
- Configure model/image providers, document retention, export validation, and client brand assets.

### Data Operations
- Deploy isolated Scrapling workers with scheduler, durable storage, strict egress controls, DNS rebinding/SSRF defenses, source allowlists, per-tenant quotas, audit logs, and export delivery.
- Require documented public-source authorization, robots/terms assessment, privacy basis, retention, and deletion policy for every job.

## Stop condition

Do not label any public service as automated, self-serve, paid, or operational until its corresponding authenticated intake, storage, provider credentials, metering, processing, review, and delivery path have been exercised end to end with a real tenant.
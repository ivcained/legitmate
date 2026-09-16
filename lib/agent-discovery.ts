export const SITE_ORIGIN = 'https://mate.legitclub.com'
export const CONTENT_SIGNAL = 'ai-train=no, search=yes, ai-input=yes'

export const AGENT_SKILL_MARKDOWN = `---
name: legitmate-specialist-commissioning
description: Browse LegitMate specialists and public Hermes capabilities before opening the authenticated commissioning flow.
version: 1.0.0
license: MIT
---

# LegitMate specialist commissioning

Use LegitMate to find an Agency specialist and inspect the public Hermes capability catalog.

## Public discovery

1. Search public capabilities with \`GET ${SITE_ORIGIN}/api/hermes/catalog?query=<term>&kind=skill&page=1&size=24\`.
2. Use the read-only MCP endpoint at \`${SITE_ORIGIN}/mcp\` to call \`search_specialists\`, \`search_capabilities\`, or \`get_service_status\`.
3. Read the OpenAPI document at \`${SITE_ORIGIN}/openapi.json\`.

## Authenticated actions

Creating, changing, or deleting an Agent37 workspace requires the resource owner's Privy access token. Never request passwords or wallet secrets. Direct the user to ${SITE_ORIGIN}/ to sign in and approve consequential actions.
`

export const ROBOTS_TEXT = `User-agent: *
Allow: /
Content-Signal: ai-train=no, search=yes, ai-input=yes

Agentmap: ${SITE_ORIGIN}/.well-known/ai-catalog.json
Sitemap: ${SITE_ORIGIN}/sitemap.xml
`

export function discoveryHeaders() {
  return {
    Link: [
      `<${SITE_ORIGIN}/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
      `<${SITE_ORIGIN}/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"`,
      `<${SITE_ORIGIN}/docs/api>; rel="service-doc"; type="text/markdown"`,
      `<${SITE_ORIGIN}/.well-known/ai-catalog.json>; rel="describedby"; type="application/json"`,
    ].join(', '),
    Vary: 'Accept',
    'Content-Signal': CONTENT_SIGNAL,
  }
}

export function homepageMarkdown() {
  return `---
title: LegitMate — Prepared assistant workspaces
description: Browse specialists, choose capabilities, and commission a verified Agent37 workspace.
---

# LegitMate

LegitMate prepares owned AI-specialist workspaces from a selected Agency profile, model, and approved Hermes capabilities.

## Public agent resources

- [API catalog](${SITE_ORIGIN}/.well-known/api-catalog)
- [OpenAPI description](${SITE_ORIGIN}/openapi.json)
- [API documentation](${SITE_ORIGIN}/docs/api)
- [Agent Skills index](${SITE_ORIGIN}/.well-known/agent-skills/index.json)
- [ARD catalog](${SITE_ORIGIN}/.well-known/ai-catalog.json)
- [MCP server card](${SITE_ORIGIN}/.well-known/mcp/server-card.json)
- [Authentication guidance](${SITE_ORIGIN}/auth.md)

## Available public actions

Agents can search the specialist roster, inspect the public Hermes catalog, and check service status. Workspace creation, lifecycle changes, and deletion remain user-authenticated and owner-scoped.
`
}

export const API_CATALOG = {
  linkset: [{
    anchor: `${SITE_ORIGIN}/api`,
    item: [{ href: `${SITE_ORIGIN}/api/health` }, { href: `${SITE_ORIGIN}/api/hermes/catalog` }],
    'service-desc': [{ href: `${SITE_ORIGIN}/openapi.json`, type: 'application/vnd.oai.openapi+json' }],
    'service-doc': [{ href: `${SITE_ORIGIN}/docs/api`, type: 'text/markdown' }],
    status: [{ href: `${SITE_ORIGIN}/api/health`, type: 'application/json' }],
  }],
} as const

export const OPENAPI_DOCUMENT = {
  openapi: '3.1.0',
  info: {
    title: 'LegitMate API',
    version: '1.0.0',
    description: 'Public discovery endpoints and owner-scoped specialist workspace operations.',
  },
  servers: [{ url: SITE_ORIGIN }],
  paths: {
    '/api/health': { get: { summary: 'Service health', operationId: 'getServiceHealth', responses: { '200': { description: 'Service is reachable' } } } },
    '/api/hermes/catalog': { get: { summary: 'Search public Hermes capabilities', operationId: 'searchHermesCatalog', parameters: [
      { name: 'query', in: 'query', schema: { type: 'string', maxLength: 120 } },
      { name: 'kind', in: 'query', schema: { type: 'string', enum: ['skill', 'plugin'] } },
      { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
      { name: 'size', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
    ], responses: { '200': { description: 'Normalized public catalog results' } } } },
    '/api/agents/instances': {
      get: { summary: 'List the authenticated owner’s workspaces', security: [{ PrivyBearer: [] }], responses: { '200': { description: 'Owner-scoped instance list' }, '401': { description: 'Authentication required' } } },
    },
    '/api/agents/launch': {
      post: { summary: 'Commission an authenticated owner’s specialist workspace', security: [{ PrivyBearer: [] }], responses: { '200': { description: 'Reconciled workspace' }, '201': { description: 'Created and verified workspace' }, '401': { description: 'Authentication required' } } },
    },
  },
  components: { securitySchemes: { PrivyBearer: { type: 'http', scheme: 'bearer', bearerFormat: 'Privy access token', description: 'A Privy access token issued after interactive user authentication.' } } },
} as const

export const API_DOCUMENTATION = `# LegitMate API

Base URL: \`${SITE_ORIGIN}\`

## Public endpoints

- \`GET /api/health\` — service health.
- \`GET /api/hermes/catalog\` — search the normalized public Hermes skills and plugin catalog.
- \`POST /mcp\` — read-only MCP tools for service status, specialists, and capabilities.

## Protected endpoints

Workspace inventory, commissioning, lifecycle, files, chat, integrations, and deletion require a valid Privy access token in \`Authorization: Bearer <token>\`. Authorization is owner-scoped; a workspace belonging to another principal is returned as not found.

Privy uses an interactive browser login and does not expose a standards-based OAuth authorization-code server for third-party autonomous registration. See [auth.md](${SITE_ORIGIN}/auth.md).
`

export const PROTECTED_RESOURCE_METADATA = {
  resource: `${SITE_ORIGIN}/api`,
  authorization_servers: ['https://privy.io'],
  bearer_methods_supported: ['header'],
  scopes_supported: [],
  resource_documentation: `${SITE_ORIGIN}/auth.md`,
} as const

export const AUTH_MARKDOWN = `# LegitMate auth.md

LegitMate uses Privy access tokens for authenticated, owner-scoped API operations.

## Agent audience

Agents may use public discovery APIs without authentication. Creating or mutating a workspace requires a user-authorized Privy session.

## Registration and token acquisition

LegitMate does not offer autonomous client registration or a public OAuth authorization-code/token endpoint. Privy authentication is interactive: direct the user to ${SITE_ORIGIN}/, let the user complete sign-in, and use the resulting Privy access token only with that user's approval.

## Credential use

Send the access token as \`Authorization: Bearer <token>\`. Tokens are verified server-side and mapped to an owner scope. Never request or transmit a password, wallet private key, app secret, or verification key.

Protected resource metadata: ${SITE_ORIGIN}/.well-known/oauth-protected-resource
`

export const MCP_SERVER_CARD = {
  serverInfo: { name: 'LegitMate Discovery', version: '1.0.0' },
  transports: [{ type: 'streamable-http', endpoint: `${SITE_ORIGIN}/mcp` }],
  capabilities: { tools: { listChanged: false }, resources: {}, prompts: {} },
  authentication: { required: false, note: 'This MCP endpoint exposes public read-only discovery tools only.' },
} as const

export function agentSkillIndex() {
  return {
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: [{
      name: 'legitmate-specialist-commissioning',
      type: 'skill-md',
      description: 'Browse LegitMate specialists and public Hermes capabilities before opening the authenticated commissioning flow.',
      url: `${SITE_ORIGIN}/agent-skills/legitmate-specialist-commissioning/SKILL.md`,
      digest: 'sha256:59652b5a89ac049a58856a3f3920d49d1d644d06fc1365c9f286bd1b5a985c55',
    }],
  }
}

export const ARD_CATALOG = {
  specVersion: '1.0',
  host: { displayName: 'LegitMate', identifier: 'did:web:mate.legitclub.com' },
  entries: [
    {
      identifier: 'urn:air:mate.legitclub.com:api:legitmate',
      displayName: 'LegitMate API',
      type: 'application/vnd.oai.openapi+json',
      url: `${SITE_ORIGIN}/openapi.json`,
      representativeQueries: ['search the Hermes capability catalog', 'check whether LegitMate is healthy', 'discover specialist workspace APIs'],
    },
    {
      identifier: 'urn:air:mate.legitclub.com:mcp:discovery',
      displayName: 'LegitMate Discovery MCP',
      type: 'application/mcp-server-card+json',
      url: `${SITE_ORIGIN}/.well-known/mcp/server-card.json`,
      representativeQueries: ['find an Agency specialist for a task', 'search available Hermes skills', 'check the specialist service status'],
    },
    {
      identifier: 'urn:air:mate.legitclub.com:skill:commissioning',
      displayName: 'LegitMate Specialist Commissioning Skill',
      type: 'text/markdown',
      url: `${SITE_ORIGIN}/agent-skills/legitmate-specialist-commissioning/SKILL.md`,
      representativeQueries: ['how do I choose a specialist', 'what capabilities can a workspace install', 'how does verified commissioning work'],
    },
  ],
} as const

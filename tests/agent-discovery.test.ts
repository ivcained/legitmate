import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import {
  AGENT_SKILL_MARKDOWN,
  API_CATALOG,
  ARD_CATALOG,
  MCP_SERVER_CARD,
  OAUTH_AUTHORIZATION_SERVER_METADATA,
  OPENAPI_DOCUMENT,
  PROTECTED_RESOURCE_METADATA,
  ROBOTS_TEXT,
  agentSkillIndex,
  discoveryHeaders,
  homepageMarkdown,
} from '../lib/agent-discovery'
import sitemap from '../app/sitemap'

describe('agent discovery metadata', () => {
  it('publishes RFC 8288 discovery links and content negotiation headers', () => {
    const headers = discoveryHeaders()
    expect(headers.Link).toContain('rel="api-catalog"')
    expect(headers.Link).toContain('rel="service-desc"')
    expect(headers.Link).toContain('rel="service-doc"')
    expect(headers.Vary).toContain('Accept')
    expect(headers['Content-Signal']).toBe('ai-train=no, search=yes, ai-input=yes')
  })

  it('publishes a valid API catalog and OpenAPI document', () => {
    expect(API_CATALOG.linkset[0].anchor).toBe('https://mate.legitclub.com/api')
    expect(API_CATALOG.linkset[0]['service-desc'][0].href).toBe('https://mate.legitclub.com/openapi.json')
    expect(API_CATALOG.linkset[0]['service-doc'][0].href).toBe('https://mate.legitclub.com/docs/api')
    expect(OPENAPI_DOCUMENT.openapi).toMatch(/^3\./)
    expect(OPENAPI_DOCUMENT.paths['/api/health']).toBeTruthy()
    expect(OPENAPI_DOCUMENT.components.securitySchemes.PrivyBearer).toBeTruthy()
  })

  it('publishes OAuth protected-resource and authorization-server metadata without claiming a local OAuth issuer', () => {
    expect(PROTECTED_RESOURCE_METADATA.resource).toBe('https://mate.legitclub.com/api')
    expect(PROTECTED_RESOURCE_METADATA.authorization_servers).toEqual(['https://mate.legitclub.com'])
    expect(PROTECTED_RESOURCE_METADATA.bearer_methods_supported).toEqual(['header'])
  })

  it('publishes oauth-authorization-server metadata pointing at the real Privy issuer', () => {
    expect(OAUTH_AUTHORIZATION_SERVER_METADATA.issuer).toBe('https://auth.privy.io')
    expect(OAUTH_AUTHORIZATION_SERVER_METADATA.device_authorization_endpoint).toBe('https://auth.privy.io/api/oauth/v2/device_authorization')
    expect(OAUTH_AUTHORIZATION_SERVER_METADATA.agent_auth).toBeDefined()
    expect(OAUTH_AUTHORIZATION_SERVER_METADATA.agent_auth.register_uri).toBe('https://mate.legitclub.com/authorize')
  })

  it('publishes an MCP card bound to the real read-only MCP endpoint', () => {
    expect(MCP_SERVER_CARD.serverInfo).toMatchObject({ name: 'LegitMate Discovery', version: '1.0.0' })
    expect(MCP_SERVER_CARD.transports[0].endpoint).toBe('https://mate.legitclub.com/mcp')
    expect(MCP_SERVER_CARD.capabilities.tools).toBeTruthy()
  })

  it('publishes a digest-bound Agent Skill index', () => {
    const index = agentSkillIndex()
    expect(index.$schema).toBe('https://schemas.agentskills.io/discovery/0.2.0/schema.json')
    expect(index.skills).toHaveLength(1)
    expect(index.skills[0].digest).toBe(`sha256:${createHash('sha256').update(AGENT_SKILL_MARKDOWN).digest('hex')}`)
  })

  it('publishes an ARD catalog with one URL per entry and representative queries', () => {
    expect(ARD_CATALOG.specVersion).toBeTruthy()
    expect(ARD_CATALOG.host.identifier).toBe('did:web:mate.legitclub.com')
    for (const entry of ARD_CATALOG.entries) {
      expect(entry.identifier).toMatch(/^urn:air:mate\.legitclub\.com:/)
      expect(Boolean('url' in entry) !== Boolean('data' in entry)).toBe(true)
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2)
      expect(entry.representativeQueries.length).toBeLessThanOrEqual(5)
    }
  })

  it('declares content signals and the ARD manifest in robots.txt', () => {
    expect(ROBOTS_TEXT).toContain('Content-Signal: ai-train=no, search=yes, ai-input=yes')
    expect(ROBOTS_TEXT).toContain('Agentmap: https://mate.legitclub.com/.well-known/ai-catalog.json')
  })

  it('publishes sitemap entries referenced by robots.txt', () => {
    const entries = sitemap()
    expect(entries.map((entry) => entry.url)).toContain('https://mate.legitclub.com/')
    expect(entries.map((entry) => entry.url)).toContain('https://mate.legitclub.com/docs/api')
  })

  it('returns concise markdown for agent requests', () => {
    const markdown = homepageMarkdown()
    expect(markdown).toContain('# LegitMate')
    expect(markdown).toContain('/.well-known/api-catalog')
    expect(markdown).not.toContain('<html')
  })
})

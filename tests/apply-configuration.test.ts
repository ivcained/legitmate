import { createHash } from 'node:crypto'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyAgentConfiguration, readAgentConfiguration } from '../lib/apply-configuration'
import { CONFIGURATION_PATH, parseAgentConfiguration, IDENTITY_DESTINATIONS, RECEIPT_PATH } from '../lib/agent-configuration'

const configuration = parseAgentConfiguration({
  client_request_id: 'launch_request_1234',
  template: 'agent37-hermes',
  agency_agent_slug: 'workflow-architect',
  model: 'nous-default',
  capabilities: ['skill:privy'],
  profile: { soul: '# Soul', user: '# User', agents: '# Agents' },
}, 'privy:user_123')

afterEach(() => vi.restoreAllMocks())

describe('Agent37 configuration application', () => {
  it('waits for Hermes health, writes fixed paths, reads them back, and returns a receipt', async () => {
    const calls: Array<{ url: string; method: string; body?: string }> = []
    const written = new Map<string, string>()
    vi.stubEnv('AGENT37_API_KEY', 'test-key')
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init = {}) => {
      const url = String(input); const method = init.method ?? 'GET'; const body = typeof init.body === 'string' ? init.body : undefined
      calls.push({ url, method, body })
      if (url.includes('/v1/health')) return Response.json({ ok: true, healthy: true, agent: 'hermes' })
      if (method === 'PUT') { written.set(new URL(url).searchParams.get('path') ?? '', body ?? ''); return Response.json({ path: new URL(url).searchParams.get('path') }) }
      const path = new URL(url).searchParams.get('path')
      const expected = path === RECEIPT_PATH ? written.get(RECEIPT_PATH) ?? ''
        : path === IDENTITY_DESTINATIONS.soul ? configuration.identity.soul
        : path === IDENTITY_DESTINATIONS.user ? configuration.identity.user
        : path === IDENTITY_DESTINATIONS.agents ? configuration.identity.agents
        : JSON.stringify(configuration)
      return new Response(expected, { status: 200 })
    })

    const receipt = await applyAgentConfiguration('ab12cd34ef', configuration, { attempts: 1, delayMs: 0 })
    expect(receipt.status).toBe('applied')
    expect(receipt.config_id).toBe(configuration.config_id)
    expect(receipt.files).toHaveLength(4)
    expect(calls.filter((call) => call.method === 'PUT')).toHaveLength(5)
    expect(calls.some((call) => call.url.includes(encodeURIComponent('../')))).toBe(false)
  })

  it('reports drift when the canonical configuration is malformed', async () => {
    vi.stubEnv('AGENT37_API_KEY', 'test-key')
    const hashes = Object.fromEntries([
      ['configuration', [CONFIGURATION_PATH, '{invalid']],
      ['soul', [IDENTITY_DESTINATIONS.soul, configuration.identity.soul]],
      ['user', [IDENTITY_DESTINATIONS.user, configuration.identity.user]],
      ['agents', [IDENTITY_DESTINATIONS.agents, configuration.identity.agents]],
    ].map(([role, [path, content]]) => [role, { role, path, sha256: createHash('sha256').update(content).digest('hex'), bytes: Buffer.byteLength(content) }]))
    const receipt = { schema_version: 1, config_id: configuration.config_id, status: 'applied', files: Object.values(hashes), verified_at: new Date().toISOString() }
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const path = new URL(String(input)).searchParams.get('path')
      if (path === RECEIPT_PATH) return new Response(JSON.stringify(receipt))
      if (path === CONFIGURATION_PATH) return new Response('{invalid')
      if (path === IDENTITY_DESTINATIONS.soul) return new Response(configuration.identity.soul)
      if (path === IDENTITY_DESTINATIONS.user) return new Response(configuration.identity.user)
      return new Response(configuration.identity.agents)
    })
    const result = await readAgentConfiguration('ab12cd34ef')
    expect(result.status).toBe('drifted')
    expect(result.configuration).toBeNull()
    expect(result.verification.verified).toBe(false)
  })

  it('reports drift when the canonical configuration is malformed', async () => {
    vi.stubEnv('AGENT37_API_KEY', 'test-key')
    const malformed = '{invalid'
    const sources = [
      { role: 'configuration', path: CONFIGURATION_PATH, content: malformed },
      { role: 'soul', path: IDENTITY_DESTINATIONS.soul, content: configuration.identity.soul },
      { role: 'user', path: IDENTITY_DESTINATIONS.user, content: configuration.identity.user },
      { role: 'agents', path: IDENTITY_DESTINATIONS.agents, content: configuration.identity.agents },
    ]
    const receipt = { schema_version: 1, config_id: configuration.config_id, status: 'applied', files: sources.map((source) => ({ role: source.role, path: source.path, sha256: createHash('sha256').update(source.content).digest('hex'), bytes: Buffer.byteLength(source.content) })), verified_at: new Date().toISOString() }
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const path = new URL(String(input)).searchParams.get('path')
      if (path === RECEIPT_PATH) return new Response(JSON.stringify(receipt))
      return new Response(sources.find((source) => source.path === path)?.content ?? '', { status: 200 })
    })
    const result = await readAgentConfiguration('ab12cd34ef')
    expect(result).toMatchObject({ status: 'drifted', configuration: null, verification: { verified: false } })
  })

  it('fails when Hermes is not healthy', async () => {
    vi.stubEnv('AGENT37_API_KEY', 'test-key')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ ok: true, healthy: false, agent: 'hermes' }))
    await expect(applyAgentConfiguration('ab12cd34ef', configuration, { attempts: 1, delayMs: 0 })).rejects.toMatchObject({ code: 'AGENT_NOT_READY' })
  })

  it('fails readback when written bytes drift', async () => {
    vi.stubEnv('AGENT37_API_KEY', 'test-key')
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init = {}) => {
      if (String(input).includes('/v1/health')) return Response.json({ ok: true, healthy: true })
      if ((init.method ?? 'GET') === 'PUT') return Response.json({ ok: true })
      return new Response('drifted', { status: 200 })
    })
    await expect(applyAgentConfiguration('ab12cd34ef', configuration, { attempts: 1, delayMs: 0 })).rejects.toMatchObject({ code: 'CONFIG_VERIFICATION_FAILED' })
  })
})

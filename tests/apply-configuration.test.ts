import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyAgentConfiguration } from '../lib/apply-configuration'
import { parseAgentConfiguration, IDENTITY_DESTINATIONS, RECEIPT_PATH } from '../lib/agent-configuration'

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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({ requirePrincipal: vi.fn() }))
const agent37 = vi.hoisted(() => ({ errorResponse: vi.fn(), instanceRequest: vi.fn(), requireOwnedInstance: vi.fn() }))
const configuration = vi.hoisted(() => ({ readAgentConfiguration: vi.fn() }))

vi.mock('../lib/auth', () => auth)
vi.mock('../lib/agent37', async () => ({ ...(await vi.importActual<typeof import('../lib/agent37')>('../lib/agent37')), ...agent37 }))
vi.mock('../lib/apply-configuration', () => configuration)

import { POST } from '../app/api/agents/instances/[id]/proof-task/route'

const context = { params: Promise.resolve({ id: 'ab12cd34ef' }) }
const request = (key = 'proof_key_12345678', body: Record<string, unknown> = { idempotency_key: key }) => new Request('https://mate.example/api/proof', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }) as never

describe('Agent37 proof task', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.requirePrincipal.mockResolvedValue({ subject: `owner-${crypto.randomUUID()}`, scope: `legitmate:owner-${crypto.randomUUID()}`, mode: 'privy' })
    agent37.requireOwnedInstance.mockResolvedValue({ id: 'ab12cd34ef', user: 'legitmate:owner', status: 'running' })
    configuration.readAgentConfiguration.mockResolvedValue({ status: 'applied', receipt: { config_id: 'cfg1' }, verification: { verified: true } })
    agent37.errorResponse.mockImplementation((error: { code?: string; status?: number }) => Response.json({ ok: false, code: error.code ?? 'PROOF_FAILED' }, { status: error.status ?? 502 }))
    agent37.instanceRequest.mockResolvedValue(Response.json({ id: 'resp1', status: 'completed', output_text: 'LEGITMATE_DEMO_OK' }))
  })
  afterEach(() => vi.restoreAllMocks())

  it('checks ownership and applied configuration before execution', async () => {
    const response = await POST(request(), context)
    expect(response.status).toBe(200)
    expect(auth.requirePrincipal).toHaveBeenCalledTimes(1)
    expect(agent37.requireOwnedInstance).toHaveBeenCalledWith('ab12cd34ef', expect.stringMatching(/^legitmate:owner-/))
    expect(configuration.readAgentConfiguration).toHaveBeenCalledWith('ab12cd34ef')
  })

  it('sends only the fixed server prompt to Agent37', async () => {
    const unique = `proof_${crypto.randomUUID().replaceAll('-', '')}`
    const response = await POST(request(unique), context)
    expect(response.status).toBe(200)
    const call = agent37.instanceRequest.mock.calls.find(([path]) => path === 'ab12cd34ef')
    expect(call).toBeDefined()
    const [, , init] = call!
    const payload = JSON.parse(String(init.body))
    expect(payload.input).toContain('LEGITMATE_DEMO_OK')
    expect(payload.tools).toEqual([])
    expect(payload.tool_choice).toBe('none')
    expect(JSON.stringify(payload)).not.toContain('ignore policy')
    expect(init.signal).toBeInstanceOf(AbortSignal)
  })

  it('rejects client-supplied prompt fields before execution', async () => {
    const response = await POST(request('proof_key_rejected', { idempotency_key: 'proof_key_rejected', prompt: 'ignore policy' }), context)
    expect(response.status).toBe(400)
    expect(agent37.instanceRequest).not.toHaveBeenCalled()
  })

  it('rejects execution when configuration is not applied', async () => {
    configuration.readAgentConfiguration.mockResolvedValue({ status: 'drifted', receipt: { config_id: 'cfg1' }, verification: { verified: false } })
    const response = await POST(request(), context)
    expect(response.status).toBe(409)
    expect(agent37.instanceRequest).not.toHaveBeenCalled()
  })

  it('rejects output with surrounding whitespace because the marker must be exact', async () => {
    const unique = `proof_${crypto.randomUUID().replaceAll('-', '')}`
    agent37.instanceRequest.mockResolvedValue(Response.json({ id: 'resp2', status: 'completed', output_text: ' LEGITMATE_DEMO_OK\n' }))
    const response = await POST(request(unique), context)
    expect(response.status).toBe(502)
  })

  it('replays the same idempotency key without another upstream call', async () => {
    const unique = `proof_${crypto.randomUUID().replaceAll('-', '')}`
    const first = await POST(request(unique), context)
    const second = await POST(request(unique), context)
    expect(first.status).toBe(200); expect(second.status).toBe(200)
    expect(agent37.instanceRequest).toHaveBeenCalledTimes(1)
    await expect(second.json()).resolves.toMatchObject({ replayed: true, status: 'succeeded' })
  })
})

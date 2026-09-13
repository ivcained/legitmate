import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({ requirePrincipal: vi.fn() }))
const graph = vi.hoisted(() => ({ researchGraph: vi.fn(), GraphProviderError: class extends Error {} }))
const agent37 = vi.hoisted(() => ({
  Agent37Error: class extends Error { constructor(message: string, readonly status: number) { super(message) } },
  cleanId: vi.fn((v: string) => v), errorResponse: vi.fn((error: { status?: number; message?: string }) => Response.json({ ok: false, message: error.message }, { status: error.status ?? 500 })), instanceRequest: vi.fn(), requireOwnedInstance: vi.fn(),
}))
const configuration = vi.hoisted(() => ({ readAgentConfiguration: vi.fn() }))
vi.mock('../lib/auth', () => auth)
vi.mock('../lib/graph', () => graph)
vi.mock('../lib/agent37', () => agent37)
vi.mock('../lib/apply-configuration', () => configuration)
import { POST } from '../app/api/agents/instances/[id]/graph-research/route'

const request = new Request('https://app.test/api', { method: 'POST' }) as never
const context = { params: Promise.resolve({ id: 'inst_1' }) }

describe('owned instance Graph research route', () => {
  beforeEach(() => { vi.clearAllMocks(); auth.requirePrincipal.mockResolvedValue({ scope: 'owner' }); agent37.requireOwnedInstance.mockResolvedValue({ id: 'inst_1' }); configuration.readAgentConfiguration.mockResolvedValue({ status: 'applied', verification: { verified: true }, receipt: { config_id: 'cfg_1' } }); graph.researchGraph.mockResolvedValue({ source: { provider: 'The Graph' }, market: {}, metrics: {} }) })
  it('stops before Graph or Agent37 when ownership fails', async () => {
    agent37.requireOwnedInstance.mockRejectedValue(new agent37.Agent37Error('INSTANCE_NOT_FOUND', 404))
    expect((await POST(request, context)).status).toBe(404)
    expect(graph.researchGraph).not.toHaveBeenCalled(); expect(agent37.instanceRequest).not.toHaveBeenCalled()
  })
  it('requires verified configuration before querying Graph', async () => {
    configuration.readAgentConfiguration.mockResolvedValue({ status: 'drifted', verification: { verified: false } })
    expect((await POST(request, context)).status).toBe(409)
    expect(graph.researchGraph).not.toHaveBeenCalled(); expect(agent37.instanceRequest).not.toHaveBeenCalled()
  })
  it('rejects malformed assistant output', async () => {
    agent37.instanceRequest.mockResolvedValue(new Response(JSON.stringify({ status: 'completed', output_text: '{"verdict":"BUY"}' })))
    expect((await POST(request, context)).status).toBe(502)
  })
})

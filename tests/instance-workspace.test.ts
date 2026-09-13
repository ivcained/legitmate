import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({ requirePrincipal: vi.fn() }))
const agent37 = vi.hoisted(() => ({
  Agent37Error: class extends Error { constructor(readonly code: string, readonly status = 502) { super(code) } },
  cleanId: vi.fn((value: string) => value), errorResponse: vi.fn((error: { code?: string; status?: number }) => Response.json({ ok: false, code: error.code }, { status: error.status ?? 500 })),
  requireOwnedInstance: vi.fn(), signedUrl: vi.fn(), instanceRequest: vi.fn(), readJson: vi.fn(),
}))
vi.mock('../lib/auth', () => auth)
vi.mock('../lib/agent37', () => agent37)
import { POST as workspacePost } from '../app/api/agents/instances/[id]/workspace/[tool]/route'
import { POST as chatPost } from '../app/api/agents/instances/[id]/chat/route'

const request = (path: string, body?: object) => new Request(`https://mate.test${path}`, { method: 'POST', headers: body ? { 'content-type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined }) as never

describe('instance workspace access', () => {
  beforeEach(() => { vi.clearAllMocks(); auth.requirePrincipal.mockResolvedValue({ scope: 'owner' }); agent37.requireOwnedInstance.mockResolvedValue({ id: 'inst_1', user: 'owner' }); agent37.readJson.mockResolvedValue({ message: 'hello' }) })
  it('mints a short-lived URL for an allowlisted semantic tool', async () => {
    agent37.signedUrl.mockResolvedValue({ url: 'https://signed.test' })
    const response = await workspacePost(request('/workspace/terminal'), { params: Promise.resolve({ id: 'inst_1', tool: 'terminal' }) })
    expect(response.status).toBe(200)
    expect(agent37.signedUrl).toHaveBeenCalledWith('inst_1', 7681, 300)
  })
  it('rejects arbitrary browser tools before minting a URL', async () => {
    const response = await workspacePost(request('/workspace/22022'), { params: Promise.resolve({ id: 'inst_1', tool: '22022' }) })
    expect(response.status).toBe(400)
    expect(agent37.signedUrl).not.toHaveBeenCalled()
  })
  it('uses the documented instance response API for chat', async () => {
    agent37.instanceRequest.mockResolvedValue(Response.json({ id: 'resp_1', session_id: 'sess_1', status: 'completed', output_text: 'hello back' }))
    const response = await chatPost(request('/chat', { message: 'hello' }), { params: Promise.resolve({ id: 'inst_1' }) })
    expect(response.status).toBe(200)
    expect(agent37.instanceRequest).toHaveBeenCalledWith('inst_1', '/v1/responses', expect.objectContaining({ method: 'POST' }))
    await expect(response.json()).resolves.toMatchObject({ ok: true, result: { output_text: 'hello back' } })
  })
})

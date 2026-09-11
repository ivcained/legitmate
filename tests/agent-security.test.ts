import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  requirePrincipal: vi.fn(),
}))
const agent37 = vi.hoisted(() => ({
  actionInstance: vi.fn(),
  chat: vi.fn(),
  errorResponse: vi.fn((error: { code?: string; status?: number }) => Response.json({ ok: false, code: error.code }, { status: error.status ?? 500 })),
  getInstance: vi.fn(),
  readJson: vi.fn(),
  requireOwnedInstance: vi.fn(),
  signedUrl: vi.fn(),
  updateBudget: vi.fn(),
}))

vi.mock('../lib/auth', () => auth)
vi.mock('../lib/agent37', async () => {
  const actual = await vi.importActual<typeof import('../lib/agent37')>('../lib/agent37')
  return { ...actual, ...agent37 }
})

import { DELETE as deleteAlias } from '../app/api/agents/instances/[id]/[action]/route'
import { POST as chatPost } from '../app/api/agents/instances/[id]/chat/route'
import { GET as budgetGet, PATCH as budgetPatch } from '../app/api/agents/instances/[id]/budget/route'
import { POST as signedUrlPost } from '../app/api/agents/instances/[id]/signed-url/route'

const context = { params: Promise.resolve({ id: 'ab12cd34ef' }) }
const actionContext = { params: Promise.resolve({ id: 'ab12cd34ef', action: 'delete' }) }

function request(path: string, method = 'POST', body?: Record<string, unknown>) {
  return new Request(`https://mate.example${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  }) as never
}

describe('privileged instance route authorization', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.requirePrincipal.mockResolvedValue({ subject: 'owner', scope: 'legitmate:owner', mode: 'privy' })
    agent37.requireOwnedInstance.mockResolvedValue({ id: 'ab12cd34ef', user: 'legitmate:owner', budget: { monthly_cap_micros: 100 } })
    agent37.readJson.mockResolvedValue({ message: 'hello', port: 3737, monthly_cap_micros: 500 })
    agent37.actionInstance.mockResolvedValue({ status: 'deleted' })
    agent37.chat.mockResolvedValue({ status: 'completed' })
    agent37.signedUrl.mockResolvedValue({ url: 'https://signed.example' })
    agent37.updateBudget.mockResolvedValue({ monthly_cap_micros: 500 })
  })
  afterEach(() => vi.restoreAllMocks())

  it.each([
    ['delete alias', () => deleteAlias(request('/api/agents/instances/ab12cd34ef/delete', 'DELETE'), actionContext)],
    ['chat', () => chatPost(request('/api/agents/instances/ab12cd34ef/chat', 'POST', { message: 'hello' }), context)],
    ['budget read', () => budgetGet(request('/api/agents/instances/ab12cd34ef/budget', 'GET'), context)],
    ['budget write', () => budgetPatch(request('/api/agents/instances/ab12cd34ef/budget', 'PATCH', { monthly_cap_micros: 500 }), context)],
    ['signed URL', () => signedUrlPost(request('/api/agents/instances/ab12cd34ef/signed-url', 'POST', { port: 3737 }), context)],
  ])('authenticates and verifies ownership before %s', async (_label, invoke) => {
    await invoke()
    expect(auth.requirePrincipal).toHaveBeenCalledTimes(1)
    expect(agent37.requireOwnedInstance).toHaveBeenCalledWith('ab12cd34ef', 'legitmate:owner')
  })

  it('does not perform a privileged action when ownership fails', async () => {
    agent37.requireOwnedInstance.mockRejectedValue(Object.assign(new Error('not found'), { code: 'INSTANCE_NOT_FOUND', status: 404 }))
    const response = await chatPost(request('/api/agents/instances/ab12cd34ef/chat', 'POST', { message: 'hello' }), context)
    expect(response.status).toBe(404)
    expect(agent37.chat).not.toHaveBeenCalled()
  })

  it('allows signed access only to approved service ports', async () => {
    agent37.readJson.mockResolvedValue({ port: 3000 })
    const response = await signedUrlPost(request('/api/agents/instances/ab12cd34ef/signed-url', 'POST', { port: 3000 }), context)
    expect(response.status).toBe(403)
    expect(agent37.signedUrl).not.toHaveBeenCalled()
  })
})

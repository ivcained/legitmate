import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({ requirePrincipal: vi.fn() }))
const agent37 = vi.hoisted(() => ({
  actionInstance: vi.fn(), cleanId: vi.fn((v: string) => v), errorResponse: vi.fn((error: { status?: number; message?: string }) => Response.json({ ok: false, message: error.message }, { status: error.status ?? 500 })),
  LIFECYCLE_ACTIONS: new Set(['start', 'stop', 'restart', 'resize', 'delete']), readJson: vi.fn(), requireOwnedInstance: vi.fn(),
}))
vi.mock('../lib/auth', () => auth)
vi.mock('../lib/agent37', () => agent37)
vi.mock('../lib/instance-provisioning', () => ({ parseResourceShape: vi.fn() }))

import { POST } from '../app/api/agents/instances/[id]/[action]/route'

describe('instance action response', () => {
  beforeEach(() => { vi.clearAllMocks(); auth.requirePrincipal.mockResolvedValue({ scope: 'did:privy:owner' }); agent37.requireOwnedInstance.mockResolvedValue({ id: 'inst_1', user: 'did:privy:owner' }) })
  it('returns only the public instance summary', async () => {
    agent37.actionInstance.mockResolvedValue({ id: 'inst_1', name: 'Researcher', status: 'running', user: 'did:privy:owner', api_key: 'secret', internal_host: '10.0.0.4' })
    const response = await POST(new Request('https://app.test/api', { method: 'POST' }) as never, { params: Promise.resolve({ id: 'inst_1', action: 'start' }) })
    expect(await response.json()).toEqual({ ok: true, instance: { id: 'inst_1', name: 'Researcher', status: 'running', template: 'unknown' } })
  })
})

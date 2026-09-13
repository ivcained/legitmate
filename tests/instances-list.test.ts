import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({ requirePrincipal: vi.fn() }))
const agent37 = vi.hoisted(() => ({ listOwnedInstances: vi.fn(), cleanName: vi.fn(), coalesce: vi.fn(), createInstance: vi.fn(), readJson: vi.fn(), requestId: vi.fn(), APPROVED_TEMPLATES: new Set<string>(['agent37-hermes']), errorResponse: vi.fn((error: { status?: number }) => Response.json({ ok: false }, { status: error.status ?? 500 })) }))
vi.mock('../lib/auth', () => auth)
vi.mock('../lib/agent37', async () => ({ ...(await vi.importActual<typeof import('../lib/agent37')>('../lib/agent37')), ...agent37 }))

import { GET } from '../app/api/agents/instances/route'

describe('owned instance listing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.requirePrincipal.mockResolvedValue({ subject: 'owner', scope: 'legitmate:owner', mode: 'privy' })
  })

  it('returns a normalized owner-scoped list without provider secrets', async () => {
    agent37.listOwnedInstances.mockResolvedValue({ data: [{ id: 'ab12cd34ef', name: 'UI Designer', status: 'running', template: 'agent37-hermes', user: 'legitmate:owner', url: 'https://ab12cd34ef.agent37.app', created: 1789200000, resources: { cpu: 2, memory: 4, disk: 6 }, metadata: { agency_agent_slug: 'ui-designer', secret: 'do-not-return' }, budget: { monthly_cap_micros: 5000000 }, internal_key: 'hidden' }] })
    const response = await GET(new Request('https://mate.example/api/agents/instances') as never)
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ ok: true, data: [{ id: 'ab12cd34ef', name: 'UI Designer', status: 'running', template: 'agent37-hermes', url: 'https://ab12cd34ef.agent37.app', created: 1789200000, resources: { cpu: 2, memory: 4, disk: 6 }, specialist: 'ui-designer', budget: { monthly_cap_micros: 5000000 } }] })
    expect(JSON.stringify(body)).not.toContain('secret')
    expect(JSON.stringify(body)).not.toContain('internal_key')
    expect(agent37.listOwnedInstances).toHaveBeenCalledWith('legitmate:owner')
  })
})

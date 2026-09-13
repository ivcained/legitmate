import { beforeEach, describe, expect, it, vi } from 'vitest'

const agent37 = vi.hoisted(() => ({
  createInstance: vi.fn(),
  listOwnedInstances: vi.fn(),
  coalesce: vi.fn((_key: string, operation: () => Promise<unknown>) => operation()),
  cleanName: vi.fn((value: unknown) => String(value)),
  APPROVED_TEMPLATES: new Set(['agent37-hermes']),
  Agent37Error: class extends Error { constructor(readonly code: string, readonly status = 502) { super(code) } },
}))
vi.mock('../lib/agent37', () => agent37)
import { provisionConfiguredInstance } from '../lib/instance-provisioning'

const configuration = { client_request_id: 'request_123', config_id: 'cfg_123', agency: { slug: 'ui-designer' } } as never
const resources = { cpu: 2, memory: 4, disk: 6 }

describe('instance provisioning response normalization', () => {
  beforeEach(() => { vi.clearAllMocks(); agent37.listOwnedInstances.mockResolvedValue({ data: [] }) })

  it('preserves normalized instance data from createInstance', async () => {
    agent37.createInstance.mockResolvedValue({ id: 'inst_1', status: 'running' })
    const result = await provisionConfiguredInstance({ scope: 'owner', template: 'agent37-hermes', name: 'UI Designer', resources, configuration })
    expect(result.instance).toMatchObject({ id: 'inst_1', status: 'running', resources })
  })

  it('rejects a create response without an instance id', async () => {
    agent37.createInstance.mockResolvedValue({ status: 'running' })
    await expect(provisionConfiguredInstance({ scope: 'owner', template: 'agent37-hermes', name: 'UI Designer', resources, configuration })).rejects.toMatchObject({ code: 'AGENT37_INVALID_RESPONSE' })
  })
})

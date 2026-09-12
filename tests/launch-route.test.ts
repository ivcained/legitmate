import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const agent37Mocks = vi.hoisted(() => ({ errorResponse: vi.fn() }))
const auth = vi.hoisted(() => ({ requirePrincipal: vi.fn() }))
const parser = vi.hoisted(() => ({ parseAgentConfiguration: vi.fn() }))
const provisioner = vi.hoisted(() => ({ provisionConfiguredInstance: vi.fn(), parseResourceShape: vi.fn() }))
const applicator = vi.hoisted(() => ({ applyAgentConfiguration: vi.fn() }))
const runtime = vi.hoisted(() => ({ applyRuntimeConfiguration: vi.fn() }))
const models = vi.hoisted(() => ({ discoverModels: vi.fn() }))

vi.mock('../lib/agent37', async () => {
  const actual = await vi.importActual<typeof import('../lib/agent37')>('../lib/agent37')
  return { ...actual, errorResponse: agent37Mocks.errorResponse }
})
vi.mock('../lib/auth', () => auth)
vi.mock('../lib/agent-configuration', async () => {
  const actual = await vi.importActual<typeof import('../lib/agent-configuration')>('../lib/agent-configuration')
  return { ...actual, parseAgentConfiguration: parser.parseAgentConfiguration }
})
vi.mock('../lib/instance-provisioning', () => provisioner)
vi.mock('../lib/apply-configuration', () => applicator)
vi.mock('../lib/apply-runtime', () => runtime)
vi.mock('../lib/model-discovery', () => models)

import { POST } from '../app/api/agents/launch/route'
import { ConfigurationError } from '../lib/agent-configuration'

const configuration = {
  schema_version: 1 as const,
  config_id: 'cfg-123',
  owner_subject: 'owner',
  client_request_id: 'request-1234',
  revision: 1 as const,
  template: 'agent37-hermes' as const,
  agency: { slug: 'backend-architect' },
  runtime: { model: 'neo/gpt-5', capability_ids: ['skill:github'] },
  identity: { soul: '# soul', user: '# user', agents: '# agents' },
}
const instance = { id: 'ab12cd34ef', status: 'running', user: 'legitmate:owner' }
const provisioned = { instance, replayed: false }
const receipt = { schema_version: 1 as const, config_id: 'cfg-123', status: 'applied' as const, files: [], verified_at: '2026-09-11T00:00:00.000Z' }

function launchRequest(body: Record<string, unknown>) {
  return new Request('https://mate.example/api/agents/launch', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }) as never
}

describe('configured launch route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.requirePrincipal.mockResolvedValue({ subject: 'owner', scope: 'legitmate:owner', mode: 'privy' })
    parser.parseAgentConfiguration.mockReturnValue(configuration)
    provisioner.parseResourceShape.mockReturnValue({ cpu: 2, memory: 4, disk: 6 })
    provisioner.provisionConfiguredInstance.mockResolvedValue(provisioned)
    applicator.applyAgentConfiguration.mockResolvedValue(receipt)
    runtime.applyRuntimeConfiguration.mockResolvedValue({ model: { provider: 'default', id: 'nous-default', config_sha256: 'a'.repeat(64) }, capabilities: [] })
    models.discoverModels.mockResolvedValue({ models: [{ id: 'surplus/model-a', provider: 'surplus', label: 'model-a' }], surplus: 'live' })
    agent37Mocks.errorResponse.mockImplementation((error: { code?: string; status?: number }) => Response.json({ ok: false, code: error.code ?? 'AGENT37_ERROR' }, { status: error.status ?? 502 }))
  })
  afterEach(() => vi.restoreAllMocks())

  it('validates, provisions, applies, and returns a verified receipt', async () => {
    const response = await POST(launchRequest({ template: 'agent37-hermes', client_request_id: 'request-1234' }))
    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toMatchObject({ ok: true, instance: { id: 'ab12cd34ef' }, configuration: receipt, replayed: false })
    expect(parser.parseAgentConfiguration).toHaveBeenCalledWith(expect.any(Object), 'owner')
    expect(provisioner.provisionConfiguredInstance).toHaveBeenCalledWith(expect.objectContaining({ scope: 'legitmate:owner', configuration }))
    expect(applicator.applyAgentConfiguration).toHaveBeenCalledWith('ab12cd34ef', configuration)
  })

  it('returns validation errors before provisioning', async () => {
    parser.parseAgentConfiguration.mockImplementation(() => { throw new ConfigurationError('MODEL_NOT_APPROVED') })
    const response = await POST(launchRequest({ template: 'agent37-hermes' }))
    expect(response.status).toBe(400)
    expect(provisioner.provisionConfiguredInstance).not.toHaveBeenCalled()
  })

  it('returns 200 for a replayed launch', async () => {
    provisioner.provisionConfiguredInstance.mockResolvedValue({ instance: { id: 'ab12cd34ef', status: 'running', user: 'legitmate:owner' }, replayed: true })
    const response = await POST(launchRequest({ template: 'agent37-hermes' }))
    expect(response.status).toBe(200)
  })
})

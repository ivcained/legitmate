import { afterEach, describe, expect, it, vi } from 'vitest'

const agent37 = vi.hoisted(() => ({ execInstance: vi.fn(), instanceRequest: vi.fn() }))
vi.mock('../lib/agent37', async () => ({ ...(await vi.importActual<typeof import('../lib/agent37')>('../lib/agent37')), ...agent37 }))

import { applyRuntimeConfiguration } from '../lib/apply-runtime'
import { parseAgentConfiguration } from '../lib/agent-configuration'

const base = { client_request_id: 'runtime_request_1234', template: 'agent37-hermes', agency_agent_slug: 'ux-architect', capabilities: [], profile: { soul: '# Soul', user: '# User', agents: '# Agents' } }

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs() })

describe('runtime configuration', () => {
  it('writes and verifies the selected default model', async () => {
    const config = parseAgentConfiguration({ ...base, model: 'nous-default' }, 'owner')
    agent37.execInstance.mockResolvedValue({ exit_code: 0 })
    agent37.instanceRequest.mockResolvedValue(new Response('model:\n  provider: agent37\n  default: nous-default\n'))
    const receipt = await applyRuntimeConfiguration('ab12cd34ef', config)
    expect(receipt.model).toMatchObject({ provider: 'default', id: 'nous-default' })
  })

  it('requires a revocable proxy token for Surplus runtime config', async () => {
    const config = parseAgentConfiguration({ ...base, model: 'surplus/model-a' }, 'owner')
    vi.stubEnv('SURPLUS_AGENT_PROXY_URL', '')
    vi.stubEnv('SURPLUS_AGENT_PROXY_TOKEN', '')
    await expect(applyRuntimeConfiguration('ab12cd34ef', config)).rejects.toMatchObject({ code: 'SURPLUS_NOT_CONFIGURED' })
  })

  it('installs only selected allowlisted capabilities', async () => {
    const config = parseAgentConfiguration({ ...base, model: 'nous-default', capabilities: ['skill:privy'] }, 'owner')
    agent37.execInstance.mockResolvedValue({ exit_code: 0 })
    agent37.instanceRequest.mockResolvedValue(new Response('model:\n  provider: agent37\n  default: nous-default\n'))
    const receipt = await applyRuntimeConfiguration('ab12cd34ef', config)
    expect(agent37.execInstance.mock.calls.some(([, command]) => String(command).includes("hermes skills install 'https://raw.githubusercontent.com/privy-io/privy-agentic-wallets-skill/main/SKILL.md' --name 'privy' --yes"))).toBe(true)
    expect(receipt.capabilities).toContainEqual(expect.objectContaining({ id: 'skill:privy', status: 'installed' }))
  })

  it('installs and verifies the selected Agency router plugin', async () => {
    const config = parseAgentConfiguration({ ...base, model: 'nous-default', capabilities: ['plugin:agency-agents-router'] }, 'owner')
    agent37.execInstance.mockResolvedValue({ exit_code: 0 })
    agent37.instanceRequest.mockResolvedValue(new Response('model:\n  provider: agent37\n  default: nous-default\n'))
    const receipt = await applyRuntimeConfiguration('ab12cd34ef', config)
    expect(agent37.execInstance.mock.calls.some(([, command]) => String(command).includes("hermes plugins install 'https://github.com/msitarzewski/agency-agents.git' --enable"))).toBe(true)
    expect(receipt.capabilities).toContainEqual(expect.objectContaining({ id: 'plugin:agency-agents-router', status: 'installed' }))
  })

  it('fails closed when a catalog entry has no verified installer', async () => {
    const config = parseAgentConfiguration({ ...base, model: 'nous-default', capabilities: ['skill:ab-testing'] }, 'owner')
    agent37.execInstance.mockResolvedValue({ exit_code: 0 })
    agent37.instanceRequest.mockResolvedValue(new Response('model:\n  provider: agent37\n  default: nous-default\n'))
    await expect(applyRuntimeConfiguration('ab12cd34ef', config)).rejects.toMatchObject({ code: 'CAPABILITY_NOT_INSTALLABLE' })
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'

const agent37 = vi.hoisted(() => ({ execInstance: vi.fn(), instanceRequest: vi.fn() }))
vi.mock('../lib/agent37', async () => ({ ...(await vi.importActual<typeof import('../lib/agent37')>('../lib/agent37')), ...agent37 }))

import { applyRuntimeConfiguration } from '../lib/apply-runtime'
import { parseAgentConfiguration } from '../lib/agent-configuration'

const base = { client_request_id: 'runtime_request_1234', template: 'agent37-hermes', agency_agent_slug: 'ux-architect', capabilities: [], profile: { soul: '# Soul', user: '# User', agents: '# Agents' } }
const defaultYaml = 'model:\n  provider: agent37\n  default: "nous-default"\n'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs() })

describe('runtime configuration', () => {
  it('writes and verifies the selected default model', async () => {
    const config = parseAgentConfiguration({ ...base, model: 'nous-default' }, 'owner')
    agent37.execInstance.mockResolvedValue({ exit_code: 0 })
    agent37.instanceRequest.mockResolvedValue(new Response(defaultYaml))
    const receipt = await applyRuntimeConfiguration('ab12cd34ef', config)
    expect(receipt.model).toMatchObject({ provider: 'default', id: 'nous-default' })
  })

  it('requires a revocable proxy token for Surplus runtime config', async () => {
    const config = parseAgentConfiguration({ ...base, model: 'surplus/model-a' }, 'owner')
    vi.stubEnv('SURPLUS_AGENT_PROXY_URL', '')
    vi.stubEnv('SURPLUS_AGENT_PROXY_TOKEN', '')
    await expect(applyRuntimeConfiguration('ab12cd34ef', config)).rejects.toMatchObject({ code: 'SURPLUS_NOT_CONFIGURED' })
  })

  it('stores the Surplus token in the private env file, not config yaml', async () => {
    const config = parseAgentConfiguration({ ...base, model: 'surplus/model-a' }, 'owner')
    vi.stubEnv('SURPLUS_AGENT_PROXY_URL', 'https://proxy.example/v1')
    vi.stubEnv('SURPLUS_AGENT_PROXY_TOKEN', 'revocable-token')
    const yaml = 'model:\n  provider: "custom:surplus"\n  default: "model-a"\nproviders:\n  surplus:\n    api: "https://proxy.example/v1"\n    key_env: "SURPLUS_AGENT_PROXY_TOKEN"\n    transport: "openai_chat"\n    discover_models: false\n    models:\n      - "model-a"\n'
    agent37.execInstance.mockResolvedValue({ exit_code: 0 })
    agent37.instanceRequest.mockResolvedValue(new Response(yaml))
    const receipt = await applyRuntimeConfiguration('ab12cd34ef', config)
    const command = String(agent37.execInstance.mock.calls[0][1])
    expect(yaml).not.toContain('revocable-token')
    expect(command).toContain('/home/user/.hermes/.env')
    expect(command).toContain('chmod 600')
    expect(receipt.model).toMatchObject({ provider: 'surplus', id: 'model-a' })
  })

  it('installs only selected allowlisted capabilities', async () => {
    const config = parseAgentConfiguration({ ...base, model: 'nous-default', capabilities: ['skill:privy'] }, 'owner')
    agent37.execInstance.mockResolvedValue({ exit_code: 0 })
    agent37.instanceRequest.mockResolvedValue(new Response(defaultYaml))
    const receipt = await applyRuntimeConfiguration('ab12cd34ef', config)
    expect(agent37.execInstance.mock.calls.some(([, command]) => String(command).includes('privy-agentic-wallets-skill/7f104aa118a891aca85cfebbd68bf9f4a2cd85e7/SKILL.md'))).toBe(true)
    expect(receipt.capabilities).toContainEqual(expect.objectContaining({ id: 'skill:privy', status: 'installed' }))
  })

  it('installs and verifies the selected Agency router plugin at a pinned revision', async () => {
    const config = parseAgentConfiguration({ ...base, model: 'nous-default', capabilities: ['plugin:agency-agents-router'] }, 'owner')
    agent37.execInstance.mockResolvedValue({ exit_code: 0 })
    agent37.instanceRequest.mockResolvedValue(new Response(defaultYaml))
    const receipt = await applyRuntimeConfiguration('ab12cd34ef', config)
    const commands = agent37.execInstance.mock.calls.map(([, command]) => String(command)).join('\n')
    expect(commands).toContain("checkout --quiet '6d29a9b08785a0e49ffc9818bbdd381164c2df5f'")
    expect(commands).toContain('install.sh" --tool hermes')
    expect(receipt.capabilities).toContainEqual(expect.objectContaining({ id: 'plugin:agency-agents-router', status: 'installed' }))
  })
})

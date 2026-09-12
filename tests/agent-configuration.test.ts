import { describe, expect, it } from 'vitest'
import { parseAgentConfiguration, IDENTITY_DESTINATIONS } from '../lib/agent-configuration'

const valid = {
  client_request_id: 'launch_request_1234',
  template: 'agent37-hermes',
  agency_agent_slug: 'workflow-architect',
  model: 'nous-default',
  capabilities: ['skill:privy', 'plugin:agency-agents-router'],
  profile: {
    soul: '# Soul\nCareful and direct.',
    user: '# User\nPrefers concise updates.',
    agents: '# Project\nUse evidence gates.',
  },
}

describe('agent configuration validation', () => {
  it('normalizes a valid configuration and produces a stable config id', () => {
    const first = parseAgentConfiguration(valid, 'privy:user_123')
    const second = parseAgentConfiguration({ ...valid, capabilities: [...valid.capabilities].reverse() }, 'privy:user_123')
    expect(first.config_id).toMatch(/^[a-f0-9]{64}$/)
    expect(first.config_id).toBe(second.config_id)
    expect(first.runtime.capability_ids).toEqual(['plugin:agency-agents-router', 'skill:privy'])
  })

  it('changes the config id for a material identity change', () => {
    const first = parseAgentConfiguration(valid, 'privy:user_123')
    const second = parseAgentConfiguration({ ...valid, profile: { ...valid.profile, soul: '# Soul\nDifferent.' } }, 'privy:user_123')
    expect(first.config_id).not.toBe(second.config_id)
  })

  it.each([
    [{ ...valid, agency_agent_slug: '../root' }, 'AGENCY_NOT_APPROVED'],
    [{ ...valid, model: 'arbitrary/model' }, 'MODEL_NOT_APPROVED'],
    [{ ...valid, capabilities: ['https://evil.invalid/plugin'] }, 'CAPABILITY_NOT_APPROVED'],
    [{ ...valid, capabilities: ['skill:ab-testing'] }, 'CAPABILITY_NOT_APPROVED'],
    [{ ...valid, capabilities: Array.from({ length: 17 }, (_, i) => `skill:fake-${i}`) }, 'TOO_MANY_CAPABILITIES'],
    [{ ...valid, profile: { ...valid.profile, soul: 'bad\0text' } }, 'INVALID_PROFILE_TEXT'],
    [{ ...valid, profile: { ...valid.profile, extra: '../secret' } }, 'INVALID_PROFILE'],
  ] as const)('rejects invalid configuration %#', (input, code) => {
    expect(() => parseAgentConfiguration(input, 'privy:user_123')).toThrow(code)
  })

  it('uses fixed server-owned identity destinations', () => {
    expect(IDENTITY_DESTINATIONS).toEqual({
      soul: '/home/node/.hermes/SOUL.md',
      user: '/home/node/.hermes/memories/USER.md',
      agents: '/home/node/.agent37-gateway/workspace/AGENTS.md',
    })
  })
})

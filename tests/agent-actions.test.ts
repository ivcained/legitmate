import { describe, expect, it } from 'vitest'
import { agentActionRequest } from '../lib/agent-actions'

describe('agent lifecycle request routing', () => {
  it.each(['start', 'stop', 'restart', 'update'] as const)('routes %s through the POST action endpoint', (action) => {
    expect(agentActionRequest('inst_123', action, { cpu: 2, memory: 4, disk: 6 })).toEqual({
      url: `/api/agents/instances/inst_123/${action}`,
      init: { method: 'POST', headers: { 'content-type': 'application/json' } },
    })
  })

  it('routes resize with a validated JSON body', () => {
    expect(agentActionRequest('inst_123', 'resize', { cpu: 4, memory: 8, disk: 12 })).toEqual({
      url: '/api/agents/instances/inst_123/resize',
      init: {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cpu: 4, memory: 8, disk: 12 }),
      },
    })
  })

  it('reserves DELETE for deletion', () => {
    expect(agentActionRequest('inst_123', 'delete', { cpu: 2, memory: 4, disk: 6 })).toEqual({
      url: '/api/agents/instances/inst_123',
      init: { method: 'DELETE', headers: { 'content-type': 'application/json' } },
    })
  })
})

export type AgentAction = 'start' | 'stop' | 'restart' | 'resize' | 'delete'
export type AgentResources = { cpu: number; memory: number; disk: number }

export function agentActionRequest(id: string, action: AgentAction, resources: AgentResources): {
  url: string
  init: RequestInit
} {
  const headers = { 'content-type': 'application/json' }
  if (action === 'delete') return { url: `/api/agents/instances/${id}`, init: { method: 'DELETE', headers } }
  return {
    url: `/api/agents/instances/${id}/${action}`,
    init: {
      method: 'POST',
      headers,
      ...(action === 'resize' ? { body: JSON.stringify(resources) } : {}),
    },
  }
}

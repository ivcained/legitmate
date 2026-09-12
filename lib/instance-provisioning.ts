import { Agent37Error, APPROVED_TEMPLATES, cleanName, coalesce, createInstance, listOwnedInstances } from './agent37'
import type { AgentConfigurationV1 } from './agent-configuration'

export const RESOURCE_OPTIONS = {
  cpu: [2, 4, 8],
  memory: [4, 8, 16],
  disk: [2, 4, 6, 8, 12, 16, 24, 32],
} as const

export type ResourceShape = { cpu: number; memory: number; disk: number }

export function parseResourceShape(value: unknown): ResourceShape {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
  const resources = {
    cpu: typeof input.cpu === 'number' ? input.cpu : 2,
    memory: typeof input.memory === 'number' ? input.memory : 4,
    disk: typeof input.disk === 'number' ? input.disk : 6,
  }
  if (!RESOURCE_OPTIONS.cpu.includes(resources.cpu as 2 | 4 | 8) || !RESOURCE_OPTIONS.memory.includes(resources.memory as 4 | 8 | 16) || !RESOURCE_OPTIONS.disk.includes(resources.disk as 2 | 4 | 6 | 8 | 12 | 16 | 24 | 32)) {
    throw new Agent37Error('INVALID_RESOURCES', 400)
  }
  return resources
}

export async function provisionConfiguredInstance(input: {
  scope: string
  template: string
  name?: unknown
  resources: ResourceShape
  configuration: AgentConfigurationV1
}): Promise<{ instance: Record<string, unknown>; replayed: boolean }> {
  if (!APPROVED_TEMPLATES.has(input.template)) throw new Agent37Error('TEMPLATE_NOT_APPROVED', 400)
  const operationKey = `${input.scope}:${input.configuration.client_request_id}`
  return coalesce(operationKey, async () => {
    const payload = await listOwnedInstances(input.scope)
    const items = payload && typeof payload === 'object' && !Array.isArray(payload) && Array.isArray((payload as Record<string, unknown>).data)
      ? (payload as Record<string, unknown>).data as Record<string, unknown>[]
      : []
    const match = items.find((item) => {
      const metadata = item.metadata
      return metadata && typeof metadata === 'object' && !Array.isArray(metadata) && (metadata as Record<string, unknown>).client_request_id === input.configuration.client_request_id
    })
    if (match) {
      const metadata = match.metadata as Record<string, unknown>
      if (metadata.config_id !== input.configuration.config_id) throw new Agent37Error('CLIENT_REQUEST_ID_CONFLICT', 409)
      return { instance: match, replayed: true }
    }
    const instance = await createInstance({
      name: cleanName(input.name),
      user: input.scope,
      template: input.template,
      auto_sleep: true,
      idle_timeout_seconds: 1200,
      cpu: input.resources.cpu,
      memory_gb: input.resources.memory,
      disk_gb: input.resources.disk,
      metadata: {
        client_request_id: input.configuration.client_request_id,
        config_id: input.configuration.config_id,
        agency_agent_slug: input.configuration.agency.slug,
      },
    })
    if (!instance || typeof instance !== 'object' || Array.isArray(instance)) throw new Agent37Error('AGENT37_ERROR', 502)
    return { instance: instance as Record<string, unknown>, replayed: false }
  })
}

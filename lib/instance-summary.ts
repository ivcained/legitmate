export type OwnedInstanceSummary = {
  id: string
  name: string
  status: string
  template: string
  url?: string
  created?: number
  resources?: { cpu?: number; memory?: number; disk?: number }
  specialist?: string
  budget?: { monthly_cap_micros?: number; credit_micros?: number }
}

export function instanceSummary(value: unknown): OwnedInstanceSummary | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const item = value as Record<string, unknown>
  const id = typeof item.id === 'string' ? item.id : ''
  if (!id) return null
  const metadata = item.metadata && typeof item.metadata === 'object' && !Array.isArray(item.metadata) ? item.metadata as Record<string, unknown> : null
  const resources = item.resources && typeof item.resources === 'object' && !Array.isArray(item.resources) ? item.resources as Record<string, unknown> : null
  const budget = item.budget && typeof item.budget === 'object' && !Array.isArray(item.budget) ? item.budget as Record<string, unknown> : null
  return {
    id,
    name: typeof item.name === 'string' && item.name.trim() ? item.name : 'Unnamed specialist',
    status: typeof item.status === 'string' ? item.status : 'unknown',
    template: typeof item.template === 'string' ? item.template : 'unknown',
    ...(typeof item.url === 'string' ? { url: item.url } : {}),
    ...(typeof item.created === 'number' ? { created: item.created } : {}),
    ...(resources ? { resources: { ...(typeof resources.cpu === 'number' ? { cpu: resources.cpu } : {}), ...(typeof resources.memory === 'number' ? { memory: resources.memory } : {}), ...(typeof resources.disk === 'number' ? { disk: resources.disk } : {}) } } : {}),
    ...(typeof metadata?.agency_agent_slug === 'string' ? { specialist: metadata.agency_agent_slug } : {}),
    ...(budget ? { budget: { ...(typeof budget.monthly_cap_micros === 'number' ? { monthly_cap_micros: budget.monthly_cap_micros } : {}), ...(typeof budget.credit_micros === 'number' ? { credit_micros: budget.credit_micros } : {}) } } : {}),
  }
}

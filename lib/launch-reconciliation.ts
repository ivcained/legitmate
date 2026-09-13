type Inputs = {
  clientRequestId: string
  list: () => Promise<unknown>
  readConfiguration: (instanceId: string) => Promise<unknown>
}

export async function reconcileLaunchResult(input: Inputs): Promise<Record<string, unknown>> {
  const payload = await input.list()
  const items = payload && typeof payload === 'object' && !Array.isArray(payload) && Array.isArray((payload as Record<string, unknown>).data)
    ? (payload as { data: Record<string, unknown>[] }).data
    : []
  const instance = items.find((item) => {
    const metadata = item.metadata
    return metadata && typeof metadata === 'object' && !Array.isArray(metadata) && (metadata as Record<string, unknown>).client_request_id === input.clientRequestId
  })
  if (!instance || typeof instance.id !== 'string') return { found: false }
  const configuration = await input.readConfiguration(instance.id)
  if (configuration && typeof configuration === 'object' && !Array.isArray(configuration)) {
    const value = configuration as Record<string, unknown>
    const verification = value.verification as Record<string, unknown> | undefined
    if (value.status === 'applied' && verification?.verified === true) return { found: true, instance, configuration }
  }
  return { found: true, pending: true, instance }
}

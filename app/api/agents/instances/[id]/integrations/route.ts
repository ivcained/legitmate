import { NextRequest } from 'next/server'
import { Agent37Error, cleanId, connectIntegration, errorResponse, listIntegrationConnections, listIntegrationToolkits, readJson, requireOwnedInstance } from '../../../../../../lib/agent37'
import { requirePrincipal } from '../../../../../../lib/auth'

function array(value: unknown, key: string): Record<string, unknown>[] {
  const items = Array.isArray(value)
    ? value
    : value && typeof value === 'object' && !Array.isArray(value) && Array.isArray((value as Record<string, unknown>)[key])
      ? (value as Record<string, unknown>)[key] as unknown[]
      : []
  return items.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item))
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) throw new Agent37Error('INVALID_INSTANCE_ID', 400)
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    const [toolkits, connections] = await Promise.all([listIntegrationToolkits(id), listIntegrationConnections(id)])
    const safeToolkits = array(toolkits, 'data').slice(0, 12).map((value) => { const item=value as Record<string,unknown>; return { slug: String(item.slug??''), name: String(item.name??item.slug??''), description: typeof item.description==='string'?item.description:'', enabled: item.enabled !== false, isNoAuth: item.isNoAuth === true } }).filter((item)=>item.slug&&item.name)
    const safeConnections = array(connections, 'data').map((value) => { const item=value as Record<string,unknown>; return { id: String(item.id??''), toolkitSlug: String(item.toolkitSlug??''), toolkitName: String(item.toolkitName??item.toolkitSlug??''), status: String(item.status??'UNKNOWN') } }).filter((item)=>item.id)
    return Response.json({ ok: true, toolkits: safeToolkits, connections: safeConnections })
  } catch (error) { return errorResponse(error) }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) throw new Agent37Error('INVALID_INSTANCE_ID', 400)
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    const body = await readJson(request)
    const toolkit = typeof body?.toolkit === 'string' && /^[a-z0-9][a-z0-9_-]{1,63}$/.test(body.toolkit) ? body.toolkit : null
    if (!toolkit) throw new Agent37Error('INVALID_INTEGRATION', 400)
    const callbackUrl = `${new URL(request.url).origin}/instances/${encodeURIComponent(id)}#integrations`
    const result = await connectIntegration(id, toolkit, callbackUrl)
    if (!result || typeof result !== 'object' || Array.isArray(result) || typeof (result as Record<string,unknown>).redirectUrl !== 'string') throw new Agent37Error('INTEGRATION_CONNECT_FAILED', 502)
    return Response.json({ ok: true, redirectUrl: (result as Record<string,unknown>).redirectUrl })
  } catch (error) { return errorResponse(error) }
}

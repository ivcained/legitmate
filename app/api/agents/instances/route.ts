import { NextRequest } from 'next/server'
import { APPROVED_TEMPLATES, cleanName, coalesce, createInstance, errorResponse, listOwnedInstances, readJson, requestId } from '../../../../lib/agent37'
import { requirePrincipal } from '../../../../lib/auth'

export async function GET(request: NextRequest) {
  try { const { scope } = await requirePrincipal(request); const payload = await listOwnedInstances(scope)
 return Response.json({ ok: true, data: payload && typeof payload === 'object' && !Array.isArray(payload) ? (payload as Record<string, unknown>).data ?? payload : payload }) } catch (e) { return errorResponse(e) }
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request)
    const template = body?.template
    const resources = body?.resources
    if (typeof template !== 'string' || !APPROVED_TEMPLATES.has(template)) return Response.json({ ok: false, code: 'TEMPLATE_NOT_APPROVED' }, { status: 400 })
    if (resources !== undefined && (!resources || typeof resources !== 'object' || Array.isArray(resources))) return Response.json({ ok: false, code: 'INVALID_RESOURCES' }, { status: 400 })
    const shape = resources as { cpu?: unknown; memory?: unknown; disk?: unknown } | undefined
    if (shape && (shape.cpu !== undefined || shape.memory !== undefined || shape.disk !== undefined)) {
      const cpu = shape.cpu; const memory = shape.memory; const disk = shape.disk
      if (!((cpu === 2 && memory === 4) || (cpu === 4 && memory === 8) || (cpu === 8 && memory === 16))) return Response.json({ ok: false, code: 'INVALID_RESOURCES', message: 'Choose 2/4, 4/8, or 8/16 CPU/RAM.' }, { status: 400 })
      if (typeof disk !== 'number' || !Number.isInteger(disk) || disk < 2 || disk > (cpu === 2 ? 12 : cpu === 4 ? 20 : 40)) return Response.json({ ok: false, code: 'INVALID_RESOURCES' }, { status: 400 })
    }
    const name = cleanName(body?.name)
    const { scope } = await requirePrincipal(request)
    const id = requestId(request, body, scope)
    const result = await coalesce(`${scope}:${id}`, async () => {
      const existingPayload = await listOwnedInstances(scope)
      const items = (existingPayload && typeof existingPayload === 'object' && !Array.isArray(existingPayload) && Array.isArray((existingPayload as Record<string, unknown>).data)) ? (existingPayload as Record<string, unknown>).data as Record<string, unknown>[] : []
      const match = items.find((item) => {
        const metadata = item.metadata
        return metadata && typeof metadata === 'object' && (metadata as Record<string, unknown>).client_request_id === id
      })
      if (match) return { payload: { id: match.id, status: match.status, url: match.url, template }, status: 200 }
      const payload = await createInstance({ user: scope, name, template, resources: resources ?? { cpu: 2, memory: 4, disk: 6 }, metadata: { client_request_id: id, source: 'legitmate', ...(typeof body?.agency_agent_slug === 'string' ? { agency_agent_slug: body.agency_agent_slug } : {}), ...(typeof body?.model === 'string' ? { model: body.model } : {}), ...(Array.isArray(body?.capabilities) ? { capabilities: body.capabilities.slice(0, 100) } : {}) }, auto_sleep: true, idle_timeout_seconds: 900, budget: { monthly_cap_micros: 5000000 } })
      const instance = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
      return { payload: { id: instance.id, status: instance.status, url: instance.url, template }, status: 201 }
    })
    return Response.json({ ok: true, instance: result.payload }, { status: result.status })
  } catch (e) { return errorResponse(e) }
}

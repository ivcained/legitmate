import { NextRequest } from 'next/server'
import { APPROVED_TEMPLATES, cleanName, coalesce, createInstance, errorResponse, listInstances, readJson, requestId, scopedUser } from '../../../../lib/agent37'

export async function GET(request: NextRequest) {
  try { const payload = await listInstances(scopedUser(request))
 return Response.json({ ok: true, data: payload && typeof payload === 'object' && !Array.isArray(payload) ? (payload as Record<string, unknown>).data ?? payload : payload }) } catch (e) { return errorResponse(e) }
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request)
    const template = body?.template
    if (typeof template !== 'string' || !APPROVED_TEMPLATES.has(template)) return Response.json({ ok: false, code: 'TEMPLATE_NOT_APPROVED' }, { status: 400 })
    const name = cleanName(body?.name)
    const scope = scopedUser(request)
    const id = requestId(request, body)
    const result = await coalesce(`${scope}:${id}`, async () => {
      const existing = await listInstances(scope)
      const items = (existing && typeof existing === 'object' && Array.isArray((existing as Record<string, unknown>).data)) ? (existing as Record<string, unknown>).data as Record<string, unknown>[] : []
      const match = items.find((item) => {
        const metadata = item.metadata
        return metadata && typeof metadata === 'object' && (metadata as Record<string, unknown>).client_request_id === id
      })
      if (match) return { payload: { id: match.id, status: match.status, url: match.url, template }, status: 200 }
      const payload = await createInstance({ user: scope, name, template, metadata: { client_request_id: id, source: 'legitmate' }, auto_sleep: true, idle_timeout_seconds: 900, budget: { monthly_cap_micros: 5000000 } })
      const instance = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
      return { payload: { id: instance.id, status: instance.status, url: instance.url, template }, status: 201 }
    })
    return Response.json({ ok: true, instance: result.payload }, { status: result.status })
  } catch (e) { return errorResponse(e) }
}

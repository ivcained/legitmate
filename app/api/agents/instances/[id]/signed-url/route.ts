import { NextRequest } from 'next/server'
import { cleanId, errorResponse, readJson, requireOwnedInstance, signedUrl } from '../../../../../../lib/agent37'
import { requirePrincipal } from '../../../../../../lib/auth'

const APPROVED_PORTS = new Set([3737, 6901, 9119, 8080, 7681])

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    const body = await readJson(request)
    const port = body?.port
    if (typeof port !== 'number' || !Number.isInteger(port) || port < 1 || port > 65535) return Response.json({ ok: false, code: 'INVALID_PORT' }, { status: 400 })
    if (!APPROVED_PORTS.has(port)) return Response.json({ ok: false, code: 'PORT_NOT_ALLOWED' }, { status: 403 })
    const result = await signedUrl(id, port)
    return Response.json({ ok: true, result })
  } catch (e) { return errorResponse(e) }
}

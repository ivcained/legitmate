import { NextRequest } from 'next/server'
import { cleanId, errorResponse, readJson, signedUrl } from '../../../../../../lib/agent37'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    const body = await readJson(request)
    const port = body?.port
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    if (typeof port !== 'number' || !Number.isInteger(port) || port < 1 || port > 65535) return Response.json({ ok: false, code: 'INVALID_PORT' }, { status: 400 })
    const result = await signedUrl(id, port)
    return Response.json({ ok: true, result })
  } catch (e) { return errorResponse(e) }
}

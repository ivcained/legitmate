import { NextRequest } from 'next/server'
import { chat, cleanId, errorResponse, readJson } from '../../../../../../lib/agent37'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    const body = await readJson(request)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    if (!body || typeof body.message !== 'string' || body.message.length === 0 || body.message.length > 16000) return Response.json({ ok: false, code: 'INVALID_MESSAGE' }, { status: 400 })
    const result = await chat(id, { message: body.message })
    return Response.json({ ok: true, result })
  } catch (e) { return errorResponse(e) }
}

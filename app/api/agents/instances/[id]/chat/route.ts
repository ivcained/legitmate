import { NextRequest } from 'next/server'
import { Agent37Error, cleanId, errorResponse, instanceRequest, readJson, requireOwnedInstance } from '../../../../../../lib/agent37'
import { requirePrincipal } from '../../../../../../lib/auth'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    const body = await readJson(request)
    if (!body || typeof body.message !== 'string' || body.message.trim().length === 0 || body.message.length > 16000) return Response.json({ ok: false, code: 'INVALID_MESSAGE' }, { status: 400 })
    const response = await instanceRequest(id, '/v1/responses', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: body.message.trim(), agent: 'hermes', stream: false }),
      signal: AbortSignal.timeout(120_000),
    })
    const payload = await response.json().catch(() => null) as Record<string, unknown> | null
    if (!payload || payload.status !== 'completed' || typeof payload.output_text !== 'string') throw new Agent37Error('CHAT_FAILED', 502)
    return Response.json({ ok: true, result: { id: typeof payload.id === 'string' ? payload.id : null, session_id: typeof payload.session_id === 'string' ? payload.session_id : null, output_text: payload.output_text } })
  } catch (error) { return errorResponse(error) }
}

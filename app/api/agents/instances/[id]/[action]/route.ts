import { NextRequest } from 'next/server'
import { cleanId, errorResponse, LIFECYCLE_ACTIONS, actionInstance, readJson } from '../../../../../../lib/agent37'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string; action: string }> }) {
  try {
    const { id: rawId, action } = await context.params
    const id = cleanId(rawId)
    if (!id || !LIFECYCLE_ACTIONS.has(action)) return Response.json({ ok: false, code: 'ACTION_NOT_ALLOWED' }, { status: 400 })
    const body = action === 'resize' || action === 'update' ? await readJson(request) : undefined
    if ((action === 'resize' || action === 'update') && !body) return Response.json({ ok: false, code: 'INVALID_JSON' }, { status: 400 })
    return Response.json({ ok: true, instance: await actionInstance(id, action, body ?? undefined) })
  } catch (e) { return errorResponse(e) }
}

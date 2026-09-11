import { NextRequest } from 'next/server'
import { cleanId, errorResponse, LIFECYCLE_ACTIONS, actionInstance, readJson, requireOwnedInstance } from '../../../../../../lib/agent37'
import { requirePrincipal } from '../../../../../../lib/auth'

type Context = { params: Promise<{ id: string; action: string }> }

export async function POST(request: NextRequest, context: Context) {
  try {
    const { id: rawId, action } = await context.params
    const id = cleanId(rawId)
    if (!id || !LIFECYCLE_ACTIONS.has(action) || action === 'delete') return Response.json({ ok: false, code: 'ACTION_NOT_ALLOWED' }, { status: 400 })
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    const body = action === 'resize' || action === 'update' ? await readJson(request) : undefined
    if ((action === 'resize' || action === 'update') && !body) return Response.json({ ok: false, code: 'INVALID_JSON' }, { status: 400 })
    return Response.json({ ok: true, instance: await actionInstance(id, action, body ?? undefined) })
  } catch (e) { return errorResponse(e) }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const { id: rawId, action } = await context.params
    const id = cleanId(rawId)
    if (!id || action !== 'delete') return Response.json({ ok: false, code: 'ACTION_NOT_ALLOWED' }, { status: 400 })
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    return Response.json({ ok: true, instance: await actionInstance(id, 'delete') })
  } catch (e) { return errorResponse(e) }
}

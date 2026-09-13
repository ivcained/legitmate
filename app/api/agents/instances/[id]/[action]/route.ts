import { NextRequest } from 'next/server'
import { Agent37Error, cleanId, errorResponse, LIFECYCLE_ACTIONS, actionInstance, readJson, requireOwnedInstance } from '../../../../../../lib/agent37'
import { requirePrincipal } from '../../../../../../lib/auth'
import { parseResourceShape } from '../../../../../../lib/instance-provisioning'
import { instanceSummary } from '../../../../../../lib/instance-summary'

const RESIZE_KEYS = new Set(['cpu', 'memory', 'disk'])

function validatedActionBody(action: string, body: Record<string, unknown> | null) {
  if (action !== 'resize' && action !== 'update') return undefined
  if (!body) throw new Agent37Error('INVALID_JSON', 400)
  if (action === 'update') {
    const keys = Object.keys(body)
    if (keys.some((key) => key !== 'name') || typeof body.name !== 'string' || body.name.trim().length === 0 || body.name.length > 80) throw new Agent37Error('INVALID_UPDATE', 400)
    return { name: body.name.trim() }
  }
  if (Object.keys(body).some((key) => !RESIZE_KEYS.has(key))) throw new Agent37Error('INVALID_RESIZE', 400)
  try { return parseResourceShape(body) } catch { throw new Agent37Error('INVALID_RESIZE', 400) }
}

type Context = { params: Promise<{ id: string; action: string }> }

export async function POST(request: NextRequest, context: Context) {
  try {
    const { id: rawId, action } = await context.params
    const id = cleanId(rawId)
    if (!id || !LIFECYCLE_ACTIONS.has(action) || action === 'delete') return Response.json({ ok: false, code: 'ACTION_NOT_ALLOWED' }, { status: 400 })
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    const rawBody = action === 'resize' || action === 'update' ? await readJson(request) : null
    const body = validatedActionBody(action, rawBody)
    return Response.json({ ok: true, instance: instanceSummary(await actionInstance(id, action, body)) })
  } catch (e) { return errorResponse(e) }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const { id: rawId, action } = await context.params
    const id = cleanId(rawId)
    if (!id || action !== 'delete') return Response.json({ ok: false, code: 'ACTION_NOT_ALLOWED' }, { status: 400 })
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    return Response.json({ ok: true, instance: instanceSummary(await actionInstance(id, 'delete')) })
  } catch (e) { return errorResponse(e) }
}

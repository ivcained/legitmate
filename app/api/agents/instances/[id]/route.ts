import { NextRequest } from 'next/server'
import { actionInstance, cleanId, errorResponse, requireOwnedInstance } from '../../../../../lib/agent37'
import { requirePrincipal } from '../../../../../lib/auth'
import { instanceSummary } from '../../../../../lib/instance-summary'

type Context = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: Context) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    const { scope } = await requirePrincipal(request)
    const instance = await requireOwnedInstance(id, scope)
    return Response.json({ ok: true, instance: instanceSummary(instance) })
  } catch (e) { return errorResponse(e) }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    return Response.json({ ok: true, instance: await actionInstance(id, 'delete') })
  } catch (e) { return errorResponse(e) }
}

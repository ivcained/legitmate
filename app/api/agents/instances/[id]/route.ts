import { NextRequest } from 'next/server'
import { cleanId, errorResponse, getInstance, actionInstance } from '../../../../../lib/agent37'

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: Context) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    return Response.json({ ok: true, instance: await getInstance(id) })
  } catch (e) { return errorResponse(e) }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    return Response.json({ ok: true, instance: await actionInstance(id, 'delete') })
  } catch (e) { return errorResponse(e) }
}

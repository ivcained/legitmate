import { NextRequest } from 'next/server'
import { cleanId, errorResponse, getInstance } from '../../../../../lib/agent37'

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    return Response.json({ ok: true, instance: await getInstance(id) })
  } catch (e) { return errorResponse(e) }
}

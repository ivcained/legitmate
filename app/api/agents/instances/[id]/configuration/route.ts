import { NextRequest } from 'next/server'
import { readAgentConfiguration } from '../../../../../../lib/apply-configuration'
import { cleanId, errorResponse, requireOwnedInstance } from '../../../../../../lib/agent37'
import { requirePrincipal } from '../../../../../../lib/auth'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    const readback = await readAgentConfiguration(id)
    return Response.json({ ok: true, instance: { id }, ...readback })
  } catch (error) { return errorResponse(error) }
}

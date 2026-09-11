import { NextRequest } from 'next/server'
import { cleanId, errorResponse, readJson, requireOwnedInstance, updateBudget } from '../../../../../../lib/agent37'
import { requirePrincipal } from '../../../../../../lib/auth'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    const { scope } = await requirePrincipal(request)
    const instance = await requireOwnedInstance(id, scope)
    const value = instance && typeof instance === 'object' ? (instance as Record<string, unknown>).budget : undefined
    return Response.json({ ok: true, budget: value ?? null })
  } catch (e) { return errorResponse(e) }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    const body = await readJson(request)
    if (!body || typeof body.monthly_cap_micros !== 'number' || !Number.isSafeInteger(body.monthly_cap_micros) || body.monthly_cap_micros < 0 || body.monthly_cap_micros > 1000000000) return Response.json({ ok: false, code: 'INVALID_BUDGET' }, { status: 400 })
    return Response.json({ ok: true, budget: await updateBudget(id, { monthly_cap_micros: body.monthly_cap_micros }) })
  } catch (e) { return errorResponse(e) }
}

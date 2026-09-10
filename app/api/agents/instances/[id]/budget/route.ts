import { NextRequest } from 'next/server'
import { cleanId, errorResponse, getInstance, actionInstance, readJson } from '../../../../../../lib/agent37'

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    const instance = await getInstance(id)
    const value = instance && typeof instance === 'object' ? (instance as Record<string, unknown>).budget : undefined
    return Response.json({ ok: true, budget: value ?? null })
  } catch (e) { return errorResponse(e) }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    const body = await readJson(request)
    if (!id) return Response.json({ ok: false, code: 'INVALID_INSTANCE_ID' }, { status: 400 })
    if (!body || typeof body.monthly_cap_micros !== 'number' || !Number.isSafeInteger(body.monthly_cap_micros) || body.monthly_cap_micros < 0 || body.monthly_cap_micros > 1000000000) return Response.json({ ok: false, code: 'INVALID_BUDGET' }, { status: 400 })
    return Response.json({ ok: true, budget: await actionInstance(id, 'budget', { monthly_cap_micros: body.monthly_cap_micros }) })
  } catch (e) { return errorResponse(e) }
}

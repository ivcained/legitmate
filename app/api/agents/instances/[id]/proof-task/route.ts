import { createHash, randomUUID } from 'node:crypto'
import { NextRequest } from 'next/server'
import { readAgentConfiguration } from '../../../../../../lib/apply-configuration'
import { Agent37Error, cleanId, errorResponse, instanceRequest, readJson, requireOwnedInstance } from '../../../../../../lib/agent37'
import { requirePrincipal } from '../../../../../../lib/auth'

const FIXED_PROMPT = 'Reply with exactly LEGITMATE_DEMO_OK. Do not browse, call tools, open files, change state, or include any other text.'
const MAX_COMPLETED = 256
const COMPLETED_TTL_MS = 60 * 60 * 1000
const RATE_WINDOW_MS = 60 * 60 * 1000
const MAX_RUNS_PER_WINDOW = 3
const completed = new Map<string, { result: Record<string, unknown>; expiresAt: number }>()
const inflight = new Map<string, Promise<Record<string, unknown>>>()
const acceptedRuns = new Map<string, number[]>()

function prune(now = Date.now()) {
  for (const [key, value] of completed) if (value.expiresAt <= now) completed.delete(key)
  while (completed.size > MAX_COMPLETED) completed.delete(completed.keys().next().value!)
  for (const [key, values] of acceptedRuns) {
    const live = values.filter((at) => now - at < RATE_WINDOW_MS)
    if (live.length) acceptedRuns.set(key, live); else acceptedRuns.delete(key)
  }
}

function keyFor(subject: string, instanceId: string, configId: string, idempotencyKey: string) {
  return createHash('sha256').update(`${subject}:${instanceId}:${configId}:${idempotencyKey}`).digest('hex')
}

function outputText(payload: Record<string, unknown>) {
  if (typeof payload.output_text === 'string') return payload.output_text
  const output = payload.output
  if (!Array.isArray(output)) return ''
  return output.flatMap((item) => item && typeof item === 'object' && Array.isArray((item as Record<string, unknown>).content) ? (item as Record<string, unknown>).content as Array<Record<string, unknown>> : []).map((item) => typeof item.text === 'string' ? item.text : '').join('')
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) throw new Agent37Error('INVALID_INSTANCE_ID', 400)
    const principal = await requirePrincipal(request)
    await requireOwnedInstance(id, principal.scope)
    const readback = await readAgentConfiguration(id)
    if (readback.status !== 'applied' || !readback.verification.verified) throw new Agent37Error('CONFIG_NOT_APPLIED', 409)
    const body = await readJson(request)
    const idempotencyKey = body?.idempotency_key
    if (typeof idempotencyKey !== 'string' || !/^[A-Za-z0-9_-]{16,128}$/.test(idempotencyKey) || Object.keys(body ?? {}).some((field) => field !== 'idempotency_key')) throw new Agent37Error('INVALID_PROOF_REQUEST', 400)
    const key = keyFor(principal.subject, id, readback.receipt.config_id, idempotencyKey)
    const now = Date.now()
    prune(now)
    const prior = completed.get(key)
    if (prior) return Response.json({ ok: true, ...prior.result, replayed: true })
    const current = inflight.get(key)
    if (current) return Response.json({ ok: true, ...(await current), replayed: true })
    const rateKey = `${principal.subject}:${id}`
    const history = acceptedRuns.get(rateKey) ?? []
    if (history.length >= MAX_RUNS_PER_WINDOW) throw new Agent37Error('RATE_LIMITED', 429)
    acceptedRuns.set(rateKey, [...history, now])
    const task = (async () => {
      const response = await instanceRequest(id, '/v1/responses', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: FIXED_PROMPT, tools: [], tool_choice: 'none' }),
        signal: AbortSignal.timeout(15000),
      })
      const payload = await response.json().catch(() => null) as Record<string, unknown> | null
      if (!payload || payload.status !== 'completed' || outputText(payload) !== 'LEGITMATE_DEMO_OK') throw new Agent37Error('PROOF_FAILED', 502)
      const result = { execution_id: randomUUID(), instance_id: id, configuration_id: readback.receipt.config_id, upstream_response_id: typeof payload.id === 'string' ? payload.id : null, status: 'succeeded', output_text: 'LEGITMATE_DEMO_OK' }
      completed.set(key, { result, expiresAt: Date.now() + COMPLETED_TTL_MS })
      return result
    })().finally(() => inflight.delete(key))
    inflight.set(key, task)
    return Response.json({ ok: true, ...(await task), replayed: false })
  } catch (error) { return errorResponse(error) }
}

import { NextRequest } from 'next/server'

const AGENT37_BASE = 'https://api.agent37.com/v1'
const APPROVED_TEMPLATES = new Set(['agent37-hermes', 'legitmate-youtube', 'legitmate-business-operator', 'legitmate-whatsapp-concierge', 'cloud-computai'])

export async function POST(request: NextRequest) {
  const key = process.env.AGENT37_API_KEY?.trim()
  if (!key) return Response.json({ ok: false, code: 'AGENT37_NOT_CONFIGURED', message: 'Instance provisioning is not configured yet.' }, { status: 503 })
  const body = await request.json().catch(() => null) as { template?: unknown; name?: unknown } | null
  const template = typeof body?.template === 'string' ? body.template : ''
  const name = typeof body?.name === 'string' ? body.name.slice(0, 80) : 'LegitMate Hermes assistant'
  if (!APPROVED_TEMPLATES.has(template)) return Response.json({ ok: false, code: 'TEMPLATE_NOT_APPROVED' }, { status: 400 })
  const upstream = await fetch(`${AGENT37_BASE}/instances`, { method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' }, body: JSON.stringify({ template, name, auto_sleep: true, idle_timeout_seconds: 900, budget: { monthly_cap_micros: 5000000 } }), cache: 'no-store' }).catch(() => null)
  if (!upstream) return Response.json({ ok: false, code: 'AGENT37_UNREACHABLE' }, { status: 502 })
  const payload = await upstream.json().catch(() => null)
  if (!upstream.ok) return Response.json({ ok: false, code: 'AGENT37_ERROR', message: 'Agent provisioning failed.' }, { status: 502 })
  const instance = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
  return Response.json({ ok: true, instance: { id: instance.id, status: instance.status, url: instance.url, template, simulated: false } }, { status: 201 })
}

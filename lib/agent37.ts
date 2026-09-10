import { createHash } from 'node:crypto'

export const AGENT37_BASE = (process.env.AGENT37_API_BASE ?? 'https://api.agent37.com/v1').replace(/\/$/, '')
export const APPROVED_TEMPLATES = new Set([
  'agent37-hermes',
  'legitmate-youtube',
  'legitmate-business-operator',
  'legitmate-whatsapp-concierge',
  'cloud-computai',
])
export const LIFECYCLE_ACTIONS = new Set(['start', 'stop', 'restart', 'resize', 'update'])
const MAX_BODY_BYTES = 64 * 1024

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null

export class Agent37Error extends Error {
  constructor(public code: string, public status = 502) { super(code) }
}

export function userId(request: Request): string {
  const value = request.headers.get('x-legitmate-user-id') ?? request.headers.get('x-user-id')
  if (!value || !/^[a-zA-Z0-9:_-]{1,128}$/.test(value)) return 'anonymous'
  return value
}

export function scopedUser(request: Request): string { return `legitmate:${userId(request)}` }

export function cleanId(value: unknown): string | null {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(value) ? value : null
}

export function cleanName(value: unknown, fallback = 'LegitMate Hermes assistant'): string {
  return typeof value === 'string' ? value.trim().slice(0, 80) || fallback : fallback
}

export function requestId(request: Request, body: Record<string, unknown> | null): string {
  const supplied = request.headers.get('x-client-request-id') ?? body?.client_request_id
  if (typeof supplied === 'string' && /^[A-Za-z0-9._:-]{8,128}$/.test(supplied)) return supplied
  return createHash('sha256').update(`${userId(request)}:${JSON.stringify(body ?? {})}`).digest('hex')
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get('content-length') ?? 0)
  if (length > MAX_BODY_BYTES) throw new Agent37Error('PAYLOAD_TOO_LARGE', 413)
  const value = await request.json().catch(() => null)
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}

async function upstream(path: string, init: RequestInit = {}): Promise<Json> {
  const key = process.env.AGENT37_API_KEY?.trim()
  if (!key) throw new Agent37Error('AGENT37_NOT_CONFIGURED', 503)
  let response: Response
  try {
    response = await fetch(`${AGENT37_BASE}${path}`, {
      ...init,
      headers: { authorization: `Bearer ${key}`, accept: 'application/json', ...(init.body ? { 'content-type': 'application/json' } : {}), ...init.headers },
      cache: 'no-store',
    })
  } catch { throw new Agent37Error('AGENT37_UNREACHABLE', 502) }
  const payload = await response.json().catch(() => null) as Json
  if (!response.ok) throw new Agent37Error('AGENT37_ERROR', response.status >= 400 && response.status < 500 ? response.status : 502)
  return payload
}

export function listInstances(scope: string) { return upstream(`/instances?user=${encodeURIComponent(scope)}`) }
export function getInstance(id: string) { return upstream(`/instances/${encodeURIComponent(id)}`) }
export function createInstance(body: Record<string, unknown>) { return upstream('/instances', { method: 'POST', body: JSON.stringify(body) }) }
export function actionInstance(id: string, action: string, body?: Record<string, unknown>) { return upstream(`/instances/${encodeURIComponent(id)}/${action}`, { method: 'POST', body: body ? JSON.stringify(body) : undefined }) }
export function updateBudget(id: string, body: Record<string, unknown>) { return upstream(`/instances/${encodeURIComponent(id)}/budget`, { method: 'PATCH', body: JSON.stringify(body) }) }
export function signedUrl(id: string, port: number) { return upstream(`/instances/${encodeURIComponent(id)}/signed-url`, { method: 'POST', body: JSON.stringify({ port }) }) }
export function chat(id: string, body: Record<string, unknown>) { return upstream(`/instances/${encodeURIComponent(id)}/chat`, { method: 'POST', body: JSON.stringify(body) }) }

export function errorResponse(error: unknown) {
  const e = error instanceof Agent37Error ? error : new Agent37Error('AGENT37_ERROR')
  const messages: Record<string, string> = { AGENT37_NOT_CONFIGURED: 'Instance provisioning is not configured yet.', PAYLOAD_TOO_LARGE: 'Request is too large.' }
  return Response.json({ ok: false, code: e.code, message: messages[e.code] ?? 'Agent service request failed.' }, { status: e.status })
}

// Best-effort process-local coalescing; the client request ID also reconciles after a restart.
const inflight = new Map<string, Promise<unknown>>()
export function coalesce<T>(key: string, operation: () => Promise<T>): Promise<T> {
  const current = inflight.get(key)
  if (current) return current as Promise<T>
  const task = operation().finally(() => inflight.delete(key))
  inflight.set(key, task)
  return task
}

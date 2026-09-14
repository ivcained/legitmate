import { createHash } from 'node:crypto'

const API_BASE = 'https://api.agent37.com/v1'
export const APPROVED_TEMPLATES = new Set([
  'agent37-hermes',
  'legitmate-youtube',
  'legitmate-business-operator',
  'legitmate-whatsapp-concierge',
  'cloud-computai',
])
export const LIFECYCLE_ACTIONS = new Set(['start', 'stop', 'restart', 'resize', 'update', 'delete'])
const MAX_BODY_BYTES = 64 * 1024

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null

export class Agent37Error extends Error {
  constructor(public code: string, public status = 502) { super(code) }
}

export function cleanId(value: unknown): string | null {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(value) ? value : null
}

export function cleanName(value: unknown, fallback = 'LegitMate Hermes assistant'): string {
  return typeof value === 'string' ? value.trim().slice(0, 80) || fallback : fallback
}

export function requestId(request: Request, body: Record<string, unknown> | null, trustedSubject = 'server'): string {
  const supplied = request.headers.get('x-client-request-id') ?? body?.client_request_id
  if (typeof supplied === 'string' && /^[A-Za-z0-9._:-]{8,128}$/.test(supplied)) return supplied
  return createHash('sha256').update(`${trustedSubject}:${JSON.stringify(body ?? {})}`).digest('hex')
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
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { authorization: `Bearer ${key}`, accept: 'application/json', ...(init.body ? { 'content-type': 'application/json' } : {}), ...init.headers },
      cache: 'no-store',
    })
  } catch { throw new Agent37Error('AGENT37_UNREACHABLE', 502) }
  const payload = await response.json().catch(() => null) as Json
  if (!response.ok) throw new Agent37Error('AGENT37_ERROR', response.status >= 400 && response.status < 500 ? response.status : 502)
  return payload
}

export async function instanceRequest(id: string, path: string, init: RequestInit = {}): Promise<Response> {
  const key = process.env.AGENT37_API_KEY?.trim()
  if (!key) throw new Agent37Error('AGENT37_NOT_CONFIGURED', 503)
  let response: Response
  try {
    response = await fetch(`https://${encodeURIComponent(id)}.agent37.app${path}`, {
      ...init,
      headers: { 'X-Agent37-Key': key, ...init.headers },
      cache: 'no-store',
    })
  } catch { throw new Agent37Error('AGENT37_UNREACHABLE', 502) }
  if (!response.ok) throw new Agent37Error('AGENT37_ERROR', response.status >= 400 && response.status < 500 ? response.status : 502)
  return response
}

export function listInstances(scope: string) { return upstream(`/instances?user=${encodeURIComponent(scope)}`) }
export async function listOwnedInstances(scope: string) {
  const payload = await listInstances(scope)
  const record = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload as Record<string, unknown> : null
  const data = Array.isArray(record?.data) ? record.data : Array.isArray(payload) ? payload : []
  const owned = data.filter((item) => item && typeof item === 'object' && !Array.isArray(item) && (item as Record<string, unknown>).user === scope)
  return record ? { ...record, data: owned } : owned
}
export function getInstance(id: string) { return upstream(`/instances/${encodeURIComponent(id)}`) }
export async function requireOwnedInstance(id: string, scope: string) {
  try {
    const instance = await getInstance(id)
    if (!instance || typeof instance !== 'object' || Array.isArray(instance) || (instance as Record<string, unknown>).user !== scope) {
      throw new Agent37Error('INSTANCE_NOT_FOUND', 404)
    }
    return instance as Record<string, unknown>
  } catch {
    throw new Agent37Error('INSTANCE_NOT_FOUND', 404)
  }
}
export async function createInstance(body: Record<string, unknown>) {
  const payload = await upstream('/instances', { method: 'POST', body: JSON.stringify(body) })
  const instance = payload && typeof payload === 'object' && !Array.isArray(payload) && 'instance' in payload
    ? (payload as { instance?: unknown }).instance
    : payload
  if (!instance || typeof instance !== 'object' || Array.isArray(instance) || typeof (instance as Record<string, unknown>).id !== 'string') throw new Agent37Error('AGENT37_INVALID_RESPONSE', 502)
  return instance as Record<string, unknown>
}
export function execInstance(id: string, command: string) { return upstream(`/instances/${encodeURIComponent(id)}/exec`, { method: 'POST', body: JSON.stringify({ command }) }) }
export function deleteInstance(id: string) { return upstream(`/instances/${encodeURIComponent(id)}`, { method: 'DELETE' }) }
export function actionInstance(id: string, action: string, body?: Record<string, unknown>) { return upstream(`/instances/${encodeURIComponent(id)}/${action}`, { method: 'POST', body: body ? JSON.stringify(body) : undefined }) }
export function updateBudget(id: string, body: Record<string, unknown>) { return upstream(`/instances/${encodeURIComponent(id)}/budget`, { method: 'PATCH', body: JSON.stringify(body) }) }
export function signedUrl(id: string, port: number, ttlSeconds = 300) { return upstream(`/instances/${encodeURIComponent(id)}/signed-url`, { method: 'POST', body: JSON.stringify({ port, ttl_seconds: ttlSeconds }) }) }
export function chat(id: string, body: Record<string, unknown>) { return upstream(`/instances/${encodeURIComponent(id)}/chat`, { method: 'POST', body: JSON.stringify(body) }) }
export function listIntegrationToolkits(id: string) { return upstream(`/instances/${encodeURIComponent(id)}/integrations/toolkits?limit=12`) }
export function listIntegrationConnections(id: string) { return upstream(`/instances/${encodeURIComponent(id)}/integrations/connections`) }
export function connectIntegration(id: string, toolkit: string, callbackUrl: string) { return upstream(`/instances/${encodeURIComponent(id)}/integrations/connect`, { method: 'POST', body: JSON.stringify({ toolkit, callbackUrl }) }) }

export function errorResponse(error: unknown) {
  const e = error instanceof Agent37Error ? error : new Agent37Error('AGENT37_ERROR')
  const messages: Record<string, string> = {
    AGENT37_NOT_CONFIGURED: 'Instance provisioning is not configured yet.',
    PAYLOAD_TOO_LARGE: 'Request is too large.',
    AGENT37_UNREACHABLE: 'Agent37 could not be reached. LegitMate will check whether a workspace was created before another request is sent.',
    AGENT37_ERROR: 'Agent37 could not complete the workspace request. LegitMate will check for an existing workspace before retrying.',
    AGENT37_INVALID_RESPONSE: 'Agent37 returned an invalid workspace response. Check My instances before retrying.',
    AGENT_NOT_READY: 'The workspace was created, but Hermes did not become ready in time. Open My instances to inspect it before retrying.',
    AUTH_NOT_CONFIGURED: 'Secure server authentication is not configured.',
    AUTH_REQUIRED: 'Sign in before managing an instance.',
    INVALID_AUTH_TOKEN: 'Your session is invalid or expired.',
    INSTANCE_NOT_FOUND: 'Instance not found.',
    SURPLUS_NOT_CONFIGURED: 'Surplus is not configured for deployment yet. Choose the default model or ask an operator to add a revocable Surplus proxy.',
    CAPABILITY_NOT_INSTALLABLE: 'That capability does not have a verified Agent37 installer yet.',
    CAPABILITY_INSTALL_FAILED: 'The selected capability could not be installed and verified on the workspace.',
    CAPABILITY_VERIFICATION_FAILED: 'The selected capability was installed, but its workspace verification failed. Retry to resume configuration safely.',
    RUNTIME_CONFIG_FAILED: 'The selected model configuration could not be written.',
    RUNTIME_CONFIG_VERIFICATION_FAILED: 'The selected model configuration could not be verified.',
  }
  const status = e.status === 502 ? 424 : e.status
  return Response.json({ ok: false, code: e.code, message: messages[e.code] ?? 'Agent service request failed.' }, { status })
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

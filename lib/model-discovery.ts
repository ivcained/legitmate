import { Agent37Error } from './agent37'

export type ModelChoice = { id: string; label: string; provider: 'default' | 'surplus' }

const DEFAULT_MODELS: ModelChoice[] = [
  { id: 'nous-default', label: 'Balanced — recommended', provider: 'default' },
  { id: 'nous-reasoning', label: 'Deep reasoning', provider: 'default' },
]
const MODEL_ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,159}$/
let cached: { source: string; until: number; models: ModelChoice[] } | null = null

function surplusUrl() {
  const raw = process.env.SURPLUS_BASE_URL?.trim()
  if (!raw) return null
  let url: URL
  try { url = new URL(raw) } catch { throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503) }
  if (url.protocol !== 'https:' || url.username || url.password || url.hostname === 'localhost' || url.hostname.endsWith('.local')) throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503)
  return `${url.toString().replace(/\/$/, '').replace(/\/v1$/, '')}/v1/models`
}

function fallbackModels(): ModelChoice[] {
  return (process.env.SURPLUS_FALLBACK_MODELS ?? '').split(',').map((id) => id.trim()).filter((id) => MODEL_ID.test(id)).map((id) => ({ id: `surplus/${id}`, label: id, provider: 'surplus' as const }))
}

export async function discoverModels(): Promise<{ models: ModelChoice[]; surplus: 'live' | 'fallback' | 'unavailable' }> {
  const now = Date.now()
  const url = surplusUrl()
  if (cached && cached.source === (url ?? '') && cached.until > now) return { models: cached.models, surplus: cached.models.some((model) => model.provider === 'surplus') ? 'live' : 'unavailable' }
  if (!url) return { models: [...DEFAULT_MODELS, ...fallbackModels()], surplus: fallbackModels().length ? 'fallback' : 'unavailable' }
  try {
    const response = await fetch(url, { headers: { accept: 'application/json', ...(process.env.SURPLUS_API_KEY ? { authorization: 'Bearer ' + process.env.SURPLUS_API_KEY } : {}) }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(5000) })
    if (!response.ok) throw new Error('discovery failed')
    const payload = await response.json() as { data?: Array<{ id?: unknown }> }
    const surplus = [...new Set((payload.data ?? []).map((item) => item.id).filter((id): id is string => typeof id === 'string' && MODEL_ID.test(id)))].slice(0, 100).map((id) => ({ id: `surplus/${id}`, label: id, provider: 'surplus' as const }))
    const models = [...DEFAULT_MODELS, ...(surplus.length ? surplus : fallbackModels())]
    cached = { source: url, until: now + 5 * 60 * 1000, models }
    return { models, surplus: surplus.length ? 'live' : fallbackModels().length ? 'fallback' : 'unavailable' }
  } catch {
    const models = [...DEFAULT_MODELS, ...fallbackModels()]
    return { models, surplus: fallbackModels().length ? 'fallback' : 'unavailable' }
  }
}

export function defaultModels() { return DEFAULT_MODELS }

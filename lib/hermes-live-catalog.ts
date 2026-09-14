export type CatalogKind = 'skill' | 'plugin'
export type CatalogItem = {
  id: string
  kind: CatalogKind
  name: string
  description: string
  source: string
  trust: string
  installable: boolean
  reason?: string
  requiresEnv?: string[]
  revision?: string
}

type Cache = { until: number; items: CatalogItem[] }
const SKILLS_URL = 'https://hermes-agent.nousresearch.com/docs/api/skills-index.json'
const PLUGINS_URL = 'https://hermes-agent.nousresearch.com/docs/api/plugin-catalog.json'
const TTL_MS = 15 * 60 * 1000
const MAX_CATALOG_BYTES = 64 * 1024 * 1024
const MAX_SELECTED_CAPABILITIES = 16
let cache: Cache | null = null

const SKILL_ID = /^[A-Za-z0-9][A-Za-z0-9._/@:()\-]{0,400}$/
const PLUGIN_ID = /^[a-z0-9][a-z0-9._-]{1,127}$/

function text(value: unknown, max = 500) { return typeof value === 'string' ? value.trim().slice(0, max) : '' }
function strings(value: unknown) { return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').map((item) => item.slice(0, 120)) : [] }

async function json(url: string, fetchImpl: typeof fetch) {
  const response = await fetchImpl(url, { headers: { accept: 'application/json', 'accept-encoding': 'gzip, deflate' }, cache: 'no-store', signal: AbortSignal.timeout(15_000) })
  if (!response.ok) throw new Error('CATALOG_UPSTREAM_FAILED')
  const length = Number(response.headers.get('content-length') ?? 0)
  if (length > MAX_CATALOG_BYTES) throw new Error('CATALOG_TOO_LARGE')
  const raw = await response.text()
  if (Buffer.byteLength(raw) > MAX_CATALOG_BYTES) throw new Error('CATALOG_TOO_LARGE')
  return JSON.parse(raw) as Record<string, unknown>
}

function skillItems(payload: Record<string, unknown>): CatalogItem[] {
  if (!Array.isArray(payload.skills)) throw new Error('CATALOG_INVALID')
  const items = payload.skills.flatMap((raw) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return []
    const item = raw as Record<string, unknown>
    const identifier = text(item.identifier, 400)
    if (!SKILL_ID.test(identifier)) return []
    const platforms = strings(item.platforms).map((value) => value.toLowerCase())
    const compatible = !platforms.length || platforms.includes('linux')
    const installable = compatible && identifier.startsWith('official/') && !item.required_environment_variables && !item.required_credential_files
    return [{ id: `skill:${identifier}`, kind: 'skill' as const, name: text(item.name, 120) || identifier.split('/').at(-1)!, description: text(item.description), source: text(item.source, 80) || identifier.split('/')[0], trust: text(item.trust_level, 40) || 'community', installable, reason: !compatible ? `Requires ${platforms.join(', ')}` : !identifier.startsWith('official/') ? 'Browse-only: this skill source is not pinned by the Hermes catalog' : item.required_environment_variables || item.required_credential_files ? 'Requires credentials that must be configured inside the workspace' : undefined }]
  })
  const dropped = payload.skills.length - items.length
  if (dropped > Math.max(100, Math.floor(payload.skills.length * 0.01))) throw new Error('CATALOG_SCHEMA_DRIFT')
  return items
}

function pluginItems(payload: Record<string, unknown>): CatalogItem[] {
  if (!Array.isArray(payload.entries)) throw new Error('CATALOG_INVALID')
  const removed = new Set(Array.isArray(payload.removed) ? payload.removed.flatMap((value) => value && typeof value === 'object' && !Array.isArray(value) ? [text((value as Record<string, unknown>).name, 128)] : []) : [])
  return payload.entries.flatMap((raw) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return []
    const item = raw as Record<string, unknown>
    const name = text(item.name, 128)
    if (!PLUGIN_ID.test(name) || removed.has(name)) return []
    const platforms = strings(item.platforms).map((value) => value.toLowerCase())
    const explicitPlatforms = platforms.length > 0
    const compatible = explicitPlatforms && platforms.includes('linux')
    const revision = text(item.sha, 40)
    const pinned = /^[a-f0-9]{40}$/.test(revision)
    const repo = text(item.repo, 200)
    const sourceSafe = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/.test(repo)
    const requiresEnv = strings((item.capabilities as Record<string, unknown> | undefined)?.requires_env)
    return [{ id: `plugin:${name}`, kind: 'plugin' as const, name, description: text(item.description), source: repo, trust: text(item.tier, 40) || 'community', installable: compatible && pinned && sourceSafe && requiresEnv.length === 0, reason: !explicitPlatforms ? 'Platform compatibility is not declared' : !compatible ? `Requires ${platforms.join(', ')}` : !pinned ? 'Catalog entry is not pinned' : !sourceSafe ? 'Catalog source is not approved' : requiresEnv.length ? `Requires server credentials: ${requiresEnv.join(', ')}` : undefined, requiresEnv, revision: pinned ? revision : undefined }]
  })
}

export async function loadHermesCatalog(options: { force?: boolean; fetchImpl?: typeof fetch } = {}): Promise<CatalogItem[]> {
  if (!options.force && cache && cache.until > Date.now()) return cache.items
  const fetchImpl = options.fetchImpl ?? fetch
  const [skills, plugins] = await Promise.all([json(SKILLS_URL, fetchImpl), json(PLUGINS_URL, fetchImpl)])
  const items = [...skillItems(skills), ...pluginItems(plugins)]
  cache = { until: Date.now() + TTL_MS, items }
  return items
}

export async function queryHermesCatalog(input: { kind?: string; query?: string; page?: number; size?: number }, fetchImpl?: typeof fetch) {
  const kind = input.kind === 'skill' || input.kind === 'plugin' ? input.kind : undefined
  const query = (input.query ?? '').trim().toLowerCase().slice(0, 120)
  const requestedPage = Number(input.page ?? 1)
  const requestedSize = Number(input.size ?? 24)
  const page = Number.isFinite(requestedPage) ? Math.max(1, Math.floor(requestedPage)) : 1
  const size = Number.isFinite(requestedSize) ? Math.max(1, Math.min(100, Math.floor(requestedSize))) : 24
  const all = await loadHermesCatalog({ fetchImpl })
  const filtered = all.filter((item) => (!kind || item.kind === kind) && (!query || `${item.name} ${item.description} ${item.source}`.toLowerCase().includes(query)))
  const start = (page - 1) * size
  return { items: filtered.slice(start, start + size), total: filtered.length, page, size, totalPages: Math.max(1, Math.ceil(filtered.length / size)), counts: { skills: all.filter((item) => item.kind === 'skill').length, plugins: all.filter((item) => item.kind === 'plugin').length } }
}

export async function resolveHermesCapabilities(ids: string[], fetchImpl?: typeof fetch) {
  if (!Array.isArray(ids) || ids.length > MAX_SELECTED_CAPABILITIES || new Set(ids).size !== ids.length) throw new Error('INVALID_CAPABILITIES')
  const catalog = await loadHermesCatalog({ fetchImpl })
  const byId = new Map(catalog.map((item) => [item.id, item]))
  return ids.map((id) => {
    const item = byId.get(id)
    if (!item || !item.installable) throw new Error('CAPABILITY_NOT_INSTALLABLE')
    return item
  })
}

export const HERMES_CATALOG_URLS = { skills: SKILLS_URL, plugins: PLUGINS_URL } as const

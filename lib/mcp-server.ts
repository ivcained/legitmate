import { AGENCY_AGENTS } from './agency-agents'
import { queryHermesCatalog } from './hermes-live-catalog'

const PROTOCOL_VERSION = '2025-06-18'
const MAX_BODY_BYTES = 32 * 1024

const tools = [
  {
    name: 'get_service_status',
    title: 'Get LegitMate service status',
    description: 'Return public LegitMate service status and discovery URLs.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false, consequentialHint: false },
  },
  {
    name: 'search_capabilities',
    title: 'Search Hermes capabilities',
    description: 'Search the normalized public Hermes skills and plugin catalog.',
    inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 120 }, kind: { type: 'string', enum: ['skill', 'plugin'] }, page: { type: 'integer', minimum: 1 }, size: { type: 'integer', minimum: 1, maximum: 20 } }, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: true, consequentialHint: false },
  },
  {
    name: 'search_specialists',
    title: 'Search Agency specialists',
    description: 'Search LegitMate’s public Agency specialist roster by name, division, description, or working style.',
    inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 120 }, limit: { type: 'integer', minimum: 1, maximum: 20 } }, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false, consequentialHint: false },
  },
] as const

function response(id: unknown, result?: unknown, error?: { code: number; message: string }, status = 200) {
  return Response.json(error ? { jsonrpc: '2.0', id: id ?? null, error } : { jsonrpc: '2.0', id: id ?? null, result }, {
    status,
    headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
  })
}

function textResult(value: unknown) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }], structuredContent: value }
}

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function boundedString(value: unknown, max = 120) { return typeof value === 'string' ? value.trim().slice(0, max) : '' }
function boundedInteger(value: unknown, fallback: number, max: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.max(1, Math.min(max, Math.floor(parsed))) : fallback
}

async function callTool(name: unknown, args: Record<string, unknown>) {
  if (name === 'get_service_status') return textResult({ ok: true, service: 'legitmate', mode: 'public-discovery', apiCatalog: 'https://mate.legitclub.com/.well-known/api-catalog', openapi: 'https://mate.legitclub.com/openapi.json' })
  if (name === 'search_capabilities') {
    const kind = args.kind === 'skill' || args.kind === 'plugin' ? args.kind : undefined
    const result = await queryHermesCatalog({ query: boundedString(args.query), kind, page: boundedInteger(args.page, 1, 100_000), size: boundedInteger(args.size, 10, 20) })
    return textResult(result)
  }
  if (name === 'search_specialists') {
    const query = boundedString(args.query).toLowerCase()
    const limit = boundedInteger(args.limit, 10, 20)
    const specialists = AGENCY_AGENTS
      .filter((agent) => !query || `${agent.name} ${agent.division} ${agent.description} ${agent.vibe}`.toLowerCase().includes(query))
      .slice(0, limit)
      .map(({ slug, name: displayName, division, description, vibe }) => ({ slug, name: displayName, division, description, vibe }))
    return textResult({ total: specialists.length, specialists })
  }
  throw new Error('UNKNOWN_TOOL')
}

export async function handleMcpRequest(request: Request) {
  if (request.method === 'GET') return Response.json({ name: 'LegitMate Discovery', protocolVersion: PROTOCOL_VERSION, transport: 'streamable-http', tools: tools.map((tool) => tool.name) }, { headers: { 'Access-Control-Allow-Origin': '*' } })
  if (request.method !== 'POST') return response(null, undefined, { code: -32600, message: 'Only GET and POST are supported' }, 405)
  const length = Number(request.headers.get('content-length') ?? 0)
  if (length > MAX_BODY_BYTES) return response(null, undefined, { code: -32600, message: 'Request body is too large' }, 413)
  let body: Record<string, unknown>
  try { body = object(await request.json()) } catch { return response(null, undefined, { code: -32700, message: 'Parse error' }, 400) }
  const id = body.id
  try {
    if (body.jsonrpc !== '2.0' || typeof body.method !== 'string') return response(id, undefined, { code: -32600, message: 'Invalid Request' }, 400)
    if (body.method === 'initialize') return response(id, { protocolVersion: PROTOCOL_VERSION, capabilities: { tools: { listChanged: false } }, serverInfo: { name: 'LegitMate Discovery', version: '1.0.0' } })
    if (body.method === 'notifications/initialized') return new Response(null, { status: 202 })
    if (body.method === 'ping') return response(id, {})
    if (body.method === 'tools/list') return response(id, { tools })
    if (body.method === 'tools/call') {
      const params = object(body.params)
      if (typeof params.name !== 'string') return response(id, undefined, { code: -32602, message: 'Tool name is required' }, 400)
      return response(id, await callTool(params.name, object(params.arguments)))
    }
    return response(id, undefined, { code: -32601, message: 'Method not found' }, 404)
  } catch (error) {
    if (error instanceof Error && error.message === 'UNKNOWN_TOOL') return response(id, undefined, { code: -32602, message: 'Unknown tool' }, 400)
    return response(id, undefined, { code: -32603, message: 'Internal error' }, 500)
  }
}

const GRAPH_GATEWAY = 'https://gateway.thegraph.com/api'
const DEFAULT_QUERY = `query LegitMateResearch { _meta { block { number hash } deployment } }`

type GraphErrorCode = 'NOT_CONFIGURED' | 'UPSTREAM'

export class GraphProviderError extends Error {
  readonly code: GraphErrorCode
  readonly status: number

  constructor(code: GraphErrorCode, message: string, status: number) {
    super(message)
    this.name = 'GraphProviderError'
    this.code = code
    this.status = status
  }
}

export type GraphResearchResult = { data: Record<string, unknown> }

function serverConfig() {
  const apiKey = process.env.GRAPH_API_KEY?.trim()
  const subgraphId = process.env.GRAPH_SUBGRAPH_ID?.trim()
  if (!apiKey || !subgraphId) {
    throw new GraphProviderError('NOT_CONFIGURED', 'The Graph provider is not configured on the server.', 503)
  }
  return { apiKey, subgraphId }
}

export async function researchGraph(fetchImpl: typeof fetch = fetch): Promise<GraphResearchResult> {
  const { apiKey, subgraphId } = serverConfig()
  const endpoint = `${GRAPH_GATEWAY}/${encodeURIComponent(apiKey)}/subgraphs/id/${encodeURIComponent(subgraphId)}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ query: DEFAULT_QUERY }),
      signal: controller.signal,
      cache: 'no-store',
    })
    const payload: unknown = await response.json().catch(() => null)
    if (!response.ok) {
      throw new GraphProviderError('UPSTREAM', 'The Graph provider request failed.', 502)
    }
    if (!payload || typeof payload !== 'object' || !('data' in payload) || ('errors' in payload && Array.isArray(payload.errors) && payload.errors.length > 0)) {
      throw new GraphProviderError('UPSTREAM', 'The Graph provider request failed.', 502)
    }
    return { data: (payload as { data: Record<string, unknown> }).data }
  } catch (error) {
    if (error instanceof GraphProviderError) throw error
    throw new GraphProviderError('UPSTREAM', 'The Graph provider request failed.', 502)
  } finally {
    clearTimeout(timeout)
  }
}

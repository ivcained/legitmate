const GRAPH_GATEWAY = 'https://gateway.thegraph.com/api'
const DEFAULT_QUERY = `query LegitMateMarketBrief {
  _meta { block { number hash timestamp } deployment }
  bundle(id: "1") { ethPriceUSD }
  factory(id: "0x1f98431c8ad98523631ae4a59f267346ea31f984") { poolCount txCount totalVolumeUSD totalValueLockedUSD }
  pools(first: 5, orderBy: volumeUSD, orderDirection: desc) { id token0 { symbol } token1 { symbol } feeTier volumeUSD totalValueLockedUSD txCount }
}`

type GraphErrorCode = 'NOT_CONFIGURED' | 'UPSTREAM'
export class GraphProviderError extends Error {
  constructor(readonly code: GraphErrorCode, message: string, readonly status: number) { super(message); this.name = 'GraphProviderError' }
}

type Pool = { id: string; pair: string; feeTier: number; volumeUSD: number; totalValueLockedUSD: number; txCount: number }
export type GraphResearchResult = {
  source: { provider: 'The Graph'; subgraphId: string; blockNumber: number; blockHash: string; blockTimestamp: number; deployment: string; observedAt: string }
  market: { ethPriceUSD: number; poolCount: number; txCount: number; totalVolumeUSD: number; totalValueLockedUSD: number; topPools: Pool[] }
  metrics: { topPoolVolumeSharePct: number; volumeToTvlRatio: number }
}

function serverConfig() {
  const apiKey = process.env.GRAPH_API_KEY?.trim()
  const subgraphId = process.env.GRAPH_SUBGRAPH_ID?.trim()
  if (!apiKey || !subgraphId) throw new GraphProviderError('NOT_CONFIGURED', 'The Graph provider is not configured on the server.', 503)
  return { apiKey, subgraphId }
}

function number(value: unknown) {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  if (!Number.isFinite(parsed) || parsed < 0) throw new GraphProviderError('UPSTREAM', 'The Graph provider request failed.', 502)
  return parsed
}
function text(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) throw new GraphProviderError('UPSTREAM', 'The Graph provider request failed.', 502)
  return value
}
const MAX_BLOCK_AGE_SECONDS = 60 * 60

function normalize(payload: unknown, subgraphId: string): GraphResearchResult {
  if (!payload || typeof payload !== 'object' || !('data' in payload) || ('errors' in payload && Array.isArray(payload.errors) && payload.errors.length)) throw new GraphProviderError('UPSTREAM', 'The Graph provider request failed.', 502)
  const data = (payload as { data?: Record<string, unknown> }).data
  const meta = data?._meta as { block?: Record<string, unknown>; deployment?: unknown } | undefined
  const bundle = data?.bundle as Record<string, unknown> | undefined
  const factory = data?.factory as Record<string, unknown> | undefined
  const rawPools = data?.pools
  if (!meta?.block || !bundle || !factory || !Array.isArray(rawPools) || !rawPools.length) throw new GraphProviderError('UPSTREAM', 'The Graph provider request failed.', 502)
  const topPools = rawPools.map((value) => {
    if (!value || typeof value !== 'object') throw new GraphProviderError('UPSTREAM', 'The Graph provider request failed.', 502)
    const pool = value as Record<string, unknown>
    const token0 = pool.token0 as Record<string, unknown> | undefined
    const token1 = pool.token1 as Record<string, unknown> | undefined
    return { id: text(pool.id), pair: `${text(token0?.symbol)} / ${text(token1?.symbol)}`, feeTier: number(pool.feeTier), volumeUSD: number(pool.volumeUSD), totalValueLockedUSD: number(pool.totalValueLockedUSD), txCount: number(pool.txCount) }
  })
  const totalVolumeUSD = number(factory.totalVolumeUSD)
  const totalValueLockedUSD = number(factory.totalValueLockedUSD)
  const blockTimestamp = number(meta.block.timestamp)
  const nowSeconds = Date.now() / 1000
  if (blockTimestamp > nowSeconds + 300 || nowSeconds - blockTimestamp > MAX_BLOCK_AGE_SECONDS) throw new GraphProviderError('UPSTREAM', 'The Graph data is not current enough to analyze.', 502)
  return {
    source: { provider: 'The Graph', subgraphId, blockNumber: number(meta.block.number), blockHash: text(meta.block.hash), blockTimestamp, deployment: text(meta.deployment), observedAt: new Date().toISOString() },
    market: { ethPriceUSD: number(bundle.ethPriceUSD), poolCount: number(factory.poolCount), txCount: number(factory.txCount), totalVolumeUSD, totalValueLockedUSD, topPools },
    metrics: { topPoolVolumeSharePct: totalVolumeUSD ? Number(((topPools[0].volumeUSD / totalVolumeUSD) * 100).toFixed(2)) : 0, volumeToTvlRatio: totalValueLockedUSD ? Number((totalVolumeUSD / totalValueLockedUSD).toFixed(2)) : 0 },
  }
}

export async function researchGraph(fetchImpl: typeof fetch = fetch): Promise<GraphResearchResult> {
  const { apiKey, subgraphId } = serverConfig()
  const endpoint = `${GRAPH_GATEWAY}/${encodeURIComponent(apiKey)}/subgraphs/id/${encodeURIComponent(subgraphId)}`
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const response = await fetchImpl(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ query: DEFAULT_QUERY }), signal: controller.signal, cache: 'no-store' })
    if (!response.ok) throw new GraphProviderError('UPSTREAM', 'The Graph provider request failed.', 502)
    return normalize(await response.json().catch(() => null), subgraphId)
  } catch (error) {
    if (error instanceof GraphProviderError) throw error
    throw new GraphProviderError('UPSTREAM', 'The Graph provider request failed.', 502)
  } finally { clearTimeout(timeout) }
}

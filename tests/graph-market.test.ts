import { afterEach, describe, expect, it, vi } from 'vitest'
import { researchGraph } from '../lib/graph'

const originalEnv = { ...process.env }
afterEach(() => { process.env = { ...originalEnv }; vi.restoreAllMocks() })

const livePayload = {
  data: {
    _meta: { block: { number: 23936001, hash: '0xabc', timestamp: 1789200000 }, deployment: 'QmDeployment' },
    bundle: { ethPriceUSD: '4123.45' },
    factory: { poolCount: '12345', txCount: '999999', totalVolumeUSD: '1000000', totalValueLockedUSD: '250000' },
    pools: [
      { id: '0x1', token0: { symbol: 'WETH' }, token1: { symbol: 'USDC' }, feeTier: '500', volumeUSD: '400000', totalValueLockedUSD: '120000', txCount: '5000' },
      { id: '0x2', token0: { symbol: 'WBTC' }, token1: { symbol: 'WETH' }, feeTier: '3000', volumeUSD: '100000', totalValueLockedUSD: '60000', txCount: '1200' },
    ],
  },
}

describe('Graph market research', () => {
  it('normalizes live protocol data into evidence for an assistant', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1789200300 * 1000)
    process.env.GRAPH_API_KEY = 'server-secret'
    process.env.GRAPH_SUBGRAPH_ID = 'live-subgraph'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(livePayload))
    const result = await researchGraph()
    expect(result.source).toMatchObject({ provider: 'The Graph', subgraphId: 'live-subgraph', blockNumber: 23936001, deployment: 'QmDeployment' })
    expect(result.market).toMatchObject({ ethPriceUSD: 4123.45, poolCount: 12345, txCount: 999999, totalVolumeUSD: 1000000, totalValueLockedUSD: 250000 })
    expect(result.market.topPools[0]).toMatchObject({ pair: 'WETH / USDC', volumeUSD: 400000 })
    expect(result.metrics).toEqual({ topPoolVolumeSharePct: 40, volumeToTvlRatio: 4 })
  })

  it('fails closed on stale indexed evidence', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1789207200 * 1000)
    process.env.GRAPH_API_KEY = 'server-secret'
    process.env.GRAPH_SUBGRAPH_ID = 'live-subgraph'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(livePayload))
    await expect(researchGraph()).rejects.toMatchObject({ status: 502, message: 'The Graph data is not current enough to analyze.' })
  })

  it('fails closed on malformed market evidence', async () => {
    process.env.GRAPH_API_KEY = 'server-secret'
    process.env.GRAPH_SUBGRAPH_ID = 'live-subgraph'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ data: { _meta: { block: { number: 1 } } } }))
    await expect(researchGraph()).rejects.toMatchObject({ code: 'UPSTREAM' })
  })
})

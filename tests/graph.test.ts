import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from '../app/api/graph/research/route'
import { researchGraph } from '../lib/graph'

const originalEnv = { ...process.env }

afterEach(() => {
  process.env = { ...originalEnv }
  vi.restoreAllMocks()
})

describe('The Graph provider', () => {
  it('fails closed when server configuration is incomplete', async () => {
    delete process.env.GRAPH_API_KEY
    delete process.env.GRAPH_SUBGRAPH_ID

    await expect(researchGraph()).rejects.toMatchObject({ code: 'NOT_CONFIGURED' })

    const response = await POST()
    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'The Graph provider is not configured on the server.',
      code: 'GRAPH_NOT_CONFIGURED',
    })
  })

  it('queries the configured documented gateway without returning the API key', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000300 * 1000)
    process.env.GRAPH_API_KEY = 'server-secret'
    process.env.GRAPH_SUBGRAPH_ID = 'subgraph-id'
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: { _meta: { block: { number: 123, hash: '0xabc', timestamp: 1700000000 }, deployment: 'QmDeployment' }, bundle: { ethPriceUSD: '4000' }, factory: { poolCount: '10', txCount: '20', totalVolumeUSD: '1000', totalValueLockedUSD: '500' }, pools: [{ id: '0xpool', token0: { symbol: 'WETH' }, token1: { symbol: 'USDC' }, feeTier: '500', volumeUSD: '400', totalValueLockedUSD: '200', txCount: '5' }] } }), { status: 200 }),
    )

    const result = await researchGraph()
    expect(result).toMatchObject({ source: { blockNumber: 123, deployment: 'QmDeployment' }, market: { ethPriceUSD: 4000, poolCount: 10 } })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://gateway.thegraph.com/api/server-secret/subgraphs/id/subgraph-id',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('returns a generic upstream error and never leaks credentials', async () => {
    process.env.GRAPH_API_KEY = 'server-secret'
    process.env.GRAPH_SUBGRAPH_ID = 'subgraph-id'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ errors: [{ message: 'bad server-secret token' }] }), { status: 200 }),
    )

    const response = await POST()
    expect(response.status).toBe(502)
    const body = await response.text()
    expect(body).toContain('The Graph provider request failed.')
    expect(body).not.toContain('server-secret')
  })
})

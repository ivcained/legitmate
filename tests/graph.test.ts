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
    process.env.GRAPH_API_KEY = 'server-secret'
    process.env.GRAPH_SUBGRAPH_ID = 'subgraph-id'
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: { _meta: { block: { number: 123 } } } }), { status: 200 }),
    )

    const result = await researchGraph()
    expect(result).toEqual({ data: { _meta: { block: { number: 123 } } } })
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

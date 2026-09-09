import { GraphProviderError, researchGraph } from '../../../../lib/graph'

export async function POST() {
  try {
    const result = await researchGraph()
    return Response.json({ ok: true, ...result })
  } catch (error) {
    if (error instanceof GraphProviderError) {
      return Response.json(
        {
          ok: false,
          error: error.message,
          code: error.code === 'NOT_CONFIGURED' ? 'GRAPH_NOT_CONFIGURED' : 'GRAPH_UPSTREAM_ERROR',
        },
        { status: error.status },
      )
    }
    return Response.json({ ok: false, error: 'The Graph provider request failed.', code: 'GRAPH_UPSTREAM_ERROR' }, { status: 502 })
  }
}

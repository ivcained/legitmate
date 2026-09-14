import { NextRequest } from 'next/server'
import { queryHermesCatalog } from '../../../../lib/hermes-live-catalog'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const result = await queryHermesCatalog({
      kind: url.searchParams.get('kind') ?? undefined,
      query: url.searchParams.get('q') ?? undefined,
      page: Number(url.searchParams.get('page') ?? 1),
      size: Number(url.searchParams.get('size') ?? 24),
    })
    return Response.json({ ok: true, ...result, source: 'Hermes live catalog' }, { headers: { 'cache-control': 'public, max-age=300, stale-while-revalidate=600' } })
  } catch (error) {
    const code = error instanceof Error ? error.message : 'CATALOG_FAILED'
    return Response.json({ ok: false, code, message: 'Hermes catalog is temporarily unavailable.' }, { status: 502 })
  }
}

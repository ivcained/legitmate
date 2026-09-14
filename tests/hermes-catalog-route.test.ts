import { describe, expect, it, vi } from 'vitest'
import { GET } from '../app/api/hermes/catalog/route'

vi.mock('../lib/hermes-live-catalog', () => ({ queryHermesCatalog: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, size: 24, totalPages: 1, counts: { skills: 100148, plugins: 9 } }) }))

describe('Hermes catalog route', () => {
  it('returns public read-only catalog metadata', async () => {
    const response = await GET(new Request('https://app.test/api/hermes/catalog?kind=plugin') as never)
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ ok: true, counts: { skills: 100148, plugins: 9 } })
  })
})

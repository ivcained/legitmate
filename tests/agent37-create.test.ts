import { afterEach, describe, expect, it, vi } from 'vitest'

const originalFetch = globalThis.fetch

afterEach(() => { globalThis.fetch = originalFetch; vi.restoreAllMocks(); delete process.env.AGENT37_API_KEY })

describe('Agent37 create response', () => {
  it('unwraps the current create envelope', async () => {
    process.env.AGENT37_API_KEY = 'test-key'
    globalThis.fetch = vi.fn().mockResolvedValue(Response.json({ instance: { id: 'inst_1', status: 'running' } }))
    const { createInstance } = await import('../lib/agent37')
    await expect(createInstance({ name: 'test' })).resolves.toMatchObject({ id: 'inst_1', status: 'running' })
  })

  it('accepts the legacy direct instance shape', async () => {
    process.env.AGENT37_API_KEY = 'test-key'
    globalThis.fetch = vi.fn().mockResolvedValue(Response.json({ id: 'inst_2', status: 'running' }))
    const { createInstance } = await import('../lib/agent37')
    await expect(createInstance({ name: 'test' })).resolves.toMatchObject({ id: 'inst_2' })
  })
})

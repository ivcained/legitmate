import { afterEach, describe, expect, it, vi } from 'vitest'
import { discoverModels } from '../lib/model-discovery'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs() })

describe('model discovery', () => {
  it('returns the default model choices without Surplus configuration', async () => {
    vi.stubEnv('SURPLUS_BASE_URL', '')
    vi.stubEnv('SURPLUS_FALLBACK_MODELS', '')
    await expect(discoverModels()).resolves.toMatchObject({ surplus: 'unavailable', models: [{ id: 'nous-default' }, { id: 'nous-reasoning' }] })
  })

  it('normalizes and namespaces live Surplus models without exposing the key', async () => {
    vi.stubEnv('SURPLUS_BASE_URL', 'https://surplus.example/v1')
    vi.stubEnv('SURPLUS_API_KEY', 'secret-key')
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ data: [{ id: 'model-a' }, { id: 'model-a' }, { id: '../bad' }] }))
    const result = await discoverModels()
    expect(result.models).toContainEqual({ id: 'surplus/model-a', label: 'model-a', provider: 'surplus' })
    expect(result.models.some((model) => model.id.includes('secret-key'))).toBe(false)
    expect(fetchSpy.mock.calls[0][0]).toBe('https://surplus.example/v1/models')
  })

  it.each(['http://127.0.0.1:8080', 'https://localhost.', 'https://169.254.169.254/v1', 'https://surplus.example:8443/v1'])('rejects insecure Surplus base URL %s', async (url) => {
    vi.stubEnv('SURPLUS_BASE_URL', url)
    vi.stubEnv('SURPLUS_ALLOWED_HOSTS', new URL(url).hostname)
    await expect(discoverModels()).rejects.toMatchObject({ code: 'SURPLUS_NOT_CONFIGURED' })
  })

  it('rejects a host outside the exact operator allowlist', async () => {
    vi.stubEnv('SURPLUS_BASE_URL', 'https://attacker.example/v1')
    vi.stubEnv('SURPLUS_ALLOWED_HOSTS', 'surplus.example')
    await expect(discoverModels()).rejects.toMatchObject({ code: 'SURPLUS_NOT_CONFIGURED' })
  })
})

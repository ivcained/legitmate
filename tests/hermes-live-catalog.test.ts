import { describe, expect, it } from 'vitest'
import { HERMES_CATALOG_URLS, queryHermesCatalog, resolveHermesCapabilities } from '../lib/hermes-live-catalog'

const skills = { skills: [
  { name: 'PDF', description: 'Work with PDF files', source: 'official', identifier: 'official/productivity/pdf', trust_level: 'builtin', platforms: ['linux', 'macos'] },
  { name: 'TDD', description: 'Test driven development', source: 'official', identifier: 'official/engineering/test-driven-development-(tdd)', trust_level: 'builtin', platforms: ['linux'] },
  { name: 'Mac only', description: 'No Linux', source: 'official', identifier: 'official/productivity/mac-only', trust_level: 'builtin', platforms: ['macos'] },
] }
const plugins = { entries: [
  { name: 'snyk', description: 'Security scan', tier: 'official', repo: 'https://github.com/snyk/agent-scan', sha: 'a'.repeat(40), platforms: ['linux'], capabilities: {} },
  { name: 'netbox', description: 'Needs credentials', tier: 'community', repo: 'https://github.com/example/netbox', sha: 'b'.repeat(40), platforms: ['linux'], capabilities: { requires_env: ['NETBOX_TOKEN'] } },
  { name: 'unknown-platform', description: 'No platform metadata', tier: 'community', repo: 'https://github.com/example/unknown', sha: 'c'.repeat(40), platforms: [], capabilities: {} },
] }
function fetcher(url: string | URL | Request) { return Promise.resolve(Response.json(String(url) === HERMES_CATALOG_URLS.skills ? skills : plugins)) }

describe('Hermes live catalog', () => {
  it('normalizes, filters, and counts catalog entries', async () => {
    const result = await queryHermesCatalog({ kind: 'plugin', query: 'snyk', page: 1, size: 10 }, fetcher as typeof fetch)
    expect(result.counts).toEqual({ skills: 3, plugins: 3 })
    expect(result.items).toEqual([expect.objectContaining({ id: 'plugin:snyk', installable: true, revision: 'a'.repeat(40) })])
  })

  it('marks incompatible and credential-bound entries unavailable', async () => {
    const result = await queryHermesCatalog({ page: 1, size: 10 }, fetcher as typeof fetch)
    expect(result.items.find((item) => item.id.includes('mac-only'))).toMatchObject({ installable: false })
    expect(result.items.find((item) => item.id === 'plugin:netbox')).toMatchObject({ installable: false, requiresEnv: ['NETBOX_TOKEN'] })
    expect(result.items.find((item) => item.id === 'plugin:unknown-platform')).toMatchObject({ installable: false, reason: 'Platform compatibility is not declared' })
  })

  it('falls back for malformed pagination values', async () => {
    const result = await queryHermesCatalog({ page: Number.NaN, size: Number.POSITIVE_INFINITY }, fetcher as typeof fetch)
    expect(result).toMatchObject({ page: 1, size: 24 })
  })

  it('resolves only catalog-backed installable identifiers', async () => {
    await expect(resolveHermesCapabilities(['skill:official/productivity/pdf', 'skill:official/engineering/test-driven-development-(tdd)', 'plugin:snyk'], fetcher as typeof fetch)).resolves.toHaveLength(3)
    await expect(resolveHermesCapabilities(['plugin:not-in-catalog'], fetcher as typeof fetch)).rejects.toThrow('CAPABILITY_NOT_INSTALLABLE')
  })
})

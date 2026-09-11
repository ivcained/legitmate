import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { requirePrincipal } from '../lib/auth'

describe('server principal resolution', () => {
  const originalSubject = process.env.LEGITMATE_SINGLE_USER_SUBJECT
  const originalApp = process.env.NEXT_PUBLIC_PRIVY_APP_ID
  const originalKey = process.env.PRIVY_VERIFICATION_KEY

  beforeEach(() => {
    delete process.env.LEGITMATE_SINGLE_USER_SUBJECT
    delete process.env.NEXT_PUBLIC_PRIVY_APP_ID
    delete process.env.PRIVY_VERIFICATION_KEY
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    if (originalSubject === undefined) delete process.env.LEGITMATE_SINGLE_USER_SUBJECT; else process.env.LEGITMATE_SINGLE_USER_SUBJECT = originalSubject
    if (originalApp === undefined) delete process.env.NEXT_PUBLIC_PRIVY_APP_ID; else process.env.NEXT_PUBLIC_PRIVY_APP_ID = originalApp
    if (originalKey === undefined) delete process.env.PRIVY_VERIFICATION_KEY; else process.env.PRIVY_VERIFICATION_KEY = originalKey
  })

  it('ignores caller-controlled identity headers', async () => {
    vi.stubEnv('NODE_ENV', 'test')
    process.env.LEGITMATE_SINGLE_USER_SUBJECT = 'demo-operator'
    const request = new Request('https://mate.example/api', { headers: { 'x-legitmate-user-id': 'attacker' } })
    await expect(requirePrincipal(request)).resolves.toEqual({ subject: 'demo-operator', scope: 'legitmate:demo-operator', mode: 'single-user' })
  })

  it('fails closed when single-user mode is configured in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    process.env.LEGITMATE_SINGLE_USER_SUBJECT = 'demo-operator'
    await expect(requirePrincipal(new Request('https://mate.example/api'))).rejects.toMatchObject({ code: 'AUTH_NOT_CONFIGURED', status: 503 })
  })

  it('fails closed when no trusted auth mode is configured', async () => {
    const request = new Request('https://mate.example/api', { headers: { 'x-user-id': 'attacker' } })
    await expect(requirePrincipal(request)).rejects.toMatchObject({ code: 'AUTH_NOT_CONFIGURED', status: 503 })
  })
})

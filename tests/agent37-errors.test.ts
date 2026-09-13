import { describe, expect, it } from 'vitest'
import { Agent37Error, errorResponse } from '../lib/agent37'

describe('Agent37 dependency errors', () => {
  it('preserves JSON through Cloudflare by mapping upstream 502 errors to 424', async () => {
    const response = errorResponse(new Agent37Error('AGENT37_ERROR', 502))
    expect(response.status).toBe(424)
    expect(response.headers.get('content-type')).toContain('application/json')
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      code: 'AGENT37_ERROR',
      message: expect.stringContaining('check for an existing workspace'),
    })
  })

  it('keeps non-upstream statuses unchanged', () => {
    expect(errorResponse(new Agent37Error('AUTH_REQUIRED', 401)).status).toBe(401)
  })
})

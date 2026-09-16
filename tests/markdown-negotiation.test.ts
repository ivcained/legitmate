import { describe, expect, it } from 'vitest'
import { middleware } from '../middleware'

describe('agent-facing content negotiation', () => {
  it('serves markdown when the homepage explicitly requests it', async () => {
    const response = await middleware({ nextUrl: new URL('https://mate.legitclub.com/'), headers: new Headers({ accept: 'text/markdown' }) } as never)
    expect(response.headers.get('content-type')).toContain('text/markdown')
    expect(response.headers.get('vary')).toContain('Accept')
    expect(response.headers.get('x-markdown-tokens')).toMatch(/^\d+$/)
    expect(await response.text()).toContain('# LegitMate')
  })

  it('lets browser HTML requests continue and advertises discovery links', async () => {
    const response = await middleware({ nextUrl: new URL('https://mate.legitclub.com/'), headers: new Headers({ accept: 'text/html' }) } as never)
    expect(response.headers.get('link')).toContain('rel="api-catalog"')
    expect(response.headers.get('content-signal')).toBe('ai-train=no, search=yes, ai-input=yes')
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })
})

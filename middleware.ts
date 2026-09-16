import { NextResponse, type NextRequest } from 'next/server'
import { CONTENT_SIGNAL, discoveryHeaders, homepageMarkdown } from './lib/agent-discovery'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const accept = request.headers.get('accept') ?? ''
  if (url.pathname === '/' && accept.split(',').some((value) => value.trim().split(';')[0] === 'text/markdown')) {
    const markdown = homepageMarkdown()
    const tokenEstimate = Math.ceil(markdown.length / 4)
    return new Response(markdown, {
      headers: {
        ...discoveryHeaders(),
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        'x-markdown-tokens': String(tokenEstimate),
      },
    })
  }
  const response = NextResponse.next()
  if (url.pathname === '/') {
    for (const [name, value] of Object.entries(discoveryHeaders())) response.headers.set(name, value)
  } else {
    response.headers.set('Content-Signal', CONTENT_SIGNAL)
  }
  return response
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }

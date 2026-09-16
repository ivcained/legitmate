import { ROBOTS_TEXT } from '../../lib/agent-discovery'

export function GET() {
  return new Response(ROBOTS_TEXT, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=300' } })
}

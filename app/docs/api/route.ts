import { API_DOCUMENTATION } from '../../../lib/agent-discovery'

export function GET() {
  return new Response(API_DOCUMENTATION, { headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' } })
}

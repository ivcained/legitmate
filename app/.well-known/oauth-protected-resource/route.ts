import { PROTECTED_RESOURCE_METADATA } from '../../../lib/agent-discovery'

export function GET() {
  return Response.json(PROTECTED_RESOURCE_METADATA, { headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' } })
}

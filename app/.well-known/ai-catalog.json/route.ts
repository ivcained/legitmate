import { ARD_CATALOG } from '../../../lib/agent-discovery'

export function GET() {
  return Response.json(ARD_CATALOG, { headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' } })
}

import { MCP_SERVER_CARD } from '../../../../lib/agent-discovery'

export function GET() {
  return Response.json(MCP_SERVER_CARD, { headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' } })
}

import { API_CATALOG, discoveryHeaders } from '../../../lib/agent-discovery'

export function GET() {
  return Response.json(API_CATALOG, {
    headers: {
      ...discoveryHeaders(),
      'Content-Type': 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  })
}

export const HEAD = GET

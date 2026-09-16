import { OPENAPI_DOCUMENT } from '../../lib/agent-discovery'

export function GET() {
  return Response.json(OPENAPI_DOCUMENT, {
    headers: {
      'Content-Type': 'application/vnd.oai.openapi+json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  })
}

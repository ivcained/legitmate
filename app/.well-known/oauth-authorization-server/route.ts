import { OAUTH_AUTHORIZATION_SERVER_METADATA } from '../../../lib/agent-discovery'

export function GET() {
  return Response.json(OAUTH_AUTHORIZATION_SERVER_METADATA, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  })
}

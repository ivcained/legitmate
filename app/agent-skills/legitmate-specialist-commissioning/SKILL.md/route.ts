import { AGENT_SKILL_MARKDOWN } from '../../../../lib/agent-discovery'

export function GET() {
  return new Response(AGENT_SKILL_MARKDOWN, { headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' } })
}

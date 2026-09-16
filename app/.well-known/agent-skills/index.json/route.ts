import { agentSkillIndex } from '../../../../lib/agent-discovery'

export function GET() {
  return Response.json(agentSkillIndex(), { headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' } })
}

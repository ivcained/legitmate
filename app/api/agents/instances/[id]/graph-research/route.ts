import { NextRequest } from 'next/server'
import { GraphProviderError, researchGraph } from '../../../../../../lib/graph'
import { Agent37Error, cleanId, errorResponse, instanceRequest, requireOwnedInstance } from '../../../../../../lib/agent37'
import { readAgentConfiguration } from '../../../../../../lib/apply-configuration'
import { requirePrincipal } from '../../../../../../lib/auth'

function outputText(payload: Record<string, unknown>) {
  if (typeof payload.output_text === 'string') return payload.output_text
  return ''
}

function validateAnalysis(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Agent37Error('GRAPH_ANALYSIS_FAILED', 502)
  const item = value as Record<string, unknown>
  if (!['HEALTHY', 'WATCH', 'INCONCLUSIVE'].includes(String(item.verdict)) || typeof item.summary !== 'string' || !Array.isArray(item.evidence) || item.evidence.some((v) => typeof v !== 'string') || Object.keys(item).some((key) => !['verdict', 'summary', 'evidence'].includes(key))) throw new Agent37Error('GRAPH_ANALYSIS_FAILED', 502)
  return { verdict: item.verdict as 'HEALTHY' | 'WATCH' | 'INCONCLUSIVE', summary: item.summary, evidence: item.evidence as string[] }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = cleanId((await context.params).id)
    if (!id) throw new Agent37Error('INVALID_INSTANCE_ID', 400)
    const principal = await requirePrincipal(request)
    await requireOwnedInstance(id, principal.scope)
    const readback = await readAgentConfiguration(id)
    if (readback.status !== 'applied' || !readback.verification.verified) throw new Agent37Error('CONFIG_NOT_APPLIED', 409)
    const market = await researchGraph()
    const prompt = `You are a cautious Ethereum market research specialist. Use only the live The Graph evidence below. Return JSON only with exactly these fields: {"verdict":"HEALTHY|WATCH|INCONCLUSIVE","summary":"one concise sentence","evidence":["two or three factual observations"]}. HEALTHY means the dataset is current enough to analyze and has positive liquidity; WATCH means the data is valid but concentration or liquidity deserves attention; INCONCLUSIVE means the evidence is insufficient. Do not give financial advice.\n\n${JSON.stringify(market)}`
    const response = await instanceRequest(id, '/v1/responses', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ input: prompt, tools: [], tool_choice: 'none' }), signal: AbortSignal.timeout(30000) })
    const payload = await response.json().catch(() => null) as Record<string, unknown> | null
    if (!payload || payload.status !== 'completed') throw new Agent37Error('GRAPH_ANALYSIS_FAILED', 502)
    let parsed: unknown
    try { parsed = JSON.parse(outputText(payload)) } catch { throw new Agent37Error('GRAPH_ANALYSIS_FAILED', 502) }
    return Response.json({ ok: true, market, analysis: validateAnalysis(parsed), instance_id: id, configuration_id: readback.receipt.config_id })
  } catch (error) {
    if (error instanceof GraphProviderError) return Response.json({ ok: false, code: 'GRAPH_UPSTREAM_ERROR', message: error.message }, { status: error.status })
    return errorResponse(error)
  }
}

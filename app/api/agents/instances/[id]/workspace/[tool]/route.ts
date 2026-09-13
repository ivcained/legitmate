import { NextRequest } from 'next/server'
import { Agent37Error, cleanId, errorResponse, requireOwnedInstance, signedUrl } from '../../../../../../../lib/agent37'
import { workspaceTool } from '../../../../../../../lib/agent37-workspace-tools'
import { requirePrincipal } from '../../../../../../../lib/auth'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string; tool: string }> }) {
  try {
    const { id: rawId, tool: rawTool } = await context.params
    const id = cleanId(rawId)
    if (!id) throw new Agent37Error('INVALID_INSTANCE_ID', 400)
    let port: number
    try { port = workspaceTool(rawTool).port } catch { throw new Agent37Error('TOOL_NOT_ALLOWED', 400) }
    const { scope } = await requirePrincipal(request)
    await requireOwnedInstance(id, scope)
    const result = await signedUrl(id, port, 300)
    if (!result || typeof result !== 'object' || Array.isArray(result) || typeof (result as Record<string, unknown>).url !== 'string') throw new Agent37Error('SIGNED_URL_FAILED', 502)
    return Response.json({ ok: true, tool: rawTool, url: (result as Record<string, unknown>).url })
  } catch (error) { return errorResponse(error) }
}

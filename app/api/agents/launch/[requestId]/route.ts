import { NextRequest } from 'next/server'
import { listOwnedInstances, errorResponse } from '../../../../../lib/agent37'
import { readAgentConfiguration } from '../../../../../lib/apply-configuration'
import { requirePrincipal } from '../../../../../lib/auth'
import { reconcileLaunchResult } from '../../../../../lib/launch-reconciliation'

export async function GET(request: NextRequest, context: { params: Promise<{ requestId: string }> }) {
  try {
    const { scope } = await requirePrincipal(request)
    const { requestId } = await context.params
    if (!/^[a-zA-Z0-9_-]{8,128}$/.test(requestId)) return Response.json({ ok: false, code: 'INVALID_REQUEST_ID' }, { status: 400 })
    const result = await reconcileLaunchResult({
      clientRequestId: requestId,
      list: () => listOwnedInstances(scope),
      readConfiguration: readAgentConfiguration,
    })
    const status = result.state === 'complete' ? 200 : result.state === 'pending' ? 202 : 404
    return Response.json({ ok: result.state !== 'absent', ...result }, { status })
  } catch (error) { return errorResponse(error) }
}

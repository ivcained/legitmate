import { errorResponse } from '../../../lib/agent37'
import { discoverModels } from '../../../lib/model-discovery'

export async function GET() {
  try { return Response.json({ ok: true, ...(await discoverModels()) }) }
  catch (error) { return errorResponse(error) }
}

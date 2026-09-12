import { NextRequest } from 'next/server'
import { applyAgentConfiguration } from '../../../../lib/apply-configuration'
import { applyRuntimeConfiguration } from '../../../../lib/apply-runtime'
import { ConfigurationError, parseAgentConfiguration } from '../../../../lib/agent-configuration'
import { discoverModels } from '../../../../lib/model-discovery'
import { Agent37Error, APPROVED_TEMPLATES, errorResponse, readJson } from '../../../../lib/agent37'
import { requirePrincipal } from '../../../../lib/auth'
import { parseResourceShape, provisionConfiguredInstance } from '../../../../lib/instance-provisioning'

export async function POST(request: NextRequest) {
  try {
    const principal = await requirePrincipal(request)
    const body = await readJson(request)
    if (!body) throw new Agent37Error('INVALID_JSON', 400)
    const template = typeof body.template === 'string' ? body.template : 'agent37-hermes'
    if (!APPROVED_TEMPLATES.has(template)) throw new Agent37Error('TEMPLATE_NOT_APPROVED', 400)
    const configuration = parseAgentConfiguration(body, principal.subject)
    if (configuration.runtime.model.startsWith('surplus/')) {
      const catalog = await discoverModels()
      if (!catalog.models.some((model) => model.id === configuration.runtime.model && model.provider === 'surplus')) throw new Agent37Error('MODEL_NOT_APPROVED', 400)
    }
    const resources = parseResourceShape(body.resources)
    const provisioned = await provisionConfiguredInstance({ scope: principal.scope, template, name: body.name, resources, configuration })
    const rawId = provisioned.instance.id
    if (typeof rawId !== 'string') throw new Agent37Error('AGENT37_ERROR', 502)
    try {
      const receipt = await applyAgentConfiguration(rawId, configuration)
      const runtime = await applyRuntimeConfiguration(rawId, configuration)
      return Response.json({ ok: true, instance: provisioned.instance, configuration: receipt, runtime, replayed: provisioned.replayed }, { status: provisioned.replayed ? 200 : 201 })
    } catch (error) {
      const response = errorResponse(error)
      const payload = await response.json() as Record<string, unknown>
      return Response.json({ ...payload, instance: { id: rawId }, retryable: response.status >= 500 }, { status: response.status })
    }
  } catch (error) {
    if (error instanceof ConfigurationError) return Response.json({ ok: false, code: error.message, message: 'Configuration was rejected.' }, { status: 400 })
    return errorResponse(error)
  }
}

import { createHash } from 'node:crypto'
import { AGENCY_AGENTS } from './agency-agents'
import { INSTALLABLE_HERMES_CAPABILITY_IDS } from './hermes-catalog'

export const IDENTITY_DESTINATIONS = {
  soul: '/home/node/.hermes/SOUL.md',
  user: '/home/node/.hermes/memories/USER.md',
  agents: '/home/node/.agent37-gateway/workspace/AGENTS.md',
} as const
export const CONFIGURATION_PATH = '/home/node/.agent37-gateway/workspace/.legitmate/configuration.json'
export const RECEIPT_PATH = '/home/node/.agent37-gateway/workspace/.legitmate/receipt.json'

const AGENCY_SLUGS = new Set(AGENCY_AGENTS.map((agent) => agent.slug))
const APPROVED_MODELS = new Set(['nous-default', 'nous-reasoning', 'surplus-capacity'])
const SURPLUS_MODEL_ID = /^surplus\/[A-Za-z0-9][A-Za-z0-9._:/-]{0,159}$/
const APPROVED_CAPABILITIES = INSTALLABLE_HERMES_CAPABILITY_IDS
const PROFILE_KEYS = new Set(['soul', 'user', 'agents'])
const PROFILE_LIMITS = { soul: 12 * 1024, user: 8 * 1024, agents: 16 * 1024 } as const

export class ConfigurationError extends Error {
  constructor(public code: string) { super(code) }
}

export type AgentConfigurationV1 = {
  schema_version: 1
  config_id: string
  revision: 1
  client_request_id: string
  owner_subject: string
  template: 'agent37-hermes'
  agency: { slug: string }
  runtime: { model: string; capability_ids: string[] }
  identity: { soul: string; user: string; agents: string }
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ConfigurationError('INVALID_CONFIGURATION')
  return value as Record<string, unknown>
}

function text(value: unknown, limit: number): string {
  if (typeof value !== 'string' || value.includes('\0')) throw new ConfigurationError('INVALID_PROFILE_TEXT')
  const normalized = value.replace(/\r\n?/g, '\n').trimEnd() + '\n'
  if (Buffer.byteLength(normalized, 'utf8') > limit) throw new ConfigurationError('PROFILE_TOO_LARGE')
  return normalized
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

export function parseAgentConfiguration(value: unknown, ownerSubject: string): AgentConfigurationV1 {
  const input = object(value)
  if (!/^[A-Za-z0-9:_-]{3,160}$/.test(ownerSubject)) throw new ConfigurationError('INVALID_OWNER')
  if (input.template !== 'agent37-hermes') throw new ConfigurationError('TEMPLATE_NOT_APPROVED')
  if (typeof input.agency_agent_slug !== 'string' || !AGENCY_SLUGS.has(input.agency_agent_slug)) throw new ConfigurationError('AGENCY_NOT_APPROVED')
  if (typeof input.model !== 'string' || (!APPROVED_MODELS.has(input.model) && !SURPLUS_MODEL_ID.test(input.model))) throw new ConfigurationError('MODEL_NOT_APPROVED')
  if (!Array.isArray(input.capabilities) || input.capabilities.length > 16) throw new ConfigurationError('TOO_MANY_CAPABILITIES')
  if (input.capabilities.some((item) => typeof item !== 'string' || !APPROVED_CAPABILITIES.has(item))) throw new ConfigurationError('CAPABILITY_NOT_APPROVED')
  const capabilityIds = [...new Set(input.capabilities as string[])].sort()
  if (capabilityIds.length !== input.capabilities.length) throw new ConfigurationError('DUPLICATE_CAPABILITY')

  const profile = object(input.profile)
  if (Object.keys(profile).some((key) => !PROFILE_KEYS.has(key)) || Object.keys(profile).length !== 3) throw new ConfigurationError('INVALID_PROFILE')
  const identity = {
    soul: text(profile.soul, PROFILE_LIMITS.soul),
    user: text(profile.user, PROFILE_LIMITS.user),
    agents: text(profile.agents, PROFILE_LIMITS.agents),
  }
  const clientRequestId = typeof input.client_request_id === 'string' && /^[A-Za-z0-9._:-]{8,128}$/.test(input.client_request_id)
    ? input.client_request_id
    : createHash('sha256').update(`${ownerSubject}:${canonical({ agency: input.agency_agent_slug, model: input.model, capabilityIds, identity })}`).digest('hex')
  const unsigned = {
    schema_version: 1 as const,
    revision: 1 as const,
    client_request_id: clientRequestId,
    owner_subject: ownerSubject,
    template: 'agent37-hermes' as const,
    agency: { slug: input.agency_agent_slug },
    runtime: { model: input.model, capability_ids: capabilityIds },
    identity,
  }
  return { ...unsigned, config_id: createHash('sha256').update(canonical(unsigned)).digest('hex') }
}

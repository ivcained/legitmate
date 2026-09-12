import { createHash } from 'node:crypto'
import { Agent37Error, instanceRequest } from './agent37'
import { CONFIGURATION_PATH, RECEIPT_PATH, type AgentConfigurationV1, IDENTITY_DESTINATIONS } from './agent-configuration'
import type { RuntimeReceipt } from './apply-runtime'

export type AppliedReceipt = {
  schema_version: 1
  config_id: string
  status: 'applied'
  files: Array<{ role: 'configuration' | 'soul' | 'user' | 'agents'; path: string; sha256: string; bytes: number }>
  runtime?: RuntimeReceipt
  verified_at: string
}

function sha256(value: string) { return createHash('sha256').update(value).digest('hex') }
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function writeFile(id: string, path: string, content: string) {
  await instanceRequest(id, `/v1/files/content?path=${encodeURIComponent(path)}&overwrite=true`, {
    method: 'PUT',
    headers: { 'content-type': path.endsWith('.json') ? 'application/json' : 'text/markdown; charset=utf-8' },
    body: content,
  })
}

async function readFile(id: string, path: string) {
  const response = await instanceRequest(id, `/v1/files/content?path=${encodeURIComponent(path)}`)
  return response.text()
}

function sources(configuration: AgentConfigurationV1) {
  return [
    { role: 'configuration' as const, path: CONFIGURATION_PATH, content: JSON.stringify(configuration) },
    { role: 'soul' as const, path: IDENTITY_DESTINATIONS.soul, content: configuration.identity.soul },
    { role: 'user' as const, path: IDENTITY_DESTINATIONS.user, content: configuration.identity.user },
    { role: 'agents' as const, path: IDENTITY_DESTINATIONS.agents, content: configuration.identity.agents },
  ]
}

export type ConfigurationVerification = {
  verified: boolean
  checked_at: string
  files: Array<{ role: AppliedReceipt['files'][number]['role']; expected_sha256: string; actual_sha256?: string; matches: boolean }>
}

export async function readAgentConfiguration(instanceId: string): Promise<{
  status: 'applied' | 'drifted'
  configuration: AgentConfigurationV1 | null
  receipt: AppliedReceipt
  verification: ConfigurationVerification
}> {
  let rawConfiguration: string
  let receipt: AppliedReceipt
  try {
    rawConfiguration = await readFile(instanceId, CONFIGURATION_PATH)
    receipt = JSON.parse(await readFile(instanceId, RECEIPT_PATH)) as AppliedReceipt
  } catch { throw new Agent37Error('CONFIGURATION_NOT_FOUND', 404) }
  let configuration: AgentConfigurationV1 | null = null
  try { configuration = JSON.parse(rawConfiguration) as AgentConfigurationV1 } catch { /* reported as drift below */ }
  if (!receipt?.config_id) throw new Agent37Error('CONFIGURATION_CORRUPT', 409)
  const expectedPaths: Record<AppliedReceipt['files'][number]['role'], string> = { configuration: CONFIGURATION_PATH, soul: IDENTITY_DESTINATIONS.soul, user: IDENTITY_DESTINATIONS.user, agents: IDENTITY_DESTINATIONS.agents }
  const roles = new Set(receipt.files?.map((file) => file.role))
  if (receipt.schema_version !== 1 || receipt.status !== 'applied' || receipt.files?.length !== 4 || roles.size !== 4 || Object.keys(expectedPaths).some((role) => !roles.has(role as keyof typeof expectedPaths)) || receipt.files.some((file) => expectedPaths[file.role] !== file.path || !/^[a-f0-9]{64}$/.test(file.sha256) || !Number.isSafeInteger(file.bytes) || file.bytes < 0)) throw new Agent37Error('CONFIGURATION_CORRUPT', 409)
  const sourceByRole = {
    configuration: rawConfiguration,
    soul: configuration?.identity?.soul ?? '',
    user: configuration?.identity?.user ?? '',
    agents: configuration?.identity?.agents ?? '',
  }
  const files: ConfigurationVerification['files'] = []
  for (const expected of receipt.files) {
    try {
      const actual = await readFile(instanceId, expected.path)
      const actualHash = sha256(actual)
      files.push({ role: expected.role, expected_sha256: expected.sha256, actual_sha256: actualHash, matches: actualHash === expected.sha256 && sha256(sourceByRole[expected.role]) === expected.sha256 })
    } catch {
      files.push({ role: expected.role, expected_sha256: expected.sha256, matches: false })
    }
  }
  const verified = Boolean(configuration && configuration.config_id === receipt.config_id && receipt.runtime && files.length === 4 && files.every((file) => file.matches))
  return { status: verified ? 'applied' : 'drifted', configuration, receipt, verification: { verified, checked_at: new Date().toISOString(), files } }
}

export async function applyAgentConfiguration(
  instanceId: string,
  configuration: AgentConfigurationV1,
  options: { attempts?: number; delayMs?: number } = {},
): Promise<Omit<AppliedReceipt, 'status' | 'runtime'>> {
  const attempts = options.attempts ?? 45
  const delayMs = options.delayMs ?? 2000
  let healthy = false
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const response = await instanceRequest(instanceId, '/v1/health?agent=hermes')
    const status = await response.json().catch(() => null) as { healthy?: boolean } | null
    if (status?.healthy === true) { healthy = true; break }
    if (attempt + 1 < attempts) await wait(delayMs)
  }
  if (!healthy) throw new Agent37Error('AGENT_NOT_READY', 503)

  const files: AppliedReceipt['files'] = []
  for (const file of sources(configuration)) await writeFile(instanceId, file.path, file.content)
  for (const file of sources(configuration)) {
    const actual = await readFile(instanceId, file.path)
    if (sha256(actual) !== sha256(file.content)) throw new Agent37Error('CONFIG_VERIFICATION_FAILED', 502)
    files.push({ role: file.role, path: file.path, sha256: sha256(actual), bytes: Buffer.byteLength(actual) })
  }
  return { schema_version: 1, config_id: configuration.config_id, files, verified_at: new Date().toISOString() }
}

export async function commitAppliedReceipt(instanceId: string, prepared: Omit<AppliedReceipt, 'status' | 'runtime'>, runtime: RuntimeReceipt): Promise<AppliedReceipt> {
  const receipt: AppliedReceipt = { ...prepared, status: 'applied', runtime }
  await writeFile(instanceId, RECEIPT_PATH, JSON.stringify(receipt))
  const committed = await readFile(instanceId, RECEIPT_PATH)
  if (sha256(committed) !== sha256(JSON.stringify(receipt))) throw new Agent37Error('RECEIPT_WRITE_FAILED', 502)
  return receipt
}

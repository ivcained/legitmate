import { createHash } from 'node:crypto'
import { Agent37Error, instanceRequest } from './agent37'
import { type AgentConfigurationV1, IDENTITY_DESTINATIONS } from './agent-configuration'

const CONFIG_PATH = '/home/user/.agent37-gateway/workspace/.legitmate/configuration.json'

export type AppliedReceipt = {
  schema_version: 1
  config_id: string
  status: 'applied'
  files: Array<{ role: 'configuration' | 'soul' | 'user' | 'agents'; path: string; sha256: string; bytes: number }>
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

export async function applyAgentConfiguration(
  instanceId: string,
  configuration: AgentConfigurationV1,
  options: { attempts?: number; delayMs?: number } = {},
): Promise<AppliedReceipt> {
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

  const sources = [
    { role: 'configuration' as const, path: CONFIG_PATH, content: JSON.stringify(configuration) },
    { role: 'soul' as const, path: IDENTITY_DESTINATIONS.soul, content: configuration.identity.soul },
    { role: 'user' as const, path: IDENTITY_DESTINATIONS.user, content: configuration.identity.user },
    { role: 'agents' as const, path: IDENTITY_DESTINATIONS.agents, content: configuration.identity.agents },
  ]
  for (const file of sources) await writeFile(instanceId, file.path, file.content)

  const files: AppliedReceipt['files'] = []
  for (const file of sources) {
    const actual = await readFile(instanceId, file.path)
    if (sha256(actual) !== sha256(file.content)) throw new Agent37Error('CONFIG_VERIFICATION_FAILED', 502)
    files.push({ role: file.role, path: file.path, sha256: sha256(actual), bytes: Buffer.byteLength(actual) })
  }
  return { schema_version: 1, config_id: configuration.config_id, status: 'applied', files, verified_at: new Date().toISOString() }
}

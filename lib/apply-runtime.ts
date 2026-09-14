import { createHash } from 'node:crypto'
import { Agent37Error, execInstance, instanceRequest } from './agent37'
import type { AgentConfigurationV1 } from './agent-configuration'
import type { CatalogItem } from './hermes-live-catalog'
import { INSTALLABLE_HERMES_CAPABILITY_IDS } from './hermes-catalog'

const SHELL_SAFE = /^[A-Za-z0-9._/@:()\-]{1,420}$/

export type RuntimeReceipt = {
  model: { provider: 'default' | 'surplus'; id: string; config_sha256: string }
  capabilities: Array<{ id: string; status: 'installed'; source_revision: string; artifact_sha256: string }>
}

function quote(value: string) { return `'${value.replaceAll("'", "'\\''")}'` }
function output(result: Record<string, unknown>, code = 'CAPABILITY_INSTALL_FAILED') {
  if (result.exit_code !== 0 || typeof result.stdout !== 'string' || result.truncated === true) throw new Agent37Error(code, 502)
  return result.stdout.trim()
}

function validatedProxyUrl() {
  const raw = process.env.SURPLUS_AGENT_PROXY_URL?.trim()
  if (!raw) throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503)
  let url: URL
  try { url = new URL(raw) } catch { throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503) }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || (url.port && url.port !== '443')) throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503)
  return `${url.toString().replace(/\/$/, '').replace(/\/v1$/, '')}/v1`
}

function providerConfig(model: string) {
  if (!model.startsWith('surplus/')) return { provider: 'default' as const, id: model, yaml: `model:\n  provider: agent37\n  default: ${JSON.stringify(model)}\n`, secret: null }
  const id = model.slice('surplus/'.length)
  const token = process.env.SURPLUS_AGENT_PROXY_TOKEN?.trim()
  if (!token || !SHELL_SAFE.test(id)) throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503)
  const api = validatedProxyUrl()
  return { provider: 'surplus' as const, id, secret: token, yaml: `model:\n  provider: "custom:surplus"\n  default: ${JSON.stringify(id)}\nproviders:\n  surplus:\n    api: ${JSON.stringify(api)}\n    key_env: "SURPLUS_AGENT_PROXY_TOKEN"\n    transport: "openai_chat"\n    discover_models: false\n    models:\n      - ${JSON.stringify(id)}\n` }
}

async function applyModel(instanceId: string, model: string) {
  const provider = providerConfig(model)
  const configPath = '/home/node/.hermes/config.yaml'
  const envPath = '/home/node/.hermes/.env'
  const configEncoded = Buffer.from(provider.yaml).toString('base64')
  const commands = ['mkdir -p /home/node/.hermes', `printf %s ${quote(configEncoded)} | base64 -d > ${quote(configPath)}`, `chmod 600 ${quote(configPath)}`]
  if (provider.secret) {
    const envLine = `SURPLUS_AGENT_PROXY_TOKEN=${provider.secret.replaceAll('\\', '\\\\').replaceAll('\n', '').replaceAll('\r', '')}\n`
    commands.push(`printf %s ${quote(Buffer.from(envLine).toString('base64'))} | base64 -d > ${quote(envPath)}`, `chmod 600 ${quote(envPath)}`)
  }
  const write = await execInstance(instanceId, commands.join(' && ')) as Record<string, unknown>
  if (write.exit_code !== 0) throw new Agent37Error('RUNTIME_CONFIG_FAILED', 502)
  const response = await instanceRequest(instanceId, `/v1/files/content?path=${encodeURIComponent(configPath)}`)
  const actual = await response.text()
  if (actual !== provider.yaml || actual.includes(provider.secret ?? '\0')) throw new Agent37Error('RUNTIME_CONFIG_VERIFICATION_FAILED', 502)
  return { provider, actual }
}

async function installSkill(instanceId: string, item: CatalogItem) {
  if (item.id === 'skill:privy' && item.trust === 'legacy') {
    const revision = '7f104aa118a891aca85cfebbd68bf9f4a2cd85e7'
    const path = '/home/node/.hermes/skills/privy'
    const command = `tmp=$(mktemp -d) && git clone --quiet ${quote(item.source)} "$tmp/repo" && git -C "$tmp/repo" checkout --quiet ${quote(revision)} && rm -rf ${quote(path)} && mkdir -p ${quote(path)} && cp "$tmp/repo/SKILL.md" ${quote(`${path}/SKILL.md`)} && sha256sum ${quote(`${path}/SKILL.md`)} | cut -d' ' -f1`
    const digest = output(await execInstance(instanceId, command) as Record<string, unknown>)
    if (!/^[a-f0-9]{64}$/.test(digest)) throw new Agent37Error('CAPABILITY_VERIFICATION_FAILED', 502)
    return { id: item.id, status: 'installed' as const, source_revision: revision, artifact_sha256: digest }
  }
  if (!SHELL_SAFE.test(item.id.slice('skill:'.length))) throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
  const identifier = item.id.slice('skill:'.length)
  const command = `HERMES_HOME=/home/node/.hermes hermes skills install ${quote(identifier)} --yes && HERMES_HOME=/home/node/.hermes python3 -c ${quote(`import json,pathlib,sys; sys.path.insert(0,'/home/node/.hermes/hermes-agent'); from tools.skills_guard import content_hash; p=pathlib.Path('/home/node/.hermes/skills/.hub/lock.json'); d=json.loads(p.read_text()); rows=[dict(name=k,**v) for k,v in d.get('installed',{}).items() if v.get('identifier') == ${JSON.stringify(identifier)}]; assert len(rows)==1; row=rows[0]; root=pathlib.Path('/home/node/.hermes/skills')/row['install_path']; assert content_hash(root)==row.get('content_hash'); assert row.get('scan_verdict') in ('safe','caution'); assert isinstance(row.get('scan_provenance'),dict); print(json.dumps(row,sort_keys=True))`)}`
  const raw = output(await execInstance(instanceId, command) as Record<string, unknown>)
  let record: Record<string, unknown>
  try { record = JSON.parse(raw.split('\n').at(-1)!) as Record<string, unknown> } catch { throw new Agent37Error('CAPABILITY_VERIFICATION_FAILED', 502) }
  const digest = String(record.content_hash ?? '')
  if (!/^[a-f0-9]{64}$/.test(digest) || record.identifier !== identifier || record.scan_verdict === 'block') throw new Agent37Error('CAPABILITY_VERIFICATION_FAILED', 502)
  return { id: item.id, status: 'installed' as const, source_revision: String(record.metadata && typeof record.metadata === 'object' ? (record.metadata as Record<string, unknown>).commit_sha ?? item.source : item.source), artifact_sha256: digest }
}

async function installPlugin(instanceId: string, item: CatalogItem) {
  if (item.id === 'plugin:agency-agents-router' && item.trust === 'legacy') {
    const revision = item.revision!
    const command = `tmp=$(mktemp -d) && git clone --quiet ${quote(item.source)} "$tmp/repo" && git -C "$tmp/repo" checkout --quiet ${quote(revision)} && HERMES_HOME=/home/node/.hermes "$tmp/repo/scripts/convert.sh" --tool hermes && HERMES_HOME=/home/node/.hermes "$tmp/repo/scripts/install.sh" --tool hermes --no-interactive --no-convert && rm -rf "$tmp" && HERMES_HOME=/home/node/.hermes hermes plugins list --enabled --json | python3 -c ${quote(`import json,sys; data=json.load(sys.stdin); assert any(item.get('name') == 'agency-agents-router' and item.get('status') == 'enabled' for item in data)`)} && find /home/node/.hermes/plugins/agency-agents-router -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1`
    const digest = output(await execInstance(instanceId, command) as Record<string, unknown>)
    if (!/^[a-f0-9]{64}$/.test(digest)) throw new Agent37Error('CAPABILITY_VERIFICATION_FAILED', 502)
    return { id: item.id, status: 'installed' as const, source_revision: revision, artifact_sha256: digest }
  }
  if (!SHELL_SAFE.test(item.name) || !item.revision || !/^[a-f0-9]{40}$/.test(item.revision)) throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
  const command = `HERMES_HOME=/home/node/.hermes hermes plugins install ${quote(item.name)} --ref ${quote(item.revision)} --enable && HERMES_HOME=/home/node/.hermes hermes plugins list --user --json | python3 -c ${quote(`import json,sys; rows=json.load(sys.stdin); assert any(x.get('name') == ${JSON.stringify(item.name)} and x.get('status') == 'enabled' for x in rows)`) } && python3 -c ${quote(`import hashlib,json,pathlib; p=pathlib.Path('/home/node/.hermes/plugins/.install-metadata.json'); d=json.loads(p.read_text()); rows=[v for k,v in d.items() if k == ${JSON.stringify(item.name)} and v.get('source') == ${JSON.stringify(item.source)} and v.get('revision') == ${JSON.stringify(item.revision)} and v.get('pinned') is True]; assert len(rows)==1; root=pathlib.Path('/home/node/.hermes/plugins')/${JSON.stringify(item.name)}; h=hashlib.sha256(); files=sorted(x for x in root.rglob('*') if x.is_file() and '.git' not in x.parts); [(h.update(x.relative_to(root).as_posix().encode()),h.update(b'\\0'),h.update(x.read_bytes()),h.update(b'\\0')) for x in files]; print(h.hexdigest())`)}`
  const digest = output(await execInstance(instanceId, command) as Record<string, unknown>)
  const hash = digest.split('\n').at(-1) ?? ''
  if (!/^[a-f0-9]{64}$/.test(hash)) throw new Agent37Error('CAPABILITY_VERIFICATION_FAILED', 502)
  return { id: item.id, status: 'installed' as const, source_revision: item.revision, artifact_sha256: hash }
}

export async function applyRuntimeConfiguration(instanceId: string, configuration: AgentConfigurationV1, resolvedCapabilities?: CatalogItem[]): Promise<RuntimeReceipt> {
  const { provider, actual } = await applyModel(instanceId, configuration.runtime.model)
  const effectiveCapabilities = resolvedCapabilities ?? configuration.runtime.capability_ids.map((id) => {
    if (!INSTALLABLE_HERMES_CAPABILITY_IDS.has(id)) throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
    if (id === 'skill:privy') return { id, kind: 'skill', name: 'privy', description: '', source: 'https://github.com/privy-io/privy-agentic-wallets-skill.git', trust: 'legacy', installable: true } as CatalogItem
    return { id, kind: 'plugin', name: 'agency-agents-router', description: '', source: 'https://github.com/msitarzewski/agency-agents.git', trust: 'legacy', installable: true, revision: '6d29a9b08785a0e49ffc9818bbdd381164c2df5f' } as CatalogItem
  })
  const expected = new Set(configuration.runtime.capability_ids)
  if (effectiveCapabilities.length !== expected.size || effectiveCapabilities.some((item) => !expected.has(item.id) || !item.installable)) throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
  const capabilities: RuntimeReceipt['capabilities'] = []
  for (const item of effectiveCapabilities) capabilities.push(item.kind === 'skill' ? await installSkill(instanceId, item) : await installPlugin(instanceId, item))
  return { model: { provider: provider.provider, id: provider.id, config_sha256: createHash('sha256').update(actual).digest('hex') }, capabilities }
}

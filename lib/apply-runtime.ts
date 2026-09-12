import { createHash } from 'node:crypto'
import { Agent37Error, execInstance, instanceRequest } from './agent37'
import type { AgentConfigurationV1 } from './agent-configuration'
import { HERMES_PLUGINS, HERMES_SKILLS } from './hermes-catalog'

const SKILLS = new Map(HERMES_SKILLS.map((item) => [item.slug, item]))
const PLUGINS = new Map(HERMES_PLUGINS.map((item) => [item.slug, item]))
const SKILL_INSTALLERS: Record<string, { repository: string; revision: string }> = {
  privy: {
    repository: 'https://github.com/privy-io/privy-agentic-wallets-skill.git',
    revision: '7f104aa118a891aca85cfebbd68bf9f4a2cd85e7',
  },
}
const PLUGIN_INSTALLERS: Record<string, string> = {
  'agency-agents-router': '6d29a9b08785a0e49ffc9818bbdd381164c2df5f',
}
const SHELL_SAFE = /^[A-Za-z0-9._/-]{1,160}$/

export type RuntimeReceipt = {
  model: { provider: 'default' | 'surplus'; id: string; config_sha256: string }
  capabilities: Array<{ id: string; status: 'installed'; evidence: string }>
}

function quote(value: string) { return `'${value.replaceAll("'", "'\\''")}'` }

function validatedProxyUrl() {
  const raw = process.env.SURPLUS_AGENT_PROXY_URL?.trim()
  if (!raw) throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503)
  let url: URL
  try { url = new URL(raw) } catch { throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503) }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || (url.port && url.port !== '443')) throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503)
  return `${url.toString().replace(/\/$/, '').replace(/\/v1$/, '')}/v1`
}

function providerConfig(model: string) {
  if (!model.startsWith('surplus/')) return {
    provider: 'default' as const,
    id: model,
    yaml: `model:\n  provider: agent37\n  default: ${JSON.stringify(model)}\n`,
    secret: null,
  }
  const id = model.slice('surplus/'.length)
  const token = process.env.SURPLUS_AGENT_PROXY_TOKEN?.trim()
  if (!token || !SHELL_SAFE.test(id)) throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503)
  const api = validatedProxyUrl()
  return {
    provider: 'surplus' as const,
    id,
    secret: token,
    yaml: `model:\n  provider: "custom:surplus"\n  default: ${JSON.stringify(id)}\nproviders:\n  surplus:\n    api: ${JSON.stringify(api)}\n    key_env: "SURPLUS_AGENT_PROXY_TOKEN"\n    transport: "openai_chat"\n    discover_models: false\n    models:\n      - ${JSON.stringify(id)}\n`,
  }
}

async function applyModel(instanceId: string, model: string) {
  const provider = providerConfig(model)
  const configPath = '/home/user/.hermes/config.yaml'
  const envPath = '/home/user/.hermes/.env'
  const configEncoded = Buffer.from(provider.yaml).toString('base64')
  const commands = [`mkdir -p /home/user/.hermes`, `printf %s ${quote(configEncoded)} | base64 -d > ${quote(configPath)}`, `chmod 600 ${quote(configPath)}`]
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

export async function applyRuntimeConfiguration(instanceId: string, configuration: AgentConfigurationV1): Promise<RuntimeReceipt> {
  const { provider, actual } = await applyModel(instanceId, configuration.runtime.model)
  const capabilities: RuntimeReceipt['capabilities'] = []
  for (const capabilityId of configuration.runtime.capability_ids) {
    const [kind, slug] = capabilityId.split(':', 2)
    if (!SHELL_SAFE.test(slug)) throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
    if (kind === 'skill') {
      if (!SKILLS.has(slug)) throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
      const installer = SKILL_INSTALLERS[slug]
      if (!installer) throw new Agent37Error('CAPABILITY_NOT_INSTALLABLE', 400)
      const result = await execInstance(instanceId, `tmp=$(mktemp -d) && git clone --quiet ${quote(installer.repository)} "$tmp/repo" && git -C "$tmp/repo" checkout --quiet ${quote(installer.revision)} && mkdir -p ${quote(`/home/user/.hermes/skills/${slug}`)} && cp "$tmp/repo/SKILL.md" ${quote(`/home/user/.hermes/skills/${slug}/SKILL.md`)} && if test -d "$tmp/repo/references"; then cp -R "$tmp/repo/references" ${quote(`/home/user/.hermes/skills/${slug}/references`)}; fi && rm -rf "$tmp" && test -f ${quote(`/home/user/.hermes/skills/${slug}/SKILL.md`)}`) as Record<string, unknown>
      if (result.exit_code !== 0) throw new Agent37Error('CAPABILITY_INSTALL_FAILED', 502)
      capabilities.push({ id: capabilityId, status: 'installed', evidence: `~/.hermes/skills/${slug}/SKILL.md@${installer.revision}` })
    } else if (kind === 'plugin') {
      if (!PLUGINS.has(slug)) throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
      const revision = PLUGIN_INSTALLERS[slug]
      if (!revision) throw new Agent37Error('CAPABILITY_NOT_INSTALLABLE', 400)
      const command = `tmp=$(mktemp -d) && git clone --quiet ${quote('https://github.com/msitarzewski/agency-agents.git')} "$tmp/repo" && git -C "$tmp/repo" checkout --quiet ${quote(revision)} && HERMES_HOME=/home/user/.hermes "$tmp/repo/scripts/convert.sh" --tool hermes && HERMES_HOME=/home/user/.hermes "$tmp/repo/scripts/install.sh" --tool hermes --no-interactive --no-convert && rm -rf "$tmp" && HERMES_HOME=/home/user/.hermes hermes plugins list --enabled --json | python3 -c ${quote(`import json,sys; data=json.load(sys.stdin); assert any(item.get('name') == '${slug}' and item.get('status') == 'enabled' for item in data)`)}`
      const result = await execInstance(instanceId, command) as Record<string, unknown>
      if (result.exit_code !== 0) throw new Agent37Error('CAPABILITY_INSTALL_FAILED', 502)
      capabilities.push({ id: capabilityId, status: 'installed', evidence: `hermes plugins list --enabled: ${slug}@${revision}` })
    } else throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
  }
  return { model: { provider: provider.provider, id: provider.id, config_sha256: createHash('sha256').update(actual).digest('hex') }, capabilities }
}

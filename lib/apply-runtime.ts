import { createHash } from 'node:crypto'
import { Agent37Error, execInstance, instanceRequest } from './agent37'
import type { AgentConfigurationV1 } from './agent-configuration'
import { HERMES_PLUGINS, HERMES_SKILLS } from './hermes-catalog'

const SKILLS = new Map(HERMES_SKILLS.map((item) => [item.slug, item]))
const PLUGINS = new Map(HERMES_PLUGINS.map((item) => [item.slug, item]))
const SKILL_INSTALLERS: Record<string, string> = {
  privy: 'https://raw.githubusercontent.com/privy-io/privy-agentic-wallets-skill/7f104aa118a891aca85cfebbd68bf9f4a2cd85e7/SKILL.md',
}
const PLUGIN_INSTALLERS: Record<string, string> = {
  'agency-agents-router': '6d29a9b08785a0e49ffc9818bbdd381164c2df5f',
}
const SHELL_SAFE = /^[A-Za-z0-9._/-]{1,160}$/

export type RuntimeReceipt = {
  model: { provider: 'default' | 'surplus'; id: string; config_sha256: string }
  capabilities: Array<{ id: string; status: 'available' | 'installed'; evidence: string }>
}

function quote(value: string) { return `'${value.replaceAll("'", "'\\''")}'` }

function providerConfig(model: string) {
  if (!model.startsWith('surplus/')) return { provider: 'default' as const, id: model, yaml: `model:\n  provider: agent37\n  default: ${model}\n` }
  const id = model.slice('surplus/'.length)
  const base = process.env.SURPLUS_AGENT_PROXY_URL?.trim()
  const token = process.env.SURPLUS_AGENT_PROXY_TOKEN?.trim()
  if (!base || !token || !SHELL_SAFE.test(id)) throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503)
  let url: URL
  try { url = new URL(base) } catch { throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503) }
  if (url.protocol !== 'https:' || url.username || url.password) throw new Agent37Error('SURPLUS_NOT_CONFIGURED', 503)
  const normalized = `${url.toString().replace(/\/$/, '').replace(/\/v1$/, '')}/v1`
  return { provider: 'surplus' as const, id, yaml: `model:\n  provider: "custom:Surplus"\n  default: ${JSON.stringify(id)}\ncustom_providers:\n  - name: "Surplus"\n    base_url: ${JSON.stringify(normalized)}\n    api_key: ${JSON.stringify(token)}\n    api_mode: "chat_completions"\n    model: ${JSON.stringify(id)}\n` }
}

export async function applyRuntimeConfiguration(instanceId: string, configuration: AgentConfigurationV1): Promise<RuntimeReceipt> {
  const provider = providerConfig(configuration.runtime.model)
  const configPath = '/home/user/.hermes/config.yaml'
  const encoded = Buffer.from(provider.yaml).toString('base64')
  const write = await execInstance(instanceId, `mkdir -p /home/user/.hermes && printf %s ${quote(encoded)} | base64 -d > ${quote(configPath)}`) as Record<string, unknown>
  if (write.exit_code !== 0) throw new Agent37Error('RUNTIME_CONFIG_FAILED', 502)
  const response = await instanceRequest(instanceId, `/v1/files/content?path=${encodeURIComponent(configPath)}`)
  const actual = await response.text()
  if (actual !== provider.yaml) throw new Agent37Error('RUNTIME_CONFIG_VERIFICATION_FAILED', 502)

  const capabilities: RuntimeReceipt['capabilities'] = []
  for (const capabilityId of configuration.runtime.capability_ids) {
    const [kind, slug] = capabilityId.split(':', 2)
    if (!SHELL_SAFE.test(slug)) throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
    if (kind === 'skill') {
      if (!SKILLS.has(slug)) throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
      const identifier = SKILL_INSTALLERS[slug]
      if (!identifier) throw new Agent37Error('CAPABILITY_NOT_INSTALLABLE', 400)
      const result = await execInstance(instanceId, `hermes skills install ${quote(identifier)} --name ${quote(slug)} --yes && test -f ${quote(`/home/user/.hermes/skills/${slug}/SKILL.md`)}`) as Record<string, unknown>
      if (result.exit_code !== 0) throw new Agent37Error('CAPABILITY_INSTALL_FAILED', 502)
      capabilities.push({ id: capabilityId, status: 'installed', evidence: `~/.hermes/skills/${slug}/SKILL.md` })
    } else if (kind === 'plugin') {
      if (!PLUGINS.has(slug)) throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
      const identifier = PLUGIN_INSTALLERS[slug]
      if (!identifier) throw new Agent37Error('CAPABILITY_NOT_INSTALLABLE', 400)
      const result = await execInstance(instanceId, `tmp=$(mktemp -d) && git clone --quiet ${quote('https://github.com/msitarzewski/agency-agents.git')} "$tmp/repo" && git -C "$tmp/repo" checkout --quiet ${quote(identifier)} && HERMES_HOME=/home/user/.hermes "$tmp/repo/scripts/convert.sh" --tool hermes && HERMES_HOME=/home/user/.hermes "$tmp/repo/scripts/install.sh" --tool hermes --no-interactive --no-convert && rm -rf "$tmp" && HERMES_HOME=/home/user/.hermes hermes plugins list --enabled --json | grep -F ${quote(`"name": "${slug}"`)}`) as Record<string, unknown>
      if (result.exit_code !== 0) throw new Agent37Error('CAPABILITY_INSTALL_FAILED', 502)
      capabilities.push({ id: capabilityId, status: 'installed', evidence: `hermes plugins list --enabled: ${slug}` })
    } else throw new Agent37Error('CAPABILITY_NOT_APPROVED', 400)
  }
  return { model: { provider: provider.provider, id: provider.id, config_sha256: createHash('sha256').update(actual).digest('hex') }, capabilities }
}

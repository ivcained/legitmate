'use client'

import { getAccessToken } from '@privy-io/react-auth'
import { useEffect, useMemo, useState } from 'react'
import { createServerOwnedPreset, parseRequest } from '../lib/preset'
import { ALLOWED_PERMISSIONS, type Permission } from '../lib/permissions'
import { newYouTubeAssistant, type AssistantLifecycle, type AssistantSnapshot, type State } from '../lib/lifecycle'
import { EmbeddedWallet } from '../components/embedded-wallet'
import { AGENCY_AGENTS, AGENCY_AGENT_COUNT, type AgencyAgent } from '../lib/agency-agents'
import { HERMES_PLUGIN_COUNT, HERMES_SKILL_COUNT, INSTALLABLE_HERMES_CAPABILITIES, type HermesCapability } from '../lib/hermes-catalog'
import { agentActionRequest, type AgentAction } from '../lib/agent-actions'

const stages = ['Brief', 'Prepared setup', 'Access & plan', 'Isolated trial', 'Activation', 'Dashboard / audit']
const promptExample = 'Each Monday, research emerging Ethereum topics and prepare three video concepts for review. Never publish without approval.'
const stateLabel: Record<State, string> = { draft: 'DRAFT', reviewed: 'REVIEWED', entitled: 'ENTITLED', provisioned: 'PROVISIONED', 'test-passed': 'TESTED', active: 'ACTIVE' }
const STORAGE_KEY = 'legitmate.workspace'
const STORAGE_VERSION = 1
const surfacePorts: Record<'chat' | 'files' | 'terminal' | 'integrations' | 'settings', number> = { chat: 9119, files: 8080, terminal: 7681, integrations: 9119, settings: 9119 }
const permissionLabels: Record<Permission, string> = {
  'youtube.channel.read': 'Read channel details',
  'youtube.analytics.read': 'Read channel analytics',
  'youtube.video.draft.write': 'Create video drafts',
}
type Decision = 'approved' | 'denied'
type WorkspaceRecord = { version: 1; brief: string; id: string; decisions: Partial<Record<Permission, Decision>>; trialOutput: string[]; acknowledged: boolean; snapshot: AssistantSnapshot }
type AgentInstance = { id: string; name: string; status: string; template: string; url?: string; createdAt: string; usage?: { spend: string; budget: string } }
type StoredLaunch = { version: 1; requestId: string; template: string; instance: AgentInstance }
const LAUNCH_STORAGE_KEY = 'legitmate.launch'
type ConfigurationReceipt = { schema_version: 1; config_id: string; status: 'applied'; files: Array<{ role: 'configuration' | 'soul' | 'user' | 'agents'; path: string; sha256: string; bytes: number }>; verified_at: string }
type RuntimeReceipt = { model: { provider: 'default' | 'surplus'; id: string; config_sha256: string }; capabilities: Array<{ id: string; status: 'available' | 'installed'; evidence: string }> }
type LaunchState = { template: string; phase: 'launching' | 'applied' | 'failed'; requestId: string; message: string; instance?: AgentInstance; receipt?: ConfigurationReceipt; runtime?: RuntimeReceipt; agencyAgent?: AgencyAgent }
type ProofState = { phase: 'idle' | 'running' | 'succeeded' | 'failed'; key?: string; output?: string; executionId?: string; message?: string }
type ModelChoice = { id: string; label: string; provider: 'default' | 'surplus' }
type TemplatePreflight = { template: HermesTemplate; resources: typeof resourceDefaults }
type TemplateGroup = 'All' | 'Creator ops' | 'Personal admin' | 'Research'

const resourceDefaults = { cpu: 2, memory: 4, disk: 6 }
type HermesTemplate = { id: string; name: string; outcome: string; detail: string; group: Exclude<TemplateGroup, 'All'>; tag: string }

const hermesTemplates: HermesTemplate[] = [
  { id: 'agent37-hermes', name: 'Hermes daily desk', outcome: 'Turn loose requests into a clean daily queue.', detail: 'Files, browser, terminal, and skills pre-wired for repeatable admin.', group: 'Personal admin', tag: 'BEST START' },
  { id: 'agent37-hermes', name: 'Creator operations', outcome: 'Move from research to review-ready drafts.', detail: 'A read-only research loop for briefs, concepts, and publishing checks.', group: 'Creator ops', tag: 'MOST POPULAR' },
  { id: 'agent37-hermes', name: 'Research companion', outcome: 'Keep a question moving while you work elsewhere.', detail: 'Hermes workspace with a live desktop option for longer investigations.', group: 'Research', tag: 'DEEP WORK' },
]

function isState(value: unknown): value is State { return typeof value === 'string' && ['draft', 'reviewed', 'entitled', 'provisioned', 'test-passed', 'active'].includes(value) }
function validRecord(value: unknown): value is WorkspaceRecord {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<WorkspaceRecord>
  const snap = item.snapshot
  return item.version === STORAGE_VERSION && typeof item.brief === 'string' && typeof item.id === 'string' && !!snap && typeof snap === 'object' && isState(snap.state) && Array.isArray(snap.requestedPermissions) && snap.requestedPermissions.every((p) => ALLOWED_PERMISSIONS.includes(p as Permission)) && Array.isArray(snap.audit)
}
function conceptsFor(brief: string): string[] {
  const topic = brief.match(/ethereum|crypto|web3|blockchain/i) ? 'Ethereum' : 'your audience'
  return [`Research ${topic} questions your audience is asking`, `Three practical ${topic} concepts for the next review`, `A safer workflow for turning research into drafts`]
}
function replay(record: WorkspaceRecord): AssistantLifecycle | null {
  try {
    const assistant = newYouTubeAssistant(record.id)
    const state = record.snapshot.state
    if (state !== 'draft') assistant.review()
    if (['entitled', 'provisioned', 'test-passed', 'active'].includes(state)) assistant.entitle()
    if (['provisioned', 'test-passed', 'active'].includes(state)) assistant.provision()
    if (['test-passed', 'active'].includes(state)) assistant.passTrial()
    if (state === 'active') { assistant.approve(); assistant.activate() }
    return assistant
  } catch { return null }
}

export default function Home() {
  const [brief, setBrief] = useState('')
  const [assistant, setAssistant] = useState<AssistantLifecycle | null>(null)
  const [decisions, setDecisions] = useState<Partial<Record<Permission, Decision>>>({})
  const [trialOutput, setTrialOutput] = useState<string[]>([])
  const [ack, setAck] = useState(false)
  const [error, setError] = useState('')
  const [launchState, setLaunchState] = useState<LaunchState | null>(null)
  const [proofState, setProofState] = useState<ProofState>({ phase: 'idle' })
  const [preflight, setPreflight] = useState<TemplatePreflight | null>(null)
  const [templateQuery, setTemplateQuery] = useState('')
  const [templateGroup, setTemplateGroup] = useState<TemplateGroup>('All')
  const [agencyQuery, setAgencyQuery] = useState('')
  const [agencyDivision, setAgencyDivision] = useState('All')
  const [selectedAgency, setSelectedAgency] = useState<AgencyAgent | null>(null)
  const [agencySoul, setAgencySoul] = useState('')
  const [agencyUser, setAgencyUser] = useState('')
  const [agencySkills, setAgencySkills] = useState('')
  const [selectedModel, setSelectedModel] = useState('nous-default')
  const [availableModels, setAvailableModels] = useState<ModelChoice[]>([
    { id: 'nous-default', label: 'Balanced — recommended', provider: 'default' },
    { id: 'nous-reasoning', label: 'Deep reasoning', provider: 'default' },
  ])
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [capabilityQuery, setCapabilityQuery] = useState('')
  const [capabilityKind, setCapabilityKind] = useState<'all' | 'skill' | 'plugin'>('all')
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [agentBusy, setAgentBusy] = useState(false)
  const [agentError, setAgentError] = useState('')
  const [resourceConfig, setResourceConfig] = useState({ cpu: 2, memory: 4, disk: 6 })
  const [revision, setRevision] = useState(0)
  const snap = assistant?.snapshot

  useEffect(() => {
    fetch('/api/models').then((response) => response.json()).then((result) => {
      if (result.ok && Array.isArray(result.models)) setAvailableModels(result.models)
    }).catch(() => undefined).finally(() => setModelsLoaded(true))
  }, [])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAUNCH_STORAGE_KEY)
      if (!raw) return
      const stored = JSON.parse(raw) as StoredLaunch
      if (stored?.version !== 1 || !stored.instance?.id || !stored.requestId) { window.localStorage.removeItem(LAUNCH_STORAGE_KEY); return }
      setLaunchState({ template: stored.template, phase: 'launching', requestId: stored.requestId, instance: stored.instance, message: 'Checking workspace configuration…' })
      setProofState({ phase: 'idle' })
      authenticatedFetch(`/api/agents/instances/${stored.instance.id}/configuration`).then(async (response) => {
        const result = await response.json()
        if (!response.ok || !result.ok || result.status !== 'applied') throw new Error(result.message ?? 'Saved configuration could not be verified.')
        setLaunchState({ template: stored.template, phase: 'applied', requestId: stored.requestId, instance: stored.instance, receipt: result.receipt as ConfigurationReceipt, message: 'Configuration verified after reopen.' })
      }).catch((error) => setLaunchState({ template: stored.template, phase: 'failed', requestId: stored.requestId, instance: stored.instance, message: error instanceof Error ? error.message : 'Saved configuration could not be verified.' }))
    } catch { window.localStorage.removeItem(LAUNCH_STORAGE_KEY) }
  // authenticatedFetch is stable for the initial browser session.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!launchState?.instance || launchState.phase !== 'applied') return
    const record: StoredLaunch = { version: 1, requestId: launchState.requestId, template: launchState.template, instance: launchState.instance }
    window.localStorage.setItem(LAUNCH_STORAGE_KEY, JSON.stringify(record))
  }, [launchState])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed: unknown = JSON.parse(raw)
      if (!validRecord(parsed)) { window.localStorage.removeItem(STORAGE_KEY); return }
      const restored = replay(parsed)
      if (!restored) { window.localStorage.removeItem(STORAGE_KEY); return }
      setBrief(parsed.brief); setAssistant(restored); setDecisions(parsed.decisions); setTrialOutput(parsed.trialOutput); setAck(parsed.acknowledged)
    } catch { window.localStorage.removeItem(STORAGE_KEY) }
  }, [])

  useEffect(() => {
    if (!assistant || !snap) return
    const record: WorkspaceRecord = { version: STORAGE_VERSION, brief, id: assistant.id, decisions, trialOutput, acknowledged: ack, snapshot: snap }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  }, [assistant, snap, brief, decisions, trialOutput, ack, revision])

  const stage = !assistant ? 'brief' : !snap ? 'brief' : snap.state === 'draft' ? 'prepared' : snap.state === 'reviewed' ? 'access' : snap.state === 'entitled' ? 'access' : snap.state === 'provisioned' ? 'trial' : snap.state === 'test-passed' ? 'activation' : 'dashboard'
  const stageIndex = Math.max(0, stages.findIndex((item) => item.toLowerCase().startsWith(stage)))
  const visibleTemplates = hermesTemplates.filter((template) => {
    const matchesGroup = templateGroup === 'All' || template.group === templateGroup
    const haystack = `${template.name} ${template.outcome} ${template.detail}`.toLowerCase()
    return matchesGroup && haystack.includes(templateQuery.toLowerCase().trim())
  })
  const agencyDivisions = ['All', ...Array.from(new Set(AGENCY_AGENTS.map((agent) => agent.division))).sort()]
  const visibleAgencyAgents = AGENCY_AGENTS.filter((agent) => {
    const divisionMatch = agencyDivision === 'All' || agent.division === agencyDivision
    const queryMatch = `${agent.name} ${agent.description} ${agent.vibe}`.toLowerCase().includes(agencyQuery.toLowerCase().trim())
    return divisionMatch && queryMatch
  })
  const capabilityMatches = INSTALLABLE_HERMES_CAPABILITIES.filter((item) => (capabilityKind === 'all' || item.kind === capabilityKind) && `${item.name} ${item.description}`.toLowerCase().includes(capabilityQuery.toLowerCase().trim()))
  const toggleCapability = (capability: HermesCapability) => setSelectedCapabilities((current) => current.includes(capability.slug) ? current.filter((slug) => slug !== capability.slug) : [...current, capability.slug])
  const audit = useMemo(() => snap?.audit.slice().reverse() ?? [], [snap])
  const act = (fn: () => void) => { try { setError(''); fn(); setRevision((value) => value + 1) } catch (e) { setError(e instanceof Error ? e.message : 'Action blocked') } }
  const authenticatedFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const token = process.env.NEXT_PUBLIC_PRIVY_APP_ID ? await getAccessToken().catch(() => null) : null
    return fetch(input, { ...init, headers: { ...init.headers, ...(token ? { authorization: `Bearer ${token}` } : {}) } })
  }
  const agentAction = async (action: AgentAction) => {
    const instance = launchState?.instance
    if (!instance) return
    if (action === 'delete' && !window.confirm('Delete this instance? Its files, memory, sessions, and connections will be permanently removed.')) return
    setAgentBusy(true); setAgentError('')
    try {
      const request = agentActionRequest(instance.id, action, resourceConfig)
      const response = await authenticatedFetch(request.url, request.init)
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message ?? 'Agent action is unavailable.')
      if (action === 'delete') { setLaunchState(null); setProofState({ phase: 'idle' }); window.localStorage.removeItem(LAUNCH_STORAGE_KEY); setAgentError('Instance deleted.'); return }
      setLaunchState((current) => current ? { ...current, instance: { ...instance, status: result.instance?.status ?? (action === 'stop' ? 'stopped' : 'running') }, message: `Instance ${action} request accepted.` } : current)
    } catch (e) { setAgentError(e instanceof Error ? e.message : 'Agent action failed.') } finally { setAgentBusy(false) }
  }
  const openAgentSurface = async (surface: 'chat' | 'files' | 'terminal' | 'integrations' | 'settings') => {
    const instance = launchState?.instance
    if (!instance) return
    setAgentBusy(true); setAgentError('')
    try {
      const response = await authenticatedFetch(`/api/agents/instances/${instance.id}/signed-url`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ port: surfacePorts[surface] }) })
      const result = await response.json()
      if (!response.ok || !result.ok || typeof result.result?.url !== 'string') throw new Error(result.message ?? 'Signed access is not available.')
      window.open(result.result.url, '_blank', 'noopener,noreferrer')
    } catch (e) { setAgentError(e instanceof Error ? e.message : 'Could not mint a signed link.') } finally { setAgentBusy(false) }
  }
  const openTemplatePreflight = (template: HermesTemplate) => {
    setPreflight({ template, resources: resourceConfig })
    setLaunchState(null)
    setAgentError('')
  }
  const launchAgent = async (template: string, label: string, resources = resourceConfig) => {
    setPreflight(null)
    setProofState({ phase: 'idle' })
    const requestId = launchState?.template === template && launchState.phase === 'failed' ? launchState.requestId : crypto.randomUUID()
    setLaunchState({ template, phase: 'launching', requestId, message: `Creating ${label} and applying its configuration…` }); setAgentError('')
    try {
      const response = await authenticatedFetch('/api/agents/launch', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ template, name: label, resources, client_request_id: requestId, agency_agent_slug: selectedAgency?.slug, model: selectedModel, capabilities: selectedCapabilities, profile: selectedAgency ? { soul: agencySoul, user: agencyUser, agents: agencySkills } : undefined }) })
      const result = await response.json()
      const raw = result.instance as Record<string, unknown> | undefined
      if (!response.ok || !result.ok) {
        const failedInstance = raw?.id ? { id: String(raw.id), name: label, status: 'configuration pending', template, createdAt: new Date().toISOString() } : undefined
        setLaunchState({ template, phase: 'failed', requestId, message: result.message ?? (failedInstance ? 'The workspace exists, but its model or capabilities could not be verified. Open the instance only after setup succeeds.' : 'Workspace creation failed.'), instance: failedInstance })
        return
      }
      const receipt = result.configuration as ConfigurationReceipt
      if (receipt?.status !== 'applied') throw new Error('Configuration readback was not verified.')
      setLaunchState({ template, phase: 'applied', requestId, receipt, runtime: result.runtime as RuntimeReceipt | undefined, message: `Configuration verified · ${receipt.files.length} profile files and runtime settings read back.`, instance: { id: String(raw!.id), name: label, status: String(raw!.status ?? 'provisioned'), template, url: typeof raw!.url === 'string' ? raw!.url : undefined, createdAt: new Date().toISOString(), usage: { spend: '$0.00', budget: '$5.00 / month' } } })
    } catch (e) { setLaunchState({ template, phase: 'failed', requestId, message: e instanceof Error ? e.message : 'Launch could not be reached.' }) }
  }
  const runProofTask = async () => {
    const instance = launchState?.instance
    if (!instance || launchState?.phase !== 'applied') return
    const key = proofState.key ?? `proof_${crypto.randomUUID().replaceAll('-', '')}`
    setProofState({ phase: 'running', key, message: 'Running one safe readiness check…' })
    try {
      const response = await authenticatedFetch(`/api/agents/instances/${instance.id}/proof-task`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ idempotency_key: key }) })
      const result = await response.json()
      if (!response.ok || !result.ok || result.status !== 'succeeded') throw new Error(result.message ?? 'The readiness check did not finish.')
      setProofState({ phase: 'succeeded', key, output: String(result.output_text), executionId: String(result.execution_id), message: 'Readiness check passed.' })
    } catch (error) { setProofState({ phase: 'failed', key, message: error instanceof Error ? error.message : 'The readiness check did not finish.' }) }
  }

  const prepare = () => {
    if (brief.trim().length < 12) { setError('Add a little more detail so we can prepare a useful setup.'); return }
    try {
      const preset = createServerOwnedPreset()
      parseRequest({ description: brief, requestedPermissions: preset.requestedPermissions })
      setAssistant(newYouTubeAssistant(`demo-${Date.now()}`)); setDecisions({}); setTrialOutput([]); setAck(false); setError('')
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not prepare setup') }
  }
  const setPermission = (permission: Permission, decision: Decision) => setDecisions((current) => ({ ...current, [permission]: decision }))
  const reviewedPermissionCount = snap?.requestedPermissions.filter((permission) => decisions[permission] !== undefined).length ?? 0
  const allPermissionsReviewed = Boolean(snap && reviewedPermissionCount === snap.requestedPermissions.length)
  const runTrial = () => act(() => { assistant!.passTrial(); setTrialOutput(conceptsFor(brief)) })
  const reset = () => { setAssistant(null); setBrief(''); setDecisions({}); setTrialOutput([]); setAck(false); setError(''); window.localStorage.removeItem(STORAGE_KEY) }

  return <main className="shell"><header className="topbar"><div className="brand"><span className="brand-mark">LM</span> LegitMate</div><div className="top-meta">Commissioning desk · v0.1 / sandbox</div></header><div className="main">
    <section className="intro"><div><div className="eyebrow">A managed assistant, properly commissioned</div><h1>Describe the work.<br /><em>We prepare</em> the assistant.</h1><p className="intro-copy">Start with a working setup, not a blank screen. Review the proposed tools, boundaries, and activation decision before anything can act.</p></div><div className="registration mono">FILE 001 / YC-OPS<strong>Prepared for creator operations</strong>09 SEP 2026<br />Provider-free walkthrough</div></section><div className="wallet-secondary"><EmbeddedWallet /></div><nav className="quick-nav" aria-label="Workspace sections"><a href="#agency">Agency roster</a><a href="#workspaces">Prepared workspaces</a><a href="#workflow">Commissioning flow</a></nav>
    <section className="desk" aria-label="Assistant commissioning workflow"><div id="agency" className="agency-catalog"><div className="agency-catalog-head"><div><div className="eyebrow">Agency roster / specialist deployment</div><h2 className="agency-title">A complete AI agency at your fingertips.</h2><p className="lede">From frontend wizards to Reddit community ninjas, from whimsy injectors to reality checkers. Each specialist arrives with a point of view, a working method, and deliverables you can inspect.</p></div><div className="agency-count"><strong>{AGENCY_AGENT_COUNT}</strong><span>agents available<br />to deploy</span></div></div><div className="agency-tools"><input value={agencyQuery} onChange={(event) => setAgencyQuery(event.target.value)} placeholder="Search roles, skills, or personality" aria-label="Search Agency roster" /><select value={agencyDivision} onChange={(event) => setAgencyDivision(event.target.value)} aria-label="Filter Agency division">{agencyDivisions.map((division) => <option key={division}>{division}</option>)}</select></div><div className="agency-grid">{visibleAgencyAgents.map((agent) => <button key={agent.slug} className={selectedAgency?.slug === agent.slug ? 'agency-card selected' : 'agency-card'} onClick={() => { setSelectedAgency(agent); setAgencySoul(`# ${agent.name} / soul.md\\n\\nYou are ${agent.name}.\\n\\n## Working principles\\n${agent.vibe}`); setAgencyUser('# user.md\\n\\nOwner context and preferences go here.'); setAgencySkills(`# skills.md\\n\\nUse the approved skills and processes for ${agent.name}.`); }}><span className="agency-card-top"><span>{agent.division}</span>{selectedAgency?.slug === agent.slug && <b>SELECTED</b>}</span><strong>{agent.name}</strong><small>{agent.description}</small><em>“{agent.vibe}”</em></button>)}</div>{selectedAgency && <div className="agency-editor"><div className="agency-editor-head"><div><span className="eyebrow">Configure before deployment</span><h3>{selectedAgency.name}</h3><p>Granular edits become workspace files. Start with the profile, then make its identity yours.</p></div><button className="primary" onClick={() => { setLaunchState({ template: 'agent37-hermes', phase: 'failed', requestId: crypto.randomUUID(), message: `${selectedAgency.name} selected. Review the files, then launch from the workspace.` , agencyAgent: selectedAgency }); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }}>Prepare specialist →</button></div><div className="agency-file-grid">{([{ file: 'soul.md', value: agencySoul, setValue: setAgencySoul }, { file: 'user.md', value: agencyUser, setValue: setAgencyUser }, { file: 'skills.md', value: agencySkills, setValue: setAgencySkills }]).map(({ file, value, setValue }) => <label key={file}><span>{file}</span><textarea value={value} onChange={(event) => setValue(event.target.value)} /></label>)}</div><div className="model-picker"><span className="eyebrow">02 / Choose the model</span><h4>Which model should drive {selectedAgency.name}?</h4><p>Choose the reasoning profile separately from the specialist identity. You can change it later without losing the agent’s files.</p><div className="model-options">{availableModels.map((model) => <button key={model.id} type="button" className={selectedModel === model.id ? 'model-option selected' : 'model-option'} onClick={() => setSelectedModel(model.id)} aria-pressed={selectedModel === model.id}><strong>{model.label}</strong><small>{model.provider === 'surplus' ? 'Available through Surplus. Usage may cost more.' : model.id === 'nous-default' ? 'Best for most work.' : 'For long research and difficult decisions.'}</small></button>)}</div>{modelsLoaded && !availableModels.some((model) => model.provider === 'surplus') && <p className="agency-editor-note">Surplus models will appear here after the server URL is configured.</p>}</div><div className="capability-picker"><div className="capability-picker-head"><div><span className="eyebrow">03 / Add capabilities</span><h4>Verified skills and plugins</h4><p>Choose from capabilities with a tested Agent37 installer. The broader Hermes catalog contains {HERMES_SKILL_COUNT} skills and {HERMES_PLUGIN_COUNT} plugins; unverified entries stay hidden rather than failing during deployment.</p></div><span className="capability-count mono">{selectedCapabilities.length} selected</span></div><div className="capability-tools"><input value={capabilityQuery} onChange={(event) => setCapabilityQuery(event.target.value)} placeholder="Search skills or plugins" aria-label="Search Hermes capabilities" /><div>{(['all', 'skill', 'plugin'] as const).map((kind) => <button key={kind} type="button" className={capabilityKind === kind ? 'filter-button active' : 'filter-button'} onClick={() => setCapabilityKind(kind)}>{kind === 'all' ? 'All' : kind === 'skill' ? 'Skills' : 'Plugins'}</button>)}</div></div><div className="capability-list">{capabilityMatches.map((capability) => <button key={`${capability.kind}-${capability.slug}`} type="button" className={selectedCapabilities.includes(capability.slug) ? 'capability-row selected' : 'capability-row'} onClick={() => toggleCapability(capability)} aria-pressed={selectedCapabilities.includes(capability.slug)}><span className="capability-kind">{capability.kind}</span><strong>{capability.name}</strong><small>{capability.description}</small><b>{selectedCapabilities.includes(capability.slug) ? 'Added' : 'Add'}</b></button>)}</div><p className="agency-editor-note mono">Source: Hermes Skills Hub and Plugin Catalog. Applied capabilities remain subject to provider support, workspace policy, and explicit authorization.</p></div><p className="agency-editor-note mono">No new tools or external connections are granted by editing these files. Capabilities remain subject to workspace permissions.</p></div>}</div><div id="workspaces" className="agent-launch"><div className="agent-launch-intro"><div><div className="eyebrow">Prepared Hermes workspaces</div><h2 className="agent-launch-title">Review and deploy your specialist.</h2><p className="lede">Pick a focused bot, adjust its room, and launch a ready-to-use Hermes workspace. The defaults are sensible; the final say stays with you.</p></div><div className="launch-note mono"><span>03</span> templates<br /><span>01</span> click to configure<br /><span>0</span> hidden connections</div></div><div className="template-toolbar"><label className="template-search"><span className="sr-only">Search templates</span><input value={templateQuery} onChange={(event) => setTemplateQuery(event.target.value)} placeholder="Search a job or outcome" /></label><div className="template-filters" aria-label="Filter templates">{(['All', 'Creator ops', 'Personal admin', 'Research'] as TemplateGroup[]).map((group) => <button key={group} className={templateGroup === group ? 'filter-button active' : 'filter-button'} onClick={() => setTemplateGroup(group)} aria-pressed={templateGroup === group}>{group}</button>)}</div></div><div className="agent-options">{visibleTemplates.map((template) => <button className="agent-option" key={template.id} onClick={() => openTemplatePreflight(template)} disabled={Boolean(preflight || launchState?.phase === 'launching')}><span className="template-tag">{template.tag}</span><strong>{template.name}</strong><span className="template-outcome">{template.outcome}</span><small>{template.detail}</small><b>Review setup →</b></button>)}</div>{visibleTemplates.length === 0 && <div className="template-empty">No prepared desk matches that search. Try “research”, “creator”, or “admin”.</div>}{preflight && <div className="template-preflight" role="dialog" aria-labelledby="preflight-title"><div><span className="eyebrow">Preflight / no workspace created</span><h3 id="preflight-title">{preflight.template.name}</h3><p>{preflight.template.outcome} {preflight.template.detail}</p></div><div className="preflight-summary"><span>Resources</span><strong>{preflight.resources.cpu} vCPU · {preflight.resources.memory} GB memory · {preflight.resources.disk} GB disk</strong><small>Choose the room before the server receives a launch request.</small></div><div className="actions"><button className="secondary" onClick={() => setPreflight(null)}>Cancel</button><button className="primary" onClick={() => launchAgent(preflight.template.id, preflight.template.name, preflight.resources)}>Launch workspace →</button></div></div>}{launchState && <div className="agent-result" role="status"><div className="agent-result-top"><div><span className="eyebrow">Instance / {launchState.instance ? launchState.instance.id : 'setup'}</span><strong>{launchState.instance?.name ?? launchState.template}</strong><p>{launchState.message}</p></div>{launchState.instance && <span className={`instance-status ${launchState.instance.status === 'running' ? 'is-live' : ''}`}>● {launchState.instance.status}</span>}</div>{launchState.receipt && <section className="configuration-receipt" aria-labelledby="configuration-receipt-title" data-testid="configuration-receipt"><div className="receipt-heading"><div><span className="eyebrow">Applied configuration</span><h3 id="configuration-receipt-title">Configuration verified</h3></div><span className="instance-status is-live">✓ READ BACK</span></div><div className="receipt-summary"><div><span>Configuration</span><strong className="mono">{launchState.receipt.config_id.slice(0, 12)}…</strong></div><div><span>Files</span><strong>{launchState.receipt.files.length} verified</strong></div><div><span>Verified</span><strong><time dateTime={launchState.receipt.verified_at}>{new Date(launchState.receipt.verified_at).toLocaleString()}</time></strong></div></div><details><summary>Readback evidence</summary><ul className="receipt-files">{launchState.receipt.files.map((file) => <li key={file.role} data-testid={`receipt-file-${file.role}`}><span>{file.role}</span><span className="mono">{file.bytes} bytes · {file.sha256.slice(0, 8)}…{file.sha256.slice(-4)}</span></li>)}</ul></details><p className="agent-footnote mono">Profile files are read back from the workspace. Runtime settings are independently verified: {launchState.runtime?.model.provider === 'surplus' ? `Surplus · ${launchState.runtime.model.id}` : `Default · ${launchState.runtime?.model.id ?? selectedModel}`}. {launchState.runtime?.capabilities.length ?? 0} selected capability installation(s) verified.</p><div className="proof-task" data-testid="proof-task"><span className="eyebrow">One safe test</span><h3>Check that this specialist can answer</h3><p>This sends one fixed, read-only readiness request. It cannot browse, use tools, or change files.</p>{proofState.phase === 'succeeded' ? <div className="proof-success" role="status" tabIndex={-1}><strong>✓ Test passed</strong><span>This workspace returned the expected readiness result.</span><details><summary>Technical details</summary><p className="mono">Marker: {proofState.output}<br />Execution: {proofState.executionId}</p></details></div> : <button className="primary" onClick={runProofTask} disabled={proofState.phase === 'running'} data-testid="run-proof-task">{proofState.phase === 'running' ? 'Running safe test…' : proofState.phase === 'failed' ? 'Try safe test again' : 'Run safe test'}</button>}{proofState.phase === 'failed' && <p className="agent-error" role="alert">{proofState.message}</p>}</div></section>}{launchState.instance && launchState.phase === 'applied' ? <><div className="agent-stats"><div><span>Spend</span><strong>{launchState.instance.usage?.spend}</strong></div><div><span>Budget</span><strong>{launchState.instance.usage?.budget}</strong></div><div><span>Resources</span><strong>{resourceConfig.cpu} vCPU / {resourceConfig.memory} GB</strong></div></div><div className="agent-config"><span className="control-label">Instance size</span><select aria-label="Instance size" value={`${resourceConfig.cpu}/${resourceConfig.memory}`} onChange={(event) => { const [cpu, memory] = event.target.value.split('/').map(Number); setResourceConfig((current) => ({ ...current, cpu, memory, disk: Math.min(current.disk, cpu === 2 ? 12 : cpu === 4 ? 20 : 40) })) }}><option value="2/4">Standard · 2 vCPU / 4 GB</option><option value="4/8">Power · 4 vCPU / 8 GB</option><option value="8/16">Max · 8 vCPU / 16 GB</option></select><input aria-label="Disk GB" type="number" min="2" max={resourceConfig.cpu === 2 ? 12 : resourceConfig.cpu === 4 ? 20 : 40} value={resourceConfig.disk} onChange={(event) => setResourceConfig((current) => ({ ...current, disk: Number(event.target.value) }))} /><span className="mono">GB disk</span><button onClick={() => agentAction('resize')} disabled={agentBusy}>Apply size</button></div><div className="agent-controls"><div className="control-group"><span className="control-label">Open signed access</span><button onClick={() => openAgentSurface('chat')} disabled={agentBusy}>Chat ↗</button><button onClick={() => openAgentSurface('files')} disabled={agentBusy}>Files ↗</button><button onClick={() => openAgentSurface('terminal')} disabled={agentBusy}>Terminal ↗</button><button onClick={() => openAgentSurface('integrations')} disabled={agentBusy}>Integrations ↗</button><button onClick={() => openAgentSurface('settings')} disabled={agentBusy}>Settings ↗</button></div><div className="control-group"><span className="control-label">Lifecycle</span><button onClick={() => agentAction('start')} disabled={agentBusy}>Start</button><button onClick={() => agentAction('stop')} disabled={agentBusy}>Stop</button><button onClick={() => agentAction('restart')} disabled={agentBusy}>Restart</button><button className="danger-control" onClick={() => agentAction('delete')} disabled={agentBusy}>Delete instance</button></div></div>{agentError && <div className="agent-error" role="alert">{agentError}</div>}<p className="agent-footnote mono">Links are minted by the server and expire. No Agent37 key is exposed to this browser.</p></> : <div className="agent-setup-state"><span className="setup-icon">!</span><div><strong>Setup needed before access</strong><p>Provisioning will appear here with status, budget, and controls. If this is unavailable, check the server’s Agent37 configuration.</p></div></div>}</div>}</div><div id="workflow" className="desk-workflow"><nav className="stages" aria-label="Commissioning stages"><div className="stage-label mono">The desk / {String(Math.min(stageIndex + 1, 6)).padStart(2, '0')} of 06</div>{stages.map((item, index) => <div className={`stage ${index === stageIndex ? 'active' : ''} ${index < stageIndex ? 'done' : ''}`} key={item}><span className="stage-number">{index < stageIndex ? '✓' : `0${index + 1}`}</span><span>{item}<span className="stage-state">{index < stageIndex ? 'complete' : index === stageIndex ? 'in review' : 'up next'}</span></span></div>)}</nav>
      <div className="content">{error && <div className="blocked" role="alert"><strong>Action blocked.</strong> {error}</div>}
        {stage === 'brief' && <><div className="eyebrow">01 / Intake</div><h2>Start with a working setup,<br />not a blank screen.</h2><p className="lede">Tell us what the assistant should handle, who it serves, and where you want the final say. We turn it into a prepared configuration you can inspect.</p><div className="prompt"><textarea aria-label="Describe the work" value={brief} onChange={(event) => { setBrief(event.target.value); setError('') }} placeholder="For example: I run a YouTube channel about..." /><div className="mono character-count">{brief.length} characters · plain language is fine</div></div><div className="actions"><button className="secondary" onClick={() => setBrief(promptExample)}>Use Ethereum creator example</button><button className="primary" onClick={prepare}>Prepare my setup →</button></div><div className="rule" /><div className="eyebrow">Other desks / concepts only</div><div className="preset-row"><div className="preset"><span className="concept">CONCEPT / 02</span><h3>WhatsApp concierge</h3><p>Draft replies and reminders for review. Not active in this walkthrough.</p></div><div className="preset"><span className="concept">CONCEPT / 03</span><h3>Business Operator</h3><p>Prepare recurring office work. Not active in this walkthrough.</p></div></div></>}
        {stage === 'prepared' && <><span className="stamp">{stateLabel[snap!.state]} / REVIEW</span><h2>Your setup, on paper.</h2><p className="lede">Prepared from your brief: <strong>{brief}</strong></p><div className="config-grid"><div className="config-box"><h3>Requested permissions</h3><ul>{snap!.requestedPermissions.map((permission) => <li key={permission}>{permissionLabels[permission]} <span className="permission-id mono">{permission}</span></li>)}</ul></div><div className="config-box"><h3>Permission decisions</h3><p className="helper">Approve or deny each request. This local record is separate from provider access.</p><div className="reviewed-count" role="status">{reviewedPermissionCount} of {snap!.requestedPermissions.length} requests reviewed</div>{snap!.requestedPermissions.map((permission) => <div className="permission-row" key={permission}><span>{permissionLabels[permission]}</span><span className="permission-actions"><button className={decisions[permission] === 'approved' ? 'choice selected' : 'choice'} aria-pressed={decisions[permission] === 'approved'} onClick={() => setPermission(permission, 'approved')}>Approve</button><button className={decisions[permission] === 'denied' ? 'choice denied selected' : 'choice denied'} aria-pressed={decisions[permission] === 'denied'} onClick={() => setPermission(permission, 'denied')}>Deny</button></span></div>)}</div></div><div className="notice"><strong>Guardrail / always on</strong>Requested access is not granted access. No account connection, publishing, messaging, or purchasing occurs in this provider-free demo.</div><div className="actions"><button className="secondary" onClick={() => { setAssistant(null); setError('') }}>← Edit brief</button><button className="primary" disabled={!allPermissionsReviewed} onClick={() => act(() => assistant!.review())}>Review access &amp; plan →</button></div></>}
        {stage === 'access' && <><div className="eyebrow">03 / Entitlement</div><h2>Choose the room.<br />Keep the keys.</h2><p className="lede">Payment and activation are separate decisions. This step uses a deterministic simulated entitlement and sandbox workspace.</p><div className="plan"><div><strong>Creator operations / sandbox</strong><small>One prepared workspace · no provider connection</small></div><div className="price">$0 <small>simulated</small></div></div><div className="checks"><div className="check">✓ <span>Configuration reviewed</span></div><div className="check">✓ <span>{Object.values(decisions).filter((value) => value === 'approved').length} permission approvals recorded locally</span></div><div className="check">✓ <span>Activation remains explicit</span></div></div><div className="notice"><strong>SIMULATED SANDBOX / HACKATHON</strong>No payment is taken and no external workspace is created.</div><div className="actions"><span className="flow-note">Access review is complete; provisioning is the next step.</span><button className="primary" onClick={() => act(() => { assistant!.entitle(); assistant!.provision() })}>Provision sandbox →</button></div></>}
        {stage === 'trial' && <><div className="eyebrow">04 / Prove the boundary</div><h2>A quiet, isolated trial.</h2><p className="lede">The trial output is prepared from your brief. It is read-only and non-publishing; no account is connected.</p><div className="prompt"><div className="mono">TRIAL TASK / READ-ONLY / {snap!.provisionedResource}</div><h3>{brief}</h3><div className="rule" />{trialOutput.length === 0 ? <div className="blocked"><strong>Ready to run.</strong> No external message, edit, or publish call will be made.</div> : <ul className="trial-output">{trialOutput.map((item) => <li key={item}>{item}</li>)}</ul>}</div><div className="actions"><button className="primary" onClick={runTrial}>Run isolated trial →</button></div></>}
        {stage === 'activation' && <><span className="stamp">TESTED / AWAITING APPROVAL</span><h2>Ready for your approval.</h2><p className="lede">The trial passed. Activation is a separate decision and remains blocked until you acknowledge the exact boundary below.</p><div className="notice"><strong>Activation receipt</strong><br />This sandbox may run the prepared, non-publishing workflow. No account is connected and no content can be published in this demo.</div><div className="prompt trial-receipt"><div className="mono">TRIAL RESULT / DERIVED FROM BRIEF</div><ul className="trial-output">{trialOutput.map((item) => <li key={item}>{item}</li>)}</ul></div><label className="ack"><input type="checkbox" checked={ack} onChange={(event) => setAck(event.target.checked)} /> I understand this setup is simulated, isolated, and inactive until I approve it.</label><div className="actions"><button className="secondary" onClick={() => setAck(false)}>Keep inactive</button><button className="primary" disabled={!ack} onClick={() => act(() => { assistant!.approve(); assistant!.activate() })}>Approve and activate →</button></div></>}
        {stage === 'dashboard' && <><div className="dashboard-head"><div><span className="stamp">ACTIVE / SANDBOX</span><h2>The desk is ready.</h2></div><div className="status">● ACTIVE · ISOLATED</div></div><p className="lede">Your assistant is active in a local sandbox. It has no connected account and cannot publish content.</p><div className="audit"><div className="mono audit-heading">Recorded audit / latest first</div>{audit.map((event, index) => <div className="audit-row" key={`${event.at}-${index}`}><span className="mono">{new Date(event.at).toLocaleTimeString()}</span><span>{event.type === 'approval' ? 'Activation approved explicitly' : `${event.from} → ${event.to}`}</span><span className="mono row-state">recorded</span></div>)}</div><div className="blocked"><strong>Current boundary.</strong> No account is connected. No content has been published. Real provider integrations are not part of this preview.</div><div className="actions"><button className="secondary" onClick={reset}>Start another brief</button><button className="primary" onClick={() => { setAssistant(newYouTubeAssistant(`demo-${Date.now()}`)); setDecisions({}); setTrialOutput([]); setAck(false); setPreflight(null) }}>New prepared setup</button></div></>}
      </div></div></section></div></main>
}

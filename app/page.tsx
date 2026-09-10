'use client'

import { useEffect, useMemo, useState } from 'react'
import { createServerOwnedPreset, parseRequest } from '../lib/preset'
import { ALLOWED_PERMISSIONS, type Permission } from '../lib/permissions'
import { newYouTubeAssistant, type AssistantLifecycle, type AssistantSnapshot, type State } from '../lib/lifecycle'

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
type LaunchState = { template: string; message: string; instance?: AgentInstance }
type AgentAction = 'start' | 'stop' | 'restart' | 'resize' | 'update' | 'delete'

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
  const [agentBusy, setAgentBusy] = useState(false)
  const [agentError, setAgentError] = useState('')
  const [resourceConfig, setResourceConfig] = useState({ cpu: 2, memory: 4, disk: 6 })
  const snap = assistant?.snapshot

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
  }, [assistant, snap, brief, decisions, trialOutput, ack])

  const stage = !assistant ? 'brief' : !snap ? 'brief' : snap.state === 'draft' ? 'prepared' : snap.state === 'reviewed' ? 'access' : snap.state === 'entitled' ? 'access' : snap.state === 'provisioned' ? 'trial' : snap.state === 'test-passed' ? 'activation' : 'dashboard'
  const stageIndex = Math.max(0, stages.findIndex((item) => item.toLowerCase().startsWith(stage)))
  const audit = useMemo(() => snap?.audit.slice().reverse() ?? [], [snap])
  const act = (fn: () => void) => { try { setError(''); fn() } catch (e) { setError(e instanceof Error ? e.message : 'Action blocked') } }
  const agentAction = async (action: AgentAction) => {
    const instance = launchState?.instance
    if (!instance) return
    if (action === 'delete' && !window.confirm('Delete this instance? Its files, memory, sessions, and connections will be permanently removed.')) return
    setAgentBusy(true); setAgentError('')
    try {
      const response = await fetch(`/api/agents/${instance.id}/${action}`, { method: action === 'delete' ? 'DELETE' : 'POST', headers: { 'content-type': 'application/json' }, body: action === 'resize' ? JSON.stringify({ cpu: resourceConfig.cpu, memory: resourceConfig.memory, disk: resourceConfig.disk }) : undefined })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message ?? 'Agent action is unavailable.')
      if (action === 'delete') { setLaunchState(null); setAgentError('Instance deleted.'); return }
      setLaunchState((current) => current ? { ...current, instance: { ...instance, status: result.instance?.status ?? (action === 'stop' ? 'stopped' : 'running') }, message: `Instance ${action} request accepted.` } : current)
    } catch (e) { setAgentError(e instanceof Error ? e.message : 'Agent action failed.') } finally { setAgentBusy(false) }
  }
  const openAgentSurface = async (surface: 'chat' | 'files' | 'terminal' | 'integrations' | 'settings') => {
    const instance = launchState?.instance
    if (!instance) return
    setAgentBusy(true); setAgentError('')
    try {
      const response = await fetch(`/api/agents/instances/${instance.id}/signed-url`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ port: surfacePorts[surface] }) })
      const result = await response.json()
      if (!response.ok || !result.ok || typeof result.result?.url !== 'string') throw new Error(result.message ?? 'Signed access is not available.')
      window.open(result.result.url, '_blank', 'noopener,noreferrer')
    } catch (e) { setAgentError(e instanceof Error ? e.message : 'Could not mint a signed link.') } finally { setAgentBusy(false) }
  }
  const launchAgent = async (template: string, label: string) => {
    setLaunchState({ template, message: `Launching ${label}…` }); setAgentError('')
    try {
      const response = await fetch('/api/agents/launch', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ template, name: label, resources: resourceConfig }) })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message ?? 'Launch is not available yet.')
      const raw = result.instance as Record<string, unknown>
      setLaunchState({ template, message: `Instance ${String(raw.status ?? 'provisioned')} · signed access is ready when requested.`, instance: { id: String(raw.id), name: label, status: String(raw.status ?? 'provisioned'), template, url: typeof raw.url === 'string' ? raw.url : undefined, createdAt: new Date().toISOString(), usage: { spend: '$0.00', budget: '$5.00 / month' } } })
    } catch (e) { setLaunchState({ template, message: e instanceof Error ? e.message : 'Launch could not be reached. No instance was created.' }) }
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
  const runTrial = () => act(() => { assistant!.passTrial(); setTrialOutput(conceptsFor(brief)) })
  const reset = () => { setAssistant(null); setBrief(''); setDecisions({}); setTrialOutput([]); setAck(false); setError(''); window.localStorage.removeItem(STORAGE_KEY) }

  return <main className="shell"><header className="topbar"><div className="brand"><span className="brand-mark">LM</span> LegitMate</div><div className="top-meta">Commissioning desk · v0.1 / sandbox</div></header><div className="main">
    <section className="intro"><div><div className="eyebrow">A managed assistant, properly commissioned</div><h1>Describe the work.<br /><em>We prepare</em> the assistant.</h1><p className="intro-copy">Start with a working setup, not a blank screen. Review the proposed tools, boundaries, and activation decision before anything can act.</p></div><div className="registration mono">FILE 001 / YC-OPS<strong>Prepared for creator operations</strong>09 SEP 2026<br />Provider-free walkthrough</div></section>
    <section className="desk" aria-label="Assistant commissioning workflow"><div className="agent-launch"><div><div className="eyebrow">Deploy your prepared Hermes workspace</div><h2 className="agent-launch-title">One click from brief to instance.</h2><p className="lede">Choose a managed Agent37 template. LegitMate keeps provisioning behind an approved server-side route; your instance, budget, and credentials stay separate from this browser.</p></div><div className="agent-options"><button className="agent-option" onClick={() => launchAgent('agent37-hermes', 'LegitMate Hermes assistant')}><strong>Hermes assistant</strong><span>Managed model · files · browser · skills</span><b>Launch →</b></button><button className="agent-option" onClick={() => launchAgent('cloud-computai', 'Cloud ComputAI workspace')}><strong>Cloud ComputAI</strong><span>Hermes workspace · live desktop option</span><b>Launch →</b></button><button className="agent-option" onClick={() => launchAgent('legitmate-youtube', 'YouTube operations assistant')}><strong>YouTube operations</strong><span>Prepared research and draft workflow</span><b>Launch →</b></button></div>{launchState && <div className="agent-result" role="status"><div className="agent-result-top"><div><span className="eyebrow">Instance / {launchState.instance ? launchState.instance.id : 'setup'}</span><strong>{launchState.instance?.name ?? launchState.template}</strong><p>{launchState.message}</p></div>{launchState.instance && <span className={`instance-status ${launchState.instance.status === 'running' ? 'is-live' : ''}`}>● {launchState.instance.status}</span>}</div>{launchState.instance ? <><div className="agent-stats"><div><span>Spend</span><strong>{launchState.instance.usage?.spend}</strong></div><div><span>Budget</span><strong>{launchState.instance.usage?.budget}</strong></div><div><span>Resources</span><strong>{resourceConfig.cpu} vCPU / {resourceConfig.memory} GB</strong></div></div><div className="agent-config"><span className="control-label">Instance size</span><select aria-label="Instance size" value={`${resourceConfig.cpu}/${resourceConfig.memory}`} onChange={(event) => { const [cpu, memory] = event.target.value.split('/').map(Number); setResourceConfig((current) => ({ ...current, cpu, memory, disk: Math.min(current.disk, cpu === 2 ? 12 : cpu === 4 ? 20 : 40) })) }}><option value="2/4">Standard · 2 vCPU / 4 GB</option><option value="4/8">Power · 4 vCPU / 8 GB</option><option value="8/16">Max · 8 vCPU / 16 GB</option></select><input aria-label="Disk GB" type="number" min="2" max={resourceConfig.cpu === 2 ? 12 : resourceConfig.cpu === 4 ? 20 : 40} value={resourceConfig.disk} onChange={(event) => setResourceConfig((current) => ({ ...current, disk: Number(event.target.value) }))} /><span className="mono">GB disk</span><button onClick={() => agentAction('resize')} disabled={agentBusy}>Apply size</button></div><div className="agent-controls"><div className="control-group"><span className="control-label">Open signed access</span><button onClick={() => openAgentSurface('chat')} disabled={agentBusy}>Chat ↗</button><button onClick={() => openAgentSurface('files')} disabled={agentBusy}>Files ↗</button><button onClick={() => openAgentSurface('terminal')} disabled={agentBusy}>Terminal ↗</button><button onClick={() => openAgentSurface('integrations')} disabled={agentBusy}>Integrations ↗</button><button onClick={() => openAgentSurface('settings')} disabled={agentBusy}>Settings ↗</button></div><div className="control-group"><span className="control-label">Lifecycle</span><button onClick={() => agentAction('start')} disabled={agentBusy}>Start</button><button onClick={() => agentAction('stop')} disabled={agentBusy}>Stop</button><button onClick={() => agentAction('restart')} disabled={agentBusy}>Restart</button><button className="danger-control" onClick={() => agentAction('delete')} disabled={agentBusy}>Delete instance</button></div></div>{agentError && <div className="agent-error" role="alert">{agentError}</div>}<p className="agent-footnote mono">Links are minted by the server and expire. No Agent37 key is exposed to this browser.</p></> : <div className="agent-setup-state"><span className="setup-icon">!</span><div><strong>Setup needed before access</strong><p>Provisioning will appear here with status, budget, and controls. If this is unavailable, check the server’s Agent37 configuration.</p></div></div>}</div>}</div><div className="desk-workflow"><nav className="stages" aria-label="Commissioning stages"><div className="stage-label mono">The desk / {String(Math.min(stageIndex + 1, 6)).padStart(2, '0')} of 06</div>{stages.map((item, index) => <div className={`stage ${index === stageIndex ? 'active' : ''} ${index < stageIndex ? 'done' : ''}`} key={item}><span className="stage-number">{index < stageIndex ? '✓' : `0${index + 1}`}</span><span>{item}<span className="stage-state">{index < stageIndex ? 'complete' : index === stageIndex ? 'in review' : 'up next'}</span></span></div>)}</nav>
      <div className="content">{error && <div className="blocked" role="alert"><strong>Action blocked.</strong> {error}</div>}
        {stage === 'brief' && <><div className="eyebrow">01 / Intake</div><h2>Start with a working setup,<br />not a blank screen.</h2><p className="lede">Tell us what the assistant should handle, who it serves, and where you want the final say. We turn it into a prepared configuration you can inspect.</p><div className="prompt"><textarea aria-label="Describe the work" value={brief} onChange={(event) => { setBrief(event.target.value); setError('') }} placeholder="For example: I run a YouTube channel about..." /><div className="mono character-count">{brief.length} characters · plain language is fine</div></div><div className="actions"><button className="secondary" onClick={() => setBrief(promptExample)}>Use Ethereum creator example</button><button className="primary" onClick={prepare}>Prepare my setup →</button></div><div className="rule" /><div className="eyebrow">Other desks / concepts only</div><div className="preset-row"><div className="preset"><span className="concept">CONCEPT / 02</span><h3>WhatsApp concierge</h3><p>Draft replies and reminders for review. Not active in this walkthrough.</p></div><div className="preset"><span className="concept">CONCEPT / 03</span><h3>Business Operator</h3><p>Prepare recurring office work. Not active in this walkthrough.</p></div></div></>}
        {stage === 'prepared' && <><span className="stamp">{stateLabel[snap!.state]} / REVIEW</span><h2>Your setup, on paper.</h2><p className="lede">Prepared from your brief: <strong>{brief}</strong></p><div className="config-grid"><div className="config-box"><h3>Requested permissions</h3><ul>{snap!.requestedPermissions.map((permission) => <li key={permission}>{permissionLabels[permission]} <span className="permission-id mono">{permission}</span></li>)}</ul></div><div className="config-box"><h3>Permission decisions</h3><p className="helper">Approve or deny each request. This local record is separate from provider access.</p>{snap!.requestedPermissions.map((permission) => <div className="permission-row" key={permission}><span>{permissionLabels[permission]}</span><span className="permission-actions"><button className={decisions[permission] === 'approved' ? 'choice selected' : 'choice'} aria-pressed={decisions[permission] === 'approved'} onClick={() => setPermission(permission, 'approved')}>Approve</button><button className={decisions[permission] === 'denied' ? 'choice denied selected' : 'choice denied'} aria-pressed={decisions[permission] === 'denied'} onClick={() => setPermission(permission, 'denied')}>Deny</button></span></div>)}</div></div><div className="notice"><strong>Guardrail / always on</strong>Requested access is not granted access. No account connection, publishing, messaging, or purchasing occurs in this provider-free demo.</div><div className="actions"><button className="secondary" onClick={() => { setAssistant(null); setError('') }}>← Edit brief</button><button className="primary" onClick={() => act(() => assistant!.review())}>Review access &amp; plan →</button></div></>}
        {stage === 'access' && <><div className="eyebrow">03 / Entitlement</div><h2>Choose the room.<br />Keep the keys.</h2><p className="lede">Payment and activation are separate decisions. This step uses a deterministic simulated entitlement and sandbox workspace.</p><div className="plan"><div><strong>Creator operations / sandbox</strong><small>One prepared workspace · no provider connection</small></div><div className="price">$0 <small>simulated</small></div></div><div className="checks"><div className="check">✓ <span>Configuration reviewed</span></div><div className="check">✓ <span>{Object.values(decisions).filter((value) => value === 'approved').length} permission approvals recorded locally</span></div><div className="check">✓ <span>Activation remains explicit</span></div></div><div className="notice"><strong>SIMULATED SANDBOX / HACKATHON</strong>No payment is taken and no external workspace is created.</div><div className="actions"><button className="secondary" onClick={() => act(() => { throw new Error('The domain workflow does not support backwards transitions.') })}>← Review setup</button><button className="primary" onClick={() => act(() => { assistant!.entitle(); assistant!.provision() })}>Provision sandbox →</button></div></>}
        {stage === 'trial' && <><div className="eyebrow">04 / Prove the boundary</div><h2>A quiet, isolated trial.</h2><p className="lede">The trial output is prepared from your brief. It is read-only and non-publishing; no account is connected.</p><div className="prompt"><div className="mono">TRIAL TASK / READ-ONLY / {snap!.provisionedResource}</div><h3>{brief}</h3><div className="rule" />{trialOutput.length === 0 ? <div className="blocked"><strong>Ready to run.</strong> No external message, edit, or publish call will be made.</div> : <ul className="trial-output">{trialOutput.map((item) => <li key={item}>{item}</li>)}</ul>}</div><div className="actions"><button className="primary" onClick={runTrial}>Run isolated trial →</button></div></>}
        {stage === 'activation' && <><span className="stamp">TESTED / AWAITING APPROVAL</span><h2>Ready for your approval.</h2><p className="lede">The trial passed. Activation is a separate decision and remains blocked until you acknowledge the exact boundary below.</p><div className="notice"><strong>Activation receipt</strong><br />This sandbox may run the prepared, non-publishing workflow. No account is connected and no content can be published in this demo.</div><div className="prompt trial-receipt"><div className="mono">TRIAL RESULT / DERIVED FROM BRIEF</div><ul className="trial-output">{trialOutput.map((item) => <li key={item}>{item}</li>)}</ul></div><label className="ack"><input type="checkbox" checked={ack} onChange={(event) => setAck(event.target.checked)} /> I understand this setup is simulated, isolated, and inactive until I approve it.</label><div className="actions"><button className="secondary" onClick={() => setAck(false)}>Keep inactive</button><button className="primary" disabled={!ack} onClick={() => act(() => { assistant!.approve(); assistant!.activate() })}>Approve and activate →</button></div></>}
        {stage === 'dashboard' && <><div className="dashboard-head"><div><span className="stamp">ACTIVE / SANDBOX</span><h2>The desk is ready.</h2></div><div className="status">● ACTIVE · ISOLATED</div></div><p className="lede">Your assistant is active in a local sandbox. It has no connected account and cannot publish content.</p><div className="audit"><div className="mono audit-heading">Recorded audit / latest first</div>{audit.map((event, index) => <div className="audit-row" key={`${event.at}-${index}`}><span className="mono">{new Date(event.at).toLocaleTimeString()}</span><span>{event.type === 'approval' ? 'Activation approved explicitly' : `${event.from} → ${event.to}`}</span><span className="mono row-state">recorded</span></div>)}</div><div className="blocked"><strong>Current boundary.</strong> No account is connected. No content has been published. Real provider integrations are not part of this preview.</div><div className="actions"><button className="secondary" onClick={reset}>Start another brief</button><button className="primary" onClick={() => { setAssistant(newYouTubeAssistant(`demo-${Date.now()}`)); setDecisions({}); setTrialOutput([]); setAck(false) }}>New prepared setup</button></div></>}
      </div></div></section></div></main>
}

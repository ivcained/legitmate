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
const permissionLabels: Record<Permission, string> = {
  'youtube.channel.read': 'Read channel details',
  'youtube.analytics.read': 'Read channel analytics',
  'youtube.video.draft.write': 'Create video drafts',
}
type Decision = 'approved' | 'denied'
type WorkspaceRecord = { version: 1; brief: string; id: string; decisions: Partial<Record<Permission, Decision>>; trialOutput: string[]; acknowledged: boolean; snapshot: AssistantSnapshot }

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
  const [, refresh] = useState(0)
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

  const stage = !snap ? 'brief' : snap.state === 'draft' ? 'brief' : snap.state === 'reviewed' ? 'prepared' : snap.state === 'entitled' ? 'access' : snap.state === 'provisioned' ? 'trial' : snap.state === 'test-passed' ? 'activation' : 'dashboard'
  const stageIndex = Math.max(0, stages.findIndex((item) => item.toLowerCase().startsWith(stage)))
  const audit = useMemo(() => snap?.audit.slice().reverse() ?? [], [snap])
  const act = (fn: () => void) => { try { setError(''); fn(); refresh((value) => value + 1) } catch (e) { setError(e instanceof Error ? e.message : 'Action blocked') } }
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
    <section className="desk" aria-label="Assistant commissioning workflow"><nav className="stages" aria-label="Commissioning stages"><div className="stage-label mono">The desk / {String(Math.min(stageIndex + 1, 6)).padStart(2, '0')} of 06</div>{stages.map((item, index) => <div className={`stage ${index === stageIndex ? 'active' : ''} ${index < stageIndex ? 'done' : ''}`} key={item}><span className="stage-number">{index < stageIndex ? '✓' : `0${index + 1}`}</span><span>{item}<span className="stage-state">{index < stageIndex ? 'complete' : index === stageIndex ? 'in review' : 'up next'}</span></span></div>)}</nav>
      <div className="content">{error && <div className="blocked" role="alert"><strong>Action blocked.</strong> {error}</div>}
        {stage === 'brief' && <><div className="eyebrow">01 / Intake</div><h2>Start with a working setup,<br />not a blank screen.</h2><p className="lede">Tell us what the assistant should handle, who it serves, and where you want the final say. We turn it into a prepared configuration you can inspect.</p><div className="prompt"><textarea aria-label="Describe the work" value={brief} onChange={(event) => { setBrief(event.target.value); setError('') }} placeholder="For example: I run a YouTube channel about..." /><div className="mono character-count">{brief.length} characters · plain language is fine</div></div><div className="actions"><button className="secondary" onClick={() => setBrief(promptExample)}>Use Ethereum creator example</button><button className="primary" onClick={prepare}>Prepare my setup →</button></div><div className="rule" /><div className="eyebrow">Other desks / concepts only</div><div className="preset-row"><div className="preset"><span className="concept">CONCEPT / 02</span><h3>WhatsApp concierge</h3><p>Draft replies and reminders for review. Not active in this walkthrough.</p></div><div className="preset"><span className="concept">CONCEPT / 03</span><h3>Business Operator</h3><p>Prepare recurring office work. Not active in this walkthrough.</p></div></div></>}
        {stage === 'prepared' && <><span className="stamp">{stateLabel[snap!.state]} / REVIEW</span><h2>Your setup, on paper.</h2><p className="lede">Prepared from your brief: <strong>{brief}</strong></p><div className="config-grid"><div className="config-box"><h3>Requested permissions</h3><ul>{snap!.requestedPermissions.map((permission) => <li key={permission}>{permissionLabels[permission]} <span className="permission-id mono">{permission}</span></li>)}</ul></div><div className="config-box"><h3>Permission decisions</h3><p className="helper">Approve or deny each request. This local record is separate from provider access.</p>{snap!.requestedPermissions.map((permission) => <div className="permission-row" key={permission}><span>{permissionLabels[permission]}</span><span className="permission-actions"><button className={decisions[permission] === 'approved' ? 'choice selected' : 'choice'} aria-pressed={decisions[permission] === 'approved'} onClick={() => setPermission(permission, 'approved')}>Approve</button><button className={decisions[permission] === 'denied' ? 'choice denied selected' : 'choice denied'} aria-pressed={decisions[permission] === 'denied'} onClick={() => setPermission(permission, 'denied')}>Deny</button></span></div>)}</div></div><div className="notice"><strong>Guardrail / always on</strong>Requested access is not granted access. No account connection, publishing, messaging, or purchasing occurs in this provider-free demo.</div><div className="actions"><button className="secondary" onClick={() => { setAssistant(null); setError('') }}>← Edit brief</button><button className="primary" onClick={() => act(() => assistant!.review())}>Review access &amp; plan →</button></div></>}
        {stage === 'access' && <><div className="eyebrow">03 / Entitlement</div><h2>Choose the room.<br />Keep the keys.</h2><p className="lede">Payment and activation are separate decisions. This step uses a deterministic simulated entitlement and sandbox workspace.</p><div className="plan"><div><strong>Creator operations / sandbox</strong><small>One prepared workspace · no provider connection</small></div><div className="price">$0 <small>simulated</small></div></div><div className="checks"><div className="check">✓ <span>Configuration reviewed</span></div><div className="check">✓ <span>{Object.values(decisions).filter((value) => value === 'approved').length} permission approvals recorded locally</span></div><div className="check">✓ <span>Activation remains explicit</span></div></div><div className="notice"><strong>SIMULATED SANDBOX / HACKATHON</strong>No payment is taken and no external workspace is created.</div><div className="actions"><button className="secondary" onClick={() => act(() => { throw new Error('The domain workflow does not support backwards transitions.') })}>← Review setup</button><button className="primary" onClick={() => act(() => { assistant!.entitle(); assistant!.provision() })}>Provision sandbox →</button></div></>}
        {stage === 'trial' && <><div className="eyebrow">04 / Prove the boundary</div><h2>A quiet, isolated trial.</h2><p className="lede">The trial output is prepared from your brief. It is read-only and non-publishing; no account is connected.</p><div className="prompt"><div className="mono">TRIAL TASK / READ-ONLY / {snap!.provisionedResource}</div><h3>{brief}</h3><div className="rule" />{trialOutput.length === 0 ? <div className="blocked"><strong>Ready to run.</strong> No external message, edit, or publish call will be made.</div> : <ul className="trial-output">{trialOutput.map((item) => <li key={item}>{item}</li>)}</ul>}</div><div className="actions"><button className="primary" onClick={runTrial}>Run isolated trial →</button></div></>}
        {stage === 'activation' && <><span className="stamp">TESTED / AWAITING APPROVAL</span><h2>Ready for your approval.</h2><p className="lede">The trial passed. Activation is a separate decision and remains blocked until you acknowledge the exact boundary below.</p><div className="notice"><strong>Activation receipt</strong><br />This sandbox may run the prepared, non-publishing workflow. No account is connected and no content can be published in this demo.</div><label className="ack"><input type="checkbox" checked={ack} onChange={(event) => setAck(event.target.checked)} /> I understand this setup is simulated, isolated, and inactive until I approve it.</label><div className="actions"><button className="secondary" onClick={() => setAck(false)}>Keep inactive</button><button className="primary" disabled={!ack} onClick={() => act(() => { assistant!.approve(); assistant!.activate() })}>Approve and activate →</button></div></>}
        {stage === 'dashboard' && <><div className="dashboard-head"><div><span className="stamp">ACTIVE / SANDBOX</span><h2>The desk is ready.</h2></div><div className="status">● ACTIVE · ISOLATED</div></div><p className="lede">Your assistant is active in a local sandbox. It has no connected account and cannot publish content.</p><div className="audit"><div className="mono audit-heading">Recorded audit / latest first</div>{audit.map((event, index) => <div className="audit-row" key={`${event.at}-${index}`}><span className="mono">{new Date(event.at).toLocaleTimeString()}</span><span>{event.type === 'approval' ? 'Activation approved explicitly' : `${event.from} → ${event.to}`}</span><span className="mono row-state">recorded</span></div>)}</div><div className="blocked"><strong>Current boundary.</strong> No account is connected. No content has been published. Real provider integrations are not part of this preview.</div><div className="actions"><button className="secondary" onClick={reset}>Start another brief</button><button className="primary" onClick={() => { setAssistant(newYouTubeAssistant(`demo-${Date.now()}`)); setDecisions({}); setTrialOutput([]); setAck(false) }}>New prepared setup</button></div></>}
      </div></section></div></main>
}

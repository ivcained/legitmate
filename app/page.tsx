'use client'

import { getAccessToken } from '@privy-io/react-auth'
import { useEffect, useMemo, useState } from 'react'
import { EmbeddedWallet } from '../components/embedded-wallet'
import { AGENCY_AGENTS, AGENCY_AGENT_COUNT, type AgencyAgent } from '../lib/agency-agents'
import { INSTALLABLE_HERMES_CAPABILITIES, type HermesCapability } from '../lib/hermes-catalog'
import { agentActionRequest, type AgentAction } from '../lib/agent-actions'

const LAUNCH_STORAGE_KEY = 'legitmate.launch'
const surfacePorts = { chat: 9119, files: 8080, terminal: 7681, integrations: 9119, settings: 9119 } as const
const stepLabels = ['Select agent', 'Profile', 'Provider & model', 'Capabilities', 'Review & deploy'] as const
const resourceDefaults = { cpu: 2, memory: 4, disk: 6 }

type AgentInstance = {
  id: string
  name: string
  status: string
  template: string
  url?: string
  createdAt: string
  usage?: { spend: string; budget: string }
}
type StoredLaunch = { version: 1; requestId: string; template: string; instance: AgentInstance }
type ConfigurationReceipt = {
  schema_version: 1
  config_id: string
  status: 'applied'
  files: Array<{ role: 'configuration' | 'soul' | 'user' | 'agents'; path: string; sha256: string; bytes: number }>
  verified_at: string
}
type RuntimeReceipt = {
  model: { provider: 'default' | 'surplus'; id: string; config_sha256: string }
  capabilities: Array<{ id: string; status: 'available' | 'installed'; evidence: string }>
}
type LaunchState = {
  template: string
  phase: 'launching' | 'applied' | 'failed'
  requestId: string
  message: string
  instance?: AgentInstance
  receipt?: ConfigurationReceipt
  runtime?: RuntimeReceipt
}
type ProofState = { phase: 'idle' | 'running' | 'succeeded' | 'failed'; key?: string; output?: string; executionId?: string; message?: string }
type ModelChoice = { id: string; label: string; provider: 'default' | 'surplus' }

const defaultModels: ModelChoice[] = [
  { id: 'nous-default', label: 'Balanced — recommended', provider: 'default' },
  { id: 'nous-reasoning', label: 'Deep reasoning', provider: 'default' },
]

function profileFor(agent: AgencyAgent) {
  return {
    soul: `# ${agent.name} / soul.md\n\nYou are ${agent.name}.\n\n## Working principles\n${agent.vibe}`,
    user: '# user.md\n\nOwner context and preferences go here.',
    agents: `# agents.md\n\nUse the approved skills and processes for ${agent.name}.`,
  }
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAgency, setSelectedAgency] = useState<AgencyAgent | null>(null)
  const [agencySoul, setAgencySoul] = useState('')
  const [agencyUser, setAgencyUser] = useState('')
  const [agencySkills, setAgencySkills] = useState('')
  const [selectedModel, setSelectedModel] = useState('nous-default')
  const [availableModels, setAvailableModels] = useState<ModelChoice[]>(defaultModels)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [launchState, setLaunchState] = useState<LaunchState | null>(null)
  const [proofState, setProofState] = useState<ProofState>({ phase: 'idle' })
  const [agentBusy, setAgentBusy] = useState(false)
  const [agentError, setAgentError] = useState('')
  const [resourceConfig, setResourceConfig] = useState(resourceDefaults)

  useEffect(() => {
    fetch('/api/models')
      .then((response) => response.json())
      .then((result) => {
        if (result.ok && Array.isArray(result.models)) setAvailableModels(result.models)
      })
      .catch(() => undefined)
      .finally(() => setModelsLoaded(true))
  }, [])

  const authenticatedFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const token = process.env.NEXT_PUBLIC_PRIVY_APP_ID ? await getAccessToken().catch(() => null) : null
    return fetch(input, { ...init, headers: { ...init.headers, ...(token ? { authorization: `Bearer ${token}` } : {}) } })
  }

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAUNCH_STORAGE_KEY)
      if (!raw) return
      const stored = JSON.parse(raw) as StoredLaunch
      if (stored?.version !== 1 || !stored.instance?.id || !stored.requestId) {
        window.localStorage.removeItem(LAUNCH_STORAGE_KEY)
        return
      }
      setLaunchState({ template: stored.template, phase: 'launching', requestId: stored.requestId, instance: stored.instance, message: 'Checking workspace configuration…' })
      authenticatedFetch(`/api/agents/instances/${stored.instance.id}/configuration`)
        .then(async (response) => {
          const result = await response.json()
          if (!response.ok || !result.ok || result.status !== 'applied') throw new Error(result.message ?? 'Saved configuration could not be verified.')
          setLaunchState({ template: stored.template, phase: 'applied', requestId: stored.requestId, instance: stored.instance, receipt: result.receipt as ConfigurationReceipt, message: 'Configuration verified after reopen.' })
        })
        .catch((error) => setLaunchState({ template: stored.template, phase: 'failed', requestId: stored.requestId, instance: stored.instance, message: error instanceof Error ? error.message : 'Saved configuration could not be verified.' }))
    } catch {
      window.localStorage.removeItem(LAUNCH_STORAGE_KEY)
    }
    // authenticatedFetch is stable for the initial browser session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!launchState?.instance || launchState.phase !== 'applied') return
    const record: StoredLaunch = { version: 1, requestId: launchState.requestId, template: launchState.template, instance: launchState.instance }
    window.localStorage.setItem(LAUNCH_STORAGE_KEY, JSON.stringify(record))
  }, [launchState])

  const selectedModelChoice = availableModels.find((model) => model.id === selectedModel) ?? defaultModels[0]
  const selectedCapabilityDetails = useMemo(
    () => INSTALLABLE_HERMES_CAPABILITIES.filter((capability) => selectedCapabilities.includes(`${capability.kind}:${capability.slug}`)),
    [selectedCapabilities],
  )

  const selectAgency = (agent: AgencyAgent) => {
    const profile = profileFor(agent)
    setSelectedAgency(agent)
    setAgencySoul(profile.soul)
    setAgencyUser(profile.user)
    setAgencySkills(profile.agents)
    setLaunchState(null)
    setProofState({ phase: 'idle' })
  }

  const toggleCapability = (capability: HermesCapability) => {
    const id = `${capability.kind}:${capability.slug}`
    setSelectedCapabilities((current) =>
      current.includes(id) ? current.filter((capabilityId) => capabilityId !== id) : [...current, id],
    )
  }

  const launchAgent = async (template: string, label: string, resources = resourceConfig) => {
    if (!selectedAgency) return
    setProofState({ phase: 'idle' })
    const requestId = launchState?.template === template && launchState.phase === 'failed' ? launchState.requestId : crypto.randomUUID()
    setLaunchState({ template, phase: 'launching', requestId, message: `Creating ${label} and applying its configuration…` })
    setAgentError('')
    try {
      const response = await authenticatedFetch('/api/agents/launch', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          template,
          name: label,
          resources,
          client_request_id: requestId,
          agency_agent_slug: selectedAgency.slug,
          model: selectedModel,
          capabilities: selectedCapabilities,
          profile: { soul: agencySoul, user: agencyUser, agents: agencySkills },
        }),
      })
      const result = await response.json()
      const raw = result.instance as Record<string, unknown> | undefined
      if (!response.ok || !result.ok) {
        const failedInstance = raw?.id
          ? { id: String(raw.id), name: label, status: 'configuration pending', template, createdAt: new Date().toISOString() }
          : undefined
        setLaunchState({ template, phase: 'failed', requestId, message: result.message ?? 'Workspace creation failed.', instance: failedInstance })
        return
      }
      const receipt = result.configuration as ConfigurationReceipt
      if (receipt?.status !== 'applied') throw new Error('Configuration readback was not verified.')
      setLaunchState({
        template,
        phase: 'applied',
        requestId,
        receipt,
        runtime: result.runtime as RuntimeReceipt | undefined,
        message: `Configuration verified · ${receipt.files.length} profile files and runtime settings read back.`,
        instance: {
          id: String(raw!.id),
          name: label,
          status: String(raw!.status ?? 'provisioned'),
          template,
          url: typeof raw!.url === 'string' ? raw!.url : undefined,
          createdAt: new Date().toISOString(),
          usage: { spend: '$0.00', budget: '$5.00 / month' },
        },
      })
    } catch (error) {
      setLaunchState({ template, phase: 'failed', requestId, message: error instanceof Error ? error.message : 'Launch could not be reached.' })
    }
  }

  const runProofTask = async () => {
    const instance = launchState?.instance
    if (!instance || launchState.phase !== 'applied') return
    const key = proofState.key ?? `proof_${crypto.randomUUID().replaceAll('-', '')}`
    setProofState({ phase: 'running', key, message: 'Running one safe readiness check…' })
    try {
      const response = await authenticatedFetch(`/api/agents/instances/${instance.id}/proof-task`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idempotency_key: key }),
      })
      const result = await response.json()
      if (!response.ok || !result.ok || result.status !== 'succeeded') throw new Error(result.message ?? 'The readiness check did not finish.')
      setProofState({ phase: 'succeeded', key, output: String(result.output_text), executionId: String(result.execution_id), message: 'Readiness check passed.' })
    } catch (error) {
      setProofState({ phase: 'failed', key, message: error instanceof Error ? error.message : 'The readiness check did not finish.' })
    }
  }

  const agentAction = async (action: AgentAction) => {
    const instance = launchState?.instance
    if (!instance) return
    if (action === 'delete' && !window.confirm('Delete this instance? Its files, memory, sessions, and connections will be permanently removed.')) return
    setAgentBusy(true)
    setAgentError('')
    try {
      const request = agentActionRequest(instance.id, action, resourceConfig)
      const response = await authenticatedFetch(request.url, request.init)
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message ?? 'Agent action is unavailable.')
      if (action === 'delete') {
        setLaunchState(null)
        setProofState({ phase: 'idle' })
        window.localStorage.removeItem(LAUNCH_STORAGE_KEY)
        setAgentError('Instance deleted.')
        return
      }
      setLaunchState((current) => current ? { ...current, instance: { ...instance, status: result.instance?.status ?? (action === 'stop' ? 'stopped' : 'running') }, message: `Instance ${action} request accepted.` } : current)
    } catch (error) {
      setAgentError(error instanceof Error ? error.message : 'Agent action failed.')
    } finally {
      setAgentBusy(false)
    }
  }

  const openAgentSurface = async (surface: keyof typeof surfacePorts) => {
    const instance = launchState?.instance
    if (!instance) return
    setAgentBusy(true)
    setAgentError('')
    try {
      const response = await authenticatedFetch(`/api/agents/instances/${instance.id}/signed-url`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ port: surfacePorts[surface] }),
      })
      const result = await response.json()
      if (!response.ok || !result.ok || typeof result.result?.url !== 'string') throw new Error(result.message ?? 'Signed access is not available.')
      window.open(result.result.url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      setAgentError(error instanceof Error ? error.message : 'Could not mint a signed link.')
    } finally {
      setAgentBusy(false)
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">LM</span> LegitMate</div>
        <EmbeddedWallet />
      </header>

      <div className="main setup-main">
        <section className="setup-hero">
          <div className="eyebrow">Specialist deployment</div>
          <h1>Choose an agent.<br /><em>Deploy with confidence.</em></h1>
          <p>Pick a specialist, confirm its profile, choose a model and capabilities, then review the exact setup before deployment.</p>
        </section>

        <nav className="setup-steps" aria-label="Setup progress">
          {stepLabels.map((label, index) => {
            const step = index + 1
            return <button key={label} type="button" className={currentStep === step ? 'active' : currentStep > step ? 'complete' : ''} onClick={() => step <= currentStep && setCurrentStep(step)} disabled={step > currentStep}><span>{currentStep > step ? '✓' : step}</span>{label}</button>
          })}
        </nav>

        {selectedAgency && (
          <aside className="selection-summary" aria-live="polite">
            <span className="eyebrow">Selected specialist</span>
            <strong>{selectedAgency.name}</strong>
            <span>{selectedAgency.division}</span>
            <button type="button" onClick={() => setCurrentStep(1)}>Change</button>
          </aside>
        )}

        <section className="setup-panel" aria-labelledby={`step-${currentStep}-title`}>
          {currentStep === 1 && (
            <>
              <div className="step-heading">
                <div><span className="eyebrow">Step 1 of 5</span><h2 id="step-1-title">Select an agent</h2><p>Browse all {AGENCY_AGENT_COUNT} specialists. The roster stays in one scrollable list.</p></div>
                <strong className="roster-count">{AGENCY_AGENT_COUNT} agents</strong>
              </div>
              <div className="agency-grid" aria-label={`${AGENCY_AGENT_COUNT} Agency specialists`}>
                {AGENCY_AGENTS.map((agent) => (
                  <button key={agent.slug} type="button" className={selectedAgency?.slug === agent.slug ? 'agency-card selected' : 'agency-card'} aria-pressed={selectedAgency?.slug === agent.slug} onClick={() => selectAgency(agent)}>
                    <span className="agency-card-top"><span>{agent.division}</span>{selectedAgency?.slug === agent.slug && <b>Selected</b>}</span>
                    <strong>{agent.name}</strong><small>{agent.description}</small><em>“{agent.vibe}”</em>
                  </button>
                ))}
              </div>
              <div className="step-actions"><span>{selectedAgency ? `${selectedAgency.name} is selected.` : 'Choose one specialist to continue.'}</span><button className="primary" type="button" disabled={!selectedAgency} onClick={() => setCurrentStep(2)}>Continue to profile →</button></div>
            </>
          )}

          {currentStep === 2 && selectedAgency && (
            <>
              <div className="step-heading"><div><span className="eyebrow">Step 2 of 5</span><h2 id="step-2-title">Confirm the profile</h2><p>These files define how {selectedAgency.name} works. The prepared profile is ready as-is.</p></div></div>
              <div className="profile-card"><div className="profile-identity"><span>{selectedAgency.division}</span><h3>{selectedAgency.name}</h3><p>{selectedAgency.description}</p><blockquote>“{selectedAgency.vibe}”</blockquote></div><details className="profile-files"><summary>Review or edit profile files</summary><div><label><span>soul.md</span><textarea value={agencySoul} onChange={(event) => setAgencySoul(event.target.value)} /></label><label><span>user.md</span><textarea value={agencyUser} onChange={(event) => setAgencyUser(event.target.value)} /></label><label><span>agents.md</span><textarea value={agencySkills} onChange={(event) => setAgencySkills(event.target.value)} /></label></div></details></div>
              <div className="step-actions"><button className="secondary" type="button" onClick={() => setCurrentStep(1)}>← Back</button><button className="primary" type="button" onClick={() => setCurrentStep(3)}>Confirm profile →</button></div>
            </>
          )}

          {currentStep === 3 && selectedAgency && (
            <>
              <div className="step-heading"><div><span className="eyebrow">Step 3 of 5</span><h2 id="step-3-title">Choose provider and model</h2><p>The default models are always available. Surplus models appear when returned by the configured server endpoint.</p></div></div>
              <fieldset className="model-picker"><legend>Provider and model</legend>{availableModels.map((model) => <label key={model.id} className={selectedModel === model.id ? 'model-option selected' : 'model-option'}><input type="radio" name="model" value={model.id} checked={selectedModel === model.id} onChange={() => setSelectedModel(model.id)} /><span><strong>{model.label}</strong><small>{model.provider === 'surplus' ? `Surplus · ${model.id}` : `Default provider · ${model.id}`}</small></span></label>)}</fieldset>
              {!modelsLoaded && <p className="helper" role="status">Checking for Surplus models…</p>}
              {modelsLoaded && !availableModels.some((model) => model.provider === 'surplus') && <p className="helper">No Surplus models are configured. You can continue with a default model.</p>}
              <div className="step-actions"><button className="secondary" type="button" onClick={() => setCurrentStep(2)}>← Back</button><button className="primary" type="button" onClick={() => setCurrentStep(4)}>Continue to capabilities →</button></div>
            </>
          )}

          {currentStep === 4 && selectedAgency && (
            <>
              <div className="step-heading"><div><span className="eyebrow">Step 4 of 5</span><h2 id="step-4-title">Add capabilities</h2><p>Only capabilities with a server-owned installer and post-install verification are shown. You can also deploy without extras.</p></div><strong className="roster-count">{selectedCapabilities.length} selected</strong></div>
              <div className="capability-list">{INSTALLABLE_HERMES_CAPABILITIES.map((capability) => { const capabilityId = `${capability.kind}:${capability.slug}`; return <label key={capabilityId} className={selectedCapabilities.includes(capabilityId) ? 'capability-row selected' : 'capability-row'}><input type="checkbox" checked={selectedCapabilities.includes(capabilityId)} onChange={() => toggleCapability(capability)} /><span className="capability-kind">{capability.kind}</span><span><strong>{capability.name}</strong><small>{capability.description}</small></span></label> })}</div>
              <p className="helper">Selection does not prove installation. Installation is verified only after deployment.</p>
              <div className="step-actions"><button className="secondary" type="button" onClick={() => setCurrentStep(3)}>← Back</button><button className="primary" type="button" onClick={() => setCurrentStep(5)}>Review setup →</button></div>
            </>
          )}

          {currentStep === 5 && selectedAgency && (
            <>
              <div className="step-heading"><div><span className="eyebrow">Step 5 of 5</span><h2 id="step-5-title">Review and deploy</h2><p>Check the exact specialist, profile, model, and capabilities that will be sent to the launch service.</p></div></div>
              <dl className="review-list"><div><dt>Agent</dt><dd><strong>{selectedAgency.name}</strong><span>{selectedAgency.division} · {selectedAgency.slug}</span></dd><button type="button" onClick={() => setCurrentStep(1)}>Edit</button></div><div><dt>Profile</dt><dd><strong>Prepared profile confirmed</strong><span>soul.md · user.md · agents.md</span></dd><button type="button" onClick={() => setCurrentStep(2)}>Edit</button></div><div><dt>Provider & model</dt><dd><strong>{selectedModelChoice.provider === 'surplus' ? 'Surplus' : 'Default'}</strong><span>{selectedModelChoice.label} · {selectedModelChoice.id}</span></dd><button type="button" onClick={() => setCurrentStep(3)}>Edit</button></div><div><dt>Capabilities</dt><dd><strong>{selectedCapabilityDetails.length ? `${selectedCapabilityDetails.length} selected` : 'No extras selected'}</strong><span>{selectedCapabilityDetails.length ? selectedCapabilityDetails.map((item) => `${item.kind}: ${item.name}`).join(' · ') : 'Base workspace only'}</span></dd><button type="button" onClick={() => setCurrentStep(4)}>Edit</button></div></dl>
              <div className="deploy-bar"><div><strong>Ready to create {selectedAgency.name}</strong><span>Deployment applies the profile and then verifies configuration readback.</span></div><button className="primary deploy-button" type="button" disabled={launchState?.phase === 'launching'} onClick={() => launchAgent('agent37-hermes', selectedAgency.name)}>{launchState?.phase === 'launching' ? 'Deploying…' : 'Deploy specialist →'}</button></div>

              {launchState && <section className={`launch-result ${launchState.phase}`} aria-live="polite"><span className="eyebrow">Deployment status</span><h3>{launchState.instance?.name ?? selectedAgency.name}</h3><p>{launchState.message}</p>{launchState.receipt && <><div className="receipt-summary"><div><span>Configuration</span><strong className="mono">{launchState.receipt.config_id.slice(0, 12)}…</strong></div><div><span>Files</span><strong>{launchState.receipt.files.length} verified</strong></div><div><span>Model</span><strong>{launchState.runtime?.model.id ?? selectedModel}</strong></div></div><details><summary>Readback evidence</summary><ul>{launchState.receipt.files.map((file) => <li key={file.role}><span>{file.role}</span><span className="mono">{file.bytes} bytes · {file.sha256.slice(0, 8)}…</span></li>)}</ul></details><div className="proof-task"><h4>Safe readiness check</h4>{proofState.phase === 'succeeded' ? <div className="proof-success"><strong>✓ Test passed</strong><span>{proofState.output}</span></div> : <button className="secondary" type="button" disabled={proofState.phase === 'running'} onClick={runProofTask}>{proofState.phase === 'running' ? 'Running check…' : proofState.phase === 'failed' ? 'Try check again' : 'Run safe check'}</button>}{proofState.phase === 'failed' && <p role="alert">{proofState.message}</p>}</div></>}
                {launchState.instance && launchState.phase === 'applied' && <div className="instance-tools"><label><span>Instance size</span><select value={`${resourceConfig.cpu}/${resourceConfig.memory}`} onChange={(event) => { const [cpu, memory] = event.target.value.split('/').map(Number); setResourceConfig((current) => ({ ...current, cpu, memory })) }}><option value="2/4">Standard · 2 vCPU / 4 GB</option><option value="4/8">Power · 4 vCPU / 8 GB</option><option value="8/16">Max · 8 vCPU / 16 GB</option></select></label><div><span>Open</span>{(['chat', 'files', 'terminal', 'integrations', 'settings'] as const).map((surface) => <button type="button" key={surface} disabled={agentBusy} onClick={() => openAgentSurface(surface)}>{surface}</button>)}</div><div><span>Lifecycle</span>{(['start', 'stop', 'restart'] as AgentAction[]).map((action) => <button type="button" key={action} disabled={agentBusy} onClick={() => agentAction(action)}>{action}</button>)}<button className="danger-control" type="button" disabled={agentBusy} onClick={() => agentAction('delete')}>delete</button></div></div>}
                {agentError && <p role="alert">{agentError}</p>}</section>}
              <div className="step-actions"><button className="secondary" type="button" onClick={() => setCurrentStep(4)}>← Back</button></div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

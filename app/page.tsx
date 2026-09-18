'use client'

import { getAccessToken } from '@privy-io/react-auth'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'
import { ThemeToggle } from '../components/theme-provider'
import { SoundToggle } from '../components/ui-sounds'
import { EmbeddedWallet } from '../components/embedded-wallet'
import { AGENCY_AGENTS, AGENCY_AGENT_COUNT, type AgencyAgent } from '../lib/agency-agents'
import { agentActionRequest, type AgentAction } from '../lib/agent-actions'
import { deploymentConfettiBursts } from '../lib/deployment-confetti'

const LAUNCH_STORAGE_KEY = 'legitmate.launch'
const stepLabels = ['Select agent', 'Profile', 'Provider & model', 'Capabilities', 'Review & deploy'] as const
const resourceDefaults = { cpu: 2, memory: 4, disk: 6 }

type AgentInstance = {
  id: string
  name: string
  status: string
  template: string
  url?: string
  createdAt: string
  resources?: { cpu: number; memory: number; disk: number }
  usage?: { spend: string; budget: string }
}
type StoredLaunch = { version: 1; requestId: string; template: string; instance: AgentInstance; resources: { cpu: number; memory: number; disk: number } }
type ConfigurationReceipt = {
  schema_version: 1
  config_id: string
  status: 'applied'
  files: Array<{ role: 'configuration' | 'soul' | 'user' | 'agents'; path: string; sha256: string; bytes: number }>
  verified_at: string
}
type RuntimeReceipt = {
  model: { provider: 'default' | 'surplus'; id: string; config_sha256: string }
  capabilities: Array<{ id: string; status: 'available' | 'installed'; evidence?: string; source_revision?: string; artifact_sha256?: string }>
}
type StoredConfiguration = { agency?: { slug?: string }; identity?: { soul?: string; user?: string; agents?: string }; runtime?: { model?: string; capability_ids?: string[] } }
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
type GraphState = { phase: 'idle' | 'running' | 'succeeded' | 'failed'; message?: string; result?: { market: { source: { blockNumber: number; blockHash: string; deployment: string; observedAt: string }; market: { ethPriceUSD: number; totalValueLockedUSD: number; topPools: Array<{ pair: string; volumeUSD: number }> }; metrics: { topPoolVolumeSharePct: number; volumeToTvlRatio: number } }; analysis: { verdict: string; summary: string; evidence: string[] } } }
type ModelChoice = { id: string; label: string; provider: 'default' | 'surplus' }
type CatalogCapability = { id: string; kind: 'skill' | 'plugin'; name: string; description: string; source: string; trust: string; installable: boolean; reason?: string; requiresEnv?: string[] }
type CatalogResponse = { ok: boolean; items?: CatalogCapability[]; total?: number; page?: number; totalPages?: number; counts?: { skills: number; plugins: number }; message?: string }

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

async function responseBody(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''
  const text = await response.text()
  if (contentType.includes('application/json')) {
    try { return JSON.parse(text) as Record<string, unknown> } catch { /* handled below */ }
  }
  const requestId = response.headers.get('cf-ray') ?? response.headers.get('x-request-id')
  throw new Error(`The server returned ${response.status} ${response.statusText || 'an unexpected response'}${requestId ? ` · request ${requestId}` : ''}. Please retry; if it continues, the service may be deploying.`)
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [agentQuery, setAgentQuery] = useState('')
  const [selectedAgency, setSelectedAgency] = useState<AgencyAgent | null>(null)
  const [agencySoul, setAgencySoul] = useState('')
  const [agencyUser, setAgencyUser] = useState('')
  const [agencySkills, setAgencySkills] = useState('')
  const [selectedModel, setSelectedModel] = useState('nous-default')
  const [availableModels, setAvailableModels] = useState<ModelChoice[]>(defaultModels)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [catalogItems, setCatalogItems] = useState<CatalogCapability[]>([])
  const [catalogQuery, setCatalogQuery] = useState('')
  const [catalogKind, setCatalogKind] = useState<'all' | 'skill' | 'plugin'>('all')
  const [catalogPage, setCatalogPage] = useState(1)
  const [catalogTotalPages, setCatalogTotalPages] = useState(1)
  const [catalogCounts, setCatalogCounts] = useState({ skills: 0, plugins: 0 })
  const [catalogPhase, setCatalogPhase] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [catalogError, setCatalogError] = useState('')
  const [catalogRetry, setCatalogRetry] = useState(0)
  const [selectedCapabilityMetadata, setSelectedCapabilityMetadata] = useState<Record<string, CatalogCapability>>({})
  const [launchState, setLaunchState] = useState<LaunchState | null>(null)
  const [proofState, setProofState] = useState<ProofState>({ phase: 'idle' })
  const [graphState, setGraphState] = useState<GraphState>({ phase: 'idle' })
  const [agentBusy, setAgentBusy] = useState(false)
  const [agentError, setAgentError] = useState('')
  const [resourceConfig, setResourceConfig] = useState(resourceDefaults)
  const [launchResources, setLaunchResources] = useState<typeof resourceDefaults | null>(null)
  const celebratedRequest = useRef<string | null>(null)
  const previousStep = useRef(currentStep)
  const stepPanel = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (previousStep.current !== currentStep) {
      previousStep.current = currentStep
      stepPanel.current?.querySelector<HTMLElement>('h2')?.focus()
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep !== 4) return
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setCatalogPhase('loading'); setCatalogError('')
      const params = new URLSearchParams({ page: String(catalogPage), size: '24' })
      if (catalogKind !== 'all') params.set('kind', catalogKind)
      if (catalogQuery.trim()) params.set('q', catalogQuery.trim())
      fetch(`/api/hermes/catalog?${params}`, { signal: controller.signal })
        .then(async (response) => ({ response, body: await response.json() as CatalogResponse }))
        .then(({ response, body }) => {
          if (!response.ok || !body.ok || !body.items) throw new Error(body.message || 'Hermes catalog is unavailable.')
          setCatalogItems(body.items)
          setSelectedCapabilityMetadata((current) => ({ ...current, ...Object.fromEntries(body.items!.map((item) => [item.id, item])) }))
          setCatalogTotalPages(body.totalPages ?? 1); setCatalogCounts(body.counts ?? { skills: 0, plugins: 0 }); setCatalogPhase('ready')
        })
        .catch((error) => { if (error instanceof DOMException && error.name === 'AbortError') return; setCatalogError(error instanceof Error ? error.message : 'Hermes catalog is unavailable.'); setCatalogPhase('error') })
    }, 250)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [currentStep, catalogQuery, catalogKind, catalogPage, catalogRetry])

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
      if (stored?.version !== 1 || !stored.instance?.id || !stored.requestId || !stored.resources) {
        window.localStorage.removeItem(LAUNCH_STORAGE_KEY)
        return
      }
      setResourceConfig(stored.resources)
      setLaunchResources(stored.resources)
      setLaunchState({ template: stored.template, phase: 'launching', requestId: stored.requestId, instance: { ...stored.instance, resources: stored.resources }, message: 'Checking workspace configuration…' })
      authenticatedFetch(`/api/agents/instances/${stored.instance.id}/configuration`)
        .then(async (response) => {
          const result = await responseBody(response)
          if (!response.ok || result.ok !== true || result.status !== 'applied') throw new Error(typeof result.message === 'string' ? result.message : 'Saved configuration could not be verified.')
          const configuration = result.configuration as StoredConfiguration | undefined
          const agency = AGENCY_AGENTS.find((agent) => agent.slug === configuration?.agency?.slug)
          if (!agency || !configuration?.identity?.soul || !configuration.identity.user || !configuration.identity.agents) throw new Error('Saved specialist profile could not be restored.')
          setSelectedAgency(agency)
          setAgencySoul(configuration.identity.soul)
          setAgencyUser(configuration.identity.user)
          setAgencySkills(configuration.identity.agents)
          setSelectedModel(configuration.runtime?.model ?? 'nous-default')
          setSelectedCapabilities(configuration.runtime?.capability_ids ?? [])
          setCurrentStep(5)
          const receipt = result.receipt as (ConfigurationReceipt & { runtime?: RuntimeReceipt })
          setLaunchState({ template: stored.template, phase: 'applied', requestId: stored.requestId, instance: { ...stored.instance, resources: stored.resources }, receipt, runtime: receipt.runtime, message: 'Configuration verified after reopen.' })
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
    const resources = launchState.instance.resources ?? resourceConfig
    const record: StoredLaunch = { version: 1, requestId: launchState.requestId, template: launchState.template, instance: { ...launchState.instance, resources }, resources }
    window.localStorage.setItem(LAUNCH_STORAGE_KEY, JSON.stringify(record))
  }, [launchState, resourceConfig])

  useEffect(() => {
    if (launchState?.phase !== 'applied' || celebratedRequest.current === launchState.requestId) return
    celebratedRequest.current = launchState.requestId
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    for (const burst of deploymentConfettiBursts()) void confetti(burst)
  }, [launchState])

  const selectedModelChoice = availableModels.find((model) => model.id === selectedModel) ?? defaultModels[0]
  const normalizedAgentQuery = agentQuery.trim().toLowerCase()
  const visibleAgents = useMemo(
    () => normalizedAgentQuery
      ? AGENCY_AGENTS.filter((agent) => `${agent.name} ${agent.division} ${agent.description} ${agent.vibe}`.toLowerCase().includes(normalizedAgentQuery))
      : AGENCY_AGENTS,
    [normalizedAgentQuery],
  )
  const selectedCapabilityDetails = useMemo(
    () => {
      const live = new Map(Object.entries(selectedCapabilityMetadata))
      return selectedCapabilities.map((id) => live.get(id) ?? { id, kind: id.startsWith('plugin:') ? 'plugin' as const : 'skill' as const, name: id.slice(id.indexOf(':') + 1), description: 'Selected from the Hermes catalog.', source: 'Hermes', trust: 'catalog', installable: true })
    },
    [selectedCapabilities, selectedCapabilityMetadata],
  )

  const selectAgency = (agent: AgencyAgent) => {
    const profile = profileFor(agent)
    setSelectedAgency(agent)
    setAgencySoul(profile.soul)
    setAgencyUser(profile.user)
    setAgencySkills(profile.agents)
    setLaunchState(null)
    setLaunchResources(null)
    setProofState({ phase: 'idle' })
    setGraphState({ phase: 'idle' })
  }

  const toggleCapability = (capability: CatalogCapability) => {
    const id = capability.id
    setSelectedCapabilities((current) =>
      current.includes(id) ? current.filter((capabilityId) => capabilityId !== id) : current.length < 16 ? [...current, id] : current,
    )
  }

  const launchAgent = async (template: string, label: string, requestedResources = resourceConfig) => {
    if (!selectedAgency) return
    const resources = launchResources ?? { ...requestedResources }
    if (!launchResources) setLaunchResources(resources)
    setProofState({ phase: 'idle' })
    setGraphState({ phase: 'idle' })
    const requestId = launchState?.template === template && launchState.phase === 'failed' ? launchState.requestId : crypto.randomUUID()
    setLaunchState({ template, phase: 'launching', requestId, message: `Creating ${label} and applying its configuration…` })
    setAgentError('')
    const reconcile = async (attempts = 1) => {
      let pendingInstance: Record<string, unknown> | undefined
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 2000))
        try {
          setLaunchState({ template, phase: 'launching', requestId, message: `Checking whether ${label} was created…` })
          const response = await authenticatedFetch(`/api/agents/launch/${encodeURIComponent(requestId)}`)
          const result = await responseBody(response)
          const recovered = result.instance as Record<string, unknown> | undefined
          const recoveredConfiguration = result.configuration as { receipt?: ConfigurationReceipt } | undefined
          if (result.state === 'complete' && recovered?.id && recoveredConfiguration?.receipt?.status === 'applied') {
            const receipt = recoveredConfiguration.receipt
            setLaunchState({ template, phase: 'applied', requestId, receipt, message: `Workspace recovered after the connection closed · ${receipt.files.length} profile files verified.`, instance: { id: String(recovered.id), name: label, status: String(recovered.status ?? 'provisioned'), template, url: typeof recovered.url === 'string' ? recovered.url : undefined, createdAt: new Date().toISOString(), resources, usage: { spend: '$0.00', budget: '$5.00 / month' } } })
            return true
          }
          if (result.state === 'pending' && recovered?.id) pendingInstance = recovered
        } catch { /* preserve the original launch error */ }
      }
      if (pendingInstance?.id) {
        setLaunchState({ template, phase: 'failed', requestId, message: 'The workspace was created, but configuration verification is not complete. Retry deployment to resume safely without creating a duplicate.', instance: { id: String(pendingInstance.id), name: label, status: 'configuration pending', template, createdAt: new Date().toISOString(), resources } })
        return true
      }
      return false
    }
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
      const parsed = await responseBody(response)
      const result = parsed as Record<string, unknown>
      if (response.status === 202 || result.pending === true) {
        if (await reconcile(5)) return
        setLaunchState({ template, phase: 'failed', requestId, message: 'The request is still pending, but no workspace is visible yet. Check My instances, then retry with the same request.' })
        return
      }
      const raw = result.instance as Record<string, unknown> | undefined
      if (!response.ok || !result.ok) {
        if ((response.status >= 500 || response.status === 424) && await reconcile(5)) return
        const failedInstance = raw?.id
          ? { id: String(raw.id), name: label, status: 'configuration pending', template, createdAt: new Date().toISOString(), resources }
          : undefined
        setLaunchState({ template, phase: 'failed', requestId, message: typeof result.message === 'string' ? result.message : 'Workspace creation failed.', instance: failedInstance })
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
          resources,
          usage: { spend: '$0.00', budget: '$5.00 / month' },
        },
      })
    } catch (error) {
      if (await reconcile(5)) return
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
      const result = await responseBody(response)
      if (!response.ok || result.ok !== true || result.status !== 'succeeded') throw new Error(typeof result.message === 'string' ? result.message : 'The readiness check did not finish.')
      setProofState({ phase: 'succeeded', key, output: String(result.output_text), executionId: String(result.execution_id), message: 'Readiness check passed.' })
    } catch (error) {
      setProofState({ phase: 'failed', key, message: error instanceof Error ? error.message : 'The readiness check did not finish.' })
    }
  }

  const runGraphResearch = async () => {
    const instance = launchState?.instance
    if (!instance || launchState.phase !== 'applied') return
    setGraphState({ phase: 'running', message: 'Querying live Uniswap data through The Graph…' })
    try {
      const response = await authenticatedFetch(`/api/agents/instances/${instance.id}/graph-research`, { method: 'POST' })
      const result = await responseBody(response)
      if (!response.ok || result.ok !== true) throw new Error(typeof result.message === 'string' ? result.message : 'Live market research failed.')
      setGraphState({ phase: 'succeeded', result: result as GraphState['result'], message: 'Live Graph evidence analyzed.' })
    } catch (error) {
      setGraphState({ phase: 'failed', message: error instanceof Error ? error.message : 'Live market research failed.' })
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
      const result = await responseBody(response)
      if (!response.ok || result.ok !== true) throw new Error(typeof result.message === 'string' ? result.message : 'Agent action is unavailable.')
      if (action === 'delete') {
        setLaunchState(null)
        setLaunchResources(null)
        setProofState({ phase: 'idle' })
        window.localStorage.removeItem(LAUNCH_STORAGE_KEY)
        setAgentError('Instance deleted.')
        return
      }
      setLaunchState((current) => current ? { ...current, instance: { ...instance, status: typeof result.status === 'string' ? result.status : (action === 'stop' ? 'stopped' : 'running') }, message: `Instance ${action} request accepted.` } : current)
    } catch (error) {
      setAgentError(error instanceof Error ? error.message : 'Agent action failed.')
    } finally {
      setAgentBusy(false)
    }
  }

  const openAgentWorkspace = (instanceId: string) => {
    window.location.href = `/instances/${encodeURIComponent(instanceId)}`
  }

  return (
    <main className="shell">
      <a className="skip-link" href="#main-content">Skip to setup</a>
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">LM</span> LegitClub</Link>
        <div className="topbar-actions"><Link className="top-link" href="/short-form-video">Short-form video</Link><Link className="top-link" href="/seo-services">SEO services</Link><Link className="top-link" href="/instances">My instances</Link><ThemeToggle /><SoundToggle /><EmbeddedWallet /></div>
      </header>

      <div id="main-content" className="main setup-main">
        <section className="setup-hero t-hero-reveal">
          <div className="eyebrow">Specialist deployment</div>
          <h1>Choose an agent.<br /><em>Deploy with confidence.</em></h1>
          <p>Pick a specialist, confirm its profile, choose a model and capabilities, then review the exact setup before deployment. Need search growth instead? <Link href="/seo-services">Explore our global SEO services →</Link></p>
          <div className="hero-signal"><span>279 specialists</span><i aria-hidden="true" /><span>verified setup</span><i aria-hidden="true" /><span>owned workspace</span></div>
        </section>

        <nav className="setup-steps" aria-label="Setup progress">
          {stepLabels.map((label, index) => {
            const step = index + 1
            return <Button key={label} type="button" aria-current={currentStep === step ? 'step' : undefined} className={currentStep === step ? 'active' : currentStep > step ? 'complete' : ''} onClick={() => step <= currentStep && setCurrentStep(step)} disabled={step > currentStep}><span>{currentStep > step ? '✓' : step}</span>{label}</Button>
          })}
        </nav>

        {selectedAgency && (
          <aside className="selection-summary" aria-live="polite">
            <span className="eyebrow">Selected specialist</span>
            <strong>{selectedAgency.name}</strong>
            <span>{selectedAgency.division}</span>
            <Button type="button" onClick={() => setCurrentStep(1)}>Change</Button>
          </aside>
        )}

        <section ref={stepPanel} key={currentStep} className="setup-panel t-stage-enter" aria-labelledby={`step-${currentStep}-title`}>
          {currentStep === 1 && (
            <>
              <div className="step-heading">
                <div className="step-heading-copy"><span className="eyebrow">Step 1 of 5</span><h2 tabIndex={-1} id="step-1-title">Select an agent</h2><p>Browse all {AGENCY_AGENT_COUNT} specialists. The roster stays in one scrollable list.</p></div>
                <Badge variant="outline" className="roster-count t-number-pop">{AGENCY_AGENT_COUNT} agents</Badge>
              </div>
              <div className="roster-toolbar">
                <label className="agent-search">
                  <Search aria-hidden="true" />
                  <span className="sr-only">Search specialists</span>
                  <Input type="search" value={agentQuery} onChange={(event) => setAgentQuery(event.target.value)} placeholder="Search specialists" />
                </label>
                <Badge variant="outline" className="roster-count t-number-pop">{visibleAgents.length} of {AGENCY_AGENT_COUNT}</Badge>
              </div>
              <ScrollArea className="agency-scroll" role="region" aria-labelledby="step-1-title">
                <div className="agency-grid">
                  {visibleAgents.map((agent) => (
                    <Button key={agent.slug} type="button" className={selectedAgency?.slug === agent.slug ? 'agency-card selected t-card-select' : 'agency-card t-card-select'} aria-pressed={selectedAgency?.slug === agent.slug} onClick={() => selectAgency(agent)}>
                      <span className="agency-card-top"><span>{agent.division}</span>{selectedAgency?.slug === agent.slug && <b>Selected</b>}</span>
                      <strong>{agent.name}</strong><small>{agent.description}</small><em>“{agent.vibe}”</em>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              {visibleAgents.length === 0 && <div className="roster-empty" role="status"><strong>No matching specialists</strong><span>Try a role, division, or capability.</span></div>}
              <div className="step-actions"><span>{selectedAgency ? `${selectedAgency.name} is selected.` : 'Choose one specialist to continue.'}</span><Button className="primary" type="button" disabled={!selectedAgency} onClick={() => setCurrentStep(2)}>Continue to profile →</Button></div>
            </>
          )}

          {currentStep === 2 && selectedAgency && (
            <>
              <div className="step-heading"><div><span className="eyebrow">Step 2 of 5</span><h2 tabIndex={-1} id="step-2-title">Confirm the profile</h2><p>These files define how {selectedAgency.name} works. The prepared profile is ready as-is.</p></div></div>
              <div className="profile-card"><div className="profile-identity"><span>{selectedAgency.division}</span><h3>{selectedAgency.name}</h3><p>{selectedAgency.description}</p><blockquote>“{selectedAgency.vibe}”</blockquote></div><details className="profile-files"><summary>Review or edit profile files</summary><div><label><span>soul.md</span><Textarea value={agencySoul} onChange={(event) => setAgencySoul(event.target.value)} /></label><label><span>user.md</span><Textarea value={agencyUser} onChange={(event) => setAgencyUser(event.target.value)} /></label><label><span>agents.md</span><Textarea value={agencySkills} onChange={(event) => setAgencySkills(event.target.value)} /></label></div></details></div>
              <div className="step-actions"><Button className="secondary" type="button" onClick={() => setCurrentStep(1)}>← Back</Button><Button className="primary" type="button" onClick={() => setCurrentStep(3)}>Confirm profile →</Button></div>
            </>
          )}

          {currentStep === 3 && selectedAgency && (
            <>
              <div className="step-heading"><div><span className="eyebrow">Step 3 of 5</span><h2 tabIndex={-1} id="step-3-title">Choose provider and model</h2><p>The default models are always available. Surplus models appear when returned by the configured server endpoint.</p></div></div>
              <fieldset className="model-picker"><legend>Provider and model</legend>{availableModels.map((model) => <label key={model.id} className={selectedModel === model.id ? 'model-option selected t-choice' : 'model-option t-choice'}><input type="radio" name="model" value={model.id} checked={selectedModel === model.id} onChange={() => setSelectedModel(model.id)} /><span><strong>{model.label}</strong><small>{model.provider === 'surplus' ? `Surplus · ${model.id}` : `Default provider · ${model.id}`}</small></span></label>)}</fieldset>
              {!modelsLoaded && <p className="helper" role="status">Checking for Surplus models…</p>}
              {modelsLoaded && !availableModels.some((model) => model.provider === 'surplus') && <p className="helper">No Surplus models are configured. You can continue with a default model.</p>}
              <div className="step-actions"><Button className="secondary" type="button" onClick={() => setCurrentStep(2)}>← Back</Button><Button className="primary" type="button" onClick={() => setCurrentStep(4)}>Continue to capabilities →</Button></div>
            </>
          )}

          {currentStep === 4 && selectedAgency && (
            <>
              <div className="step-heading"><div><span className="eyebrow">Step 4 of 5</span><h2 tabIndex={-1} id="step-4-title">Add capabilities</h2><p>Browse the live Hermes Skills Hub and plugin catalog. LegitMate installs selected entries inside your workspace and verifies the result.</p></div><strong className="roster-count">{selectedCapabilities.length} / 16 selected</strong></div>
              <div className="catalog-toolbar"><Input aria-label="Search Hermes capabilities" type="search" value={catalogQuery} onChange={(event) => { setCatalogQuery(event.target.value); setCatalogPage(1) }} placeholder="Search 100k+ Hermes skills and plugins" /><div role="group" aria-label="Capability type"><Button type="button" aria-pressed={catalogKind === 'all'} onClick={() => { setCatalogKind('all'); setCatalogPage(1) }}>All</Button><Button type="button" aria-pressed={catalogKind === 'skill'} onClick={() => { setCatalogKind('skill'); setCatalogPage(1) }}>Skills {catalogCounts.skills.toLocaleString()}</Button><Button type="button" aria-pressed={catalogKind === 'plugin'} onClick={() => { setCatalogKind('plugin'); setCatalogPage(1) }}>Plugins {catalogCounts.plugins.toLocaleString()}</Button></div></div>
              {catalogPhase === 'loading' && <p className="helper t-text-swap" data-phase="loading" role="status"><span>Loading the Hermes catalog…</span></p>}
              {catalogPhase === 'error' && <div className="catalog-error t-panel-reveal t-error-shake" data-error="true" role="alert"><span>{catalogError}</span><Button type="button" onClick={() => setCatalogRetry((value) => value + 1)}>Try again</Button></div>}
              {catalogPhase === 'ready' && <div className="capability-list t-panel-reveal">{catalogItems.map((capability) => { const selected = selectedCapabilities.includes(capability.id); const selectionLimit = selectedCapabilities.length >= 16 && !selected; const disabledReason = capability.reason ?? (selectionLimit ? 'Selection limit reached' : ''); return <label key={capability.id} title={disabledReason} className={selected ? 'capability-row selected t-choice t-checkbox' : 'capability-row t-choice t-checkbox'}><input type="checkbox" checked={selected} disabled={!capability.installable || selectionLimit} aria-describedby={disabledReason ? `capability-reason-${capability.id.replaceAll(/[^A-Za-z0-9_-]/g, '-')}` : undefined} onChange={() => toggleCapability(capability)} /><span className="capability-kind">{capability.kind}</span><span><strong>{capability.name}</strong><small>{capability.description || capability.source}</small>{disabledReason && <em id={`capability-reason-${capability.id.replaceAll(/[^A-Za-z0-9_-]/g, '-')}`}>{disabledReason}</em>}</span></label> })}</div>}
              {catalogPhase === 'ready' && catalogItems.length === 0 && <div className="roster-empty" role="status"><strong>No matching capabilities</strong><span>Try another term or capability type.</span></div>}
              {catalogTotalPages > 1 && <div className="catalog-pagination" aria-live="polite"><Button type="button" disabled={catalogPage <= 1} onClick={() => setCatalogPage((page) => page - 1)}>← Previous</Button><span>Page {catalogPage} of {catalogTotalPages}</span><Button type="button" disabled={catalogPage >= catalogTotalPages} onClick={() => setCatalogPage((page) => page + 1)}>Next →</Button></div>}
              <p className="helper">Catalog choices are resolved again by the server. Installation is complete only after Agent37 exec and Hermes readback verification succeed.</p>
              <div className="step-actions"><Button className="secondary" type="button" onClick={() => setCurrentStep(3)}>← Back</Button><Button className="primary" type="button" disabled={catalogPhase === 'loading' || catalogPhase === 'error'} onClick={() => setCurrentStep(5)}>Review setup →</Button></div>
            </>
          )}

          {currentStep === 5 && selectedAgency && (
            <>
              <div className="step-heading"><div><span className="eyebrow">Step 5 of 5</span><h2 tabIndex={-1} id="step-5-title">Review and deploy</h2><p>Check the exact specialist, profile, model, and capabilities that will be sent to the launch service.</p></div></div>
              <dl className="review-list"><div><dt>Agent</dt><dd><strong>{selectedAgency.name}</strong><span>{selectedAgency.division} · {selectedAgency.slug}</span></dd><Button type="button" onClick={() => setCurrentStep(1)}>Edit</Button></div><div><dt>Profile</dt><dd><strong>Prepared profile confirmed</strong><span>soul.md · user.md · agents.md</span></dd><Button type="button" onClick={() => setCurrentStep(2)}>Edit</Button></div><div><dt>Provider & model</dt><dd><strong>{selectedModelChoice.provider === 'surplus' ? 'Surplus' : 'Default'}</strong><span>{selectedModelChoice.label} · {selectedModelChoice.id}</span></dd><Button type="button" onClick={() => setCurrentStep(3)}>Edit</Button></div><div><dt>Capabilities</dt><dd><strong>{selectedCapabilityDetails.length ? `${selectedCapabilityDetails.length} selected` : 'No extras selected'}</strong><span>{selectedCapabilityDetails.length ? selectedCapabilityDetails.map((item) => `${item.kind}: ${item.name}`).join(' · ') : 'Base workspace only'}</span></dd><Button type="button" onClick={() => setCurrentStep(4)}>Edit</Button></div><div><dt>Resources</dt><dd><strong>{resourceConfig.cpu} vCPU · {resourceConfig.memory} GB memory</strong><span>{resourceConfig.disk} GB workspace disk</span><select aria-label="Instance size" disabled={Boolean(launchResources)} value={`${resourceConfig.cpu}/${resourceConfig.memory}`} onChange={(event) => { const [cpu, memory] = event.target.value.split('/').map(Number); setResourceConfig((current) => ({ ...current, cpu, memory })) }}><option value="2/4">Standard · 2 vCPU / 4 GB</option><option value="4/8">Power · 4 vCPU / 8 GB</option><option value="8/16">Max · 8 vCPU / 16 GB</option></select>{launchResources && <span>Resources are locked for this workspace request.</span>}</dd><span /></div></dl>
              <div className="deploy-bar"><div><strong>Ready to create {selectedAgency.name}</strong><span>Deployment applies the profile and then verifies configuration readback.</span></div><Button className="primary deploy-button t-button-loader" aria-busy={launchState?.phase === 'launching'} type="button" disabled={launchState?.phase === 'launching'} onClick={() => launchAgent('agent37-hermes', selectedAgency.name)}>{launchState?.phase === 'launching' ? 'Deploying…' : 'Deploy specialist →'}</Button></div>

              {launchState && <section className={`launch-result ${launchState.phase} t-panel-slide t-panel-reveal ${launchState.phase === 'applied' ? 't-success-check' : ''} ${launchState.phase === 'failed' ? 't-error-shake' : ''}`} data-error={launchState.phase === 'failed' ? 'true' : undefined} data-open="true" aria-live="polite">{launchState.phase === 'launching' && <div className="deployment-loader t-matrix-shell" role="status"><span className="deployment-loader-mark t-matrix-loader" aria-hidden="true"><i /><i /><i /></span><div><span className="eyebrow">Commissioning workspace</span><h3>{selectedAgency.name}</h3><p className="t-thinking-copy">Creating the Agent37 workspace, applying the profile, and verifying every file. This usually takes a minute.</p><div className="deployment-loader-track indeterminate" aria-hidden="true"><Progress value={100} /></div></div></div>}<span className="eyebrow">Deployment status</span><h3>{launchState.instance?.name ?? selectedAgency.name}</h3><p>{launchState.message}</p>{launchState.receipt && <><div className="receipt-summary"><div><span>Configuration</span><strong className="mono">{launchState.receipt.config_id.slice(0, 12)}…</strong></div><div><span>Files</span><strong>{launchState.receipt.files.length} verified</strong></div><div><span>Model</span><strong>{launchState.runtime?.model.id ?? selectedModel}</strong></div></div><details><summary>Readback evidence</summary><ul>{launchState.receipt.files.map((file) => <li key={file.role}><span>{file.role}</span><span className="mono">{file.bytes} bytes · {file.sha256.slice(0, 8)}…</span></li>)}</ul></details><div className="proof-task"><h4>Safe readiness check</h4>{proofState.phase === 'succeeded' ? <div className="proof-success t-success-pop"><strong>✓ Test passed</strong><span>{proofState.output}</span></div> : <Button className="secondary" type="button" disabled={proofState.phase === 'running'} onClick={runProofTask}>{proofState.phase === 'running' ? 'Running check…' : proofState.phase === 'failed' ? 'Try check again' : 'Run safe check'}</Button>}{proofState.phase === 'failed' && <p role="alert">{proofState.message}</p>}</div><div className="graph-proof"><span className="eyebrow">Live sponsor proof / The Graph</span><h4>Analyze live Uniswap market data</h4><p>The server queries a live decentralized subgraph, then this deployed specialist turns the normalized evidence into a bounded research brief.</p>{graphState.phase === 'succeeded' && graphState.result ? <div className="graph-result t-panel-slide" data-open="true" role="status"><div className="receipt-summary"><div><span>Verdict</span><strong>{graphState.result.analysis.verdict}</strong></div><div><span>Indexed block</span><strong>{graphState.result.market.source.blockNumber.toLocaleString()}</strong></div><div><span>ETH reference</span><strong>${graphState.result.market.market.ethPriceUSD.toLocaleString()}</strong></div></div><p><strong>Assistant assessment:</strong> {graphState.result.analysis.summary}</p><ul>{graphState.result.analysis.evidence.map((item) => <li key={item}>{item}</li>)}</ul><details><summary>Live Graph evidence</summary><p className="mono">Deployment {graphState.result.market.source.deployment}<br />Block {graphState.result.market.source.blockNumber} · {graphState.result.market.source.blockHash.slice(0, 14)}…<br />Top pool {graphState.result.market.market.topPools[0]?.pair} · {graphState.result.market.metrics.topPoolVolumeSharePct}% of indexed volume<br />Observed {new Date(graphState.result.market.source.observedAt).toLocaleString()}</p></details></div> : <Button className="secondary" type="button" disabled={graphState.phase === 'running'} onClick={runGraphResearch}>{graphState.phase === 'running' ? 'Analyzing live data…' : graphState.phase === 'failed' ? 'Retry live analysis' : 'Analyze live subgraph'}</Button>}{graphState.phase === 'failed' && <p role="alert">{graphState.message}</p>}</div></>}
                {launchState.instance && launchState.phase === 'applied' && <div className="instance-tools"><div><span>Instance size</span><strong>{(launchState.instance.resources ?? launchResources ?? resourceConfig).cpu} vCPU · {(launchState.instance.resources ?? launchResources ?? resourceConfig).memory} GB memory · {(launchState.instance.resources ?? launchResources ?? resourceConfig).disk} GB disk</strong></div><div><span>Workspace</span><Button type="button" disabled={agentBusy} onClick={() => openAgentWorkspace(launchState.instance!.id)}>Open management →</Button></div><div><span>Lifecycle</span>{(['start', 'stop', 'restart'] as AgentAction[]).map((action) => <Button type="button" key={action} disabled={agentBusy} onClick={() => agentAction(action)}>{action}</Button>)}<Button className="danger-control" type="button" disabled={agentBusy} onClick={() => agentAction('delete')}>delete</Button></div></div>}
                {agentError && <p role="alert">{agentError}</p>}</section>}
              <div className="step-actions"><Button className="secondary" type="button" onClick={() => setCurrentStep(4)}>← Back</Button></div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

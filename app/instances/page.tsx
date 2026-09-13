'use client'

import { getAccessToken } from '@privy-io/react-auth'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Instance = { id: string; name: string; status: string; template: string; url?: string; created?: number; specialist?: string; resources?: { cpu?: number; memory?: number; disk?: number }; budget?: { monthly_cap_micros?: number } }

async function body(response: Response) {
  const type = response.headers.get('content-type') ?? ''
  const text = await response.text()
  if (type.includes('application/json')) try { return JSON.parse(text) as Record<string, unknown> } catch { /* handled below */ }
  throw new Error(`The server returned ${response.status}. Please retry.`)
}

export default function InstancesPage() {
  const [items, setItems] = useState<Instance[]>([])
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState('Loading your workspaces…')

  async function load() {
    setPhase('loading'); setMessage('Loading your workspaces…')
    try {
      const token = process.env.NEXT_PUBLIC_PRIVY_APP_ID ? await getAccessToken().catch(() => null) : null
      const response = await fetch('/api/agents/instances', { headers: token ? { authorization: `Bearer ${token}` } : {}, cache: 'no-store' })
      const result = await body(response)
      if (!response.ok || result.ok !== true || !Array.isArray(result.data)) throw new Error(typeof result.message === 'string' ? result.message : 'Could not load your instances.')
      setItems(result.data as Instance[]); setPhase('ready'); setMessage('')
    } catch (error) { setPhase('error'); setMessage(error instanceof Error ? error.message : 'Could not load your instances.') }
  }

  // Authentication helper is stable for the current browser session.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load() }, [])
  const active = items.filter((item) => ['running', 'starting', 'waking'].includes(item.status)).length

  return <main className="shell"><header className="topbar"><Link className="brand" href="/"><span className="brand-mark">LM</span> LegitMate</Link><Link className="top-link" href="/">Create specialist</Link></header><div className="main instances-page"><section className="instances-head"><div><span className="eyebrow">Account workspaces</span><h1>Your instances.</h1><p>Open any specialist you deployed with this account. Status comes directly from Agent37.</p></div><div className="instance-total"><strong>{items.length}</strong><span>total<br />{active} active</span></div></section>
    {phase === 'loading' && <div className="instances-state" role="status"><span className="deployment-loader-track" aria-hidden="true"><span /></span><strong>Loading your workspaces…</strong></div>}
    {phase === 'error' && <div className="instances-state instances-error" role="alert"><strong>Instances unavailable</strong><p>{message}</p><button className="secondary" onClick={() => void load()}>Try again</button></div>}
    {phase === 'ready' && items.length === 0 && <div className="instances-state"><strong>No deployed specialists yet.</strong><p>Choose a specialist, confirm its setup, and deploy your first workspace.</p><Link className="button-link primary" href="/">Create a specialist →</Link></div>}
    {phase === 'ready' && items.length > 0 && <section className="instances-grid" aria-label="Your deployed instances">{items.map((item) => <article className="instance-card" key={item.id}><div className="instance-card-top"><span className={`instance-dot status-${item.status}`} aria-hidden="true" /><span>{item.status}</span><time>{item.created ? new Date(item.created * 1000).toLocaleDateString() : 'Created recently'}</time></div><h2>{item.name}</h2><p>{item.specialist ? item.specialist.replaceAll('-', ' ') : item.template}</p><dl><div><dt>Instance</dt><dd className="mono">{item.id}</dd></div><div><dt>Resources</dt><dd>{item.resources?.cpu ?? '—'} vCPU · {item.resources?.memory ?? '—'} GB</dd></div><div><dt>Budget</dt><dd>{item.budget?.monthly_cap_micros ? `$${(item.budget.monthly_cap_micros / 1_000_000).toFixed(2)} / mo` : 'No managed budget'}</dd></div></dl><Link className="button-link primary" href={`/instances/${item.id}`}>Manage instance →</Link></article>)}</section>}
  </div></main>
}

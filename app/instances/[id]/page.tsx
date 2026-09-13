'use client'

import { getAccessToken } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type Instance = { id: string; name?: string; status?: string; template?: string; url?: string; resources?: { cpu?: number; memory?: number; disk?: number }; created?: number }
async function parse(response: Response) { const type=response.headers.get('content-type')??''; const text=await response.text(); if(type.includes('application/json'))try{return JSON.parse(text) as Record<string,unknown>}catch{} throw new Error(`The server returned ${response.status}. Please retry.`) }

export default function InstancePage(){
  const params=useParams<{id:string}>(); const id=String(params.id||'')
  const [item,setItem]=useState<Instance|null>(null); const [phase,setPhase]=useState<'loading'|'ready'|'error'>('loading'); const [message,setMessage]=useState('Loading instance…'); const [busy,setBusy]=useState('')
  async function auth(){return process.env.NEXT_PUBLIC_PRIVY_APP_ID?await getAccessToken().catch(()=>null):null}
  async function load(){setPhase('loading');try{const token=await auth();const r=await fetch(`/api/agents/instances/${id}`,{headers:token?{authorization:`Bearer ${token}`}:{},cache:'no-store'});const x=await parse(r);if(!r.ok||x.ok!==true||!x.instance||typeof x.instance!=='object')throw new Error(typeof x.message==='string'?x.message:'Could not load this instance.');setItem(x.instance as Instance);setPhase('ready')}catch(e){setMessage(e instanceof Error?e.message:'Could not load this instance.');setPhase('error')}}
  // Authentication helper is stable for this instance route.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{void load()},[id])
  async function action(name:'start'|'stop'|'restart'){setBusy(name);setMessage('');try{const token=await auth();const r=await fetch(`/api/agents/instances/${id}/${name}`,{method:'POST',headers:{'content-type':'application/json',...(token?{authorization:`Bearer ${token}`}:{})}});const x=await parse(r);if(!r.ok||x.ok!==true)throw new Error(typeof x.message==='string'?x.message:`Could not ${name} the instance.`);await load()}catch(e){setMessage(e instanceof Error?e.message:`Could not ${name} the instance.`)}finally{setBusy('')}}
  return <main className="shell"><header className="topbar"><Link className="brand" href="/"><span className="brand-mark">LM</span> LegitMate</Link><Link className="top-link" href="/instances">All instances</Link></header><div className="main instances-page">{phase==='loading'&&<div className="instances-state" role="status">Loading instance…</div>}{phase==='error'&&<div className="instances-state instances-error" role="alert"><strong>Instance unavailable</strong><p>{message}</p><Link className="button-link secondary" href="/instances">Back to instances</Link></div>}{phase==='ready'&&item&&<><section className="instance-detail-head"><div><span className="eyebrow">Managed workspace / {item.id}</span><h1>{item.name??'Deployed specialist'}</h1><p>{item.template} · created {item.created?new Date(item.created*1000).toLocaleString():'recently'}</p></div><span className={`instance-status status-${item.status}`}>● {item.status??'unknown'}</span></section><section className="instance-detail-grid"><div className="instance-detail-card"><span className="eyebrow">Resources</span><strong>{item.resources?.cpu??'—'} vCPU · {item.resources?.memory??'—'} GB memory · {item.resources?.disk??'—'} GB disk</strong></div><div className="instance-detail-card"><span className="eyebrow">Lifecycle</span><div className="instance-actions"><button onClick={()=>void action('start')} disabled={!!busy}>Start</button><button onClick={()=>void action('stop')} disabled={!!busy}>Stop</button><button onClick={()=>void action('restart')} disabled={!!busy}>Restart</button></div></div></section>{message&&<p className="instances-state" role="alert">{message}</p>}</>}</div></main>
}

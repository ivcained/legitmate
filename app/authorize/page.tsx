'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'

const APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ''

function AuthorizeInner() {
  const { getAccessToken, authenticated, login } = usePrivy()
  const searchParams = useSearchParams()
  const userCode = searchParams.get('user_code') ?? ''
  const [status, setStatus] = useState<'idle' | 'approving' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handle(action: 'approve' | 'deny') {
    if (!authenticated) { await login(); return }
    setStatus('approving')
    try {
      const token = await getAccessToken()
      const res = await fetch('https://auth.privy.io/api/oauth/v2/device_verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'privy-app-id': APP_ID, Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_code: userCode, action }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      setStatus('done')
    } catch (e: unknown) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '4rem auto', padding: '2rem', fontFamily: 'system-ui', colorScheme: 'dark' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Agent Authorization</h1>
      {userCode ? (
        <>
          <p style={{ marginBottom: '0.5rem' }}>Enter this code when prompted:</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#a3e635', marginBottom: '1.5rem' }}>{userCode}</p>
          {!authenticated && (
            <button onClick={() => login()} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}>Log in to continue</button>
          )}
          {authenticated && status === 'idle' && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={() => handle('approve')} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', background: '#a3e635', border: 'none', borderRadius: 8, color: '#000' }}>Approve</button>
              <button onClick={() => handle('deny')} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', background: 'transparent', border: '1px solid #666', borderRadius: 8, color: '#ccc' }}>Deny</button>
            </div>
          )}
          {status === 'approving' && <p>Submitting...</p>}
          {status === 'done' && <p style={{ color: '#86efac', marginTop: '1rem' }}>Approved. The agent can now proceed.</p>}
          {status === 'error' && <p style={{ color: '#f87171', marginTop: '1rem' }}>Error: {error}</p>}
        </>
      ) : (
        <p>No code found. Open the link provided by the agent.</p>
      )}
    </div>
  )
}

export default function AuthorizePage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 480, margin: '4rem auto', padding: '2rem' }}>Loading...</div>}>
      <AuthorizeInner />
    </Suspense>
  )
}
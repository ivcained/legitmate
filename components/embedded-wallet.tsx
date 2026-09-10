'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'

function shorten(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function EmbeddedWallet() {
  const configured = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID)
  if (!configured) {
    return <div className="wallet-panel wallet-panel-demo" role="status"><div><span className="eyebrow">Wallet / demo guard</span><strong>Provider access is not configured.</strong><small>Add NEXT_PUBLIC_PRIVY_APP_ID to enable secure sign-in and embedded wallets. No wallet or transaction is available in this preview.</small></div></div>
  }

  return <ConfiguredWallet />
}

function ConfiguredWallet() {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const { wallets } = useWallets()
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy')

  if (!ready) return <div className="wallet-panel" role="status"><span className="eyebrow">Wallet / loading</span><strong>Checking secure sign-in…</strong></div>
  if (!authenticated) return <div className="wallet-panel"><div><span className="eyebrow">Wallet / available</span><strong>Sign in to provision your workspace wallet.</strong><small>Privy creates an embedded wallet only for users who do not already have one.</small></div><button className="primary" onClick={login}>Sign in securely →</button></div>

  const address = embeddedWallet?.address
  return <div className="wallet-panel"><div><span className="eyebrow">Wallet / connected</span><strong>{address ? shorten(address) : 'Wallet is being provisioned…'}</strong><small>{user?.email?.address ?? user?.google?.email ?? 'Authenticated with Privy'} · embedded wallet</small></div><div className="wallet-actions"><button className="secondary" disabled={!address} onClick={() => address && navigator.clipboard?.writeText(address)}>Copy address</button><button className="secondary" onClick={logout}>Sign out</button></div><small className="wallet-boundary">Wallet display only. No transaction is prepared or submitted.</small></div>
}

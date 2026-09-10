'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFiatOnramp, usePrivy, useSendTransaction, useWallets } from '@privy-io/react-auth'

const chainId = process.env.NEXT_PUBLIC_PRIVY_CHAIN_ID ?? ''
const chain = chainId ? `eip155:${chainId}` : ''
const fundingAsset = process.env.NEXT_PUBLIC_PRIVY_FUNDING_ASSET ?? ''
const fundingEnvironment = process.env.NEXT_PUBLIC_PRIVY_FUNDING_ENVIRONMENT ?? ''
const withdrawalRecipient = process.env.NEXT_PUBLIC_PRIVY_WITHDRAW_RECIPIENT ?? ''
const isProductionFunding = fundingEnvironment === 'production'
const isValidAddress = (value: string) => /^0x[a-fA-F0-9]{40}$/.test(value)
const isConfiguredChain = /^eip155:\d+$/.test(chain)

function shorten(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function formatBalance(value: string | null) {
  if (value === null) return '—'
  try {
    const wei = BigInt(value)
    const unit = BigInt('1000000000000000000')
    const whole = wei / unit
    const fraction = (wei % unit).toString().padStart(18, '0').slice(0, 6).replace(/0+$/, '')
    return `${whole}${fraction ? `.${fraction}` : ''} ETH`
  } catch {
    return 'Unavailable'
  }
}

function decimalToWei(value: string) {
  if (!/^\d+(\.\d{1,18})?$/.test(value)) return null
  const [whole, fraction = ''] = value.split('.')
  const amountWei = BigInt(whole) * BigInt('1000000000000000000') + BigInt(fraction.padEnd(18, '0') || '0')
  return amountWei
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
  const { wallets, ready: walletsReady } = useWallets()
  const { fund } = useFiatOnramp()
  const { sendTransaction } = useSendTransaction()
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy')
  const address = embeddedWallet?.address
  const [balance, setBalance] = useState<string | null>(null)
  const [balanceError, setBalanceError] = useState('')
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionStatus, setActionStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const withdrawalConfigured = isProductionFunding && isConfiguredChain && isValidAddress(withdrawalRecipient)
  const fundingConfigured = isProductionFunding && isConfiguredChain && isValidAddress(fundingAsset)
  const configMessage = useMemo(() => {
    if (!isConfiguredChain) return 'Funding and withdrawals are disabled until NEXT_PUBLIC_PRIVY_CHAIN_ID is set to a numeric production chain ID.'
    if (fundingEnvironment && fundingEnvironment !== 'production') return `Funding is disabled in ${fundingEnvironment}; only explicitly configured production funding is enabled.`
    return ''
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadBalance() {
      if (!address || !walletsReady) return
      setBalanceError('')
      try {
        const provider = await (embeddedWallet as unknown as { getEthereumProvider: () => Promise<{ request: (args: { method: string; params: string[] }) => Promise<string> }> }).getEthereumProvider()
        const result = await provider.request({ method: 'eth_getBalance', params: [address, 'latest'] })
        if (!cancelled) setBalance(result)
      } catch {
        if (!cancelled) setBalanceError('Balance is temporarily unavailable.')
      }
    }
    void loadBalance()
    return () => { cancelled = true }
  }, [address, embeddedWallet, walletsReady, actionStatus])

  async function fundWallet() {
    if (!address || !fundingConfigured) return
    setBusy(true); setActionError(''); setActionStatus('')
    try {
      await fund({ source: { assets: ['usd', 'eur'] }, destination: { asset: fundingAsset, chain: chain as `${string}:${string}`, address }, environment: 'production' })
      setActionStatus('Funding flow opened. Confirm completion with your provider.')
    } catch { setActionError('Funding could not be started.') }
    finally { setBusy(false) }
  }

  async function withdraw() {
    const wei = decimalToWei(amount)
    if (!address || !withdrawalConfigured || wei === null || wei <= BigInt(0)) {
      setActionError('Enter a positive ETH amount. The recipient and chain are fixed by configuration.')
      return
    }
    setBusy(true); setActionError(''); setActionStatus('')
    try {
      const result = await sendTransaction({ to: withdrawalRecipient, value: `0x${wei.toString(16)}`, chainId: Number(chainId) }, { address })
      if (!result?.hash) throw new Error('No transaction hash returned')
      setActionStatus(`Withdrawal submitted: ${result.hash}`)
      setAmount(''); setWithdrawOpen(false)
    } catch { setActionError('Withdrawal was not submitted or was rejected.') }
    finally { setBusy(false) }
  }

  if (!ready) return <div className="wallet-panel" role="status"><span className="eyebrow">Wallet / loading</span><strong>Checking secure sign-in…</strong></div>
  if (!authenticated) return <div className="wallet-panel"><div><span className="eyebrow">Wallet / available</span><strong>Sign in to provision your workspace wallet.</strong><small>Privy creates an embedded wallet only for users who do not already have one.</small></div><button className="primary" onClick={login}>Sign in securely →</button></div>

  return <div className="wallet-panel wallet-panel-rich">
    <div className="wallet-panel-head"><div><span className="eyebrow">Wallet / connected</span><strong>{address ? shorten(address) : 'Wallet is being provisioned…'}</strong><small>{user?.email?.address ?? user?.google?.email ?? 'Authenticated with Privy'} · embedded wallet</small></div><div className="wallet-balance"><span>Balance</span><strong>{formatBalance(balance)}</strong>{balanceError && <small role="alert">{balanceError}</small>}</div></div>
    <div className="wallet-actions"><button className="secondary" disabled={!address} onClick={() => address && navigator.clipboard?.writeText(address)}>Copy address</button><button className="secondary" disabled={!address || !fundingConfigured || busy} onClick={() => void fundWallet()}>Add funds</button><button className="secondary" disabled={!address || !withdrawalConfigured || busy} onClick={() => { setWithdrawOpen(!withdrawOpen); setActionError('') }}>Withdraw</button><button className="secondary" onClick={logout}>Sign out</button></div>
    {configMessage && <small className="wallet-boundary">{configMessage}</small>}
    {!fundingConfigured && !configMessage && <small className="wallet-boundary">Add funds is disabled until a production chain and token are explicitly configured.</small>}
    {!withdrawalConfigured && <small className="wallet-boundary">Withdraw is disabled until a fixed recipient and production chain are explicitly configured. Recipients cannot be entered here.</small>}
    {withdrawOpen && <div className="wallet-withdraw"><span className="control-label">Fixed recipient · {shorten(withdrawalRecipient)}</span><input aria-label="ETH amount" inputMode="decimal" placeholder="0.00 ETH" value={amount} onChange={(event) => setAmount(event.target.value)} disabled={busy || !withdrawalConfigured} /><button className="primary" onClick={() => void withdraw()} disabled={busy || !withdrawalConfigured}>{busy ? 'Confirming…' : 'Review withdrawal'}</button></div>}
    {actionError && <small className="wallet-error" role="alert">{actionError}</small>}
    {actionStatus && <small className="wallet-status" role="status">{actionStatus}</small>}
  </div>
}

'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import type { ReactNode } from 'react'

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

export function PrivyShell({ children }: { children: ReactNode }) {
  if (!appId) return <>{children}</>

  return (
    <PrivyProvider
      appId={appId}
      config={{
        embeddedWallets: { ethereum: { createOnLogin: 'users-without-wallets' } },
        loginMethods: ['email', 'google', 'twitter', 'wallet'],
      }}
    >
      {children}
    </PrivyProvider>
  )
}

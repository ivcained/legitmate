import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agent Authorization | LegitClub',
  robots: { index: false, follow: true },
}

export default function AuthorizeLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Agent Workspaces | LegitClub',
  robots: { index: false, follow: true },
}

export default function InstancesLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LegitMate — Commissioning desk',
  description: 'Prepare a working assistant setup without a blank screen.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}

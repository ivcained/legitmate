import './globals.css'
import './reference-redesign.css'
import './review-fixes.css'
import './final-review.css'
import './themes.css'
import './catalog.css'
import './motion.css'
import { PrivyShell } from '../components/privy-shell'
import { UiSounds } from '../components/ui-sounds'
import { ThemeProvider } from '../components/theme-provider'
import { Geist } from 'next/font/google'
import { cn } from '@/lib/utils'
import { WebMcpRegistration } from '../components/webmcp-registration'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
const themeScript = `(()=>{try{const saved=localStorage.getItem('legitmate.theme');const theme=saved==='light'?'light':'dark';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch{document.documentElement.dataset.theme='dark';document.documentElement.style.colorScheme='dark'}})()`

export const metadata = { title: 'LegitMate — Prepared assistant workspaces', description: 'Describe the work. We prepare the assistant.' }
export const viewport = { width: 'device-width', initialScale: 1 }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-theme="dark" className={cn('font-sans', geist.variable)} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><PrivyShell><WebMcpRegistration /><ThemeProvider><UiSounds>{children}</UiSounds></ThemeProvider></PrivyShell></body></html>
}

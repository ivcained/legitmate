import './globals.css'
import './reference-redesign.css'
import './review-fixes.css'
import './final-review.css'
import './themes.css'
import './catalog.css'
import './motion.css'
import './seo-services.css'
import './short-form-video.css'
import './product-family.css'
import './data-operations.css'
import { PrivyShell } from '../components/privy-shell'
import { UiSounds } from '../components/ui-sounds'
import { ThemeProvider } from '../components/theme-provider'
import { Geist } from 'next/font/google'
import { cn } from '@/lib/utils'
import { WebMcpRegistration } from '../components/webmcp-registration'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
const themeScript = `(()=>{try{const saved=localStorage.getItem('legitmate.theme');const theme=saved==='light'?'light':'dark';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch{document.documentElement.dataset.theme='dark';document.documentElement.style.colorScheme='dark'}})()`

export const metadata = { metadataBase: new URL('https://mate.legitclub.com'), title: { default: 'LegitClub — Managed AI Work, Search, Video, Decks & Data', template: '%s | LegitClub' }, description: 'Specialist AI workspaces and managed systems for search, short-form video, presentations, and authorized public web data.', openGraph: { siteName: 'LegitClub', type: 'website' }, robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } } }
export const viewport = { width: 'device-width', initialScale: 1 }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-theme="dark" className={cn('font-sans', geist.variable)} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><PrivyShell><WebMcpRegistration /><ThemeProvider><UiSounds>{children}</UiSounds></ThemeProvider></PrivyShell></body></html>
}

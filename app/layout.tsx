import './globals.css'
import { PrivyShell } from '../components/privy-shell'
import { UiSounds } from '../components/ui-sounds'
export const metadata={title:'LegitMate — Prepared assistant workspaces',description:'Describe the work. We prepare the assistant.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><PrivyShell><UiSounds>{children}</UiSounds></PrivyShell></body></html>}

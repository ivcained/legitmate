import './globals.css'
import { PrivyShell } from '../components/privy-shell'
export const metadata={title:'LegitMate — Prepared assistant workspaces',description:'Describe the work. We prepare the assistant.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><PrivyShell>{children}</PrivyShell></body></html>}

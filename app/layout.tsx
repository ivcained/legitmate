import './globals.css'
import './reference-redesign.css'
import './review-fixes.css'
import './final-review.css'
import { PrivyShell } from '../components/privy-shell'
import { UiSounds } from '../components/ui-sounds'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata={title:'LegitMate — Prepared assistant workspaces',description:'Describe the work. We prepare the assistant.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={cn("font-sans", geist.variable)}><body><PrivyShell><UiSounds>{children}</UiSounds></PrivyShell></body></html>}

'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'

export type ThemeMode = 'dark' | 'light'
export const THEME_PREFERENCE_KEY = 'legitmate.theme'

const ThemeContext = createContext<{ theme: ThemeMode; toggle: () => void } | null>(null)

export function ThemeToggle() {
  const value = useContext(ThemeContext)
  if (!value) return null
  const next = value.theme === 'dark' ? 'light' : 'dark'
  return (
    <Button type="button" variant="outline" size="lg" className="theme-toggle" aria-label={`Switch to ${next} mode`} onClick={value.toggle}>
      {value.theme === 'dark' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
      <span>{value.theme === 'dark' ? 'Dark' : 'Light'}</span>
    </Button>
  )
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('dark')

  useEffect(() => {
    let saved: string | null = null
    try { saved = window.localStorage.getItem(THEME_PREFERENCE_KEY) } catch { /* dark remains the safe default */ }
    const resolved: ThemeMode = saved === 'light' ? 'light' : 'dark'
    document.documentElement.dataset.theme = resolved
    document.documentElement.style.colorScheme = resolved
    setTheme(resolved)
  }, [])

  const toggle = () => {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document.documentElement.style.colorScheme = next
    setTheme(next)
    try { window.localStorage.setItem(THEME_PREFERENCE_KEY, next) } catch { /* keep this session's applied theme */ }
  }

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

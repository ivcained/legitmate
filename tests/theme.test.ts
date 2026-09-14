import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { THEME_PREFERENCE_KEY } from '../components/theme-provider'

describe('theme preference', () => {
  it('uses a stable local-storage key', () => {
    expect(THEME_PREFERENCE_KEY).toBe('legitmate.theme')
  })

  it('ships dark mode as the server and no-preference default', () => {
    const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8')
    expect(layout).toContain('data-theme="dark"')
    expect(layout).toContain("saved==='light'?'light':'dark'")
  })

  it('provides both semantic theme palettes', () => {
    const css = readFileSync(new URL('../app/themes.css', import.meta.url), 'utf8')
    expect(css).toContain('[data-theme="dark"]')
    expect(css).toContain('[data-theme="light"]')
  })
})

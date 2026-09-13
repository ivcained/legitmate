import { describe, expect, it } from 'vitest'
import { QUIET_FX_VOLUME, cueForButton } from '../lib/ui-sounds'

describe('Quiet FX UI sound policy', () => {
  it('raises the library default volume by exactly 20 percent', () => {
    expect(QUIET_FX_VOLUME).toBeCloseTo(0.42)
  })

  it('maps button intent to restrained interface cues', () => {
    expect(cueForButton('Deploy specialist →')).toBe('begin')
    expect(cueForButton('Stop')).toBe('toggle-off')
    expect(cueForButton('Sign in securely →')).toBe('confirm')
    expect(cueForButton('Continue to profile →')).toBe('tap')
  })
})

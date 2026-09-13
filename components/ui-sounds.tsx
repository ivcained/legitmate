'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { CUES, DEFAULTS, makePatch, renderPatch, SoundPlayer, type Rendered } from 'quiet-fx'
import { QUIET_FX_VOLUME, cueForButton } from '../lib/ui-sounds'

export function UiSounds({ children }: { children: ReactNode }) {
  const player = useRef<SoundPlayer | null>(null)
  const rendered = useRef(new Map<string, Rendered>())

  useEffect(() => {
    const getPlayer = () => {
      if (!player.current) {
        player.current = new SoundPlayer()
        player.current.setVolume(QUIET_FX_VOLUME)
      }
      return player.current
    }
    const onClick = async (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('button,[role="button"]') : null
      if (!target || target.getAttribute('aria-disabled') === 'true' || (target instanceof HTMLButtonElement && target.disabled)) return
      const label = target.getAttribute('aria-label') ?? target.textContent ?? ''
      const cueId = cueForButton(label)
      const cue = CUES.find((item) => item.id === cueId)
      if (!cue) return
      const sound = rendered.current.get(cueId) ?? renderPatch(makePatch(cue, { ...DEFAULTS, voice: 'Felt', variant: 'Light' }))
      rendered.current.set(cueId, sound)
      const soundPlayer = getPlayer()
      if (await soundPlayer.enable().catch(() => false)) soundPlayer.play(sound)
    }
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      player.current?.stop()
      void player.current?.context?.close().catch(() => undefined)
      player.current = null
    }
  }, [])

  return children
}

'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { CUES, DEFAULTS, makePatch, renderPatch, SoundPlayer, type Rendered } from 'quiet-fx'
import { Button } from './ui/button'
import { QUIET_FX_VOLUME, cueForButton } from '../lib/ui-sounds'

const SOUND_PREFERENCE_KEY = 'legitmate.interface-sounds'
const SoundContext = createContext<{ enabled: boolean; toggle: () => Promise<void> } | null>(null)

export function SoundToggle() {
  const sound = useContext(SoundContext)
  if (!sound) return null
  return <Button type="button" variant="outline" size="lg" className="sound-toggle" aria-label={sound.enabled ? 'Mute interface sounds' : 'Unmute interface sounds'} aria-pressed={sound.enabled} data-no-ui-sound onClick={() => void sound.toggle()}>{sound.enabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}<span>Sounds {sound.enabled ? 'on' : 'off'}</span></Button>
}

export function UiSounds({ children }: { children: ReactNode }) {
  const player = useRef<SoundPlayer | null>(null)
  const rendered = useRef(new Map<string, Rendered>())
  const enabledRef = useRef(true)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const saved = window.localStorage.getItem(SOUND_PREFERENCE_KEY)
    if (saved === 'off') { enabledRef.current = false; setEnabled(false) }

    const getPlayer = () => {
      if (!player.current) {
        player.current = new SoundPlayer()
        player.current.setVolume(QUIET_FX_VOLUME)
      }
      return player.current
    }
    const arm = () => { if (enabledRef.current) void getPlayer().enable().catch(() => false) }
    const onClick = async (event: MouseEvent) => {
      if (!event.isTrusted || !enabledRef.current) return
      const target = event.target instanceof Element ? event.target.closest('button,[role="button"]') : null
      if (!target || target.hasAttribute('data-no-ui-sound') || target.getAttribute('aria-disabled') === 'true' || (target instanceof HTMLButtonElement && target.disabled)) return
      const cueId = cueForButton(target.getAttribute('aria-label') ?? target.textContent ?? '')
      const cue = CUES.find((item) => item.id === cueId)
      if (!cue) return
      const sound = rendered.current.get(cueId) ?? renderPatch(makePatch(cue, { ...DEFAULTS, voice: 'Felt', variant: 'Light' }))
      rendered.current.set(cueId, sound)
      const soundPlayer = getPlayer()
      if (await soundPlayer.enable().catch(() => false)) soundPlayer.play(sound)
    }
    document.addEventListener('pointerdown', arm, { capture: true, once: true })
    document.addEventListener('keydown', arm, { capture: true, once: true })
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('pointerdown', arm, true)
      document.removeEventListener('keydown', arm, true)
      document.removeEventListener('click', onClick, true)
      player.current?.stop()
      void player.current?.context?.close().catch(() => undefined)
      player.current = null
    }
  }, [])

  const toggle = async () => {
    const next = !enabledRef.current
    enabledRef.current = next
    setEnabled(next)
    window.localStorage.setItem(SOUND_PREFERENCE_KEY, next ? 'on' : 'off')
    if (!next) { player.current?.mute(); return }
    if (!player.current) player.current = new SoundPlayer()
    player.current.setVolume(QUIET_FX_VOLUME)
    const cue = CUES.find((item) => item.id === 'toggle-on')
    if (cue && await player.current.enable().catch(() => false)) player.current.play(renderPatch(makePatch(cue, { ...DEFAULTS, voice: 'Felt', variant: 'Light' })))
  }

  return <SoundContext.Provider value={{ enabled, toggle }}>{children}</SoundContext.Provider>
}

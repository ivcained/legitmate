export const QUIET_FX_VOLUME = 0.35 * 1.2

export function cueForButton(label: string) {
  const value = label.trim().toLowerCase()
  if (/deploy|start|run|create/.test(value)) return 'begin'
  if (/stop|delete|disconnect|sign out/.test(value)) return 'toggle-off'
  if (/sign in|confirm|save|connect|add/.test(value)) return 'confirm'
  if (/back|undo|cancel/.test(value)) return 'undo'
  if (/restart|retry|resume/.test(value)) return 'resume'
  if (/send/.test(value)) return 'send'
  return 'tap'
}

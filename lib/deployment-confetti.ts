import type { Options } from 'canvas-confetti'

export function deploymentConfettiBursts(): Options[] {
  const shared: Options = {
    particleCount: 52,
    spread: 58,
    startVelocity: 42,
    gravity: 0.92,
    ticks: 180,
    scalar: 0.86,
    colors: ['#c64a32', '#e7dcc7', '#738c79', '#202522'],
    disableForReducedMotion: true,
    zIndex: 1200,
  }
  return [
    { ...shared, angle: 62, origin: { x: 0.2, y: 0.72 } },
    { ...shared, angle: 118, origin: { x: 0.8, y: 0.72 } },
  ]
}

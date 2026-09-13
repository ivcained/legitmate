import { describe, expect, it } from 'vitest'
import { deploymentConfettiBursts } from '../lib/deployment-confetti'

describe('deployment confetti', () => {
  it('uses a bounded two-sided burst that respects reduced motion', () => {
    const bursts = deploymentConfettiBursts()
    expect(bursts).toHaveLength(2)
    expect(bursts.every((burst) => burst.disableForReducedMotion)).toBe(true)
    expect(bursts.reduce((total, burst) => total + (burst.particleCount ?? 0), 0)).toBeLessThanOrEqual(120)
    expect(bursts.map((burst) => burst.origin?.x)).toEqual([0.2, 0.8])
  })
})

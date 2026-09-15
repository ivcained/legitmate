import { describe, expect, it } from 'vitest'
import { FREE_TRANSITION_RECIPES, LEGITMATE_MOTION_ASSIGNMENTS, MOTION_TOKENS } from '../lib/motion-registry'

describe('motion policy', () => {
  it('registers every free transitions.dev recipe exactly once', () => {
    expect(FREE_TRANSITION_RECIPES).toHaveLength(32)
    expect(new Set(FREE_TRANSITION_RECIPES).size).toBe(FREE_TRANSITION_RECIPES.length)
    expect(Object.keys(LEGITMATE_MOTION_ASSIGNMENTS).sort()).toEqual([...FREE_TRANSITION_RECIPES].sort())
  })

  it('assigns every recipe to an explicit product role or honest dormant state', () => {
    for (const recipe of FREE_TRANSITION_RECIPES) expect(LEGITMATE_MOTION_ASSIGNMENTS[recipe].trim().length).toBeGreaterThan(16)
  })

  it('keeps interaction durations restrained', () => {
    expect(MOTION_TOKENS.duration.fast).toBeLessThanOrEqual(150)
    expect(MOTION_TOKENS.duration.base).toBeLessThanOrEqual(200)
    expect(MOTION_TOKENS.duration.slow).toBeLessThanOrEqual(300)
  })
})

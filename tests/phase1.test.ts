import { describe, expect, it } from 'vitest'
import { deriveConfiguration } from '../lib/preset'
import { decidePermissions } from '../lib/permissions'
import { createWorkspace, deserializeWorkspace, deriveTrialOutput, serializeWorkspace } from '../lib/workspace'

describe('brief-derived configuration', () => {
  it('derives emphasis and permissions without grants', () => {
    expect(deriveConfiguration('Research weekly audience analytics and prepare video drafts')).toEqual({
      emphasis: ['analytics', 'drafts', 'research'],
      requestedPermissions: ['youtube.analytics.read', 'youtube.video.draft.write'],
      grantedPermissions: [],
    })
  })
})

describe('explicit permission decisions', () => {
  it('records every requested permission as approved or denied', () => {
    expect(decidePermissions(['youtube.channel.read', 'youtube.analytics.read'], {
      'youtube.channel.read': 'approve',
      'youtube.analytics.read': 'deny',
    })).toEqual([
      { permission: 'youtube.channel.read', decision: 'approved' },
      { permission: 'youtube.analytics.read', decision: 'denied' },
    ])
  })
})

describe('serializable workspace and deterministic trial', () => {
  it('round trips versioned state and derives honest sandbox output', () => {
    const workspace = createWorkspace('a', 'Research analytics for weekly videos')
    expect(deserializeWorkspace(serializeWorkspace(workspace))).toEqual(workspace)
    expect(deriveTrialOutput(workspace)).toEqual({
      sandbox: true,
      summary: 'Research analytics for weekly videos',
      emphasis: ['analytics', 'research'],
      permissions: ['youtube.analytics.read'],
      actions: ['research', 'analytics'],
    })
  })
})

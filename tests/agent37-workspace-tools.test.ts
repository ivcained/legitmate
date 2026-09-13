import { describe, expect, it } from 'vitest'
import { workspaceTool } from '../lib/agent37-workspace-tools'

describe('Agent37 workspace tools', () => {
  it.each([
    ['dashboard', 9119],
    ['terminal', 7681],
    ['files', 8080],
  ] as const)('maps %s to its documented platform port', (tool, port) => {
    expect(workspaceTool(tool)).toEqual({ tool, port })
  })

  it('rejects browser tools outside the server allowlist', () => {
    expect(() => workspaceTool('22022')).toThrow('TOOL_NOT_ALLOWED')
  })
})

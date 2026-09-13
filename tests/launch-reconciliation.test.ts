import { describe, expect, it } from 'vitest'
import { reconcileLaunchResult } from '../lib/launch-reconciliation'

describe('launch reconciliation', () => {
  it('recovers the matching instance and verified configuration after a lost launch response', async () => {
    const result = await reconcileLaunchResult({
      clientRequestId: 'request-1234',
      list: async () => ({ data: [{ id: 'inst_1', name: 'Psychologist', status: 'running', metadata: { client_request_id: 'request-1234', config_id: 'cfg_1' } }] }),
      readConfiguration: async () => ({ status: 'applied', verification: { verified: true }, receipt: { config_id: 'cfg_1', status: 'applied', files: [] } }),
    })
    expect(result).toMatchObject({ found: true, instance: { id: 'inst_1' }, configuration: { status: 'applied' } })
  })

  it('does not expose another operation and reports a pending matching instance honestly', async () => {
    const result = await reconcileLaunchResult({
      clientRequestId: 'request-1234',
      list: async () => ({ data: [
        { id: 'foreign_operation', metadata: { client_request_id: 'different' } },
        { id: 'inst_1', metadata: { client_request_id: 'request-1234', config_id: 'cfg_1' } },
      ] }),
      readConfiguration: async () => ({ status: 'drifted', verification: { verified: false } }),
    })
    expect(result).toEqual({ found: true, pending: true, instance: { id: 'inst_1', metadata: { client_request_id: 'request-1234', config_id: 'cfg_1' } } })
  })
})

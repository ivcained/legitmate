import { describe, expect, it } from 'vitest'
import { handleMcpRequest } from '../lib/mcp-server'

function rpc(method: string, params?: unknown) {
  return new Request('https://mate.legitclub.com/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) })
}

describe('read-only discovery MCP server', () => {
  it('initializes with tool capabilities', async () => {
    const response = await handleMcpRequest(rpc('initialize', { protocolVersion: '2025-06-18' }))
    const body = await response.json()
    expect(body.result.serverInfo.name).toBe('LegitMate Discovery')
    expect(body.result.capabilities.tools).toBeTruthy()
  })

  it('lists only read-only public tools', async () => {
    const response = await handleMcpRequest(rpc('tools/list'))
    const body = await response.json()
    expect(body.result.tools.map((tool: { name: string }) => tool.name)).toEqual(['get_service_status', 'search_capabilities', 'search_specialists'])
    expect(body.result.tools.every((tool: { annotations: { readOnlyHint: boolean } }) => tool.annotations.readOnlyHint)).toBe(true)
  })

  it('rejects unknown methods with a JSON-RPC error', async () => {
    const response = await handleMcpRequest(rpc('unknown/method'))
    const body = await response.json()
    expect(body.error.code).toBe(-32601)
  })
})

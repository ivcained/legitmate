'use client'

import { useEffect } from 'react'

type WebMcpTool = {
  name: string
  title: string
  description: string
  inputSchema: Record<string, unknown>
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean; consequentialHint: boolean }
  execute: (input: Record<string, unknown>) => Promise<unknown>
}

type ModelContext = { registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => Promise<void> | void }

declare global { interface Navigator { modelContext?: ModelContext } }

async function json(url: string) {
  const response = await fetch(url, { headers: { accept: 'application/json' } })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json()
}

export function WebMcpRegistration() {
  useEffect(() => {
    const context = navigator.modelContext
    if (!context) return
    const controller = new AbortController()
    const annotations = { readOnlyHint: true, untrustedContentHint: false, consequentialHint: false }
    const registrations: WebMcpTool[] = [
      {
        name: 'legitmate.get_service_status',
        title: 'Get LegitMate service status',
        description: 'Read the public health status of LegitMate.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations,
        execute: async () => json('/api/health'),
      },
      {
        name: 'legitmate.search_capabilities',
        title: 'Search Hermes capabilities',
        description: 'Search the public normalized Hermes skills and plugin catalog.',
        inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 120 }, kind: { type: 'string', enum: ['skill', 'plugin'] }, page: { type: 'integer', minimum: 1 }, size: { type: 'integer', minimum: 1, maximum: 20 } }, additionalProperties: false },
        annotations: { ...annotations, untrustedContentHint: true },
        execute: async (input) => {
          const params = new URLSearchParams()
          if (typeof input.query === 'string') params.set('query', input.query.slice(0, 120))
          if (input.kind === 'skill' || input.kind === 'plugin') params.set('kind', input.kind)
          if (Number.isFinite(Number(input.page))) params.set('page', String(Math.max(1, Math.floor(Number(input.page)))))
          if (Number.isFinite(Number(input.size))) params.set('size', String(Math.max(1, Math.min(20, Math.floor(Number(input.size))))))
          return json(`/api/hermes/catalog?${params}`)
        },
      },
      {
        name: 'legitmate.search_specialists',
        title: 'Search LegitMate specialists',
        description: 'Search the Agency specialist roster rendered in this page and return public profile summaries.',
        inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 120 }, limit: { type: 'integer', minimum: 1, maximum: 20 } }, additionalProperties: false },
        annotations,
        execute: async (input) => {
          const query = typeof input.query === 'string' ? input.query.trim().toLowerCase().slice(0, 120) : ''
          const limit = Number.isFinite(Number(input.limit)) ? Math.max(1, Math.min(20, Math.floor(Number(input.limit)))) : 10
          const cards = Array.from(document.querySelectorAll<HTMLElement>('.agency-card'))
          return cards.filter((card) => !query || (card.textContent ?? '').toLowerCase().includes(query)).slice(0, limit).map((card) => ({ name: card.querySelector(':scope > strong')?.textContent?.trim() ?? '', summary: card.querySelector('small')?.textContent?.trim() ?? '', division: card.querySelector('.agency-card-top span')?.textContent?.trim() ?? '' }))
        },
      },
    ]
    void Promise.all(registrations.map((tool) => context.registerTool(tool, { signal: controller.signal }))).catch(() => undefined)
    return () => controller.abort()
  }, [])
  return null
}

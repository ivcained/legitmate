import { deriveConfiguration } from './preset'
import type { Permission } from './permissions'

export const WORKSPACE_VERSION = 1 as const
export type WorkspaceState = { readonly version: 1; readonly id: string; readonly brief: string; readonly configuration: ReturnType<typeof deriveConfiguration> }
export type TrialOutput = { readonly sandbox: true; readonly summary: string; readonly emphasis: string[]; readonly permissions: Permission[]; readonly actions: string[] }
export function createWorkspace(id: string, brief: string): WorkspaceState { return Object.freeze({ version: WORKSPACE_VERSION, id, brief, configuration: deriveConfiguration(brief) }) }
export function serializeWorkspace(workspace: WorkspaceState): string { return JSON.stringify(workspace) }
export function deserializeWorkspace(serialized: string): WorkspaceState {
  const value = JSON.parse(serialized) as WorkspaceState
  if (value.version !== WORKSPACE_VERSION || typeof value.id !== 'string' || typeof value.brief !== 'string') throw new Error('Unsupported workspace state')
  return createWorkspace(value.id, value.brief)
}
export function deriveTrialOutput(workspace: WorkspaceState): TrialOutput {
  const emphasis = [...workspace.configuration.emphasis]
  return { sandbox: true, summary: workspace.brief, emphasis, permissions: [...workspace.configuration.requestedPermissions], actions: ['research', 'analytics', 'drafts'].filter(e => emphasis.includes(e)) }
}

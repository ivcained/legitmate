export type WorkspaceTool = 'dashboard' | 'terminal' | 'files'

const WORKSPACE_TOOLS: Record<WorkspaceTool, number> = {
  dashboard: 9119,
  terminal: 7681,
  files: 8080,
}

export function workspaceTool(value: string) {
  if (!(value in WORKSPACE_TOOLS)) throw new Error('TOOL_NOT_ALLOWED')
  const tool = value as WorkspaceTool
  return { tool, port: WORKSPACE_TOOLS[tool] }
}

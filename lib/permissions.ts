export const ALLOWED_PERMISSIONS = ['youtube.channel.read', 'youtube.analytics.read', 'youtube.video.draft.write'] as const
export type Permission = (typeof ALLOWED_PERMISSIONS)[number]
export type PermissionDecision = 'approved' | 'denied'
export type PermissionDecisionRecord = { readonly permission: Permission; readonly decision: PermissionDecision }
export function isPermission(value: unknown): value is Permission { return typeof value === 'string' && (ALLOWED_PERMISSIONS as readonly string[]).includes(value) }
export function decidePermissions(requested: readonly Permission[], decisions: Partial<Record<Permission, 'approve' | 'deny'>>): PermissionDecisionRecord[] {
  return requested.map(permission => ({ permission, decision: decisions[permission] === 'approve' ? 'approved' : 'denied' }))
}

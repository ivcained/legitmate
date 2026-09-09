export const ALLOWED_PERMISSIONS=['youtube.channel.read','youtube.analytics.read','youtube.video.draft.write'] as const
export type Permission=(typeof ALLOWED_PERMISSIONS)[number]
export function isPermission(value:unknown):value is Permission{return typeof value==='string'&&(ALLOWED_PERMISSIONS as readonly string[]).includes(value)}

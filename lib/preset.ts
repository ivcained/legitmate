import { ALLOWED_PERMISSIONS, isPermission, type Permission } from "./permissions";

export const YOUTUBE_PRESET = {
  id: "youtube-operations",
  assistant: "YouTube operations assistant",
  requestedPermissions: [...ALLOWED_PERMISSIONS],
  capabilities: ["research", "content calendars", "draft metadata", "publishing checklists", "performance summaries"],
  sandbox: true,
} as const;

export type ParsedRequest = { description: string; requestedPermissions: Permission[]; grantedPermissions: never[] };

/** Untrusted input is converted to a request; grants are exclusively lifecycle-owned. */
export function parseRequest(input: unknown): ParsedRequest {
  const value = typeof input === "string" ? { description: input } : (input ?? {}) as Record<string, unknown>;
  const permissions = value.requestedPermissions;
  if (permissions !== undefined && (!Array.isArray(permissions) || permissions.some((p) => !isPermission(p)))) {
    throw new Error("Unknown permission requested");
  }
  return {
    description: typeof value.description === "string" ? value.description : "",
    requestedPermissions: (permissions ?? []) as Permission[],
    grantedPermissions: [],
  };
}

export function createServerOwnedPreset(): typeof YOUTUBE_PRESET {
  return structuredClone(YOUTUBE_PRESET);
}

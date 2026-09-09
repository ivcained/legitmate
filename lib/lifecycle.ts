import { createServerOwnedPreset } from "./preset";
import type { Permission } from "./permissions";

export const STATES = ["draft", "reviewed", "entitled", "provisioned", "test-passed", "active"] as const;
export type State = (typeof STATES)[number];
export type TransitionAuditEvent = { type: "transition"; from: State; to: State; at: string };
export type ApprovalAuditEvent = { type: "approval"; state: "test-passed"; at: string };
export type AuditEvent = TransitionAuditEvent | ApprovalAuditEvent;

export interface AssistantRecord {
  id: string; state: State; requestedPermissions: Permission[]; grantedPermissions: never[];
  trialPassed: boolean; approved: boolean; provisionedResource?: string; audit: AuditEvent[];
}

export class SandboxPaymentAdapter {
  entitlement(_id: string): { entitled: true; sandbox: true } { return { entitled: true, sandbox: true }; }
}

export class SandboxProvisioningAdapter {
  private readonly resources = new Map<string, string>();
  provision(id: string): { resource: string; sandbox: true; created: boolean } {
    const existing = this.resources.get(id);
    if (existing) return { resource: existing, sandbox: true, created: false };
    const resource = `sandbox-workspace:${id}`;
    this.resources.set(id, resource);
    return { resource, sandbox: true, created: true };
  }
}

export class AssistantLifecycle {
  readonly record: AssistantRecord;
  constructor(readonly id: string, requestedPermissions: Permission[] = []) {
    this.record = { id, state: "draft", requestedPermissions: [...requestedPermissions], grantedPermissions: [], trialPassed: false, approved: false, audit: [] };
  }
  private transition(to: State): void {
    const from = this.record.state;
    this.record.state = to;
    this.record.audit.push({ type: "transition", from, to, at: new Date().toISOString() });
  }
  review(): void { this.require("draft"); this.transition("reviewed"); }
  entitle(payment = new SandboxPaymentAdapter()): void { this.require("reviewed"); payment.entitlement(this.id); this.transition("entitled"); }
  provision(provisioner = new SandboxProvisioningAdapter()): void {
    this.require("entitled");
    this.record.provisionedResource = provisioner.provision(this.id).resource;
    this.transition("provisioned");
  }
  passTrial(): void { this.require("provisioned"); this.record.trialPassed = true; this.transition("test-passed"); }
  approve(): void {
    if (this.record.state !== "test-passed") throw new Error("Approval requires a passed trial");
    if (this.record.approved) throw new Error("Approval already recorded");
    this.record.approved = true;
    this.record.audit.push({ type: "approval", state: "test-passed", at: new Date().toISOString() });
  }
  activate(): void { this.require("test-passed"); if (!this.record.approved) throw new Error("Explicit approval required"); this.transition("active"); }
  private require(expected: State): void { if (this.record.state !== expected) throw new Error(`Expected ${expected}, got ${this.record.state}`); }
}

export function newYouTubeAssistant(id: string): AssistantLifecycle {
  const preset = createServerOwnedPreset();
  return new AssistantLifecycle(id, [...preset.requestedPermissions]);
}

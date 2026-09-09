import { describe, expect, it } from "vitest";
import { AssistantLifecycle, newYouTubeAssistant, SandboxProvisioningAdapter } from "../lib/lifecycle";
import { parseRequest } from "../lib/preset";

describe("configuration safety", () => {
  it("never parses grants", () => {
    expect(parseRequest({ requestedPermissions: ["youtube.channel.read"], grantedPermissions: ["youtube.channel.read"] }).grantedPermissions).toEqual([]);
  });
  it("rejects unknown permissions", () => expect(() => parseRequest({ requestedPermissions: ["youtube.delete.channel"] })).toThrow("Unknown permission"));
});

describe("assistant lifecycle", () => {
  it("blocks provisioning before entitlement", () => expect(() => new AssistantLifecycle("a").provision()).toThrow("Expected entitled"));
  it("blocks trial before provisioning", () => expect(() => new AssistantLifecycle("a").passTrial()).toThrow("Expected provisioned"));
  it("blocks activation before trial and approval", () => {
    const a = newYouTubeAssistant("a");
    expect(() => a.activate()).toThrow("Expected test-passed");
    a.review(); a.entitle(); a.provision(); a.passTrial();
    expect(() => a.activate()).toThrow("Explicit approval");
  });
  it("provisions idempotently in the sandbox", () => {
    const adapter = new SandboxProvisioningAdapter();
    expect(adapter.provision("a").created).toBe(true);
    expect(adapter.provision("a")).toEqual({ resource: "sandbox-workspace:a", sandbox: true, created: false });
  });
  it("audits every state transition", () => {
    const a = newYouTubeAssistant("a"); a.review(); a.entitle(); a.provision(); a.passTrial(); a.approve(); a.activate();
    expect(a.record.audit.filter((event) => event.type === "transition").map((event) => [event.from, event.to])).toEqual([["draft", "reviewed"], ["reviewed", "entitled"], ["entitled", "provisioned"], ["provisioned", "test-passed"], ["test-passed", "active"]]);
  });
  it("audits explicit approval exactly once without activating", () => {
    const a = newYouTubeAssistant("a"); a.review(); a.entitle(); a.provision(); a.passTrial();
    a.approve();
    expect(a.record.state).toBe("test-passed");
    expect(a.record.audit.filter((event) => event.type === "approval")).toHaveLength(1);
    expect(() => a.approve()).toThrow("Approval already recorded");
    expect(a.record.audit.filter((event) => event.type === "approval")).toHaveLength(1);
  });
});

import { describe,expect,it } from 'vitest'
import { AssistantLifecycle,newYouTubeAssistant,SandboxProvisioningAdapter } from '../lib/lifecycle'
import { parseRequest,deriveConfiguration } from '../lib/preset'
import { decidePermissions } from '../lib/permissions'
import { createWorkspace,serializeWorkspace,deserializeWorkspace,deriveTrialOutput } from '../lib/workspace'

describe('configuration safety',()=>{
 it('never parses grants',()=>expect(parseRequest({requestedPermissions:['youtube.channel.read'],grantedPermissions:['youtube.channel.read']}).grantedPermissions).toEqual([]))
 it('rejects unknown permissions',()=>expect(()=>parseRequest({requestedPermissions:['youtube.delete.channel']})).toThrow('Unknown permission'))
})
describe('assistant lifecycle',()=>{
 it('blocks provisioning before entitlement',()=>expect(()=>new AssistantLifecycle('a').provision()).toThrow('Expected entitled'))
 it('blocks trial before provisioning',()=>expect(()=>new AssistantLifecycle('a').passTrial()).toThrow('Expected provisioned'))
 it('requires explicit approval and records it once',()=>{const a=newYouTubeAssistant('a'); a.review();a.entitle();a.provision();a.passTrial();expect(()=>a.activate()).toThrow('Explicit approval');a.approve();expect(a.snapshot.state).toBe('test-passed');expect(a.snapshot.audit.filter(e=>e.type==='approval')).toHaveLength(1);expect(()=>a.approve()).toThrow('already recorded');a.activate();expect(a.snapshot.state).toBe('active')})
 it('provisions idempotently',()=>{const adapter=new SandboxProvisioningAdapter();expect(adapter.provision('a').created).toBe(true);expect(adapter.provision('a')).toEqual({resource:'sandbox-workspace:a',sandbox:true,created:false})})
 it('returns immutable snapshots',()=>{const a=new AssistantLifecycle('a');const s=a.snapshot;expect(()=>{(s as {state:string}).state='active'}).toThrow();expect(a.snapshot.state).toBe('draft')})
 it('audits transitions and approval',()=>{const a=newYouTubeAssistant('a');a.review();a.entitle();a.provision();a.passTrial();a.approve();a.activate();expect(a.snapshot.audit.map(e=>e.type)).toEqual(['transition','transition','transition','transition','approval','transition'])})
})

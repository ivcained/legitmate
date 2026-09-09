import { createServerOwnedPreset } from './preset'
import type { Permission } from './permissions'

export const STATES = ['draft','reviewed','entitled','provisioned','test-passed','active'] as const
export type State = (typeof STATES)[number]
export type AuditEvent =
  | { type:'transition'; from:State; to:State; at:string }
  | { type:'approval'; at:string; decision:'approved' }

export interface AssistantSnapshot {
  readonly id:string
  readonly state:State
  readonly requestedPermissions:readonly Permission[]
  readonly grantedPermissions:readonly Permission[]
  readonly trialPassed:boolean
  readonly approved:boolean
  readonly provisionedResource?:string
  readonly audit:readonly AuditEvent[]
}

type Mutable = { id:string; state:State; requestedPermissions:Permission[]; grantedPermissions:Permission[]; trialPassed:boolean; approved:boolean; provisionedResource?:string; audit:AuditEvent[] }

export class SandboxPaymentAdapter { entitlement(_id:string){ return { entitled:true as const, sandbox:true as const } } }
export class SandboxProvisioningAdapter {
  private readonly resources = new Map<string,string>()
  provision(id:string){ const old=this.resources.get(id); if(old) return {resource:old,sandbox:true as const,created:false as const}; const resource=`sandbox-workspace:${id}`; this.resources.set(id,resource); return {resource,sandbox:true as const,created:true as const} }
}

export class AssistantLifecycle {
  private readonly data:Mutable
  constructor(readonly id:string, requestedPermissions:Permission[]=[]){ this.data={id,state:'draft',requestedPermissions:[...requestedPermissions],grantedPermissions:[],trialPassed:false,approved:false,audit:[]} }
  get snapshot():AssistantSnapshot { return Object.freeze({...this.data, requestedPermissions:Object.freeze([...this.data.requestedPermissions]), grantedPermissions:Object.freeze([...this.data.grantedPermissions]), audit:Object.freeze(this.data.audit.map(e=>Object.freeze({...e})))}) }
  private transition(to:State){ const from=this.data.state; this.data.state=to; this.data.audit.push({type:'transition',from,to,at:new Date().toISOString()}) }
  review(){ this.require('draft'); this.transition('reviewed') }
  entitle(payment=new SandboxPaymentAdapter()){ this.require('reviewed'); if(!payment.entitlement(this.id).entitled) throw new Error('Entitlement required'); this.transition('entitled') }
  provision(provisioner=new SandboxProvisioningAdapter()){ this.require('entitled'); this.data.provisionedResource=provisioner.provision(this.id).resource; this.transition('provisioned') }
  passTrial(){ this.require('provisioned'); this.data.trialPassed=true; this.transition('test-passed') }
  approve(){ this.require('test-passed'); if(this.data.approved) throw new Error('Approval already recorded'); this.data.approved=true; this.data.audit.push({type:'approval',at:new Date().toISOString(),decision:'approved'}) }
  activate(){ this.require('test-passed'); if(!this.data.trialPassed) throw new Error('Passed trial required'); if(!this.data.approved) throw new Error('Explicit approval required'); this.transition('active') }
  private require(expected:State){ if(this.data.state!==expected) throw new Error(`Expected ${expected}, got ${this.data.state}`) }
}
export function newYouTubeAssistant(id:string){ return new AssistantLifecycle(id,[...createServerOwnedPreset().requestedPermissions]) }

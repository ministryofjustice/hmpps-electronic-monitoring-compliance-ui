import { ComplianceState } from './complianceState'
import { DeviceStatus } from './deviceStatus'
import { RuleCompliance } from './ruleCompliance'

export type DeviceCompliance = {
  deviceId: number
  status: DeviceStatus
  state: ComplianceState | null
  stateChangedAt: string | null
  rules: Array<RuleCompliance>
}

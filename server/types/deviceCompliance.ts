import { ComplianceState } from './complianceState'
import { DeviceStatus } from './deviceStatus'
import { DeviceRuleCompliance } from './deviceRuleCompliance'

export type DeviceCompliance = {
  deviceId: number
  status: DeviceStatus
  state: ComplianceState | null
  stateChangedAt: string | null
  rules: Array<DeviceRuleCompliance>
}

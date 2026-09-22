import { ComplianceState } from './complianceState'

export type DeviceRuleCompliance = {
  ruleId: string
  ruleVersion: number
  state: ComplianceState
  stateChangedAt: string | null
}

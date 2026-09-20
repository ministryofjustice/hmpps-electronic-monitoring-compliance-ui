import { ComplianceState } from './complianceState'

export type RuleCompliance = {
  ruleId: string
  ruleVersion: number
  state: ComplianceState
  stateChangedAt: string | null
}

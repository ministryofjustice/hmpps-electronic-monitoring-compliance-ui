import { RuleComplianceSummary } from './ruleComplianceSummary'
import { RuleConfigurationStatus } from './ruleConfigurationStatus'

export type RuleConfiguration = {
  id: string
  ruleId: string
  ruleVersion: number
  revision: number
  parameters: Record<string, string | number>
  status: RuleConfigurationStatus
  summary: RuleComplianceSummary
}

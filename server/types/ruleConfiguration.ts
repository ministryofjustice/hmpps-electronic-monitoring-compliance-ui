import { RuleComplianceSummary } from './ruleComplianceSummary'
import { RuleConfigurationStatus } from './ruleConfigurationStatus'
import { RuleId } from './ruleId'

export type RuleConfiguration = {
  id: string
  ruleId: RuleId
  ruleVersion: number
  revision: number
  parameters: Record<string, string | number>
  status: RuleConfigurationStatus
  summary: RuleComplianceSummary
}

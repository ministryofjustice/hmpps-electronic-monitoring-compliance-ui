export type RuleConfigurationSummary = {
  id: string
  ruleId: string
  ruleVersion: number
  revision: number
  parameters: Record<string, string | number>
}

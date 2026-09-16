export type RuleConfiguration = {
  ruleId: string
  ruleVersion: number
  revision: number
  parameters: Record<string, string | number>
}

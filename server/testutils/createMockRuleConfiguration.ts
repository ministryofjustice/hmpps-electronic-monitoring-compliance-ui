import { randomUUID } from 'crypto'
import { RuleConfiguration } from '../types/ruleConfiguration'

const createMockRuleConfiguration = (overrides: Partial<RuleConfiguration> = {}): RuleConfiguration => ({
  id: randomUUID(),
  parameters: {
    threshold: 20,
  },
  revision: 1,
  ruleId: 'BATTERY_LEVEL',
  ruleVersion: 1,
  status: 'PUBLISHED',
  summary: {
    compliant: 0,
    deactivated: 0,
    noData: 0,
    nonCompliant: 0,
  },
  ...overrides,
})

export default createMockRuleConfiguration

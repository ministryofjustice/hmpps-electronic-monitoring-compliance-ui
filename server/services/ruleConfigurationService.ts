import ComplianceApiClient from '../data/complianceApiClient'
import { RuleConfiguration } from '../types/ruleConfiguration'
import { RuleConfigurationRequest } from '../types/ruleConfigurationRequest'
import { RuleConfigurationSummary } from '../types/ruleConfigurationSummary'

export default class RuleConfigurationService {
  constructor(private readonly complianceApiClient: ComplianceApiClient) {}

  async createRuleConfigurationDraft(id: string, request: RuleConfigurationRequest): Promise<RuleConfiguration> {
    return this.complianceApiClient.createRuleConfigurationDraft(id, request)
  }

  async getRuleConfiguration(id: string): Promise<RuleConfiguration> {
    return this.complianceApiClient.getRuleConfiguration(id)
  }

  async getRuleConfigurations(): Promise<RuleConfigurationSummary[]> {
    return this.complianceApiClient.getRuleConfigurations()
  }
}

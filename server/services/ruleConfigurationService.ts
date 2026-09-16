import ComplianceApiClient from '../data/complianceApiClient'
import { RuleConfiguration } from '../types/ruleConfiguration'

export default class RuleConfigurationService {
  constructor(private readonly complianceApiClient: ComplianceApiClient) {}

  async getRuleConfigurations(): Promise<RuleConfiguration[]> {
    return this.complianceApiClient.getRuleConfigurations()
  }
}

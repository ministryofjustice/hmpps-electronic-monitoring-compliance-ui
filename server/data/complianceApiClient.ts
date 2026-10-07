import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { RuleConfigurationSummary } from '../types/ruleConfigurationSummary'
import config from '../config'
import logger from '../../logger'
import { DeviceComplianceList } from '../types/deviceComplianceList'
import { DeviceCompliance } from '../types/deviceCompliance'
import { RuleConfiguration } from '../types/ruleConfiguration'
import { RuleConfigurationRequest } from '../types/ruleConfigurationRequest'

export default class ComplianceApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Electronic Monitoring Compliance API', config.apis.complianceApi, logger, authenticationClient)
  }

  async createRuleConfigurationDraft(id: string, request: RuleConfigurationRequest): Promise<RuleConfiguration> {
    return this.post<RuleConfiguration>(
      {
        path: `/v1/rule-configurations/${id}/draft`,
        data: request,
      },
      asSystem(),
    )
  }

  async getDeviceCompliance(id: string): Promise<DeviceCompliance> {
    return this.get<DeviceCompliance>(
      {
        path: `/v1/device-compliance/${id}`,
      },
      asSystem(),
    )
  }

  async getDeviceComplianceList(): Promise<DeviceComplianceList> {
    return this.get<DeviceComplianceList>(
      {
        path: '/v1/device-compliance',
      },
      asSystem(),
    )
  }

  async getRuleConfiguration(id: string): Promise<RuleConfiguration> {
    return this.get<RuleConfiguration>(
      {
        path: `/v1/rule-configurations/${id}`,
      },
      asSystem(),
    )
  }

  async getRuleConfigurations(): Promise<RuleConfigurationSummary[]> {
    return this.get<RuleConfigurationSummary[]>(
      {
        path: '/v1/rule-configurations',
      },
      asSystem(),
    )
  }
}

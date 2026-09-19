import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { RuleConfiguration } from '../types/ruleConfiguration'
import config from '../config'
import logger from '../../logger'
import { DeviceComplianceList } from '../types/deviceComplianceList'

export default class ComplianceApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Electronic Monitoring Compliance API', config.apis.complianceApi, logger, authenticationClient)
  }

  async getDeviceCompliance(): Promise<DeviceComplianceList> {
    return this.get<DeviceComplianceList>(
      {
        path: '/v1/device-compliance',
      },
      asSystem(),
    )
  }

  async getRuleConfigurations(): Promise<RuleConfiguration[]> {
    return this.get<RuleConfiguration[]>(
      {
        path: '/v1/rule-configurations',
      },
      asSystem(),
    )
  }
}

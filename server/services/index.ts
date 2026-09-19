import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import { dataAccess } from '../data'
import logger from '../../logger'
import config from '../config'
import RuleConfigurationService from './ruleConfigurationService'
import DeviceComplianceService from './deviceComplianceService'

export const services = () => {
  const { applicationInfo, complianceApiClient } = dataAccess()

  const auditService = AuditServiceFactory.createInstance(config.sqs.audit, logger)

  return {
    applicationInfo,
    auditService,
    deviceComplianceService: new DeviceComplianceService(complianceApiClient),
    ruleConfigurationService: new RuleConfigurationService(complianceApiClient),
  }
}

export type Services = ReturnType<typeof services>

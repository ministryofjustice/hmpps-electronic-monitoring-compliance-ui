import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import { dataAccess } from '../data'
import logger from '../../logger'
import config from '../config'
import RuleConfigurationService from './ruleConfigurationService'

export const services = () => {
  const { applicationInfo, complianceApiClient } = dataAccess()

  const auditService = AuditServiceFactory.createInstance(config.sqs.audit, logger)

  return {
    applicationInfo,
    auditService,
    ruleConfigurationService: new RuleConfigurationService(complianceApiClient),
  }
}

export type Services = ReturnType<typeof services>

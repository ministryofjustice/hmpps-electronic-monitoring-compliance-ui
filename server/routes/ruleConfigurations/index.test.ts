import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import RuleConfigurationService from '../../services/ruleConfigurationService'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/ruleConfigurationService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const ruleConfigurationService = new RuleConfigurationService({} as never) as jest.Mocked<RuleConfigurationService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      ruleConfigurationService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /rule-configurations', () => {
  it('should render rule configurations', () => {
    ruleConfigurationService.getRuleConfigurations.mockResolvedValue([
      {
        ruleId: 'BATTERY_LEVEL',
        ruleVersion: 1,
        revision: 1,
        parameters: {
          threshold: 20,
        },
      },
    ])

    return request(app)
      .get('/rule-configurations')
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Rule configurations')
        expect(res.text).toContain('BATTERY_LEVEL')
        expect(res.text).toContain('1')
      })
  })

  it('should handle errors from the compliance API', () => {
    ruleConfigurationService.getRuleConfigurations.mockRejectedValue(new Error('Some problem calling compliance API'))

    return request(app)
      .get('/rule-configurations')
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Some problem calling compliance API')
      })
  })
})

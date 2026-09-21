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
        id: 'a794058b-720b-47ef-af58-814050774b4f',
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

describe('GET /rule-configurations/:ruleConfigurationId', () => {
  it('should render rule configuration detail', () => {
    ruleConfigurationService.getRuleConfiguration.mockResolvedValue({
      id: 'd922503c-886c-4e3d-bf66-0cf76a5bf5de',
      ruleId: 'BATTERY_LEVEL',
      ruleVersion: 1,
      revision: 1,
      parameters: {
        threshold: 20,
      },
      status: 'PUBLISHED',
      summary: {
        compliant: 0,
        nonCompliant: 0,
        noData: 0,
        deactivated: 0,
      },
    })

    return request(app)
      .get('/rule-configurations/d922503c-886c-4e3d-bf66-0cf76a5bf5de')
      .expect(200)
      .expect(res => {
        expect(ruleConfigurationService.getRuleConfiguration).toHaveBeenCalledWith(
          'd922503c-886c-4e3d-bf66-0cf76a5bf5de',
        )

        expect(res.text).toContain('Rule configuration')
        expect(res.text).toContain('BATTERY_LEVEL')
        expect(res.text).toContain('Published')
        expect(res.text).toContain('threshold')
        expect(res.text).toContain('20')
      })
  })

  it('should handle errors from the compliance API', () => {
    ruleConfigurationService.getRuleConfiguration.mockRejectedValue(new Error('Some problem calling compliance API'))

    return request(app)
      .get('/rule-configurations/d922503c-886c-4e3d-bf66-0cf76a5bf5de')
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Some problem calling compliance API')
      })
  })
})

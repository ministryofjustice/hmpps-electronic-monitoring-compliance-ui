import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'
import { randomUUID } from 'crypto'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import RuleConfigurationService from '../../services/ruleConfigurationService'
import createMockRuleConfiguration from '../../testutils/createMockRuleConfiguration'

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

describe('GET /rule-configurations/:ruleConfigurationId/edit', () => {
  it('should render the edit form', () => {
    const configuration = createMockRuleConfiguration()
    ruleConfigurationService.getRuleConfiguration.mockResolvedValue(configuration)

    return request(app)
      .get(`/rule-configurations/${configuration.id}/edit`)
      .expect(200)
      .expect(res => {
        expect(ruleConfigurationService.getRuleConfiguration).toHaveBeenCalledWith(configuration.id)

        expect(res.text).toContain('Change rule configuration')
        expect(res.text).toContain('Battery level threshold')
        expect(res.text).toContain('20')
        expect(res.text).toContain('%')
      })
  })

  it('should handle errors from the compliance API', () => {
    ruleConfigurationService.getRuleConfiguration.mockRejectedValue(new Error('Some problem calling compliance API'))

    return request(app)
      .get('/rule-configurations/d922503c-886c-4e3d-bf66-0cf76a5bf5de/edit')
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Some problem calling compliance API')
      })
  })
})

describe('POST /rule-configurations/:ruleConfigurationId/edit', () => {
  it('should create a draft and redirect to the draft', () => {
    const sourceConfiguration = createMockRuleConfiguration()
    const draftConfiguration = createMockRuleConfiguration({
      id: randomUUID(),
      parameters: {
        threshold: 50,
      },
      revision: 2,
      status: 'DRAFT',
    })
    ruleConfigurationService.getRuleConfiguration.mockResolvedValue(sourceConfiguration)

    ruleConfigurationService.createRuleConfigurationDraft.mockResolvedValue(draftConfiguration)

    return request(app)
      .post(`/rule-configurations/${sourceConfiguration.id}/edit`)
      .type('form')
      .send({
        threshold: '50',
      })
      .expect(302)
      .expect('Location', `/rule-configurations/${draftConfiguration.id}`)
      .expect(() => {
        expect(ruleConfigurationService.createRuleConfigurationDraft).toHaveBeenCalledWith(sourceConfiguration.id, {
          parameters: {
            threshold: 50,
          },
        })
      })
  })

  it('should redisplay the form when validation fails', () => {
    const sourceConfiguration = createMockRuleConfiguration()
    ruleConfigurationService.getRuleConfiguration.mockResolvedValue(sourceConfiguration)

    return request(app)
      .post(`/rule-configurations/${sourceConfiguration.id}/edit`)
      .type('form')
      .send({
        threshold: '',
      })
      .expect(400)
      .expect(res => {
        expect(ruleConfigurationService.createRuleConfigurationDraft).not.toHaveBeenCalled()

        expect(res.text).toContain('Battery level threshold is required')
        expect(res.text).toContain('Change rule configuration')
      })
  })

  it('should preserve submitted values when validation fails', () => {
    const sourceConfiguration = createMockRuleConfiguration()
    ruleConfigurationService.getRuleConfiguration.mockResolvedValue(sourceConfiguration)

    return request(app)
      .post(`/rule-configurations/${sourceConfiguration.id}/edit`)
      .type('form')
      .send({
        threshold: '101',
      })
      .expect(400)
      .expect(res => {
        expect(res.text).toContain('value="101"')
        expect(res.text).toContain('Battery level threshold must be less than 100')
      })
  })
})

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
    const configuration = createMockRuleConfiguration()

    ruleConfigurationService.getRuleConfiguration.mockResolvedValue(configuration)
    ruleConfigurationService.getRuleConfigurationDraft.mockResolvedValue(null)

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

  it('should show change configuration when no draft exists', () => {
    const configuration = createMockRuleConfiguration()

    ruleConfigurationService.getRuleConfiguration.mockResolvedValue(configuration)
    ruleConfigurationService.getRuleConfigurationDraft.mockResolvedValue(null)

    return request(app)
      .get(`/rule-configurations/${configuration.id}`)
      .expect(200)
      .expect(res => {
        expect(ruleConfigurationService.getRuleConfigurationDraft).toHaveBeenCalledWith(configuration.id)

        expect(res.text).toContain('Change configuration')
        expect(res.text).not.toContain('Continue editing')
      })
  })

  it('should show the existing draft when one exists', () => {
    const configuration = createMockRuleConfiguration()

    const draft = createMockRuleConfiguration({
      id: randomUUID(),
      revision: 2,
      status: 'DRAFT',
      summary: null,
    })

    ruleConfigurationService.getRuleConfiguration.mockResolvedValue(configuration)
    ruleConfigurationService.getRuleConfigurationDraft.mockResolvedValue(draft)

    return request(app)
      .get(`/rule-configurations/${configuration.id}`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Continue editing')
        expect(res.text).toContain(`/rule-configurations/${draft.id}/edit`)
        expect(res.text).not.toContain('Change configuration')
      })
  })

  it('should render a draft without compliance summary', () => {
    const draft = createMockRuleConfiguration({
      status: 'DRAFT',
      revision: 2,
      summary: null,
    })

    ruleConfigurationService.getRuleConfiguration.mockResolvedValue(draft)

    return request(app)
      .get(`/rule-configurations/${draft.id}`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Draft')
        expect(res.text).not.toContain('Device compliance summary')
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
        expect(ruleConfigurationService.updateRuleConfigurationDraft).not.toHaveBeenCalled()
      })
  })

  it('should update an existing draft and redirect to it', () => {
    const draft = createMockRuleConfiguration({
      status: 'DRAFT',
      revision: 2,
      summary: null,
    })

    ruleConfigurationService.getRuleConfiguration.mockResolvedValue(draft)

    ruleConfigurationService.updateRuleConfigurationDraft.mockResolvedValue({
      ...draft,
      parameters: {
        threshold: 50,
      },
    })

    return request(app)
      .post(`/rule-configurations/${draft.id}/edit`)
      .type('form')
      .send({
        threshold: '50',
      })
      .expect(302)
      .expect('Location', `/rule-configurations/${draft.id}`)
      .expect(() => {
        expect(ruleConfigurationService.updateRuleConfigurationDraft).toHaveBeenCalledWith(draft.id, {
          parameters: {
            threshold: 50,
          },
        })

        expect(ruleConfigurationService.createRuleConfigurationDraft).not.toHaveBeenCalled()
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

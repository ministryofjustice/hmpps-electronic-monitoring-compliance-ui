import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'

jest.mock('@ministryofjustice/hmpps-audit-client')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should redirect to rule configurations index page', () => {
    auditService.logPageView.mockResolvedValue(undefined)

    return request(app).get('/').expect(302).expect('Location', '/device-compliance')
  })
})

describe('POST /perform-search', () => {
  it('should trigger audit request and redirect to /', () => {
    return request(app)
      .post('/perform-search')
      .send({ searchTerm: '12345' })
      .expect('Content-Type', /text\/plain/)
      .expect(302)
      .expect('Location', '/')
      .expect(() => {
        expect(auditService.logAuditEvent).toHaveBeenCalledWith({
          correlationId: '4d0fd4da-ecc1-454d-8308-cdee6b8b91f7',
          details: { build: 'abc123', userRoles: [] },
          subjectId: '12345',
          subjectType: 'SEARCH_TERM',
          what: 'SEARCH_OFFENDERS',
          who: 'user1',
        })
      })
  })
})

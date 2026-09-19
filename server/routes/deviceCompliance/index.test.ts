import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import DeviceComplianceService from '../../services/deviceComplianceService'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/deviceComplianceService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const deviceComplianceService = new DeviceComplianceService({} as never) as jest.Mocked<DeviceComplianceService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      deviceComplianceService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /device-compliance', () => {
  it('should render device-compliance', () => {
    deviceComplianceService.getDeviceCompliance.mockResolvedValue({
      summary: {
        compliant: 1,
        deactivated: 0,
        nonCompliant: 0,
      },
      devices: [
        {
          deviceId: 1234,
          status: 'ACTIVATED',
          state: 'COMPLIANT',
        },
      ],
    })

    return request(app)
      .get('/device-compliance')
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Device compliance')
        expect(res.text).toContain('1234')
        expect(res.text).toContain('Activated')
        expect(res.text).toContain('Compliant')
      })
  })

  it('should handle errors from the compliance API', () => {
    deviceComplianceService.getDeviceCompliance.mockRejectedValue(new Error('Some problem calling compliance API'))

    return request(app)
      .get('/device-compliance')
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Some problem calling compliance API')
      })
  })
})

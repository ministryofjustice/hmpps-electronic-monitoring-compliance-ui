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
    deviceComplianceService.getDeviceComplianceList.mockResolvedValue({
      summary: {
        compliant: 1,
        deactivated: 0,
        nonCompliant: 0,
      },
      devices: [
        {
          id: 'd4d854e9-4538-46c2-bf3d-6b0b81d07cae',
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
        expect(res.text).toContain('/device-compliance/d4d854e9-4538-46c2-bf3d-6b0b81d07cae')
        expect(res.text).toContain('Device compliance')
        expect(res.text).toContain('1234')
        expect(res.text).toContain('Activated')
        expect(res.text).toContain('Compliant')
      })
  })

  it('should handle errors from the compliance API', () => {
    deviceComplianceService.getDeviceComplianceList.mockRejectedValue(new Error('Some problem calling compliance API'))

    return request(app)
      .get('/device-compliance')
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Some problem calling compliance API')
      })
  })
})

describe('GET /device-compliance/:deviceComplianceId', () => {
  it('should render device compliance detail', () => {
    deviceComplianceService.getDeviceCompliance.mockResolvedValue({
      deviceId: 1814,
      status: 'ACTIVATED',
      state: 'COMPLIANT',
      stateChangedAt: '2026-09-20T12:00:00Z',
      rules: [
        {
          ruleId: 'BATTERY_LEVEL',
          ruleVersion: 1,
          state: 'COMPLIANT',
          stateChangedAt: '2026-09-20T12:00:00Z',
        },
      ],
    })

    return request(app)
      .get('/device-compliance/d4d854e9-4538-46c2-bf3d-6b0b81d07cae')
      .expect(200)
      .expect(res => {
        expect(deviceComplianceService.getDeviceCompliance).toHaveBeenCalledWith('d4d854e9-4538-46c2-bf3d-6b0b81d07cae')

        expect(res.text).toContain('Device compliance')
        expect(res.text).toContain('1814')
        expect(res.text).toContain('Activated')
        expect(res.text).toContain('Compliant')
        expect(res.text).toContain('BATTERY_LEVEL')
        expect(res.text).toContain('1')
      })
  })

  it('should render no data rule state', () => {
    deviceComplianceService.getDeviceCompliance.mockResolvedValue({
      deviceId: 1814,
      status: 'ACTIVATED',
      state: 'NON_COMPLIANT',
      stateChangedAt: null,
      rules: [
        {
          ruleId: 'BATTERY_LEVEL',
          ruleVersion: 1,
          state: 'NO_DATA',
          stateChangedAt: null,
        },
      ],
    })

    return request(app)
      .get('/device-compliance/d4d854e9-4538-46c2-bf3d-6b0b81d07cae')
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Non-compliant')
        expect(res.text).toContain('No data')
        expect(res.text).toContain('Not available')
      })
  })

  it('should handle errors from the compliance API', () => {
    deviceComplianceService.getDeviceCompliance.mockRejectedValue(new Error('Some problem calling compliance API'))

    return request(app)
      .get('/device-compliance/d4d854e9-4538-46c2-bf3d-6b0b81d07cae')
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Some problem calling compliance API')
      })
  })
})

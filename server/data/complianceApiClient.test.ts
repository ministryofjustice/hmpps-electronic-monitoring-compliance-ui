import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import ComplianceApiClient from './complianceApiClient'

describe('ComplianceApiClient', () => {
  let complianceApiClient: ComplianceApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    complianceApiClient = new ComplianceApiClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getRuleConfigurations', () => {
    it('should get rule configurations using a system token', async () => {
      nock(config.apis.complianceApi.url)
        .get('/v1/rule-configurations')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, [
          {
            ruleId: 'BATTERY_LEVEL',
            ruleVersion: 1,
            revision: 1,
            parameters: {
              threshold: 20,
            },
          },
        ])

      const response = await complianceApiClient.getRuleConfigurations()

      expect(response).toEqual([
        {
          ruleId: 'BATTERY_LEVEL',
          ruleVersion: 1,
          revision: 1,
          parameters: {
            threshold: 20,
          },
        },
      ])
    })
  })

  describe('getDeviceComplianceList', () => {
    it('should get device compliance using a system token', async () => {
      nock(config.apis.complianceApi.url)
        .get('/v1/device-compliance')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, {
          summary: {
            compliant: 1,
            deactivated: 0,
            nonCompliant: 0,
          },
          devices: [
            {
              deviceId: 1,
              status: 'ACTIVATED',
              state: 'COMPLIANT',
            },
          ],
        })

      const response = await complianceApiClient.getDeviceComplianceList()

      expect(response).toEqual({
        summary: {
          compliant: 1,
          deactivated: 0,
          nonCompliant: 0,
        },
        devices: [
          {
            deviceId: 1,
            status: 'ACTIVATED',
            state: 'COMPLIANT',
          },
        ],
      })
    })
  })

  describe('getDeviceCompliance', () => {
    it('should get device compliance by id using a system token', async () => {
      nock(config.apis.complianceApi.url)
        .get('/v1/device-compliance/d4d854e9-4538-46c2-bf3d-6b0b81d07cae')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, {
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

      const response = await complianceApiClient.getDeviceCompliance('d4d854e9-4538-46c2-bf3d-6b0b81d07cae')

      expect(response).toEqual({
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
    })
  })
})

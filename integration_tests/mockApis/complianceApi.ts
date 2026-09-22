import { SuperAgentRequest } from 'superagent'
import { stubFor, stubPing } from './wiremock'

export default {
  stubPing: (httpStatus = 200): SuperAgentRequest => stubPing('/compliance-api', httpStatus),

  stubGetDeviceComplianceList: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/compliance-api/v1/device-compliance',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          summary: {
            compliant: 0,
            nonCompliant: 0,
            deactivated: 0,
          },
          devices: [],
        },
      },
    }),
}

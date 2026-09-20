import ComplianceApiClient from '../data/complianceApiClient'
import { DeviceComplianceList } from '../types/deviceComplianceList'

export default class DeviceComplianceService {
  constructor(private readonly complianceApiClient: ComplianceApiClient) {}

  async getDeviceComplianceList(): Promise<DeviceComplianceList> {
    return this.complianceApiClient.getDeviceComplianceList()
  }
}

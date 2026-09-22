import ComplianceApiClient from '../data/complianceApiClient'
import { DeviceCompliance } from '../types/deviceCompliance'
import { DeviceComplianceList } from '../types/deviceComplianceList'

export default class DeviceComplianceService {
  constructor(private readonly complianceApiClient: ComplianceApiClient) {}

  async getDeviceCompliance(id: string): Promise<DeviceCompliance> {
    return this.complianceApiClient.getDeviceCompliance(id)
  }

  async getDeviceComplianceList(): Promise<DeviceComplianceList> {
    return this.complianceApiClient.getDeviceComplianceList()
  }
}

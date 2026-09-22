import { ComplianceState } from './complianceState'
import { DeviceStatus } from './deviceStatus'

export type DeviceComplianceList = {
  summary: {
    compliant: number
    nonCompliant: number
    deactivated: number
  }
  devices: Array<{
    id: string
    deviceId: number
    status: DeviceStatus
    state: ComplianceState | null
  }>
}

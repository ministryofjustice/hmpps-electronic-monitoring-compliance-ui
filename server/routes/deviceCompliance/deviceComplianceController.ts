import { RequestHandler } from 'express'
import DeviceComplianceService from '../../services/deviceComplianceService'

export default class DeviceComplianceController {
  constructor(private readonly deviceComplianceService: DeviceComplianceService) {}

  get: RequestHandler = async (_, res): Promise<void> => {
    const deviceCompliance = await this.deviceComplianceService.getDeviceCompliance()

    res.render('pages/deviceCompliance/index', {
      deviceCompliance,
    })
  }
}

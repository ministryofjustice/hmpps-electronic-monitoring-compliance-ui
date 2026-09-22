import { RequestHandler } from 'express'
import DeviceComplianceService from '../../services/deviceComplianceService'

export default class DeviceComplianceController {
  constructor(private readonly deviceComplianceService: DeviceComplianceService) {}

  get: RequestHandler<{ deviceComplianceId: string }> = async (req, res) => {
    const deviceCompliance = await this.deviceComplianceService.getDeviceCompliance(req.params.deviceComplianceId)

    res.render('pages/deviceCompliance/detail', {
      deviceCompliance,
    })
  }

  list: RequestHandler = async (_, res) => {
    const deviceComplianceList = await this.deviceComplianceService.getDeviceComplianceList()

    res.render('pages/deviceCompliance/index', {
      deviceComplianceList,
    })
  }
}

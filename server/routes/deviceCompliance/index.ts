import { Router } from 'express'
import DeviceComplianceController from './deviceComplianceController'
import DeviceComplianceService from '../../services/deviceComplianceService'

export default function routes(deviceComplianceService: DeviceComplianceService): Router {
  const router = Router()
  const controller = new DeviceComplianceController(deviceComplianceService)

  router.get('/', controller.get.bind(controller))

  return router
}

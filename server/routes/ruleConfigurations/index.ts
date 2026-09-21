import { Router } from 'express'
import RuleConfigurationsController from './ruleConfigurationsController'
import RuleConfigurationService from '../../services/ruleConfigurationService'

export default function routes(ruleConfigurationService: RuleConfigurationService): Router {
  const router = Router()
  const controller = new RuleConfigurationsController(ruleConfigurationService)

  router.get('/', controller.list)
  router.get('/:ruleConfigurationId', controller.get)

  return router
}

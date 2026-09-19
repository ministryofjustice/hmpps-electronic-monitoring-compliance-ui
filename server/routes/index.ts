import { Router } from 'express'

import type { Services } from '../services'
import auditSearchRequest from '../middleware/auditSearchRequest'

import ruleConfigurationsRoutes from './ruleConfigurations'
import deviceComplianceRoutes from './deviceCompliance'

export enum Page {
  EXAMPLE_PAGE = 'EXAMPLE_PAGE',
  SEARCH_OFFENDERS = 'SEARCH_OFFENDERS',
}

export default function routes(services: Services): Router {
  const router = Router()

  router.get('/', async (_, res, _next) => {
    res.redirect('/device-compliance')
  })

  // Example of an audited route.
  router.post(
    '/perform-search',
    auditSearchRequest({ services, page: Page.SEARCH_OFFENDERS }),
    async (_req, res, _next) => {
      return res.redirect('/')
    },
  )

  router.use('/device-compliance', deviceComplianceRoutes(services.deviceComplianceService))
  router.use('/rule-configurations', ruleConfigurationsRoutes(services.ruleConfigurationService))

  return router
}

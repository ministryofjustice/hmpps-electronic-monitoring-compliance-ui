import { RequestHandler } from 'express'
import RuleConfigurationService from '../../services/ruleConfigurationService'

export default class RuleConfigurationsController {
  constructor(private readonly ruleConfigurationService: RuleConfigurationService) {}

  get: RequestHandler = async (_, res): Promise<void> => {
    const ruleConfigurations = await this.ruleConfigurationService.getRuleConfigurations()

    res.render('pages/ruleConfigurations/index', {
      ruleConfigurations,
    })
  }
}

import { RequestHandler } from 'express'
import RuleConfigurationService from '../../services/ruleConfigurationService'

export default class RuleConfigurationsController {
  constructor(private readonly ruleConfigurationService: RuleConfigurationService) {}

  get: RequestHandler<{ ruleConfigurationId: string }> = async (req, res) => {
    const ruleConfiguration = await this.ruleConfigurationService.getRuleConfiguration(req.params.ruleConfigurationId)

    res.render('pages/ruleConfigurations/detail', {
      ruleConfiguration,
    })
  }

  list: RequestHandler = async (_, res) => {
    const ruleConfigurations = await this.ruleConfigurationService.getRuleConfigurations()

    res.render('pages/ruleConfigurations/index', {
      ruleConfigurations,
    })
  }
}

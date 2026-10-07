import { RequestHandler } from 'express'
import RuleConfigurationService from '../../services/ruleConfigurationService'
import getRuleConfigurationFormDefinition from './ruleConfigurationFormDefinitions'
import parseRuleConfigurationForm from './ruleConfigurationFormParser'
import presentValidationErrorsByField from '../../presenters/validation'

type RuleConfigurationParams = {
  ruleConfigurationId: string
}

export default class RuleConfigurationsController {
  constructor(private readonly ruleConfigurationService: RuleConfigurationService) {}

  createDraft: RequestHandler<RuleConfigurationParams> = async (req, res) => {
    const sourceConfiguration = await this.ruleConfigurationService.getRuleConfiguration(req.params.ruleConfigurationId)
    const formDefinition = getRuleConfigurationFormDefinition(
      sourceConfiguration.ruleId,
      sourceConfiguration.ruleVersion,
    )
    const parseResult = parseRuleConfigurationForm(formDefinition, req.body)

    if (!parseResult.ok) {
      res.status(400).render('pages/ruleConfigurations/edit', {
        ruleConfiguration: sourceConfiguration,
        formDefinition,
        errors: presentValidationErrorsByField(parseResult.errors),
        values: req.body,
      })
      return
    }

    const ruleConfiguration = await this.ruleConfigurationService.createRuleConfigurationDraft(
      req.params.ruleConfigurationId,
      parseResult.value,
    )

    res.redirect(`/rule-configurations/${ruleConfiguration.id}`)
  }

  edit: RequestHandler<RuleConfigurationParams> = async (req, res) => {
    const ruleConfiguration = await this.ruleConfigurationService.getRuleConfiguration(req.params.ruleConfigurationId)
    const formDefinition = getRuleConfigurationFormDefinition(ruleConfiguration.ruleId, ruleConfiguration.ruleVersion)

    res.render('pages/ruleConfigurations/edit', {
      ruleConfiguration,
      formDefinition,
    })
  }

  get: RequestHandler<RuleConfigurationParams> = async (req, res) => {
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

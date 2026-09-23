import { RuleConfigurationFormDefinition } from './types/ruleConfigurationFormDefinition'
import { RuleId } from '../../types/ruleId'
import batteryLevelFormDefinition from './forms/batteryLevel'

const ruleConfigurationFormDefinitions: Record<RuleId, Record<string, RuleConfigurationFormDefinition>> = {
  BATTERY_LEVEL: batteryLevelFormDefinition,
}

const getRuleConfigurationFormDefinition = (ruleId: RuleId, ruleVersion: number): RuleConfigurationFormDefinition => {
  const definition = ruleConfigurationFormDefinitions[ruleId]?.[`v${ruleVersion}`]

  if (!definition) {
    throw new Error(`No form definition for ${ruleId} v${ruleVersion}`)
  }

  return definition
}

export default getRuleConfigurationFormDefinition

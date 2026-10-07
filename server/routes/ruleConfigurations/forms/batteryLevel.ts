import { RuleConfigurationFormDefinition } from '../types/ruleConfigurationFormDefinition'

const v1: RuleConfigurationFormDefinition = {
  fields: {
    parameters: [
      {
        name: 'threshold',
        label: 'Battery level threshold',
        hint: 'The battery percentage at or below which the device is non-compliant.',
        type: 'number',
        suffix: '%',
        min: 0,
        max: 100,
        width: 3,
      },
    ],
  },
}

const batteryLevelFormDefinition = {
  v1,
}

export default batteryLevelFormDefinition

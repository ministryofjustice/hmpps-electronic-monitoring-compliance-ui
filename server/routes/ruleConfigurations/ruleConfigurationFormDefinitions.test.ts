import getRuleConfigurationFormDefinition from './ruleConfigurationFormDefinitions'

describe('getRuleConfigurationFormDefinition', () => {
  it('returns the form definition for the rule version', () => {
    const result = getRuleConfigurationFormDefinition('BATTERY_LEVEL', 1)

    expect(result.fields.parameters[0]).toEqual(
      expect.objectContaining({
        name: 'threshold',
        type: 'number',
      }),
    )
  })

  it('throws when the rule version has no form definition', () => {
    expect(() => getRuleConfigurationFormDefinition('BATTERY_LEVEL', 2)).toThrow(
      'No form definition for BATTERY_LEVEL v2',
    )
  })
})

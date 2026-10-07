import parseRuleConfigurationForm from './ruleConfigurationFormParser'

describe('parseRuleConfigurationForm', () => {
  it('parses numeric parameter fields', () => {
    const result = parseRuleConfigurationForm(
      {
        fields: {
          parameters: [
            {
              name: 'threshold',
              label: 'Battery level threshold',
              type: 'number',
            },
          ],
        },
      },
      {
        threshold: '50',
      },
    )

    expect(result).toEqual({
      ok: true,
      value: {
        parameters: {
          threshold: 50,
        },
      },
    })
  })

  it('parses text parameter fields', () => {
    const result = parseRuleConfigurationForm(
      {
        fields: {
          parameters: [
            {
              name: 'name',
              label: 'Name',
              type: 'text',
            },
          ],
        },
      },
      {
        name: '  example  ',
      },
    )

    expect(result).toEqual({
      ok: true,
      value: {
        parameters: {
          name: 'example',
        },
      },
    })
  })

  it('returns an error when a numeric field is missing', () => {
    const result = parseRuleConfigurationForm(
      {
        fields: {
          parameters: [
            {
              name: 'threshold',
              label: 'Battery level threshold',
              type: 'number',
            },
          ],
        },
      },
      {},
    )

    expect(result).toEqual({
      ok: false,
      errors: [
        {
          field: 'threshold',
          message: 'Battery level threshold is required',
        },
      ],
    })
  })

  it('returns an error when a numeric field is not a number', () => {
    const result = parseRuleConfigurationForm(
      {
        fields: {
          parameters: [
            {
              name: 'threshold',
              label: 'Battery level threshold',
              type: 'number',
            },
          ],
        },
      },
      {
        threshold: 'foo',
      },
    )

    expect(result).toEqual({
      ok: false,
      errors: [
        {
          field: 'threshold',
          message: 'Battery level threshold must be a number',
        },
      ],
    })
  })

  it('returns an error when a numeric field is below the minimum', () => {
    const result = parseRuleConfigurationForm(
      {
        fields: {
          parameters: [
            {
              name: 'threshold',
              label: 'Battery level threshold',
              type: 'number',
              min: 0,
            },
          ],
        },
      },
      {
        threshold: '-1',
      },
    )

    expect(result).toEqual({
      ok: false,
      errors: [
        {
          field: 'threshold',
          message: 'Battery level threshold must be greater than 0',
        },
      ],
    })
  })

  it('returns an error when a numeric field is above the maximum', () => {
    const result = parseRuleConfigurationForm(
      {
        fields: {
          parameters: [
            {
              name: 'threshold',
              label: 'Battery level threshold',
              type: 'number',
              max: 100,
            },
          ],
        },
      },
      {
        threshold: '101',
      },
    )

    expect(result).toEqual({
      ok: false,
      errors: [
        {
          field: 'threshold',
          message: 'Battery level threshold must be less than 100',
        },
      ],
    })
  })

  it('returns multiple validation errors', () => {
    const result = parseRuleConfigurationForm(
      {
        fields: {
          parameters: [
            {
              name: 'minimum',
              label: 'Minimum',
              type: 'number',
            },
            {
              name: 'maximum',
              label: 'Maximum',
              type: 'number',
            },
          ],
        },
      },
      {
        minimum: '',
        maximum: 'foo',
      },
    )

    expect(result).toEqual({
      ok: false,
      errors: [
        {
          field: 'minimum',
          message: 'Minimum is required',
        },
        {
          field: 'maximum',
          message: 'Maximum must be a number',
        },
      ],
    })
  })
})

import { RuleConfigurationFormDefinition } from './types/ruleConfigurationFormDefinition'
import { RuleConfigurationRequest } from '../../types/ruleConfigurationRequest'
import { FieldParseResult } from './types/fieldParseResult'
import { ValidationError } from '../../types/validationError'
import { FieldDefinition } from './types/fieldDefinition'
import { ParseResult } from './types/parseResult'

const createValidationError =
  <T>(field: string) =>
  (message: string): FieldParseResult<T> => ({
    ok: false,
    error: {
      field,
      message,
    },
  })

const parseNumericField = (field: FieldDefinition, value: string | undefined): FieldParseResult<number> => {
  const createError = createValidationError<number>(field.name)

  if (!value) {
    return createError(`${field.label} is required`)
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return createError(`${field.label} must be a number`)
  }

  if (field.min !== undefined && parsed < field.min) {
    return createError(`${field.label} must be greater than ${field.min}`)
  }

  if (field.max !== undefined && parsed > field.max) {
    return createError(`${field.label} must be less than ${field.max}`)
  }

  return {
    ok: true,
    value: parsed,
  }
}

const parseTextField = (field: FieldDefinition, value: string | undefined): FieldParseResult<string> => {
  const createError = createValidationError<string>(field.name)

  if (!value) {
    return createError(`${field.label} is required`)
  }

  const parsed = value.trim()

  if (field.min !== undefined && parsed.length < field.min) {
    return createError(`${field.label} must be greater than ${field.min} characters`)
  }

  if (field.max !== undefined && parsed.length > field.max) {
    return createError(`${field.label} must be less than ${field.max} characters`)
  }

  return {
    ok: true,
    value: parsed,
  }
}

const parseField = (field: FieldDefinition, value: string | undefined): FieldParseResult<string | number> => {
  switch (field.type) {
    case 'number':
      return parseNumericField(field, value)

    case 'text':
      return parseTextField(field, value)

    default:
      throw new Error(`Unsupported field type for ${field.name}`)
  }
}

const parseParameters = (
  formDefinition: RuleConfigurationFormDefinition,
  body: Record<string, string | undefined>,
): ParseResult<Record<string, string | number>> => {
  const parameters: Record<string, string | number> = {}
  const errors: Array<ValidationError> = []

  for (const field of formDefinition.fields.parameters) {
    const result = parseField(field, body[field.name])

    if (result.ok) {
      parameters[field.name] = result.value
    } else {
      errors.push(result.error)
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    value: parameters,
  }
}

const parseRuleConfigurationForm = (
  formDefinition: RuleConfigurationFormDefinition,
  body: Record<string, string>,
): ParseResult<RuleConfigurationRequest> => {
  const result = parseParameters(formDefinition, body)

  if (result.ok) {
    return {
      ok: true,
      value: {
        parameters: result.value,
      },
    }
  }

  return { ok: false, errors: result.errors }
}

export default parseRuleConfigurationForm

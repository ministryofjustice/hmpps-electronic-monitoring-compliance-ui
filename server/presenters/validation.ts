import { ValidationError } from '../types/validationError'

const presentValidationErrorsByField = (errors: Array<ValidationError>) => {
  return errors.reduce(
    (acc, error) => ({
      ...acc,
      [error.field]: error.message,
    }),
    {} as Record<string, string>,
  )
}

export default presentValidationErrorsByField

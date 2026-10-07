import { ValidationError } from '../../../types/validationError'

export type FieldParseResult<T> =
  | {
      ok: true
      value: T
    }
  | {
      ok: false
      error: ValidationError
    }

import { ValidationError } from '../../../types/validationError'

export type ParseResult<T> =
  | {
      ok: true
      value: T
    }
  | {
      ok: false
      errors: Array<ValidationError>
    }

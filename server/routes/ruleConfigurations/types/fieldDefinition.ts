import { FieldType } from './fieldType'

export type FieldDefinition = {
  name: string
  label: string
  hint?: string
  type: FieldType
  suffix?: string
  min?: number
  max?: number
  width?: number
}

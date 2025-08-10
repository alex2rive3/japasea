import { useForm, type UseFormProps, type FieldValues } from 'react-hook-form'
import { AuthValidationUtils } from '../utils/authUtils'
import type { AuthFieldValidation } from '../types/auth.types'

interface UseAuthFormProps<T extends FieldValues> extends UseFormProps<T> {
  validationRules?: AuthFieldValidation
}

export function useAuthForm<T extends FieldValues>(props: UseAuthFormProps<T> = {}) {
  const { validationRules = AuthValidationUtils.getValidationRules(), ...formProps } = props

  const form = useForm<T>(formProps)

  const validateField = (fieldName: string, value: string, formValues?: T) => {
    const rule = validationRules[fieldName]
    if (!rule) return true

    if (rule.required && !value.trim()) {
      return rule.required
    }

    if (rule.minLength && value.length < rule.minLength.value) {
      return rule.minLength.message
    }

    if (rule.maxLength && value.length > rule.maxLength.value) {
      return rule.maxLength.message
    }

    if (rule.pattern && !rule.pattern.value.test(value)) {
      return rule.pattern.message
    }

    if (rule.validate) {
      const result = rule.validate(value, formValues)
      if (result !== true) {
        return typeof result === 'string' ? result : 'Valor inválido'
      }
    }

    return true
  }

  const getFieldRules = (fieldName: string) => {
    const rule = validationRules[fieldName]
    if (!rule) return {}

    const rules: any = {}

    if (rule.required) {
      rules.required = rule.required
    }

    if (rule.minLength) {
      rules.minLength = rule.minLength
    }

    if (rule.maxLength) {
      rules.maxLength = rule.maxLength
    }

    if (rule.pattern) {
      rules.pattern = rule.pattern
    }

    if (rule.validate) {
      rules.validate = (value: string) => rule.validate!(value, form.getValues())
    }

    return rules
  }

  return {
    ...form,
    validateField,
    getFieldRules
  }
}

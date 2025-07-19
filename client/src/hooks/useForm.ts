import { useForm as useReactHookForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Re-export useForm from react-hook-form with custom configurations
export { useForm } from 'react-hook-form'

// Custom hook for auth forms with predefined validations
export const useAuthForm = () => {
  return {
    loginSchema: yup.object({
      email: yup
        .string()
        .email('Ingrese un email válido')
        .required('El email es requerido'),
      password: yup
        .string()
        .required('La contraseña es requerida')
    }),
    
    registerSchema: yup.object({
      name: yup
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres')
        .required('El nombre es requerido'),
      email: yup
        .string()
        .email('Ingrese un email válido')
        .required('El email es requerido'),
      password: yup
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
        )
        .required('La contraseña es requerida'),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirme su contraseña'),
      phone: yup
        .string()
        .nullable()
        .notRequired()
    }),
    
    profileSchema: yup.object({
      name: yup
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres')
        .required('El nombre es requerido'),
      phone: yup
        .string()
        .nullable()
        .notRequired()
    }),
    
    changePasswordSchema: yup.object({
      currentPassword: yup
        .string()
        .required('La contraseña actual es requerida'),
      newPassword: yup
        .string()
        .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'La nueva contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
        )
        .required('La nueva contraseña es requerida'),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
        .required('Confirme la nueva contraseña')
    })
  }
}

// Hook personalizado para formularios con React Hook Form y Yup
import type { DefaultValues } from 'react-hook-form'

interface UseFormWithValidationOptions<T> {
  schema: yup.AnyObjectSchema
  defaultValues?: DefaultValues<T>
}

export const useFormWithValidation = <T extends Record<string, unknown>>({
  schema,
  defaultValues
}: UseFormWithValidationOptions<T>) => {
  return useReactHookForm<T>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange' // Validación en tiempo real
  })
}

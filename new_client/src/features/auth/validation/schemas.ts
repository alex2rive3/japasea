import * as yup from 'yup';

// Login validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Ingrese un email válido')
    .required('El email es requerido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
});

// Register validation schema
export const registerSchema = yup.object({
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
    .default('')
    .optional()
});

// Forgot password validation schema
export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Ingrese un email válido')
    .required('El email es requerido')
});

// Reset password validation schema
export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
    )
    .required('La nueva contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
    .required('Confirme su nueva contraseña')
});

// Change password validation schema
export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('La contraseña actual es requerida'),
  newPassword: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
    )
    .required('La nueva contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
    .required('Confirme su nueva contraseña')
});

// Profile update validation schema
export const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .required('El nombre es requerido'),
  phone: yup
    .string()
    .default('')
});

// Profile form schema for forms
export const profileFormSchema = yup.object({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .required('El nombre es requerido'),
  phone: yup
    .string()
    .default('')
});

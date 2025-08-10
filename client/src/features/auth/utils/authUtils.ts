import type { SxProps, Theme } from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon
} from '@mui/icons-material'
import type { AuthFieldConfig, AuthFieldValidation } from '../types/auth.types'

export class AuthStylesUtils {
  static getFormFieldStyles(): SxProps<Theme> {
    return {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: 'white',
        '& input': {
          backgroundColor: 'white !important',
          color: 'black !important',
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px white inset !important',
            WebkitTextFillColor: 'black !important',
            backgroundColor: 'white !important'
          },
          '&:-webkit-autofill:hover': {
            WebkitBoxShadow: '0 0 0 1000px white inset !important',
            WebkitTextFillColor: 'black !important',
            backgroundColor: 'white !important'
          },
          '&:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0 1000px white inset !important',
            WebkitTextFillColor: 'black !important',
            backgroundColor: 'white !important'
          },
          '&:-webkit-autofill:active': {
            WebkitBoxShadow: '0 0 0 1000px white inset !important',
            WebkitTextFillColor: 'black !important',
            backgroundColor: 'white !important'
          }
        }
      }
    }
  }

  static getContainerStyles(): SxProps<Theme> {
    return {
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'center',
      backgroundColor: '#f5f7fa',
      p: { xs: 2, sm: 3 },
      boxSizing: 'border-box',
      py: { xs: 3, sm: 3 }
    }
  }

  static getPaperStyles(): SxProps<Theme> {
    return {
      p: { xs: 3, sm: 4 },
      width: '100%',
      maxWidth: 480,
      borderRadius: 3,
      backgroundColor: 'white',
      mx: 'auto'
    }
  }

  static getHeaderStyles(): SxProps<Theme> {
    return {
      textAlign: 'center',
      mb: 4
    }
  }

  static getTitleStyles(): SxProps<Theme> {
    return {
      fontWeight: 700,
      color: 'primary.main',
      mb: 1,
      fontSize: { xs: '2rem', sm: '2.5rem' }
    }
  }

  static getSubtitleStyles(): SxProps<Theme> {
    return {
      fontWeight: 400,
      opacity: 0.8
    }
  }

  static getButtonStyles(): SxProps<Theme> {
    return {
      py: 1.8,
      borderRadius: 2,
      textTransform: 'none',
      fontSize: '1.1rem',
      fontWeight: 600,
      mt: 2,
      backgroundColor: 'primary.main',
      '&:hover': {
        backgroundColor: 'primary.dark'
      },
      '&:disabled': {
        opacity: 0.7
      }
    }
  }

  static getFormContainerStyles(): SxProps<Theme> {
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }

  static getLinkContainerStyles(): SxProps<Theme> {
    return {
      textAlign: 'center',
      mt: 3
    }
  }

  static getLinkStyles() {
    return {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: 600
    }
  }

  static getAlertStyles(): SxProps<Theme> {
    return {
      borderRadius: 2,
      mb: 1
    }
  }
}

export class AuthFieldsConfig {
  static getRegisterFields(): AuthFieldConfig[] {
    return [
      {
        name: 'name',
        label: 'Nombre completo',
        placeholder: 'Tu nombre completo',
        icon: PersonIcon,
        required: true,
        autoComplete: 'name'
      },
      {
        name: 'email',
        label: 'Email',
        placeholder: 'tu@email.com',
        type: 'email',
        icon: EmailIcon,
        required: true,
        autoComplete: 'email'
      },
      {
        name: 'phone',
        label: 'Teléfono (opcional)',
        placeholder: '+595 987 654 321',
        type: 'tel',
        icon: PhoneIcon,
        required: false,
        autoComplete: 'tel'
      },
      {
        name: 'password',
        label: 'Contraseña',
        placeholder: 'Mínimo 6 caracteres',
        type: 'password',
        icon: LockIcon,
        required: true,
        autoComplete: 'new-password'
      },
      {
        name: 'confirmPassword',
        label: 'Confirmar contraseña',
        placeholder: 'Repite tu contraseña',
        type: 'password',
        icon: LockIcon,
        required: true,
        autoComplete: 'new-password'
      }
    ]
  }

  static getLoginFields(): AuthFieldConfig[] {
    return [
      {
        name: 'email',
        label: 'Email',
        placeholder: 'tu@email.com',
        type: 'email',
        icon: EmailIcon,
        required: true,
        autoComplete: 'email'
      },
      {
        name: 'password',
        label: 'Contraseña',
        placeholder: 'Tu contraseña',
        type: 'password',
        icon: LockIcon,
        required: true,
        autoComplete: 'current-password'
      }
    ]
  }

  static getResetPasswordFields(): AuthFieldConfig[] {
    return [
      {
        name: 'email',
        label: 'Email',
        placeholder: 'tu@email.com',
        type: 'email',
        icon: EmailIcon,
        required: true,
        autoComplete: 'email'
      }
    ]
  }

  static getNewPasswordFields(): AuthFieldConfig[] {
    return [
      {
        name: 'password',
        label: 'Nueva contraseña',
        placeholder: 'Mínimo 6 caracteres',
        type: 'password',
        icon: LockIcon,
        required: true,
        autoComplete: 'new-password'
      },
      {
        name: 'confirmPassword',
        label: 'Confirmar contraseña',
        placeholder: 'Repite tu contraseña',
        type: 'password',
        icon: LockIcon,
        required: true,
        autoComplete: 'new-password'
      }
    ]
  }
}

export class AuthValidationUtils {
  static getValidationRules(): AuthFieldValidation {
    return {
      name: {
        required: 'El nombre es requerido',
        minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' },
        maxLength: { value: 50, message: 'El nombre no puede tener más de 50 caracteres' }
      },
      email: {
        required: 'El email es requerido',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Formato de email inválido'
        }
      },
      phone: {
        pattern: {
          value: /^[\+]?[\d\s\-\(\)]{8,}$/,
          message: 'Formato de teléfono inválido'
        }
      },
      password: {
        required: 'La contraseña es requerida',
        minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
      },
      confirmPassword: {
        required: 'La confirmación de contraseña es requerida',
        validate: (value: string, formValues?: any) => {
          if (formValues && value !== formValues.password) {
            return 'Las contraseñas no coinciden'
          }
          return true
        }
      },
      currentPassword: {
        required: 'La contraseña actual es requerida'
      },
      newPassword: {
        required: 'La nueva contraseña es requerida',
        minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
      }
    }
  }

  static validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword
  }

  static getPasswordStrength(password: string): { score: number; message: string } {
    let score = 0
    const checks = [
      { regex: /.{6,}/, points: 1 },
      { regex: /.{8,}/, points: 1 },
      { regex: /[a-z]/, points: 1 },
      { regex: /[A-Z]/, points: 1 },
      { regex: /[0-9]/, points: 1 },
      { regex: /[^A-Za-z0-9]/, points: 1 }
    ]

    checks.forEach(check => {
      if (check.regex.test(password)) {
        score += check.points
      }
    })

    const messages = {
      0: 'Muy débil',
      1: 'Muy débil',
      2: 'Débil',
      3: 'Regular',
      4: 'Buena',
      5: 'Fuerte',
      6: 'Muy fuerte'
    }

    return {
      score,
      message: messages[score as keyof typeof messages] || 'Muy débil'
    }
  }
}

export const AUTH_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  TOKEN_STORAGE_KEY: 'japasea_auth_token',
  USER_STORAGE_KEY: 'japasea_user_data'
} as const

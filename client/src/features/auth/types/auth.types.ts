export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ResetPasswordFormData {
  email: string
}

export interface NewPasswordFormData {
  password: string
  confirmPassword: string
}

export interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface AuthFormState {
  isLoading: boolean
  error: string | null
  success?: string | null
}

export interface PasswordVisibilityState {
  password: boolean
  confirmPassword: boolean
  currentPassword?: boolean
  newPassword?: boolean
}

export interface AuthFieldConfig {
  name: string
  label: string
  placeholder: string
  type?: 'text' | 'email' | 'password' | 'tel'
  icon: React.ElementType
  required?: boolean
  autoComplete?: string
}

export interface FormFieldProps {
  name: string
  control: any
  disabled?: boolean
  error?: any
  showPassword?: boolean
  onToggleVisibility?: () => void
  fieldConfig: AuthFieldConfig
}

export interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  showLogo?: boolean
}

export interface AuthFormProps {
  onSubmit: (data: any) => Promise<void>
  isLoading: boolean
  error?: string | null
  submitText: string
  loadingText: string
  children: React.ReactNode
}

export type AuthValidationRule = {
  required?: string
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
  validate?: (value: string, formValues?: any) => string | boolean
}

export interface AuthFieldValidation {
  [key: string]: AuthValidationRule
}

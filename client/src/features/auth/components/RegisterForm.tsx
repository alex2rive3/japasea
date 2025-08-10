import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useAuthForm } from '../hooks/useAuthForm'
import { usePasswordVisibility } from '../hooks/usePasswordVisibility'
import { useAuthFormState } from '../hooks/useAuthFormState'
import { AuthLayout } from './AuthLayout'
import { AuthForm } from './AuthForm'
import { AuthFormField } from './AuthFormField'
import { AuthLink } from './AuthLink'
import { AuthFieldsConfig } from '../utils/authUtils'
import type { RegisterFormData } from '../types/auth.types'
import type { RegisterData } from '../../../types/auth'

export function RegisterForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { isLoading, error, setError, setLoading } = useAuthFormState()
  
  const { visibility, toggleVisibility, showPassword } = usePasswordVisibility({
    fields: ['password', 'confirmPassword']
  })

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useAuthForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    }
  })

  const onSubmit = async (data: RegisterFormData) => {
    const registerData: RegisterData = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || undefined
    }
    
    try {
      setError(null)
      setLoading(true)
      await register(registerData)
      navigate('/', { replace: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const fields = AuthFieldsConfig.getRegisterFields()

  return (
    <AuthLayout subtitle="Crea tu cuenta">
      <AuthForm
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading || isSubmitting}
        error={error}
        submitText="Crear Cuenta"
        loadingText="Registrando..."
      >
        {fields.map((fieldConfig) => (
          <AuthFormField
            key={fieldConfig.name}
            name={fieldConfig.name}
            control={control}
            disabled={isLoading || isSubmitting}
            error={errors[fieldConfig.name as keyof RegisterFormData]}
            showPassword={showPassword(fieldConfig.name as keyof typeof visibility)}
            onToggleVisibility={
              fieldConfig.type === 'password' 
                ? () => toggleVisibility(fieldConfig.name as keyof typeof visibility)
                : undefined
            }
            fieldConfig={fieldConfig}
          />
        ))}
        
        <AuthLink
          text="¿Ya tienes una cuenta?"
          linkText="Inicia sesión"
          to="/login"
        />
      </AuthForm>
    </AuthLayout>
  )
}

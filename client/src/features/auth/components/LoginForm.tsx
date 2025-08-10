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
import type { LoginFormData } from '../types/auth.types'

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { isLoading, error, setError, setLoading } = useAuthFormState()
  
  const { visibility, toggleVisibility, showPassword } = usePasswordVisibility({
    fields: ['password']
  })

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useAuthForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)
      setLoading(true)
      await login({ email: data.email, password: data.password })
      navigate('/', { replace: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const fields = AuthFieldsConfig.getLoginFields()

  return (
    <AuthLayout subtitle="Bienvenido de vuelta">
      <AuthForm
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading || isSubmitting}
        error={error}
        submitText="Iniciar Sesión"
        loadingText="Iniciando sesión..."
      >
        {fields.map((fieldConfig) => (
          <AuthFormField
            key={fieldConfig.name}
            name={fieldConfig.name}
            control={control}
            disabled={isLoading || isSubmitting}
            error={errors[fieldConfig.name as keyof LoginFormData]}
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
          text="¿No tienes una cuenta?"
          linkText="Regístrate"
          to="/register"
        />
      </AuthForm>
    </AuthLayout>
  )
}

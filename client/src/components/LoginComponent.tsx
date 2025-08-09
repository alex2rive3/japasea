import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import { useFormWithValidation, loginSchema } from '../hooks/useForm'
import type { LoginCredentials } from '../types/auth'
import { authStyles, fieldVariants, quickStyles } from '../styles'
import { useTranslation } from 'react-i18next'

interface LoginFormData {
  email: string
  password: string
}

export function LoginComponent() {
  const navigate = useNavigate()
  const { login, isLoading, user, isAuthenticated } = useAuth()
  const { t } = useTranslation('auth')
  
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Si el usuario ya está autenticado, redirigir según su rol
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate])

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useFormWithValidation({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    const loginData: LoginCredentials = {
      email: data.email,
      password: data.password
    }
    
    try {
      setError('')
      const user = await login(loginData)
      
      // Definir ruta preferida según rol y navegar inmediatamente
      const preferredPath = user.role === 'admin' ? '/admin' : '/'
      sessionStorage.setItem('preferredPathAfterLogin', preferredPath)
      navigate(preferredPath, { replace: true })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('errors.networkError')
      setError(errorMessage)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box sx={authStyles.container}>
      <Paper elevation={3} sx={authStyles.paper}>
        <Box sx={authStyles.card}>
          <Box sx={authStyles.header}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1,
                fontSize: { xs: '2rem', sm: '2.5rem' }
              }}
            >
              {t('appName', { ns: 'common' })}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontWeight: 400,
                opacity: 0.8
              }}
            >
              {t('login.subtitle')}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={authStyles.form}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 2,
                  mb: 1 
                }}
              >
                {error}
              </Alert>
            )}

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  label="Email"
                  placeholder={t('login.emailPlaceholder')}
                  disabled={isLoading || isSubmitting}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                  sx={fieldVariants.authInput}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label={t('common.password', { ns: 'common' })}
                  placeholder={t('login.passwordPlaceholder')}
                  disabled={isLoading || isSubmitting}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          disabled={isLoading || isSubmitting}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={fieldVariants.authInput}
                />
              )}
            />

            <Box sx={{ textAlign: 'right', mb: 2 }}>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate('/forgot-password')}
                sx={{ 
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {t('login.forgotPassword')}
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading || isSubmitting}
              sx={authStyles.button}
            >
              {(isLoading || isSubmitting) ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={quickStyles.loadingIcon} />
                  {t('login.submit')}...
                </>
              ) : (
                t('login.submit')
              )}
            </Button>

            <Box sx={authStyles.link}>
              <Typography variant="body2" color="text.secondary">
                {t('login.noAccount')}{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  {t('login.signUp')}
                </Link>
              </Typography>
            </Box>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  )
}

export default LoginComponent

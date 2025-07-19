import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Controller, type FieldValues } from 'react-hook-form'
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
import { useFormWithValidation, useAuthForm } from '../hooks/useForm'
import type { LoginCredentials } from '../types/auth'

export function LoginComponent() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const { loginSchema } = useAuthForm()
  
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
      email: data.email as string,
      password: data.password as string
    }
    
    try {
      setError('')
      await login(loginData)
      navigate('/', { replace: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fa',
        p: { xs: 2, sm: 3 },
        boxSizing: 'border-box'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          backgroundColor: 'white',
          mx: 'auto'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
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
            Japasea
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontWeight: 400,
              opacity: 0.8
            }}
          >
            Bienvenido de vuelta
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
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
                  placeholder="tu@email.com"
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
                  sx={{
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
                  }}
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
                  label="Contraseña"
                  placeholder="Tu contraseña"
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
                  sx={{
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
                  }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading || isSubmitting}
              sx={{
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
              }}
            >
              {(isLoading || isSubmitting) ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes una cuenta?{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Regístrate
                </Link>
              </Typography>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default LoginComponent

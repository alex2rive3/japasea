import { useState } from 'react'
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
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import { useFormWithValidation, registerSchema } from '../hooks/useForm'
import type { RegisterData } from '../types/auth'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}

export function RegisterComponent() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useFormWithValidation({
    schema: registerSchema,
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
      setError('')
      await register(registerData)
      navigate('/', { replace: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
    }
  }

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'center',
        backgroundColor: '#f5f7fa',
        p: { xs: 2, sm: 3 },
        boxSizing: 'border-box',
        py: { xs: 3, sm: 3 }
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: 480,
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
            Crea tu cuenta
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nombre completo"
                  placeholder="Tu nombre completo"
                  disabled={isLoading || isSubmitting}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
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
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Teléfono (opcional)"
                  placeholder="+595 987 654 321"
                  disabled={isLoading || isSubmitting}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="primary" />
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
                  placeholder="Mínimo 6 caracteres"
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
                          onClick={() => togglePasswordVisibility('password')}
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

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirmar contraseña"
                  placeholder="Repite tu contraseña"
                  disabled={isLoading || isSubmitting}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                          edge="end"
                          disabled={isLoading || isSubmitting}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                  Registrando...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Inicia sesión
                </Link>
              </Typography>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

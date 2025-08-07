import React, { useState, useEffect } from 'react'
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
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff,
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'

export const ResetPasswordComponent: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      setError('Token de recuperación no válido')
      setTimeout(() => navigate('/login'), 3000)
    } else {
      setToken(tokenParam)
    }
  }, [searchParams, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validatePassword = (): boolean => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos')
      return false
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    if (!passwordRegex.test(formData.password)) {
      setError('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePassword()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await authService.resetPassword(token, formData.password)
      
      // Login automático después de resetear la contraseña
      if (response.token && response.refreshToken && response.user) {
        await login({
          token: response.token,
          refreshToken: response.refreshToken,
          user: response.user
        })
      }
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al restablecer la contraseña'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 440,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">
            ¡Contraseña Restablecida!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tu contraseña se ha actualizado exitosamente. 
            Serás redirigido en unos segundos...
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 440,
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Nueva Contraseña
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Crea una nueva contraseña para tu cuenta
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="password"
            label="Nueva Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="Mínimo 6 caracteres, con mayúscula, minúscula y número"
          />

          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirmar Contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Restablecer Contraseña'
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
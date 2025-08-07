import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress,
  Button,
  Alert
} from '@mui/material'
import { 
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'

export const VerifyEmailComponent: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { refreshUser } = useAuth()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setStatus('error')
        setMessage('Token de verificación no válido')
        return
      }

      try {
        const response = await authService.verifyEmail(token)
        setStatus('success')
        setMessage(response.message || 'Email verificado exitosamente')
        
        // Actualizar información del usuario
        try {
          await refreshUser()
        } catch (error) {
          console.error('Error actualizando usuario:', error)
        }
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } catch (err) {
        setStatus('error')
        const errorMessage = err instanceof Error ? err.message : 'Error al verificar email'
        setMessage(errorMessage)
      }
    }

    verifyEmail()
  }, [searchParams, navigate, refreshUser])

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
        {status === 'loading' && (
          <>
            <CircularProgress size={64} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Verificando tu email...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Por favor espera mientras confirmamos tu dirección de email.
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon 
              sx={{ 
                fontSize: 64, 
                color: 'success.main', 
                mb: 2 
              }} 
            />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              ¡Email Verificado!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Serás redirigido automáticamente en unos segundos...
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              fullWidth
            >
              Ir al inicio
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorIcon 
              sx={{ 
                fontSize: 64, 
                color: 'error.main', 
                mb: 2 
              }} 
            />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Error de Verificación
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              El enlace de verificación puede haber expirado o ser inválido.
            </Alert>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                fullWidth
              >
                Iniciar sesión
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                fullWidth
              >
                Ir al inicio
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  )
}
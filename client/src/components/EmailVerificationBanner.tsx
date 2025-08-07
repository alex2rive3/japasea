import React, { useState } from 'react'
import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
} from '@mui/material'
import {
  Close as CloseIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'

export const EmailVerificationBanner: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [dismissed, setDismissed] = useState(false)

  // No mostrar si no hay usuario, el email está verificado o fue descartado
  if (!user || user.isEmailVerified || dismissed) {
    return null
  }

  const handleResendEmail = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await authService.resendVerificationEmail()
      setMessage(response.message || 'Email de verificación enviado exitosamente')
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setMessage('')
      }, 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar email'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    // Guardar en localStorage para no mostrar de nuevo en esta sesión
    sessionStorage.setItem('emailVerificationDismissed', 'true')
  }

  return (
    <Collapse in={!dismissed}>
      <Alert
        severity="warning"
        sx={{
          mb: 2,
          '& .MuiAlert-action': {
            alignItems: 'flex-start',
          },
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleDismiss}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon />
          Verifica tu email
        </AlertTitle>
        
        <div>
          Tu cuenta está activa, pero necesitas verificar tu email para acceder a todas las funciones.
        </div>

        {message && (
          <Alert
            severity="success"
            sx={{ mt: 2 }}
            icon={<CheckCircleIcon />}
          >
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          size="small"
          variant="outlined"
          onClick={handleResendEmail}
          disabled={loading}
          sx={{ mt: 2 }}
          startIcon={loading ? <CircularProgress size={16} /> : <EmailIcon />}
        >
          {loading ? 'Enviando...' : 'Reenviar email de verificación'}
        </Button>
      </Alert>
    </Collapse>
  )
}

// Componente para mostrar cuando el email está verificado
export const EmailVerifiedBadge: React.FC = () => {
  const { user } = useAuth()

  if (!user || !user.isEmailVerified) {
    return null
  }

  return (
    <Alert
      severity="success"
      sx={{
        py: 0.5,
        '& .MuiAlert-icon': {
          py: 0,
        },
      }}
      icon={<CheckCircleIcon />}
    >
      Email verificado
    </Alert>
  )
}
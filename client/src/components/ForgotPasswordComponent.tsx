import React, { useState } from 'react'
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Link,
  CircularProgress
} from '@mui/material'
import { Email as EmailIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

export const ForgotPasswordComponent: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Por favor ingresa tu email')
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      await authService.forgotPassword(email)
      setEmailSent(true)
      setMessage('Se ha enviado un email con instrucciones para restablecer tu contraseña')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar el email'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
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
            Recuperar Contraseña
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {emailSent 
              ? 'Revisa tu correo electrónico'
              : 'Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña'
            }
          </Typography>
        </Box>

        {message && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!emailSent ? (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              autoComplete="email"
              autoFocus
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
                'Enviar Instrucciones'
              )}
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Si existe una cuenta asociada a <strong>{email}</strong>, 
              recibirás un email con un enlace para restablecer tu contraseña.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              El enlace expirará en 1 hora por razones de seguridad.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setEmailSent(false)
                setEmail('')
                setMessage('')
              }}
            >
              Enviar otro email
            </Button>
          </Box>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/login')}
            sx={{ 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <ArrowBackIcon fontSize="small" />
            Volver a iniciar sesión
          </Link>
        </Box>
      </Paper>
    </Box>
  )
}
import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material'
import {
  Lock as LockIcon,
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useAuth } from '../../../hooks/useAuth'
import type { ChangePasswordData } from '../../../types/auth'

export function PasswordChangeForm() {
  const { changePassword } = useAuth()
  
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: ''
  })
  
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handlePasswordChange = (field: keyof ChangePasswordData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData(prev => ({
        ...prev,
        [field]: event.target.value
      }))
    }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError('Todos los campos son requeridos')
      return
    }

    if (passwordData.newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsChangingPassword(true)
    setError('')
    setMessage('')

    try {
      await changePassword(passwordData)
      setMessage('Contraseña cambiada exitosamente')
      setPasswordData({ currentPassword: '', newPassword: '' })
      setConfirmPassword('')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error cambiando contraseña'
      setError(errorMessage)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => () => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(prev => !prev)
        break
      case 'new':
        setShowNewPassword(prev => !prev)
        break
      case 'confirm':
        setShowConfirmPassword(prev => !prev)
        break
    }
  }

  return (
    <Box>
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3} sx={{ maxWidth: 400 }}>
        <TextField
          fullWidth
          label="Contraseña actual"
          type={showCurrentPassword ? 'text' : 'password'}
          value={passwordData.currentPassword}
          onChange={handlePasswordChange('currentPassword')}
          InputProps={{
            startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility('current')}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          disabled={isChangingPassword}
          required
        />

        <TextField
          fullWidth
          label="Nueva contraseña"
          type={showNewPassword ? 'text' : 'password'}
          value={passwordData.newPassword}
          onChange={handlePasswordChange('newPassword')}
          InputProps={{
            startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility('new')}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          disabled={isChangingPassword}
          required
          helperText="Mínimo 6 caracteres"
        />

        <TextField
          fullWidth
          label="Confirmar nueva contraseña"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility('confirm')}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          disabled={isChangingPassword}
          required
        />

        <Box>
          <Button
            variant="contained"
            startIcon={isChangingPassword ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            sx={{ mt: 2 }}
          >
            {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

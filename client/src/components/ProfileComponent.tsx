import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import type { UpdateProfileData, ChangePasswordData } from '../types/auth'
import { profileStyles } from '../styles'

export function ProfileComponent() {
  const { user, updateProfile, changePassword, logout, isLoading } = useAuth()
  
  const [profileData, setProfileData] = useState<UpdateProfileData>({
    name: user?.name || '',
    phone: user?.phone || ''
  })
  
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: ''
  })
  
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        phone: user.phone || ''
      })
    }
  }, [user])

  const handleProfileChange = (field: keyof UpdateProfileData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData(prev => ({
        ...prev,
        [field]: event.target.value
      }))
      if (message || error) {
        setMessage('')
        setError('')
      }
    }

  const handlePasswordChange = (field: keyof ChangePasswordData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData(prev => ({
        ...prev,
        [field]: event.target.value
      }))
    }

  const handleUpdateProfile = async () => {
    if (!profileData.name?.trim()) {
      setError('El nombre es requerido')
      return
    }

    try {
      setIsUpdating(true)
      setError('')
      await updateProfile(profileData)
      setMessage('Perfil actualizado exitosamente')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error actualizando perfil'
      setError(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError('Todos los campos de contraseña son requeridos')
      return
    }

    if (passwordData.newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    if (!passwordRegex.test(passwordData.newPassword)) {
      setError('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número')
      return
    }

    try {
      setIsChangingPassword(true)
      setError('')
      await changePassword(passwordData)
      setMessage('Contraseña cambiada exitosamente')
      setPasswordData({ currentPassword: '', newPassword: '' })
      setConfirmPassword('')
      setShowPasswordDialog(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error cambiando contraseña'
      setError(errorMessage)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error durante logout:', error)
    }
  }

  if (!user) {
    return (
      <Box sx={profileStyles.container}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={profileStyles.paper}>
      <Paper elevation={3} sx={profileStyles.card}>
        <Box sx={profileStyles.header}>
          
          <Typography variant="h4" component="h1" sx={profileStyles.title}>
            Mi Perfil
          </Typography>
          <Box sx={profileStyles.userInfo}>
            <Chip
              label={user.role === 'admin' ? 'Administrador' : 'Usuario'}
              color={user.role === 'admin' ? 'secondary' : 'primary'}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Miembro desde: {new Date(user.createdAt).toLocaleDateString('es-ES')}
          </Typography>
        </Box>

        {(message || error) && (
          <Alert 
            severity={message ? 'success' : 'error'} 
            sx={{ mb: 3 }}
            onClose={() => {
              setMessage('')
              setError('')
            }}
          >
            {message || error}
          </Alert>
        )}

        {/* Información del Perfil */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            Información Personal
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Nombre completo"
              value={profileData.name}
              onChange={handleProfileChange('name')}
              disabled={isUpdating}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            <TextField
              fullWidth
              label="Email"
              value={user.email}
              disabled
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              helperText="El email no se puede cambiar"
            />

            <TextField
              fullWidth
              label="Teléfono (opcional)"
              value={profileData.phone}
              onChange={handleProfileChange('phone')}
              disabled={isUpdating}
              placeholder="+595 987 654 321"
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            <Button
              variant="contained"
              onClick={handleUpdateProfile}
              disabled={isUpdating || isLoading}
              startIcon={isUpdating ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{ alignSelf: 'flex-start' }}
            >
              {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Acciones de Seguridad */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon color="primary" />
            Seguridad
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setShowPasswordDialog(true)}
              startIcon={<LockIcon />}
            >
              Cambiar Contraseña
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Dialog para cambiar contraseña */}
      <Dialog 
        open={showPasswordDialog} 
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Contraseña actual"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange('currentPassword')}
              disabled={isChangingPassword}
            />

            <TextField
              fullWidth
              type="password"
              label="Nueva contraseña"
              value={passwordData.newPassword}
              onChange={handlePasswordChange('newPassword')}
              disabled={isChangingPassword}
              helperText="Mínimo 6 caracteres con mayúscula, minúscula y número"
            />

            <TextField
              fullWidth
              type="password"
              label="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isChangingPassword}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowPasswordDialog(false)}
            disabled={isChangingPassword}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained"
            disabled={isChangingPassword}
            startIcon={isChangingPassword ? <CircularProgress size={20} /> : undefined}
          >
            {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

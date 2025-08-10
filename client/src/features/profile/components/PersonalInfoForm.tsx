import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { useAuth } from '../../../hooks/useAuth'
import type { UpdateProfileData } from '../../../types/auth'

export function PersonalInfoForm() {
  const { user, updateProfile, isLoading } = useAuth()
  
  const [profileData, setProfileData] = useState<UpdateProfileData>({
    name: user?.name || '',
    phone: user?.phone || ''
  })
  
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleProfileChange = (field: keyof UpdateProfileData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData(prev => ({
        ...prev,
        [field]: event.target.value
      }))
    }

  const handleUpdateProfile = async () => {
    if (!profileData.name?.trim()) {
      setError('El nombre es requerido')
      return
    }

    setIsUpdating(true)
    setError('')
    setMessage('')

    try {
      await updateProfile(profileData)
      setMessage('Perfil actualizado exitosamente')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error actualizando perfil'
      setError(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return <CircularProgress />
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

      <Stack spacing={3}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <TextField
              fullWidth
              label="Nombre completo"
              value={profileData.name}
              onChange={handleProfileChange('name')}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              disabled={isUpdating}
              required
            />
          </Box>

          <Box sx={{ flex: '1 1 300px' }}>
            <TextField
              fullWidth
              label="Email"
              value={user?.email || ''}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                readOnly: true
              }}
              disabled
              helperText="El email no se puede modificar"
            />
          </Box>
        </Box>

        <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <TextField
            fullWidth
            label="Teléfono"
            value={profileData.phone}
            onChange={handleProfileChange('phone')}
            InputProps={{
              startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            disabled={isUpdating}
            placeholder="+595 xxx xxx xxx"
          />
        </Box>

        <Box>
          <Button
            variant="contained"
            startIcon={isUpdating ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleUpdateProfile}
            disabled={isUpdating}
            sx={{ mt: 2 }}
          >
            {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

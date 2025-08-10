import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Stack
} from '@mui/material'
import type { SecuritySettings } from '../types/adminSettings.types'

interface SecuritySettingsFormProps {
  settings: SecuritySettings
  onChange: (settings: SecuritySettings) => void
}

export const SecuritySettingsForm = ({ settings, onChange }: SecuritySettingsFormProps) => {
  const handleTextChange = (field: keyof SecuritySettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'maxLoginAttempts' || field === 'sessionTimeout' || field === 'passwordMinLength'
      ? parseInt(event.target.value) || 0
      : event.target.value

    onChange({
      ...settings,
      [field]: value
    })
  }

  const handleSwitchChange = (field: keyof SecuritySettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...settings,
      [field]: event.target.checked
    })
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        <TextField
          fullWidth
          type="number"
          label="Intentos máximos de login"
          value={settings.maxLoginAttempts}
          onChange={handleTextChange('maxLoginAttempts')}
          inputProps={{ min: 1, max: 10 }}
          helperText="Entre 1 y 10 intentos"
        />
        <TextField
          fullWidth
          type="number"
          label="Tiempo de sesión (minutos)"
          value={settings.sessionTimeout}
          onChange={handleTextChange('sessionTimeout')}
          inputProps={{ min: 5, max: 1440 }}
          helperText="Entre 5 y 1440 minutos"
        />
      </Box>
      
      <TextField
        fullWidth
        type="number"
        label="Longitud mínima de contraseña"
        value={settings.passwordMinLength}
        onChange={handleTextChange('passwordMinLength')}
        inputProps={{ min: 6, max: 32 }}
        helperText="Entre 6 y 32 caracteres"
        sx={{ maxWidth: { md: '50%' } }}
      />
      
      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.requireStrongPassword}
              onChange={handleSwitchChange('requireStrongPassword')}
            />
          }
          label="Requerir contraseñas fuertes (mayúsculas, números, símbolos)"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.enable2FA}
              onChange={handleSwitchChange('enable2FA')}
            />
          }
          label="Habilitar autenticación de dos factores (2FA)"
        />
      </Stack>
    </Stack>
  )
}

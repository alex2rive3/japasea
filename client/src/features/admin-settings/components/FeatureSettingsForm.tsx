import {
  Stack,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch
} from '@mui/material'
import type { FeatureSettings } from '../types/adminSettings.types'

interface FeatureSettingsFormProps {
  settings: FeatureSettings
  onChange: (settings: FeatureSettings) => void
}

export const FeatureSettingsForm = ({ settings, onChange }: FeatureSettingsFormProps) => {
  const handleSwitchChange = (field: keyof FeatureSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...settings,
      [field]: event.target.checked
    })
  }

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Registro y Autenticación
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableRegistration}
                  onChange={handleSwitchChange('enableRegistration')}
                />
              }
              label="Permitir registro de nuevos usuarios"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.requireEmailVerification}
                  onChange={handleSwitchChange('requireEmailVerification')}
                  disabled={!settings.enableRegistration}
                />
              }
              label="Requerir verificación de email"
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidades
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableReviews}
                  onChange={handleSwitchChange('enableReviews')}
                />
              }
              label="Habilitar sistema de reseñas"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.moderateReviews}
                  onChange={handleSwitchChange('moderateReviews')}
                  disabled={!settings.enableReviews}
                />
              }
              label="Moderar reseñas antes de publicar"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableFavorites}
                  onChange={handleSwitchChange('enableFavorites')}
                />
              }
              label="Habilitar favoritos"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableChat}
                  onChange={handleSwitchChange('enableChat')}
                />
              }
              label="Habilitar chat con IA"
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

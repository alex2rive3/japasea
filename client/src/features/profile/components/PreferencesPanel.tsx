import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Stack,
  Card,
  CardContent,
} from '@mui/material'
import {
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material'
import { usePreferences } from '../hooks/usePreferences'

export function PreferencesPanel() {
  const { preferences, updatePreference, updateNotificationPreference } = usePreferences()

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Idioma y Región</Typography>
          </Box>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Idioma</InputLabel>
            <Select
              value={preferences.language}
              label="Idioma"
              onChange={(e) => updatePreference('language', e.target.value as 'es' | 'en')}
            >
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PaletteIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Apariencia</Typography>
          </Box>
          
          <FormControl fullWidth>
            <InputLabel>Tema</InputLabel>
            <Select
              value={preferences.theme}
              label="Tema"
              onChange={(e) => updatePreference('theme', e.target.value as 'light' | 'dark')}
            >
              <MenuItem value="light">Claro</MenuItem>
              <MenuItem value="dark">Oscuro</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Notificaciones</Typography>
          </Box>
          
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications.email}
                  onChange={(e) => updateNotificationPreference('email', e.target.checked)}
                />
              }
              label="Notificaciones por email"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications.push}
                  onChange={(e) => updateNotificationPreference('push', e.target.checked)}
                />
              }
              label="Notificaciones push"
            />
            
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Notificaciones específicas
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications.places}
                  onChange={(e) => updateNotificationPreference('places', e.target.checked)}
                />
              }
              label="Nuevos lugares agregados"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications.favorites}
                  onChange={(e) => updateNotificationPreference('favorites', e.target.checked)}
                />
              }
              label="Actualizaciones de favoritos"
            />
          </FormGroup>
        </CardContent>
      </Card>
    </Stack>
  )
}

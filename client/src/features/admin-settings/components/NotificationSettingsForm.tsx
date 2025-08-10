import {
  Stack,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
  TextField
} from '@mui/material'
import type { NotificationSettings } from '../types/adminSettings.types'

interface NotificationSettingsFormProps {
  settings: NotificationSettings
  onChange: (settings: NotificationSettings) => void
}

export const NotificationSettingsForm = ({ settings, onChange }: NotificationSettingsFormProps) => {
  const handleSwitchChange = (field: keyof NotificationSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...settings,
      [field]: event.target.checked
    })
  }

  const handleTextChange = (field: keyof NotificationSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...settings,
      [field]: event.target.value
    })
  }

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Canales de Notificación
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleSwitchChange('emailNotifications')}
                />
              }
              label="Notificaciones por email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={handleSwitchChange('pushNotifications')}
                />
              }
              label="Notificaciones push"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.smsNotifications}
                  onChange={handleSwitchChange('smsNotifications')}
                />
              }
              label="Notificaciones SMS"
            />
          </Stack>
        </CardContent>
      </Card>

      <TextField
        fullWidth
        label="Email para notificaciones del sistema"
        type="email"
        value={settings.notificationEmail}
        onChange={handleTextChange('notificationEmail')}
        disabled={!settings.emailNotifications}
        helperText="Email donde se enviarán las notificaciones administrativas"
      />
    </Stack>
  )
}

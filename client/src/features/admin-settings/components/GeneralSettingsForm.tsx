import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import type { GeneralSettings } from '../types/adminSettings.types'
import { LANGUAGE_OPTIONS } from '../types/adminSettings.types'

interface GeneralSettingsFormProps {
  settings: GeneralSettings
  onChange: (settings: GeneralSettings) => void
}

export const GeneralSettingsForm = ({ settings, onChange }: GeneralSettingsFormProps) => {
  const handleChange = (field: keyof GeneralSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...settings,
      [field]: event.target.value
    })
  }

  const handleSelectChange = (field: keyof GeneralSettings) => (
    event: SelectChangeEvent<string>
  ) => {
    onChange({
      ...settings,
      [field]: event.target.value
    })
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        <TextField
          fullWidth
          label="Nombre del sitio"
          value={settings.siteName}
          onChange={handleChange('siteName')}
          required
          helperText="Nombre que aparecerá en el título del sitio"
        />
        <TextField
          fullWidth
          label="Email de contacto"
          type="email"
          value={settings.contactEmail}
          onChange={handleChange('contactEmail')}
          required
          helperText="Email principal para contacto con usuarios"
        />
      </Box>
      
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Descripción del sitio"
        value={settings.siteDescription}
        onChange={handleChange('siteDescription')}
        required
        helperText="Descripción que aparecerá en metadatos y resultados de búsqueda"
      />
      
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        <TextField
          fullWidth
          label="Teléfono de soporte"
          value={settings.supportPhone}
          onChange={handleChange('supportPhone')}
          helperText="Número de teléfono para soporte técnico"
        />
        <FormControl fullWidth>
          <InputLabel>Idioma predeterminado</InputLabel>
          <Select
            value={settings.defaultLanguage}
            onChange={handleSelectChange('defaultLanguage')}
            label="Idioma predeterminado"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <TextField
        fullWidth
        label="Zona horaria"
        value={settings.timezone}
        onChange={handleChange('timezone')}
        helperText="Zona horaria del servidor (formato: America/Asuncion)"
      />
    </Stack>
  )
}

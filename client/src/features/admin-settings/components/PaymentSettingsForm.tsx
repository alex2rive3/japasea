import {
  Stack,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Alert
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import type { PaymentSettings } from '../types/adminSettings.types'
import { PAYMENT_GATEWAY_OPTIONS, CURRENCY_OPTIONS } from '../types/adminSettings.types'

interface PaymentSettingsFormProps {
  settings: PaymentSettings
  onChange: (settings: PaymentSettings) => void
}

export const PaymentSettingsForm = ({ settings, onChange }: PaymentSettingsFormProps) => {
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      enablePayments: event.target.checked
    })
  }

  const handleSelectChange = (field: keyof PaymentSettings) => (
    event: SelectChangeEvent<string>
  ) => {
    onChange({
      ...settings,
      [field]: event.target.value
    })
  }

  const handleNumberChange = (field: keyof PaymentSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'commission'
      ? parseFloat(event.target.value) || 0
      : event.target.value

    onChange({
      ...settings,
      [field]: value
    })
  }

  return (
    <Stack spacing={3}>
      <FormControlLabel
        control={
          <Switch
            checked={settings.enablePayments}
            onChange={handleSwitchChange}
          />
        }
        label="Habilitar sistema de pagos"
      />
      
      {!settings.enablePayments && (
        <Alert severity="info">
          Los pagos están deshabilitados. Activa esta opción para configurar los detalles del sistema de pagos.
        </Alert>
      )}
      
      {settings.enablePayments && (
        <Stack spacing={3}>
          <Typography variant="h6" color="primary">
            Configuración de Pagos
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel>Pasarela de pago</InputLabel>
            <Select
              value={settings.paymentGateway}
              onChange={handleSelectChange('paymentGateway')}
              label="Pasarela de pago"
            >
              {PAYMENT_GATEWAY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Moneda</InputLabel>
            <Select
              value={settings.currency}
              onChange={handleSelectChange('currency')}
              label="Moneda"
            >
              {CURRENCY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            type="number"
            label="Comisión (%)"
            value={settings.commission}
            onChange={handleNumberChange('commission')}
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            helperText="Porcentaje de comisión sobre las transacciones (0-100%)"
          />
          
          <Alert severity="warning">
            <strong>Importante:</strong> Asegúrate de configurar correctamente las credenciales de la pasarela de pago 
            en las variables de entorno del servidor antes de habilitar los pagos en producción.
          </Alert>
        </Stack>
      )}
    </Stack>
  )
}

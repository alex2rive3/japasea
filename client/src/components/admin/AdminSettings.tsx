import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Switch,
  Button,
  Divider,
  Alert,
  Grid,
  Card,
  CardContent,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material'
import {
  Save as SaveIcon,
  Restore as RestoreIcon,
  Email as EmailIcon,
  Notifications as NotificationIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Payment as PaymentIcon
} from '@mui/icons-material'
import { adminService } from '../../services/adminService'

interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    supportPhone: string
    defaultLanguage: string
    timezone: string
  }
  features: {
    enableRegistration: boolean
    requireEmailVerification: boolean
    enableReviews: boolean
    moderateReviews: boolean
    enableFavorites: boolean
    enableChat: boolean
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    notificationEmail: string
  }
  security: {
    maxLoginAttempts: number
    sessionTimeout: number
    passwordMinLength: number
    requireStrongPassword: boolean
    enable2FA: boolean
  }
  payment: {
    enablePayments: boolean
    paymentGateway: string
    currency: string
    commission: number
  }
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'Japasea',
      siteDescription: 'Descubre los mejores lugares de Paraguay',
      contactEmail: 'contacto@japasea.com',
      supportPhone: '+595 21 123 456',
      defaultLanguage: 'es',
      timezone: 'America/Asuncion'
    },
    features: {
      enableRegistration: true,
      requireEmailVerification: true,
      enableReviews: true,
      moderateReviews: true,
      enableFavorites: true,
      enableChat: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      notificationEmail: 'notificaciones@japasea.com'
    },
    security: {
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireStrongPassword: true,
      enable2FA: false
    },
    payment: {
      enablePayments: false,
      paymentGateway: 'stripe',
      currency: 'PYG',
      commission: 10
    }
  })
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const data = await adminService.getSystemSettings()
      // Mapear los datos del backend al formato esperado por el frontend
      if (data) {
        setSettings({
          general: {
            siteName: data.general?.siteName || 'Japasea',
            siteDescription: data.general?.siteDescription || 'Descubre los mejores lugares de Paraguay',
            contactEmail: data.general?.contactEmail || 'contacto@japasea.com',
            supportPhone: data.general?.supportPhone || '+595 21 123 456',
            defaultLanguage: data.general?.defaultLanguage || 'es',
            timezone: data.general?.timezone || 'America/Asuncion'
          },
          features: {
            enableRegistration: data.features?.registration ?? true,
            requireEmailVerification: data.features?.emailVerification ?? true,
            enableReviews: data.features?.reviews ?? true,
            moderateReviews: true, // No está en el backend
            enableFavorites: data.features?.favorites ?? true,
            enableChat: data.features?.chat ?? true
          },
          notifications: {
            emailNotifications: data.notifications?.email?.enabled ?? true,
            pushNotifications: data.notifications?.push?.enabled ?? false,
            smsNotifications: data.notifications?.sms?.enabled ?? false,
            notificationEmail: data.general?.contactEmail || 'noreply@japasea.com'
          },
          security: {
            maxLoginAttempts: data.security?.maxLoginAttempts || 5,
            sessionTimeout: data.security?.sessionTimeout || 3600,
            passwordMinLength: data.security?.passwordMinLength || 8,
            requireStrongPassword: true, // No está en el backend
            enable2FA: data.security?.require2FA ?? false
          },
          payment: {
            enablePayments: data.payments?.enabled ?? false,
            paymentGateway: data.payments?.gateway || 'mercadopago',
            currency: data.payments?.currency || 'PYG',
            commission: data.payments?.commission || 10
          }
        })
      }
    } catch (error) {
      console.error('Error cargando configuración:', error)
      // Si hay error, mantener los valores por defecto
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    setSaveSuccess(false)
    try {
      await adminService.updateSystemSettings(settings)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error guardando configuración:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetSettings = () => {
    if (window.confirm('¿Estás seguro de restaurar la configuración predeterminada?')) {
      loadSettings()
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Configuración del Sistema</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={handleResetSettings}
          >
            Restaurar
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            disabled={loading}
          >
            Guardar Cambios
          </Button>
        </Stack>
      </Stack>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Configuración guardada exitosamente
        </Alert>
      )}

      <Paper>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="General" icon={<LanguageIcon />} iconPosition="start" />
          <Tab label="Características" icon={<NotificationIcon />} iconPosition="start" />
          <Tab label="Notificaciones" icon={<EmailIcon />} iconPosition="start" />
          <Tab label="Seguridad" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="Pagos" icon={<PaymentIcon />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab General */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del sitio"
                  value={settings.general.siteName}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, siteName: e.target.value }
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email de contacto"
                  value={settings.general.contactEmail}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, contactEmail: e.target.value }
                  }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descripción del sitio"
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, siteDescription: e.target.value }
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono de soporte"
                  value={settings.general.supportPhone}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, supportPhone: e.target.value }
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Idioma predeterminado</InputLabel>
                  <Select
                    value={settings.general.defaultLanguage}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, defaultLanguage: e.target.value }
                    }))}
                  >
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="en">Inglés</MenuItem>
                    <MenuItem value="pt">Portugués</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Tab Características */}
          {activeTab === 1 && (
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Registro y Autenticación</Typography>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.features.enableRegistration}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            features: { ...prev.features, enableRegistration: e.target.checked }
                          }))}
                        />
                      }
                      label="Permitir registro de nuevos usuarios"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.features.requireEmailVerification}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            features: { ...prev.features, requireEmailVerification: e.target.checked }
                          }))}
                        />
                      }
                      label="Requerir verificación de email"
                    />
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Funcionalidades</Typography>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.features.enableReviews}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            features: { ...prev.features, enableReviews: e.target.checked }
                          }))}
                        />
                      }
                      label="Habilitar sistema de reseñas"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.features.moderateReviews}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            features: { ...prev.features, moderateReviews: e.target.checked }
                          }))}
                          disabled={!settings.features.enableReviews}
                        />
                      }
                      label="Moderar reseñas antes de publicar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.features.enableFavorites}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            features: { ...prev.features, enableFavorites: e.target.checked }
                          }))}
                        />
                      }
                      label="Habilitar favoritos"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.features.enableChat}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            features: { ...prev.features, enableChat: e.target.checked }
                          }))}
                        />
                      }
                      label="Habilitar chat con IA"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Tab Notificaciones */}
          {activeTab === 2 && (
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Canales de Notificación</Typography>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, emailNotifications: e.target.checked }
                          }))}
                        />
                      }
                      label="Notificaciones por email"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.pushNotifications}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, pushNotifications: e.target.checked }
                          }))}
                        />
                      }
                      label="Notificaciones push"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.smsNotifications}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, smsNotifications: e.target.checked }
                          }))}
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
                value={settings.notifications.notificationEmail}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, notificationEmail: e.target.value }
                }))}
              />
            </Stack>
          )}

          {/* Tab Seguridad */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Intentos máximos de login"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tiempo de sesión (minutos)"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Longitud mínima de contraseña"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, passwordMinLength: parseInt(e.target.value) }
                  }))}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.requireStrongPassword}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, requireStrongPassword: e.target.checked }
                      }))}
                    />
                  }
                  label="Requerir contraseñas fuertes (mayúsculas, números, símbolos)"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.enable2FA}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, enable2FA: e.target.checked }
                      }))}
                    />
                  }
                  label="Habilitar autenticación de dos factores (2FA)"
                />
              </Grid>
            </Grid>
          )}

          {/* Tab Pagos */}
          {activeTab === 4 && (
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.payment.enablePayments}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      payment: { ...prev.payment, enablePayments: e.target.checked }
                    }))}
                  />
                }
                label="Habilitar sistema de pagos"
              />
              
              {settings.payment.enablePayments && (
                <>
                  <FormControl fullWidth>
                    <InputLabel>Pasarela de pago</InputLabel>
                    <Select
                      value={settings.payment.paymentGateway}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        payment: { ...prev.payment, paymentGateway: e.target.value }
                      }))}
                    >
                      <MenuItem value="stripe">Stripe</MenuItem>
                      <MenuItem value="paypal">PayPal</MenuItem>
                      <MenuItem value="mercadopago">MercadoPago</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth>
                    <InputLabel>Moneda</InputLabel>
                    <Select
                      value={settings.payment.currency}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        payment: { ...prev.payment, currency: e.target.value }
                      }))}
                    >
                      <MenuItem value="PYG">Guaraníes (PYG)</MenuItem>
                      <MenuItem value="USD">Dólares (USD)</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    type="number"
                    label="Comisión (%)"
                    value={settings.payment.commission}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      payment: { ...prev.payment, commission: parseFloat(e.target.value) }
                    }))}
                    helperText="Porcentaje de comisión sobre las transacciones"
                  />
                </>
              )}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Alert,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material'
import {
  Save as SaveIcon,
  Restore as RestoreIcon
} from '@mui/icons-material'
import { useAdminSettings } from '../hooks/useAdminSettings'
import { useSettingsTabs } from '../hooks/useSettingsTabs'
import { GeneralSettingsForm } from './GeneralSettingsForm'
import { FeatureSettingsForm } from './FeatureSettingsForm'
import { NotificationSettingsForm } from './NotificationSettingsForm'
import { SecuritySettingsForm } from './SecuritySettingsForm'
import { PaymentSettingsForm } from './PaymentSettingsForm'
import type { AdminSettingsProps } from '../types/adminSettings.types'

export const AdminSettings = ({ onSettingsChange }: AdminSettingsProps) => {
  const {
    settings,
    isLoading,
    isSaving,
    saveSuccess,
    error,
    updateSettings,
    saveSettings,
    resetSettings
  } = useAdminSettings()

  const {
    activeTab,
    tabsConfig,
    changeTab
  } = useSettingsTabs()

  const handleSettingsChange = (newSettings: typeof settings) => {
    updateSettings(newSettings)
    onSettingsChange?.(newSettings)
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    changeTab(newValue)
  }

  const handleSaveSettings = async () => {
    await saveSettings()
  }

  const handleResetSettings = async () => {
    if (window.confirm('¿Estás seguro de restaurar la configuración predeterminada?')) {
      await resetSettings()
    }
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
        <Typography variant="h5" fontWeight={700}>
          Configuración del Sistema
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={handleResetSettings}
            disabled={isLoading || isSaving}
          >
            Restaurar
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            disabled={isLoading || isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Stack>
      </Stack>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Configuración guardada exitosamente
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabsConfig.map((tab) => {
            const IconComponent = tab.icon
            return (
              <Tab
                key={tab.id}
                label={tab.label}
                icon={<IconComponent />}
                iconPosition="start"
              />
            )
          })}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab General */}
          {activeTab === 0 && (
            <GeneralSettingsForm
              settings={settings.general}
              onChange={(generalSettings) =>
                handleSettingsChange({
                  ...settings,
                  general: generalSettings
                })
              }
            />
          )}

          {/* Tab Características */}
          {activeTab === 1 && (
            <FeatureSettingsForm
              settings={settings.features}
              onChange={(featureSettings) =>
                handleSettingsChange({
                  ...settings,
                  features: featureSettings
                })
              }
            />
          )}

          {/* Tab Notificaciones */}
          {activeTab === 2 && (
            <NotificationSettingsForm
              settings={settings.notifications}
              onChange={(notificationSettings) =>
                handleSettingsChange({
                  ...settings,
                  notifications: notificationSettings
                })
              }
            />
          )}

          {/* Tab Seguridad */}
          {activeTab === 3 && (
            <SecuritySettingsForm
              settings={settings.security}
              onChange={(securitySettings) =>
                handleSettingsChange({
                  ...settings,
                  security: securitySettings
                })
              }
            />
          )}

          {/* Tab Pagos */}
          {activeTab === 4 && (
            <PaymentSettingsForm
              settings={settings.payment}
              onChange={(paymentSettings) =>
                handleSettingsChange({
                  ...settings,
                  payment: paymentSettings
                })
              }
            />
          )}
        </Box>
      </Paper>
    </Box>
  )
}

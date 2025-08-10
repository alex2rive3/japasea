import type { SystemSettings } from '../types/adminSettings.types'
import { AdminSettingsUtils } from '../utils/adminSettingsUtils'
import { adminService } from '../../../services/adminService'

export class AdminSettingsService {
  static async loadSystemSettings(): Promise<SystemSettings> {
    try {
      const backendData = await adminService.getSystemSettings()
      return AdminSettingsUtils.mapBackendToFrontend(backendData || {})
    } catch (error) {
      console.error('Error loading system settings:', error)
      throw new Error('Error al cargar la configuración del sistema')
    }
  }

  static async saveSystemSettings(settings: SystemSettings): Promise<void> {
    try {
      const backendData = AdminSettingsUtils.mapFrontendToBackend(settings)
      await adminService.updateSystemSettings(backendData)
    } catch (error) {
      console.error('Error saving system settings:', error)
      throw new Error('Error al guardar la configuración del sistema')
    }
  }

  static validateSettings(settings: SystemSettings): { isValid: boolean; errors: { [key: string]: string[] } } {
    const errors = AdminSettingsUtils.validateAllSettings(settings)
    const hasErrors = Object.values(errors).some(sectionErrors => sectionErrors.length > 0)
    
    return {
      isValid: !hasErrors,
      errors
    }
  }

  static async resetSettingsToDefault(): Promise<SystemSettings> {
    try {
      // Cargar configuración actual para obtener valores del backend
      return await this.loadSystemSettings()
    } catch (error) {
      console.error('Error resetting settings:', error)
      throw new Error('Error al restaurar la configuración predeterminada')
    }
  }

  static getSettingsSummary(settings: SystemSettings): string[] {
    const summary: string[] = []
    
    if (settings.features.enableRegistration) {
      summary.push('Registro de usuarios habilitado')
    }
    
    if (settings.features.enableChat) {
      summary.push('Chat con IA habilitado')
    }
    
    if (settings.payment.enablePayments) {
      summary.push(`Pagos habilitados con ${settings.payment.paymentGateway}`)
    }
    
    if (settings.security.enable2FA) {
      summary.push('Autenticación de dos factores habilitada')
    }
    
    if (settings.notifications.emailNotifications) {
      summary.push('Notificaciones por email habilitadas')
    }
    
    return summary
  }

  static exportSettings(settings: SystemSettings): string {
    return JSON.stringify(settings, null, 2)
  }

  static async importSettings(settingsJson: string): Promise<SystemSettings> {
    try {
      const importedSettings = JSON.parse(settingsJson) as SystemSettings
      const validation = this.validateSettings(importedSettings)
      
      if (!validation.isValid) {
        const errorMessages = Object.entries(validation.errors)
          .filter(([, errors]) => errors.length > 0)
          .map(([section, errors]) => `${section}: ${errors.join(', ')}`)
          .join('\n')
        
        throw new Error(`Configuración inválida:\n${errorMessages}`)
      }
      
      return importedSettings
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Formato JSON inválido')
      }
      throw error
    }
  }
}

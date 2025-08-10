import {
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon
} from '@mui/icons-material'
import type {
  SystemSettings,
  SettingsTabConfig,
  GeneralSettings,
  SecuritySettings,
  PaymentSettings
} from '../types/adminSettings.types'
import { DEFAULT_SYSTEM_SETTINGS } from '../types/adminSettings.types'

export class AdminSettingsUtils {
  static getTabsConfig(): SettingsTabConfig[] {
    return [
      { id: 0, key: 'general', label: 'General', icon: LanguageIcon },
      { id: 1, key: 'features', label: 'Características', icon: NotificationsIcon },
      { id: 2, key: 'notifications', label: 'Notificaciones', icon: EmailIcon },
      { id: 3, key: 'security', label: 'Seguridad', icon: SecurityIcon },
      { id: 4, key: 'payment', label: 'Pagos', icon: PaymentIcon }
    ]
  }

  static validateGeneralSettings(settings: GeneralSettings): string[] {
    const errors: string[] = []

    if (!settings.siteName.trim()) {
      errors.push('El nombre del sitio es requerido')
    }

    if (!settings.contactEmail.trim()) {
      errors.push('El email de contacto es requerido')
    } else if (!this.isValidEmail(settings.contactEmail)) {
      errors.push('El email de contacto no es válido')
    }

    if (!settings.siteDescription.trim()) {
      errors.push('La descripción del sitio es requerida')
    }

    return errors
  }

  static validateSecuritySettings(settings: SecuritySettings): string[] {
    const errors: string[] = []

    if (settings.maxLoginAttempts < 1 || settings.maxLoginAttempts > 10) {
      errors.push('Los intentos máximos de login deben estar entre 1 y 10')
    }

    if (settings.sessionTimeout < 5 || settings.sessionTimeout > 1440) {
      errors.push('El tiempo de sesión debe estar entre 5 y 1440 minutos')
    }

    if (settings.passwordMinLength < 6 || settings.passwordMinLength > 32) {
      errors.push('La longitud mínima de contraseña debe estar entre 6 y 32 caracteres')
    }

    return errors
  }

  static validatePaymentSettings(settings: PaymentSettings): string[] {
    const errors: string[] = []

    if (settings.enablePayments) {
      if (!settings.paymentGateway) {
        errors.push('La pasarela de pago es requerida cuando los pagos están habilitados')
      }

      if (!settings.currency) {
        errors.push('La moneda es requerida cuando los pagos están habilitados')
      }

      if (settings.commission < 0 || settings.commission > 100) {
        errors.push('La comisión debe estar entre 0% y 100%')
      }
    }

    return errors
  }

  static validateAllSettings(settings: SystemSettings): { [key: string]: string[] } {
    return {
      general: this.validateGeneralSettings(settings.general),
      security: this.validateSecuritySettings(settings.security),
      payment: this.validatePaymentSettings(settings.payment)
    }
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static mapBackendToFrontend(backendData: any): SystemSettings {
    return {
      general: {
        siteName: backendData.general?.siteName || DEFAULT_SYSTEM_SETTINGS.general.siteName,
        siteDescription: backendData.general?.siteDescription || DEFAULT_SYSTEM_SETTINGS.general.siteDescription,
        contactEmail: backendData.general?.contactEmail || DEFAULT_SYSTEM_SETTINGS.general.contactEmail,
        supportPhone: backendData.general?.supportPhone || DEFAULT_SYSTEM_SETTINGS.general.supportPhone,
        defaultLanguage: backendData.general?.defaultLanguage || DEFAULT_SYSTEM_SETTINGS.general.defaultLanguage,
        timezone: backendData.general?.timezone || DEFAULT_SYSTEM_SETTINGS.general.timezone
      },
      features: {
        enableRegistration: backendData.features?.registration ?? DEFAULT_SYSTEM_SETTINGS.features.enableRegistration,
        requireEmailVerification: backendData.features?.emailVerification ?? DEFAULT_SYSTEM_SETTINGS.features.requireEmailVerification,
        enableReviews: backendData.features?.reviews ?? DEFAULT_SYSTEM_SETTINGS.features.enableReviews,
        moderateReviews: DEFAULT_SYSTEM_SETTINGS.features.moderateReviews, // No disponible en backend
        enableFavorites: backendData.features?.favorites ?? DEFAULT_SYSTEM_SETTINGS.features.enableFavorites,
        enableChat: backendData.features?.chat ?? DEFAULT_SYSTEM_SETTINGS.features.enableChat
      },
      notifications: {
        emailNotifications: backendData.notifications?.email?.enabled ?? DEFAULT_SYSTEM_SETTINGS.notifications.emailNotifications,
        pushNotifications: backendData.notifications?.push?.enabled ?? DEFAULT_SYSTEM_SETTINGS.notifications.pushNotifications,
        smsNotifications: backendData.notifications?.sms?.enabled ?? DEFAULT_SYSTEM_SETTINGS.notifications.smsNotifications,
        notificationEmail: backendData.general?.contactEmail || DEFAULT_SYSTEM_SETTINGS.notifications.notificationEmail
      },
      security: {
        maxLoginAttempts: backendData.security?.maxLoginAttempts || DEFAULT_SYSTEM_SETTINGS.security.maxLoginAttempts,
        sessionTimeout: backendData.security?.sessionTimeout || DEFAULT_SYSTEM_SETTINGS.security.sessionTimeout,
        passwordMinLength: backendData.security?.passwordMinLength || DEFAULT_SYSTEM_SETTINGS.security.passwordMinLength,
        requireStrongPassword: DEFAULT_SYSTEM_SETTINGS.security.requireStrongPassword, // No disponible en backend
        enable2FA: backendData.security?.require2FA ?? DEFAULT_SYSTEM_SETTINGS.security.enable2FA
      },
      payment: {
        enablePayments: backendData.payments?.enabled ?? DEFAULT_SYSTEM_SETTINGS.payment.enablePayments,
        paymentGateway: backendData.payments?.gateway || DEFAULT_SYSTEM_SETTINGS.payment.paymentGateway,
        currency: backendData.payments?.currency || DEFAULT_SYSTEM_SETTINGS.payment.currency,
        commission: backendData.payments?.commission || DEFAULT_SYSTEM_SETTINGS.payment.commission
      }
    }
  }

  static mapFrontendToBackend(settings: SystemSettings): any {
    return {
      general: {
        siteName: settings.general.siteName,
        siteDescription: settings.general.siteDescription,
        contactEmail: settings.general.contactEmail,
        supportPhone: settings.general.supportPhone,
        defaultLanguage: settings.general.defaultLanguage,
        timezone: settings.general.timezone
      },
      features: {
        registration: settings.features.enableRegistration,
        emailVerification: settings.features.requireEmailVerification,
        reviews: settings.features.enableReviews,
        favorites: settings.features.enableFavorites,
        chat: settings.features.enableChat
      },
      notifications: {
        email: { enabled: settings.notifications.emailNotifications },
        push: { enabled: settings.notifications.pushNotifications },
        sms: { enabled: settings.notifications.smsNotifications }
      },
      security: {
        maxLoginAttempts: settings.security.maxLoginAttempts,
        sessionTimeout: settings.security.sessionTimeout,
        passwordMinLength: settings.security.passwordMinLength,
        require2FA: settings.security.enable2FA
      },
      payments: {
        enabled: settings.payment.enablePayments,
        gateway: settings.payment.paymentGateway,
        currency: settings.payment.currency,
        commission: settings.payment.commission
      }
    }
  }

  static getSettingsChanges(oldSettings: SystemSettings, newSettings: SystemSettings): Partial<SystemSettings> {
    const changes: any = {}

    // Compare general settings
    const generalChanges = this.getObjectChanges(oldSettings.general, newSettings.general)
    if (Object.keys(generalChanges).length > 0) {
      changes.general = generalChanges
    }

    // Compare feature settings
    const featureChanges = this.getObjectChanges(oldSettings.features, newSettings.features)
    if (Object.keys(featureChanges).length > 0) {
      changes.features = featureChanges
    }

    // Compare notification settings
    const notificationChanges = this.getObjectChanges(oldSettings.notifications, newSettings.notifications)
    if (Object.keys(notificationChanges).length > 0) {
      changes.notifications = notificationChanges
    }

    // Compare security settings
    const securityChanges = this.getObjectChanges(oldSettings.security, newSettings.security)
    if (Object.keys(securityChanges).length > 0) {
      changes.security = securityChanges
    }

    // Compare payment settings
    const paymentChanges = this.getObjectChanges(oldSettings.payment, newSettings.payment)
    if (Object.keys(paymentChanges).length > 0) {
      changes.payment = paymentChanges
    }

    return changes
  }

  private static getObjectChanges(oldObj: any, newObj: any): any {
    const changes: any = {}
    
    Object.keys(newObj).forEach(key => {
      if (oldObj[key] !== newObj[key]) {
        changes[key] = newObj[key]
      }
    })

    return changes
  }

  static formatSettingsForDisplay(settings: SystemSettings): { [key: string]: string } {
    return {
      'Nombre del sitio': settings.general.siteName,
      'Email de contacto': settings.general.contactEmail,
      'Idioma': settings.general.defaultLanguage,
      'Registro habilitado': settings.features.enableRegistration ? 'Sí' : 'No',
      'Chat habilitado': settings.features.enableChat ? 'Sí' : 'No',
      'Favoritos habilitados': settings.features.enableFavorites ? 'Sí' : 'No',
      'Pagos habilitados': settings.payment.enablePayments ? 'Sí' : 'No',
      '2FA habilitado': settings.security.enable2FA ? 'Sí' : 'No'
    }
  }
}

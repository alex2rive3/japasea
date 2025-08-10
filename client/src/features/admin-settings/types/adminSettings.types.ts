export interface SystemSettings {
  general: GeneralSettings
  features: FeatureSettings
  notifications: NotificationSettings
  security: SecuritySettings
  payment: PaymentSettings
}

export interface GeneralSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  supportPhone: string
  defaultLanguage: string
  timezone: string
}

export interface FeatureSettings {
  enableRegistration: boolean
  requireEmailVerification: boolean
  enableReviews: boolean
  moderateReviews: boolean
  enableFavorites: boolean
  enableChat: boolean
}

export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  notificationEmail: string
}

export interface SecuritySettings {
  maxLoginAttempts: number
  sessionTimeout: number
  passwordMinLength: number
  requireStrongPassword: boolean
  enable2FA: boolean
}

export interface PaymentSettings {
  enablePayments: boolean
  paymentGateway: string
  currency: string
  commission: number
}

export type SettingsTab = 'general' | 'features' | 'notifications' | 'security' | 'payment'

export interface SettingsTabConfig {
  id: number
  key: SettingsTab
  label: string
  icon: React.ComponentType
}

export interface AdminSettingsProps {
  onSettingsChange?: (settings: SystemSettings) => void
}

export interface SettingsFormProps {
  settings: SystemSettings
  onSettingsChange: (settings: SystemSettings) => void
  loading?: boolean
}

export interface SettingsActionProps {
  onSave: () => void
  onReset: () => void
  loading?: boolean
  saveSuccess?: boolean
}

// Default settings constants
export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  siteName: 'Japasea',
  siteDescription: 'Descubre los mejores lugares de Paraguay',
  contactEmail: 'contacto@japasea.com',
  supportPhone: '+595 21 123 456',
  defaultLanguage: 'es',
  timezone: 'America/Asuncion'
}

export const DEFAULT_FEATURE_SETTINGS: FeatureSettings = {
  enableRegistration: true,
  requireEmailVerification: true,
  enableReviews: true,
  moderateReviews: true,
  enableFavorites: true,
  enableChat: true
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: false,
  smsNotifications: false,
  notificationEmail: 'notificaciones@japasea.com'
}

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  maxLoginAttempts: 5,
  sessionTimeout: 30,
  passwordMinLength: 8,
  requireStrongPassword: true,
  enable2FA: false
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  enablePayments: false,
  paymentGateway: 'stripe',
  currency: 'PYG',
  commission: 10
}

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  general: DEFAULT_GENERAL_SETTINGS,
  features: DEFAULT_FEATURE_SETTINGS,
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  security: DEFAULT_SECURITY_SETTINGS,
  payment: DEFAULT_PAYMENT_SETTINGS
}

// Language options
export const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
  { value: 'pt', label: 'Portugués' }
]

// Payment gateway options
export const PAYMENT_GATEWAY_OPTIONS = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'mercadopago', label: 'MercadoPago' }
]

// Currency options
export const CURRENCY_OPTIONS = [
  { value: 'PYG', label: 'Guaraníes (PYG)' },
  { value: 'USD', label: 'Dólares (USD)' }
]

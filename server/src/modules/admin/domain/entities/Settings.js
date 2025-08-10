const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'system_settings'
  },
  general: {
    siteName: {
      type: String,
      default: 'Japasea'
    },
    siteDescription: {
      type: String,
      default: 'Descubre los mejores lugares de Paraguay'
    },
    contactEmail: {
      type: String,
      default: 'contacto@japasea.com'
    },
    supportPhone: {
      type: String,
      default: '+595 xxx xxx xxx'
    },
    defaultLanguage: {
      type: String,
      enum: ['es', 'en', 'gn'],
      default: 'es'
    },
    timezone: {
      type: String,
      default: 'America/Asuncion'
    }
  },
  features: {
    registration: {
      type: Boolean,
      default: true
    },
    emailVerification: {
      type: Boolean,
      default: true
    },
    reviews: {
      type: Boolean,
      default: true
    },
    chat: {
      type: Boolean,
      default: true
    },
    favorites: {
      type: Boolean,
      default: true
    },
    socialLogin: {
      type: Boolean,
      default: false
    }
  },
  notifications: {
    email: {
      enabled: {
        type: Boolean,
        default: true
      },
      provider: {
        type: String,
        enum: ['smtp', 'sendgrid', 'ses'],
        default: 'smtp'
      }
    },
    push: {
      enabled: {
        type: Boolean,
        default: false
      },
      provider: {
        type: String,
        enum: ['firebase', 'onesignal'],
        default: 'firebase'
      }
    },
    sms: {
      enabled: {
        type: Boolean,
        default: false
      },
      provider: {
        type: String,
        enum: ['twilio', 'nexmo'],
        default: 'twilio'
      }
    }
  },
  security: {
    maxLoginAttempts: {
      type: Number,
      default: 5,
      min: 1,
      max: 10
    },
    sessionTimeout: {
      type: Number,
      default: 3600, // 1 hora en segundos
      min: 300, // 5 minutos
      max: 86400 // 24 horas
    },
    passwordMinLength: {
      type: Number,
      default: 8,
      min: 6,
      max: 20
    },
    require2FA: {
      type: Boolean,
      default: false
    },
    allowedOrigins: [{
      type: String
    }]
  },
  payments: {
    enabled: {
      type: Boolean,
      default: false
    },
    gateway: {
      type: String,
      enum: ['mercadopago', 'stripe', 'paypal'],
      default: 'mercadopago'
    },
    currency: {
      type: String,
      enum: ['PYG', 'USD'],
      default: 'PYG'
    },
    commission: {
      type: Number,
      default: 10, // porcentaje
      min: 0,
      max: 50
    },
    testMode: {
      type: Boolean,
      default: true
    }
  },
  social: {
    facebook: {
      enabled: { type: Boolean, default: false },
      appId: String,
      appSecret: String
    },
    google: {
      enabled: { type: Boolean, default: false },
      clientId: String,
      clientSecret: String
    },
    twitter: {
      enabled: { type: Boolean, default: false },
      apiKey: String,
      apiSecret: String
    }
  },
  seo: {
    defaultTitle: {
      type: String,
      default: 'Japasea - Descubre Paraguay'
    },
    defaultDescription: {
      type: String,
      default: 'Encuentra los mejores lugares, restaurantes y actividades en Paraguay'
    },
    defaultKeywords: [{
      type: String
    }],
    googleAnalytics: String,
    facebookPixel: String
  },
  maintenance: {
    enabled: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'El sitio está en mantenimiento. Volveremos pronto.'
    },
    allowedIPs: [{
      type: String
    }]
  }
}, {
  timestamps: true
})

// Método estático para obtener la configuración
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne({ key: 'system_settings' })
  
  // Si no existe, crear con valores por defecto
  if (!settings) {
    settings = await this.create({ key: 'system_settings' })
  }
  
  return settings
}

// Método estático para actualizar la configuración
settingsSchema.statics.updateSettings = async function(updates) {
  const settings = await this.findOneAndUpdate(
    { key: 'system_settings' },
    { $set: updates },
    { 
      new: true, 
      upsert: true,
      runValidators: true
    }
  )
  
  return settings
}

// Método para verificar si una característica está habilitada
settingsSchema.methods.isFeatureEnabled = function(feature) {
  return this.features[feature] === true
}

// Método para obtener configuración específica
settingsSchema.methods.getConfig = function(path) {
  const keys = path.split('.')
  let value = this
  
  for (const key of keys) {
    value = value[key]
    if (value === undefined) return null
  }
  
  return value
}

const Settings = mongoose.model('Settings', settingsSchema)

module.exports = Settings

const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'El key es requerido'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  type: {
    type: String,
    required: [true, 'El tipo es requerido'],
    enum: {
      values: ['Alojamiento', 'Gastronomía', 'Turístico', 'Compras', 'Entretenimiento', 'Desayunos y meriendas', 'Comida'],
      message: '{VALUE} no es un tipo válido'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90 // latitude
        },
        message: 'Coordenadas inválidas'
      }
    }
  },
  address: {
    type: String,
    required: [true, 'La dirección es requerida'],
    trim: true
  },
  contact: {
    phone: {
      type: String,
      trim: true,
      match: [/^[\d\s\-\+\(\)]+$/, 'Número de teléfono inválido']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    website: {
      type: String,
      trim: true
    },
    social: {
      facebook: String,
      instagram: String,
      whatsapp: String
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  businessHours: [{
    day: {
      type: Number,
      min: 0,
      max: 6, // 0 = Domingo, 6 = Sábado
      required: true
    },
    open: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
    },
    close: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
    },
    isClosed: {
      type: Boolean,
      default: false
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  pricing: {
    level: {
      type: Number,
      min: 1,
      max: 4, // $ - $$$$
      default: 2
    },
    currency: {
      type: String,
      default: 'PYG',
      enum: ['PYG', 'USD', 'ARS', 'BRL']
    }
  },
  features: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'seasonal'],
    default: 'active'
  },
  metadata: {
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    bookmarks: {
      type: Number,
      default: 0,
      min: 0
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    featured: {
      type: Boolean,
      default: false
    },
    featuredUntil: Date,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  seasonalInfo: {
    highSeason: [{
      start: Date,
      end: Date,
      priceMultiplier: {
        type: Number,
        default: 1.0
      }
    }],
    events: [{
      name: String,
      date: Date,
      description: String
    }]
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    }
  },
  toObject: { virtuals: true }
})

// Índices para optimización
placeSchema.index({ location: '2dsphere' }) // Para búsquedas geoespaciales
placeSchema.index({ type: 1, status: 1 })
placeSchema.index({ 'metadata.featured': -1, 'rating.average': -1 })
placeSchema.index({ name: 'text', description: 'text' }) // Para búsqueda de texto
placeSchema.index({ tags: 1 })
placeSchema.index({ status: 1, 'metadata.verified': 1 })
placeSchema.index({ createdAt: -1 })

// Métodos virtuales
placeSchema.virtual('isOpen').get(function() {
  const now = new Date()
  const day = now.getDay()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  const todayHours = this.businessHours.find(h => h.day === day)
  if (!todayHours || todayHours.isClosed) return false
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close
})

placeSchema.virtual('priceRange').get(function() {
  if (!this.pricing || !this.pricing.level) return '$'
  return '$'.repeat(this.pricing.level)
})

// Métodos estáticos
placeSchema.statics.findNearby = function(longitude, latitude, maxDistance = 5000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    status: 'active'
  })
}

placeSchema.statics.findByType = function(type) {
  return this.find({ type, status: 'active' }).sort({ 'rating.average': -1 })
}

placeSchema.statics.getFeatured = function() {
  return this.find({
    status: 'active',
    'metadata.featured': true,
    'metadata.featuredUntil': { $gte: new Date() }
  }).sort({ 'metadata.featuredUntil': 1 })
}

placeSchema.statics.search = function(query) {
  return this.find(
    { $text: { $search: query }, status: 'active' },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } })
}

// Métodos de instancia
placeSchema.methods.incrementViews = function() {
  this.metadata.views += 1
  this.metadata.lastUpdated = new Date()
  return this.save()
}

placeSchema.methods.toggleLike = function(increment = true) {
  this.metadata.likes += increment ? 1 : -1
  return this.save()
}

placeSchema.methods.toggleBookmark = function(increment = true) {
  this.metadata.bookmarks += increment ? 1 : -1
  return this.save()
}

placeSchema.methods.updateRating = function(newRating) {
  const currentTotal = this.rating.average * this.rating.count
  this.rating.count += 1
  this.rating.average = (currentTotal + newRating) / this.rating.count
  return this.save()
}

// Middleware pre-save
placeSchema.pre('save', function(next) {
  // Asegurar que solo hay una imagen principal
  const primaryImages = this.images.filter(img => img.isPrimary)
  if (primaryImages.length > 1) {
    this.images.forEach((img, index) => {
      img.isPrimary = index === 0
    })
  } else if (primaryImages.length === 0 && this.images.length > 0) {
    this.images[0].isPrimary = true
  }
  
  // Extraer ubicación lat/lng del array coordinates para compatibilidad
  if (this.location && this.location.coordinates) {
    this.location.lat = this.location.coordinates[1]
    this.location.lng = this.location.coordinates[0]
  }
  
  next()
})

module.exports = mongoose.model('Place', placeSchema)
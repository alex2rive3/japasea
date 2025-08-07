const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: [true, 'El lugar es requerido'],
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es requerido'],
    index: true
  },
  rating: {
    type: Number,
    required: [true, 'La calificación es requerida'],
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  comment: {
    type: String,
    required: [true, 'El comentario es requerido'],
    trim: true,
    minlength: [10, 'El comentario debe tener al menos 10 caracteres'],
    maxlength: [1000, 'El comentario no puede exceder 1000 caracteres']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  visitDate: {
    type: Date,
    required: [true, 'La fecha de visita es requerida'],
    validate: {
      validator: function(date) {
        return date <= new Date()
      },
      message: 'La fecha de visita no puede ser futura'
    }
  },
  visitType: {
    type: String,
    enum: ['solo', 'pareja', 'familia', 'amigos', 'negocios'],
    required: true
  },
  aspects: {
    service: {
      type: Number,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    ambience: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  helpful: {
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  response: {
    text: {
      type: String,
      trim: true,
      maxlength: [500, 'La respuesta no puede exceder 500 caracteres']
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'approved' // Por ahora aprobación automática
  },
  moderationNotes: {
    type: String,
    select: false // Solo visible para admins
  },
  reported: {
    count: {
      type: Number,
      default: 0
    },
    reasons: [{
      reason: String,
      reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reportedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  edited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    editedAt: {
      type: Date,
      default: Date.now
    },
    previousComment: String,
    previousRating: Number
  }]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v
      return ret
    }
  }
})

// Índices compuestos
reviewSchema.index({ place: 1, user: 1 }, { unique: true }) // Un usuario solo puede reseñar un lugar una vez
reviewSchema.index({ place: 1, status: 1, createdAt: -1 })
reviewSchema.index({ user: 1, createdAt: -1 })
reviewSchema.index({ rating: -1, 'helpful.count': -1 })
reviewSchema.index({ status: 1, createdAt: -1 })

// Virtuals
reviewSchema.virtual('isEdited').get(function() {
  return this.edited || this.editHistory.length > 0
})

reviewSchema.virtual('averageAspectRating').get(function() {
  const aspects = this.aspects
  if (!aspects) return null
  
  const ratings = [
    aspects.service,
    aspects.quality,
    aspects.ambience,
    aspects.value,
    aspects.cleanliness
  ].filter(r => r !== undefined)
  
  if (ratings.length === 0) return null
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length
})

// Métodos estáticos
reviewSchema.statics.getPlaceStats = async function(placeId) {
  const stats = await this.aggregate([
    { 
      $match: { 
        place: mongoose.Types.ObjectId(placeId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        distribution: {
          $push: '$rating'
        },
        averageAspects: {
          service: { $avg: '$aspects.service' },
          quality: { $avg: '$aspects.quality' },
          ambience: { $avg: '$aspects.ambience' },
          value: { $avg: '$aspects.value' },
          cleanliness: { $avg: '$aspects.cleanliness' }
        }
      }
    },
    {
      $project: {
        averageRating: { $round: ['$averageRating', 1] },
        totalReviews: 1,
        ratingDistribution: {
          5: { 
            $size: { 
              $filter: { 
                input: '$distribution', 
                cond: { $eq: ['$$this', 5] } 
              } 
            } 
          },
          4: { 
            $size: { 
              $filter: { 
                input: '$distribution', 
                cond: { $eq: ['$$this', 4] } 
              } 
            } 
          },
          3: { 
            $size: { 
              $filter: { 
                input: '$distribution', 
                cond: { $eq: ['$$this', 3] } 
              } 
            } 
          },
          2: { 
            $size: { 
              $filter: { 
                input: '$distribution', 
                cond: { $eq: ['$$this', 2] } 
              } 
            } 
          },
          1: { 
            $size: { 
              $filter: { 
                input: '$distribution', 
                cond: { $eq: ['$$this', 1] } 
              } 
            } 
          }
        },
        averageAspects: 1
      }
    }
  ])
  
  return stats[0] || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    averageAspects: {}
  }
}

reviewSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { 
      $match: { 
        user: mongoose.Types.ObjectId(userId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        totalHelpful: { $sum: '$helpful.count' },
        totalPhotos: { $sum: { $size: '$images' } }
      }
    }
  ])
  
  return stats[0] || {
    totalReviews: 0,
    averageRating: 0,
    totalHelpful: 0,
    totalPhotos: 0
  }
}

// Métodos de instancia
reviewSchema.methods.toggleHelpful = async function(userId) {
  const userObjectId = mongoose.Types.ObjectId(userId)
  const index = this.helpful.users.findIndex(id => id.equals(userObjectId))
  
  if (index === -1) {
    // Añadir voto útil
    this.helpful.users.push(userObjectId)
    this.helpful.count += 1
  } else {
    // Quitar voto útil
    this.helpful.users.splice(index, 1)
    this.helpful.count -= 1
  }
  
  return this.save()
}

reviewSchema.methods.addResponse = async function(text, userId) {
  this.response = {
    text,
    respondedBy: userId,
    respondedAt: new Date()
  }
  return this.save()
}

reviewSchema.methods.reportReview = async function(reason, userId) {
  const existingReport = this.reported.reasons.find(
    r => r.reportedBy.equals(userId)
  )
  
  if (!existingReport) {
    this.reported.reasons.push({
      reason,
      reportedBy: userId
    })
    this.reported.count += 1
    
    // Auto-flag si hay muchos reportes
    if (this.reported.count >= 5) {
      this.status = 'flagged'
    }
  }
  
  return this.save()
}

reviewSchema.methods.editReview = async function(newComment, newRating) {
  // Guardar historial
  this.editHistory.push({
    previousComment: this.comment,
    previousRating: this.rating
  })
  
  // Actualizar
  this.comment = newComment
  this.rating = newRating
  this.edited = true
  
  return this.save()
}

// Middleware
reviewSchema.pre('save', function(next) {
  // Calcular rating promedio si hay aspectos
  if (this.isNew && this.aspects) {
    const aspectRatings = Object.values(this.aspects).filter(v => v)
    if (aspectRatings.length > 0 && !this.rating) {
      this.rating = Math.round(
        aspectRatings.reduce((sum, r) => sum + r, 0) / aspectRatings.length
      )
    }
  }
  next()
})

// Post-save hook para actualizar estadísticas del lugar
reviewSchema.post('save', async function() {
  if (this.status === 'approved') {
    const Place = mongoose.model('Place')
    const stats = await this.constructor.getPlaceStats(this.place)
    
    await Place.findByIdAndUpdate(this.place, {
      'rating.average': stats.averageRating,
      'rating.count': stats.totalReviews
    })
  }
})

// Post-remove hook para actualizar estadísticas
reviewSchema.post('remove', async function() {
  const Place = mongoose.model('Place')
  const stats = await this.constructor.getPlaceStats(this.place)
  
  await Place.findByIdAndUpdate(this.place, {
    'rating.average': stats.averageRating,
    'rating.count': stats.totalReviews
  })
})

module.exports = mongoose.model('Review', reviewSchema)
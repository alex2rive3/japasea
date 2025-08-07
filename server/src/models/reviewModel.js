const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  images: [{
    type: String
  }],
  helpful: {
    type: Number,
    default: 0
  },
  helpfulVotes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vote: {
      type: String,
      enum: ['yes', 'no']
    }
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectedAt: Date,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
})

// Índices
reviewSchema.index({ userId: 1, placeId: 1 }, { unique: true })
reviewSchema.index({ placeId: 1, status: 1 })
reviewSchema.index({ status: 1 })
reviewSchema.index({ createdAt: -1 })

// Virtual para información del usuario
reviewSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
})

// Virtual para información del lugar
reviewSchema.virtual('place', {
  ref: 'Place',
  localField: 'placeId',
  foreignField: '_id',
  justOne: true
})

// Método para aprobar reseña
reviewSchema.methods.approve = function(adminId) {
  this.status = 'approved'
  this.metadata.approvedAt = new Date()
  this.metadata.approvedBy = adminId
  return this.save()
}

// Método para rechazar reseña
reviewSchema.methods.reject = function(adminId, reason) {
  this.status = 'rejected'
  this.rejectionReason = reason
  this.metadata.rejectedAt = new Date()
  this.metadata.rejectedBy = adminId
  return this.save()
}

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
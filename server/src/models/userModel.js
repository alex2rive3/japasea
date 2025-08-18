const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingrese un email válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  refreshToken: {
    type: String,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  favorites: [{
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      newsletter: {
        type: Boolean,
        default: false
      }
    },
    language: {
      type: String,
      enum: ['es', 'pt', 'en'],
      default: 'es'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    searchHistory: {
      type: Boolean,
      default: true
    }
  },
  searchHistory: [{
    query: String,
    searchedAt: {
      type: Date,
      default: Date.now
    },
    resultsCount: Number
  }],
  // Tokens de recuperación de contraseña
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  // Token de verificación de email
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: Date
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password
      delete ret.refreshToken
      delete ret.passwordResetToken
      delete ret.passwordResetExpires
      delete ret.emailVerificationToken
      delete ret.emailVerificationExpires
      delete ret.__v
      return ret
    }
  }
})

userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(config.BCRYPT_SALT_ROUNDS)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!candidatePassword || !this.password) return false
  return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email,
      role: this.role
    },
    config.JWT_SECRET,
    { 
      expiresIn: config.JWT_EXPIRES_IN,
      issuer: 'japasea-app'
    }
  )
}

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      type: 'refresh'
    },
    config.JWT_SECRET,
    { 
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
      issuer: 'japasea-app'
    }
  )
}

userSchema.methods.incrementLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    })
  }
  
  const updates = { $inc: { loginAttempts: 1 } }
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 } // 2 hours
  }
  
  return this.updateOne(updates)
}

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  })
}

userSchema.methods.addFavorite = async function(placeId) {
  const exists = this.favorites.some(fav => fav.place.equals(placeId))
  if (!exists) {
    this.favorites.push({ place: placeId })
    await this.save()
    
    // Actualizar contador en el lugar
    const Place = mongoose.model('Place')
    await Place.findByIdAndUpdate(placeId, {
      $inc: { 'metadata.bookmarks': 1 }
    })
  }
  return this
}

userSchema.methods.removeFavorite = async function(placeId) {
  const index = this.favorites.findIndex(fav => fav.place.equals(placeId))
  if (index !== -1) {
    this.favorites.splice(index, 1)
    await this.save()
    
    // Actualizar contador en el lugar
    const Place = mongoose.model('Place')
    await Place.findByIdAndUpdate(placeId, {
      $inc: { 'metadata.bookmarks': -1 }
    })
  }
  return this
}

userSchema.methods.isFavorite = function(placeId) {
  return this.favorites.some(fav => fav.place.equals(placeId))
}

userSchema.methods.addSearchHistory = async function(query, resultsCount) {
  if (this.preferences.searchHistory) {
    // Mantener solo las últimas 50 búsquedas
    if (this.searchHistory.length >= 50) {
      this.searchHistory.shift()
    }
    this.searchHistory.push({ query, resultsCount })
    await this.save()
  }
}

userSchema.methods.createPasswordResetToken = function() {
  const crypto = require('crypto')
  
  // Generar token aleatorio
  const resetToken = crypto.randomBytes(32).toString('hex')
  
  // Hash del token para almacenar en la base de datos
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  
  // Expiración en 1 hora
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000
  
  // Devolver el token sin hash (se enviará por email)
  return resetToken
}

userSchema.methods.createEmailVerificationToken = function() {
  const crypto = require('crypto')
  
  // Generar token aleatorio
  const verificationToken = crypto.randomBytes(32).toString('hex')
  
  // Hash del token para almacenar en la base de datos
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex')
  
  // Devolver el token sin hash (se enviará por email)
  return verificationToken
}

userSchema.methods.verifyEmail = function() {
  this.emailVerified = true
  this.emailVerifiedAt = new Date()
  this.emailVerificationToken = undefined
  return this.save()
}

// Indexes - email already has unique:true, so no need for separate index
userSchema.index({ createdAt: 1 })
userSchema.index({ isActive: 1 })

module.exports = mongoose.model('User', userSchema)

const mongoose = require('mongoose')

const chatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  messages: [{
    text: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    context: {
      type: String
    },
    response: {
      message: String,
      places: [{
        id: String,
        key: String,
        name: { type: String, default: 'Lugar por definir' },
        category: String,
        description: String,
        location: {
          lat: Number,
          lng: Number,
          address: String,
          city: String
        },
        imageUrl: String,
        tags: [String],
        rating: Number,
        priceLevel: String,
        openingHours: String,
        website: String,
        phone: String,
        features: [String]
      }],
      travelPlan: {
        title: String,
        duration: String,
        days: [{
          day: Number,
          title: String,
          description: String,
          activities: [{
            time: String,
            activity: String,
            place: {
              id: String,
              key: String,
              name: { type: String, default: 'Lugar por definir' },
              category: String,
              description: String,
              location: {
                lat: Number,
                lng: Number,
                address: String,
                city: String
              },
              imageUrl: String,
              tags: [String],
              rating: Number,
              priceLevel: String,
              openingHours: String,
              website: String,
              phone: String,
              features: [String]
            },
            duration: String,
            tips: [String]
          }]
        }],
        budget: {
          total: String,
          breakdown: [{
            category: String,
            amount: String
          }]
        },
        recommendations: [String]
      }
    }
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    index: true
  }
}, {
  timestamps: true
})

// Índices para mejorar el rendimiento
chatHistorySchema.index({ user: 1, createdAt: -1 })
chatHistorySchema.index({ user: 1, lastActivity: -1 })

// Método para añadir un nuevo mensaje
chatHistorySchema.methods.addMessage = function(messageData) {
  this.messages.push(messageData)
  this.lastActivity = new Date()
  return this.save()
}

// Método para obtener los últimos N mensajes
chatHistorySchema.methods.getRecentMessages = function(limit = 10) {
  return this.messages.slice(-limit)
}

// Método estático para obtener o crear historial de sesión
chatHistorySchema.statics.findOrCreateSession = async function(userId, sessionId) {
  let history = await this.findOne({ 
    user: userId, 
    sessionId: sessionId 
  })

  if (!history) {
    history = await this.create({
      user: userId,
      sessionId: sessionId,
      messages: []
    })
  }

  return history
}

// Método estático para obtener el historial reciente del usuario
chatHistorySchema.statics.getUserHistory = async function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ lastActivity: -1 })
    .limit(limit)
    .select('sessionId lastActivity messages')
}

module.exports = mongoose.model('ChatHistory', chatHistorySchema)
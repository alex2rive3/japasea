class ProcessChat {
  constructor(placeRepository, chatHistoryRepository, googleAIService) {
    this.placeRepository = placeRepository
    this.chatHistoryRepository = chatHistoryRepository
    this.googleAI = googleAIService
  }

  async execute(userId, message, context, sessionId) {
    if (!message) {
      const error = new Error('El mensaje es requerido')
      error.name = 'ValidationError'
      throw error
    }

    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key_here') {
      const error = new Error('Clave de API de Google no configurada')
      error.name = 'ConfigurationError'
      throw error
    }

    const localPlaces = await this.placeRepository.findActive()
    
    // Asegurar que todos los lugares de la BD tengan tanto key como name
    const normalizedPlaces = localPlaces.map(place => {
      if (!place.name && place.key) {
        place.name = place.key
      } else if (place.name && !place.key) {
        place.key = place.name
      } else if (!place.name && !place.key && place.title) {
        place.name = place.title
        place.key = place.title
      }
      return place
    })
    
    // Detectar si es una consulta de plan de viaje o una consulta simple
    const isTravelPlanQuery = this.detectTravelPlan(message)
    
    let response
    if (isTravelPlanQuery) {
      response = await this.googleAI.generateTravelPlan({
        message,
        history: [],
        places: normalizedPlaces,
        userId
      })
    } else {
      response = await this.googleAI.generateSimpleRecommendation({
        message,
        history: [],
        places: normalizedPlaces
      })
    }

    // Guardar en el historial si el usuario está autenticado
    if (userId) {
      try {
        const chatSessionId = sessionId || `session-${Date.now()}`
        
        await this.chatHistoryRepository.save({
          userId,
          conversationId: chatSessionId,
          userMessage: message,
          botResponse: response
        })
        
        // Añadir sessionId a la respuesta
        response.sessionId = chatSessionId
      } catch (historyError) {
        console.error('Error saving chat history:', historyError)
        // No fallar la respuesta si hay error al guardar el historial
      }
    }

    return response
  }

  detectTravelPlan(message) {
    const travelPlanKeywords = [
      'plan', 'itinerario', 'ruta', 'recorrido', 'que hacer',
      'donde ir', 'visitar', 'conocer', 'turismo', 'lugares',
      'dia', 'días', 'fin de semana', 'weekend', 'mañana',
      'tarde', 'noche', 'horario', 'programa', 'actividades'
    ]
    
    const lowerMessage = message.toLowerCase()
    return travelPlanKeywords.some(keyword => lowerMessage.includes(keyword))
  }
}

module.exports = ProcessChat

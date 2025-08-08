const { GoogleGenAI } = require('@google/genai')
const ChatHistory = require('../models/chatHistoryModel')
const Place = require('../models/placeModel')

const ai = new GoogleGenAI({})

class PlacesController {

  static async getPlaces(req, res) {
    try {
      const { type } = req.query
      
      const query = { status: 'active' }
      if (type) {
        query.type = new RegExp(type, 'i')
      }

      const places = await Place.find(query)
        .select('-__v')
        .sort({ 'rating.average': -1, 'metadata.views': -1 })
        .lean()

      res.status(200).json(places)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener lugares',
        error: error.message
      })
    }
  }

  static async searchPlaces(req, res) {
    try {
      const { q } = req.query
      
      if (!q) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro de consulta "q" es requerido'
        })
      }

      // Búsqueda por texto o regex
      const places = await Place.find({
        $and: [
          { status: 'active' },
          {
            $or: [
              { name: new RegExp(q, 'i') },
              { description: new RegExp(q, 'i') },
              { type: new RegExp(q, 'i') },
              { address: new RegExp(q, 'i') },
              { tags: new RegExp(q, 'i') }
            ]
          }
        ]
      })
      .select('-__v')
      .lean()

      res.status(200).json(places)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al buscar lugares',
        error: error.message
      })
    }
  }

  static async getRandomPlaces(req, res) {
    try {
      const { count = 3 } = req.query
      const numPlaces = parseInt(count)
      
      // Usar agregación de MongoDB para obtener lugares aleatorios
      const places = await Place.aggregate([
        { $match: { status: 'active' } },
        { $sample: { size: numPlaces } },
        { $project: { __v: 0 } }
      ])

      res.status(200).json(places)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener lugares aleatorios',
        error: error.message
      })
    }
  }

  static async processChat(req, res) {
    try {
      const { message, context, sessionId } = req.body
      
      if (!message) {
        return res.status(400).json({
          status: 'error',
          message: 'El mensaje es requerido'
        })
      }

      if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key_here') {
        return res.status(500).json({
          status: 'error',
          message: 'Clave de API de Google no configurada'
        })
      }

      const localPlaces = await Place.find({ status: 'active' }).lean()
      
      // Asegurar que todos los lugares de la BD tengan tanto key como name
      const normalizedPlaces = localPlaces.map(place => {
        if (!place.name && place.key) {
          place.name = place.key
        } else if (place.name && !place.key) {
          place.key = place.name
        } else if (!place.name && !place.key && place.title) {
          // Si viene con 'title' en lugar de 'name' o 'key'
          place.name = place.title
          place.key = place.title
        }
        return place
      })
      
      // Detectar si es una consulta de plan de viaje o una consulta simple
      const isTravelPlanQuery = PlacesController.detectTravelPlan(message)
      
      let response
      if (isTravelPlanQuery) {
        response = await PlacesController.generateTravelPlan(message, context, normalizedPlaces)
      } else {
        response = await PlacesController.generateSimpleRecommendation(message, context, normalizedPlaces)
      }

      // Normalizar SIEMPRE la respuesta antes de guardarla en historial o retornarla
      response = PlacesController.normalizeResponse(response)

      // Guardar en el historial si el usuario está autenticado
      if (req.user && req.user._id) {
        try {
          const chatSessionId = sessionId || `session-${Date.now()}`
          const chatHistory = await ChatHistory.findOrCreateSession(req.user._id, chatSessionId)
          
          // Añadir mensaje del usuario
          await chatHistory.addMessage({
            text: message,
            sender: 'user',
            context: context || ''
          })
          
          // Añadir respuesta del bot
          const botMessageData = {
            text: response.message || 'Respuesta generada',
            sender: 'bot',
            response: response
          }

          if (process.env.CHAT_DEBUG_LOG === '1') {
            try {
              console.log('\n[CHAT_DEBUG] Pre-save BOT message (normalizado):')
              console.log(JSON.stringify(botMessageData, null, 2))
              const namesFromPlan = botMessageData?.response?.travelPlan?.days?.flatMap(d => d?.activities || [])
                .map(a => a?.place?.name || a?.place?.key)
                .filter(Boolean)
              if (namesFromPlan?.length) {
                console.log('[CHAT_DEBUG] Nombres en travelPlan:', namesFromPlan)
              }
              const namesFromSimple = botMessageData?.response?.places?.map(p => p?.name || p?.key).filter(Boolean)
              if (namesFromSimple?.length) {
                console.log('[CHAT_DEBUG] Nombres en places:', namesFromSimple)
              }
            } catch (e) {
              console.log('[CHAT_DEBUG] Error imprimiendo BOT message:', e.message)
            }
          }

          await chatHistory.addMessage(botMessageData)
          
          // Añadir sessionId a la respuesta
          response.sessionId = chatSessionId
        } catch (historyError) {
          console.error('Error saving chat history:', historyError)
          // No fallar la respuesta si hay error al guardar el historial
        }
      }
      res.status(200).json(response)

    } catch (error) {
      console.error('Error processing chat:', error)
      res.status(500).json({
        status: 'error',
        message: 'Error al procesar el mensaje de chat',
        error: error.message
      })
    }
  }

  static detectTravelPlan(message) {
    const messageLower = message.toLowerCase()
    
    // Detectar menciones explícitas de días
    const dayKeywords = /(\d+)\s*(día|dias|day|days)/i
    if (dayKeywords.test(message)) {
      return true
    }
    
    // Detectar palabras que indican planificación de viaje
    const travelPlanKeywords = [
      'plan', 'planear', 'itinerario', 'ruta', 'recorrido', 'trip', 'viaje',
      'conocer', 'recorrer', 'turistear', 'explorar', 'visitar encarnación'
    ]
    
    // Detectar múltiples actividades (indica necesidad de plan)
    const hasMultipleActivities = messageLower.includes(' y ') && 
      (messageLower.includes('comer') || messageLower.includes('ir') || 
       messageLower.includes('visitar') || messageLower.includes('hacer'))
    
    const hasTravelKeywords = travelPlanKeywords.some(keyword => 
      messageLower.includes(keyword)
    )
    
    return hasTravelKeywords || hasMultipleActivities
  }

  static normalizePlace(rawPlace) {
    if (!rawPlace || typeof rawPlace !== 'object') return rawPlace
    const place = { ...rawPlace }
    if (!place.name && place.key) {
      place.name = place.key
    } else if (place.name && !place.key) {
      place.key = place.name
    } else if (!place.name && !place.key) {
      place.name = 'Lugar por definir'
      place.key = 'Lugar por definir'
    }
    if (!place.category && place.type) {
      place.category = place.type
    }
    if (!place.description) {
      place.description = 'Descripción no disponible'
    }
    if (!place.address) {
      place.address = 'Dirección por confirmar'
    }
    if (!place.location || typeof place.location.lat !== 'number' || typeof place.location.lng !== 'number') {
      place.location = { lat: -27.3309, lng: -55.8663 }
    }
    return place
  }

  static normalizeResponse(response) {
    if (!response || typeof response !== 'object') return response
    const normalized = { ...response }
    if (normalized.places && Array.isArray(normalized.places)) {
      normalized.places = normalized.places.map(PlacesController.normalizePlace)
    }
    if (normalized.travelPlan && normalized.travelPlan.days) {
      normalized.travelPlan = { ...normalized.travelPlan }
      normalized.travelPlan.days = normalized.travelPlan.days.map(day => {
        if (!day || !day.activities) return day
        return {
          ...day,
          activities: day.activities.map(activity => ({
            ...activity,
            place: PlacesController.normalizePlace(activity.place)
          }))
        }
      })
    }
    return normalized
  }

  static async generateTravelPlan(message, context, localPlaces) {
    const prompt = `Eres JapaseaBot, un asistente turístico especializado en Encarnación, Paraguay, experto en crear planes de viaje personalizados y detallados.

## INFORMACIÓN GEOGRÁFICA Y TURÍSTICA:
- **Ubicación**: Encarnación, Departamento de Itapúa, Paraguay
- **Frontera**: Con Posadas, Argentina (conectada por Puente San Roque González)
- **Atracciones icónicas**: Costanera de Encarnación, Carnaval Encarnaceno, Centro Histórico
- **Zonas principales**: Centro comercial, Paseo Gastronómico (Avda. Dr. Francia), Costanera
- **Coordenadas base**: -27.3309, -55.8663

## DATOS LOCALES DE REFERENCIA:
${JSON.stringify(localPlaces.slice(0, 10), null, 2)}

## CONSULTA DEL USUARIO:
"${message}"

## CONTEXTO PREVIO:
${context || 'Primera consulta del usuario'}

## PROCESO DE ANÁLISIS DE LA CONSULTA:

### PASO 1: EXTRACCIÓN DE PARÁMETROS
Analiza la consulta para identificar:
- **Duración**: Número de días (si no se especifica = 1 día)
- **Preferencias gastronómicas**: Tipos de comida, restricciones, presupuesto
- **Actividades deseadas**: Turismo, entretenimiento, compras, naturaleza, vida nocturna, baile
- **Tipo de viaje**: Familiar, romántico, aventura, cultural, negocios, fiesta/diversión nocturna
- **Alojamiento**: Si se menciona o se necesita incluir
- **Horarios**: Preferencias de tiempo (mañana, tarde, noche)

### PASO 2: PLANIFICACIÓN ESTRATÉGICA
- **Proximidad geográfica**: Agrupa lugares cercanos para optimizar traslados
- **Flujo temporal**: Secuencia lógica de actividades (desayuno → turismo → almuerzo → actividades → cena)
- **Variedad equilibrada**: Combina gastronomía, turismo y entretenimiento
- **Lugares auténticos**: Prioriza establecimientos reales y reconocidos

## ESTRUCTURA DE RESPUESTA OPTIMIZADA (JSON):

{
  "message": "Mensaje personalizado que resume el plan creado, destaca los puntos fuertes y da consejos adicionales (100-150 palabras)",
  "travelPlan": {
    "totalDays": [número_detectado_o_1_por_defecto],
    "days": [
      {
        "dayNumber": 1,
        "title": "[Título descriptivo del día basado en actividades principales]",
        "activities": [
          {
            "time": "09:00",
            "category": "Desayuno",
            "place": {
              "key": "Nombre exacto del establecimiento",
              "name": "Nombre exacto del establecimiento",
              "type": "Desayunos y meriendas",
              "description": "Descripción específica: tipo de comida, especialidades, ambiente, por qué es ideal para esta parte del plan",
              "address": "Dirección completa con calle y número específico",
              "location": {
                "lat": -27.xxxx,
                "lng": -55.xxxx
              {
            "time": "21:00",
            "category": "Entretenimiento",
            "place": {
              "key": "Nombre exacto del bar/discoteca",
              "name": "Nombre exacto del bar/discoteca",
              "type": "Entretenimiento",
              "description": "Tipo de música, ambiente, horarios, por qué es ideal para terminar la noche",
              "address": "Dirección específica",
              "location": {
                "lat": -27.xxxx,
                "lng": -55.xxxx
              }
            }
          }
            }
          },
          {
            "time": "10:30",
            "category": "Turismo",
            "place": {
              "key": "Nombre exacto del lugar turístico",
              "name": "Nombre exacto del lugar turístico",
              "type": "Turístico",
              "description": "Descripción detallada: qué se puede ver/hacer, tiempo recomendado, por qué es imperdible",
              "address": "Dirección específica",
              "location": {
                "lat": -27.xxxx,
                "lng": -55.xxxx
              }
            }
          },
          {
            "time": "12:30",
            "category": "Almuerzo",
            "place": {
              "key": "Nombre exacto del restaurante",
              "name": "Nombre exacto del restaurante",
              "type": "Gastronomía",
              "description": "Especialidades, tipo de cocina, ambiente, rango de precios, por qué encaja con el plan",
              "address": "Dirección específica",
              "location": {
                "lat": -27.xxxx,
                "lng": -55.xxxx
              }
            }
          },
          {
            "time": "15:00",
            "category": "Turismo",
            "place": {
              "key": "Segundo lugar turístico",
              "name": "Segundo lugar turístico",
              "type": "Turístico",
              "description": "Actividad complementaria, diferente al primer sitio turístico",
              "address": "Dirección específica",
              "location": {
                "lat": -27.xxxx,
                "lng": -55.xxxx
              }
            }
          },
          {
            "time": "19:00",
            "category": "Cena",
            "place": {
              "key": "Nombre exacto del restaurante para cena",
              "name": "Nombre exacto del restaurante para cena",
              "type": "Gastronomía",
              "description": "Ambiente nocturno, especialidades, por qué cierra bien el día",
              "address": "Dirección específica",
              "location": {
                "lat": -27.xxxx,
                "lng": -55.xxxx
              }
            }
          }
        ]
      }
    ]
  },
  "timestamp": "${new Date().toISOString()}"
} `

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      }
    })

    try {
      const jsonResponse = response.text.trim()
      const cleanedResponse = jsonResponse.replace(/```json\n?|\n?```/g, '').trim()
      const parsedResponse = JSON.parse(cleanedResponse)
      
      return parsedResponse
    } catch (parseError) {
      console.error('Error parsing travel plan response:', parseError)
      return PlacesController.generateFallbackTravelPlan(message)
    }
  }

  static async generateSimpleRecommendation(message, context, localPlaces) {
  
    const prompt = `
Eres JapaseaBot, un asistente turístico local especializado en Encarnación, Paraguay. Tienes conocimiento exhaustivo de la ciudad y respondes consultas específicas con recomendaciones precisas.

## CONTEXTO DE ENCARNACIÓN:
- Ciudad fronteriza con Posadas, Argentina
- Departamento de Itapúa, Paraguay
- Conocida por: Costanera, Carnaval Encarnaceno, gastronomía local
- Atracciones icónicas: Costanera de Encarnación, Puente San Roque González, Centro Histórico
- Zona gastronómica: Centro y Paseo Gastronómico
- Coordenadas: -27.3309, -55.8663

## DATOS LOCALES DE REFERENCIA:
${JSON.stringify(localPlaces.slice(0, 10), null, 2)}

## CONSULTA DEL USUARIO: 
"${message}"

## CONTEXTO PREVIO: 
${context || 'Primera consulta'}

## INSTRUCCIONES PARA LA RESPUESTA:

### REGLAS FUNDAMENTALES:
1. **CANTIDAD**: Responde con EXACTAMENTE 3-4 lugares (nunca menos de 3, nunca más de 4)
2. **RELEVANCIA**: Cada lugar debe responder DIRECTAMENTE a la consulta específica
3. **PRECISIÓN**: Usa nombres reales de establecimientos de Encarnación
4. **CONCISIÓN**: Respuesta directa sin información adicional no solicitada
5. **IDIOMA**: Responde en español natural y amigable

### CRITERIOS DE SELECCIÓN:
- Prioriza lugares que coincidan exactamente con lo solicitado
- Incluye variedad en ubicaciones (centro, costanera, barrios)
- Considera diferentes rangos de precio cuando sea relevante
- Asegúrate de que los lugares estén actualmente operativos

### FORMATO DE RESPUESTA REQUERIDO (JSON):
{
  "message": "Respuesta concisa en español (máximo 80 palabras) que introduce las recomendaciones",
  "travelPlan": {
    "totalDays": 1,
    "days": [
      {
        "dayNumber": 1,
        "title": "Lugares recomendados para tu consulta",
        "activities": [
          {
            "category": "Recomendación",
            "place": {
              "key": "Nombre exacto del establecimiento",
              "name": "Nombre exacto del establecimiento",
              "type": "Categoría específica (ej: pizzería, restaurante, café)",
              "description": "Breve descripción específica del lugar y por qué es ideal para esta consulta (máximo 30 palabras)",
              "address": "Dirección completa con nombre de calle y número",
              "location": {
                "lat": -27.xxxx,
                "lng": -55.xxxx
              }
            }
          },
          {
            "category": "Recomendación",
            "place": {
              "key": "Nombre exacto del establecimiento 2",
              "name": "Nombre exacto del establecimiento 2",
              "type": "Categoría específica",
              "description": "Descripción breve y específica (máximo 30 palabras)",
              "address": "Dirección completa",
              "location": {
                "lat": -27.xxxx,
                "lng": -55.xxxx
              }
            }
          },
          {
            "category": "Recomendación",
            "place": {
              "key": "Nombre exacto del establecimiento 3",
              "name": "Nombre exacto del establecimiento 3",
              "type": "Categoría específica",
              "description": "Descripción breve y específica (máximo 30 palabras)",
              "address": "Dirección completa",
              "location": {
                "lat": -27.xxxx,
                "lng": -55.xxxx
              }
            }
          }
        ]
      }
    ]
  },
  "timestamp": "${new Date().toISOString()}"
}

## EJEMPLOS DE CONSULTAS Y RESPUESTAS ESPERADAS:

**Consulta**: "¿Dónde puedo comer buena pizza?"
**Respuesta esperada**: 3-4 pizzerías específicas de Encarnación

**Consulta**: "¿Dónde tomar un buen café?"
**Respuesta esperada**: 3-4 cafeterías locales

**Consulta**: "Lugares para cenar con vista al río"
**Respuesta esperada**: 3-4 restaurantes con vista al río Paraná

## VALIDACIÓN FINAL:
- ✅ Exactamente 3-4 lugares
- ✅ Cada lugar responde a la consulta específica
- ✅ Nombres reales de establecimientos
- ✅ Direcciones específicas de Encarnación
- ✅ Coordenadas precisas
- ✅ JSON válido y completo

RESPONDE ÚNICAMENTE CON EL JSON VÁLIDO, SIN TEXTO ADICIONAL.
`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      }
    })

    try {
      const jsonResponse = response.text.trim()
      const cleanedResponse = jsonResponse.replace(/```json\n?|\n?```/g, '').trim()
      const parsedResponse = JSON.parse(cleanedResponse)
      
      return parsedResponse
    } catch (parseError) {
      console.error('Error parsing simple recommendation response:', parseError)
      return PlacesController.generateFallbackRecommendation(message, relevantLocalPlaces)
    }
  }

  static findRelevantLocalPlaces(message, localPlaces) {
    const messageWords = message.toLowerCase().split(' ')
    
    const relevantPlaces = localPlaces.filter(place => {
      const searchText = `${place.key} ${place.description} ${place.type} ${place.address}`.toLowerCase()
      return messageWords.some(word => word.length > 2 && searchText.includes(word))
    })

    if (relevantPlaces.length >= 3) {
      return relevantPlaces.slice(0, 3)
    }

    if (message.toLowerCase().includes('hotel') || message.toLowerCase().includes('alojamiento')) {
      return localPlaces.filter(place => place.type === 'Alojamiento').slice(0, 3)
    } else if (message.toLowerCase().includes('comida') || message.toLowerCase().includes('restaurante') || message.toLowerCase().includes('comer')) {
      return localPlaces.filter(place => place.type === 'Gastronomía' || place.type === 'Comida').slice(0, 3)
    } else if (message.toLowerCase().includes('café') || message.toLowerCase().includes('desayuno') || message.toLowerCase().includes('merienda')) {
      return localPlaces.filter(place => place.type === 'Desayunos y meriendas').slice(0, 3)
    } else if (message.toLowerCase().includes('turismo') || message.toLowerCase().includes('visitar') || message.toLowerCase().includes('turistico')) {
      return localPlaces.filter(place => place.type === 'Turístico').slice(0, 3)
    }

    return localPlaces.slice(0, 3)
  }

  static generateFallbackTravelPlan(message) {
    // Detectar si se mencionan días específicos en el mensaje
    const dayMatches = message.match(/(\d+)\s*(día|dias|day|days)/i)
    const totalDays = dayMatches ? parseInt(dayMatches[1]) : 1
    
    return {
      message: `He preparado un plan de ${totalDays} día${totalDays > 1 ? 's' : ''} para tu visita a Encarnación. Los lugares son recomendaciones generales que puedes ajustar según tus preferencias específicas.`,
      travelPlan: {
        totalDays: totalDays,
        days: [
          {
            dayNumber: 1,
            title: totalDays === 1 ? "Día Completo en Encarnación" : "Llegada y Centro Histórico",
            activities: [
              {
                time: "09:00",
                category: "Desayuno",
                place: {
                  key: "Café Central Encarnación",
                  name: "Café Central Encarnación",
                  type: "Desayunos y meriendas",
                  description: "Café céntrico perfecto para comenzar el día con un buen desayuno paraguayo",
                  address: "Avda. Dr. Francia c/ 14 de Mayo",
                  location: { lat: -27.3309, lng: -55.8663 }
                }
              },
              {
                time: "11:00",
                category: "Turismo",
                place: {
                  key: "Plaza de Armas",
                  name: "Plaza de Armas",
                  type: "Turístico",
                  description: "Plaza central histórica con monumentos y ambiente tradicional",
                  address: "14 de Mayo c/ Mcal. Estigarribia",
                  location: { lat: -27.3323, lng: -55.8656 }
                }
              },
              {
                time: "13:00",
                category: "Almuerzo",
                place: {
                  key: "Restaurante La Costanera",
                  name: "Restaurante La Costanera",
                  type: "Gastronomía",
                  description: "Restaurante con vista al río y especialidades locales",
                  address: "Avda. Costanera",
                  location: { lat: -27.3340, lng: -55.8737 }
                }
              },
              {
                time: "15:30",
                category: "Turismo",
                place: {
                  key: "Costanera de Encarnación",
                  name: "Costanera de Encarnación",
                  type: "Turístico",
                  description: "Hermoso paseo junto al río Paraná con vistas panorámicas",
                  address: "Avda. Costanera",
                  location: { lat: -27.3350, lng: -55.8740 }
                }
              },
              {
                time: "19:00",
                category: "Cena",
                place: {
                  key: "Paseo Gastronómico",
                  name: "Paseo Gastronómico",
                  type: "Gastronomía",
                  description: "Zona gastronómica con variedad de restaurantes y ambiente nocturno",
                  address: "Avda. Francia",
                  location: { lat: -27.3353, lng: -55.8716 }
                }
              }
            ]
          }
        ]
      },
      timestamp: new Date().toISOString()
    }
  }

  static generateFallbackRecommendation(message, localPlaces) {
    const places = localPlaces.length > 0 ? localPlaces.slice(0, 3) : [
      {
        key: "Costanera de Encarnación",
        name: "Costanera de Encarnación",
        type: "Turístico",
        description: "Hermosa costanera con vista al río Paraná, ideal para pasear y disfrutar",
        address: "Avda. Costanera",
        location: { lat: -27.3340, lng: -55.8737 }
      },
      {
        key: "Paseo Gastronómico",
        name: "Paseo Gastronómico",
        type: "Gastronomía",
        description: "Zona gastronómica con variedad de restaurantes y opciones culinarias",
        address: "Avda. Francia",
        location: { lat: -27.3353, lng: -55.8716 }
      },
      {
        key: "Shopping Costanera",
        name: "Shopping Costanera",
        type: "Compras",
        description: "Centro comercial moderno con tiendas, restaurantes y entretenimiento",
        address: "Avda. Costanera",
        location: { lat: -27.3253, lng: -55.8754 }
      }
    ]

    return {
      message: "Aquí tienes algunas recomendaciones para tu visita a Encarnación. Estos lugares te ofrecerán una buena experiencia de la ciudad y sus atractivos principales.",
      travelPlan: {
        totalDays: 1,
        days: [
          {
            dayNumber: 1,
            title: "Recomendaciones para tu consulta",
            activities: places.map(place => ({
              category: "Recomendación",
              place: place
            }))
          }
        ]
      },
      timestamp: new Date().toISOString()
    }
  }

  // Método para obtener el historial del chat del usuario
  static async getChatHistory(req, res) {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado'
        })
      }

      const { limit = 10 } = req.query
      const history = await ChatHistory.getUserHistory(req.user._id, parseInt(limit))

      // Normalizar nombres de lugares en el historial ya guardado
      const normalizedHistory = history.map((h) => {
        const obj = typeof h.toObject === 'function' ? h.toObject() : h
        obj.messages = (obj.messages || []).map((m) => ({
          ...m,
          response: PlacesController.normalizeResponse(m.response)
        }))
        return obj
      })

      res.status(200).json({
        status: 'success',
        data: normalizedHistory
      })
    } catch (error) {
      console.error('Error getting chat history:', error)
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener el historial del chat',
        error: error.message
      })
    }
  }

  // Método para obtener una sesión específica del chat
  static async getChatSession(req, res) {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado'
        })
      }

      const { sessionId } = req.params
      
      const history = await ChatHistory.findOne({
        user: req.user._id,
        sessionId: sessionId
      })

      if (!history) {
        return res.status(404).json({
          status: 'error',
          message: 'Sesión de chat no encontrada'
        })
      }

      const obj = typeof history.toObject === 'function' ? history.toObject() : history
      obj.messages = (obj.messages || []).map((m) => ({
        ...m,
        response: PlacesController.normalizeResponse(m.response)
      }))

      res.status(200).json({
        status: 'success',
        data: obj
      })
    } catch (error) {
      console.error('Error getting chat session:', error)
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener la sesión del chat',
        error: error.message
      })
    }
  }

}

module.exports = PlacesController

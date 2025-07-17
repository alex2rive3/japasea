const fs = require('fs')
const path = require('path')
const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({})

class PlacesController {
  
  static loadPlaces() {
    try {
      const placesPath = path.join(__dirname, '../../places.json')
      const data = fs.readFileSync(placesPath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading places:', error)
      return []
    }
  }

  static getPlaces(req, res) {
    try {
      const { type } = req.query
      let places = PlacesController.loadPlaces()

      if (type) {
        places = places.filter(place => 
          place.type.toLowerCase().includes(type.toLowerCase())
        )
      }

      res.status(200).json(places)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener lugares',
        error: error.message
      })
    }
  }

  static searchPlaces(req, res) {
    try {
      const { q } = req.query
      
      if (!q) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro de consulta "q" es requerido'
        })
      }

      const places = PlacesController.loadPlaces()
      const queryLower = q.toLowerCase()
      
      const results = places.filter(place =>
        place.key.toLowerCase().includes(queryLower) ||
        place.description.toLowerCase().includes(queryLower) ||
        place.type.toLowerCase().includes(queryLower) ||
        place.address.toLowerCase().includes(queryLower)
      )

      res.status(200).json(results)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al buscar lugares',
        error: error.message
      })
    }
  }

  static getRandomPlaces(req, res) {
    try {
      const { count = 3 } = req.query
      const places = PlacesController.loadPlaces()
      
      const shuffled = [...places].sort(() => 0.5 - Math.random())
      const selectedPlaces = shuffled.slice(0, parseInt(count))

      res.status(200).json(selectedPlaces)
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
      const { message, context } = req.body
      
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

      const localPlaces = PlacesController.loadPlaces()
      const response = await PlacesController.generateTravelResponse(message, context, localPlaces)

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

  static async generateTravelResponse(message, context, localPlaces) {
    const isTravelPlan = PlacesController.detectTravelPlan(message)
    
    if (isTravelPlan) {
      return await PlacesController.generateTravelPlan(message, context, localPlaces)
    } else {
      return await PlacesController.generateSimpleRecommendation(message, context, localPlaces)
    }
  }

  static detectTravelPlan(message) {
    const travelPlanIndicators = [
      'plan', 'itinerario', 'viaje', 'días', 'dia', 'día', 'semana', 'fin de semana',
      'recorrido', 'ruta', 'agenda', 'cronograma', 'programar', 'organizar',
      'visitar en', 'hacer en', 'qué hacer', 'actividades'
    ]
    
    const messageLower = message.toLowerCase()
    return travelPlanIndicators.some(indicator => messageLower.includes(indicator))
  }

  static async generateTravelPlan(message, context, localPlaces) {
    const prompt = `
      Eres JapaseaBot, un asistente turístico especializado en Encarnación, Paraguay, experto en crear planes de viaje personalizados.

      INFORMACIÓN SOBRE ENCARNACIÓN:
      - Ciudad ubicada en el departamento de Itapúa, Paraguay
      - Frontera con Argentina (Posadas)
      - Famosa por su Costanera, Carnaval Encarnaceno y turismo
      - Atracciones principales: Costanera de Encarnación, Puente San Roque González de Santa Cruz, Centro Histórico
      - Zona comercial y gastronómica en el centro y Paseo Gastronómico
      - Coordenadas aproximadas: -27.3309, -55.8663

      LUGARES LOCALES DE APOYO (usa como referencia):
      ${JSON.stringify(localPlaces.slice(0, 10), null, 2)}

      CONSULTA DEL USUARIO: "${message}"
      CONTEXTO PREVIO: ${context || 'Primera consulta del usuario'}

      INSTRUCCIONES PARA CREAR EL PLAN:
      1. Analiza la consulta para extraer: número de días, preferencias gastronómicas, actividades deseadas, tipo de alojamiento
      2. Crea un plan día por día que incluya lugares REALES de Encarnación
      3. Combina lugares de la base de datos local con lugares reales de Google Maps
      4. Para cada día, incluye: desayuno, actividades matutinas, almuerzo, actividades vespertinas, cena
      5. Sugiere lugares específicos con nombres reales y direcciones exactas
      6. Considera la proximidad geográfica de los lugares

      ESTRUCTURA DE RESPUESTA REQUERIDA (JSON):
      {
        "message": "Mensaje personalizado de bienvenida y resumen del plan (máximo 150 palabras)",
        "travelPlan": {
          "totalDays": número_de_días,
          "days": [
            {
              "dayNumber": 1,
              "title": "Título del día (ej: Llegada y Centro Histórico)",
              "activities": [
                {
                  "time": "09:00",
                  "category": "Desayuno",
                  "place": {
                    "key": "Nombre exacto del lugar",
                    "type": "Desayunos y meriendas",
                    "description": "Descripción detallada del lugar y por qué es perfecto para esta actividad",
                    "address": "Dirección específica con calles reales",
                    "location": {"lat": -27.xxxx, "lng": -55.xxxx}
                  }
                },
                {
                  "time": "11:00",
                  "category": "Turismo",
                  "place": {
                    "key": "Nombre exacto del lugar",
                    "type": "Turístico",
                    "description": "Descripción de la actividad turística",
                    "address": "Dirección específica",
                    "location": {"lat": -27.xxxx, "lng": -55.xxxx}
                  }
                },
                {
                  "time": "13:00",
                  "category": "Almuerzo",
                  "place": {
                    "key": "Nombre exacto del restaurante",
                    "type": "Gastronomía",
                    "description": "Descripción del tipo de comida y especialidades",
                    "address": "Dirección específica",
                    "location": {"lat": -27.xxxx, "lng": -55.xxxx}
                  }
                }
              ]
            }
          ]
        },
        "timestamp": "${new Date().toISOString()}"
      }

      CATEGORÍAS DE LUGARES:
      - Alojamiento: Hoteles, hostales, posadas
      - Gastronomía: Restaurantes, parrillas, comida internacional
      - Desayunos y meriendas: Cafés, panaderías, heladerías
      - Turístico: Museos, plazas, costanera, centros comerciales
      - Entretenimiento: Bares, pubs, vida nocturna

      CALLES Y AVENIDAS PRINCIPALES DE ENCARNACIÓN:
      - Avda. Costanera (zona turística principal)
      - Avda. Dr. Francia (Paseo Gastronómico)
      - Avda. Irrazábal, Avda. Caballero
      - 14 de Mayo, Mcal. Estigarribia, Cerro Corá
      - Zona centro: Plaza de Armas y alrededores

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
      console.error('Error parsing travel plan response:', parseError)
      return PlacesController.generateFallbackTravelPlan(message)
    }
  }

  static async generateSimpleRecommendation(message, context, localPlaces) {
    const relevantLocalPlaces = PlacesController.findRelevantLocalPlaces(message, localPlaces)
    
    const prompt = `
      Eres JapaseaBot, un asistente turístico especializado en Encarnación, Paraguay.

      LUGARES LOCALES DISPONIBLES:
      ${JSON.stringify(relevantLocalPlaces, null, 2)}

      INFORMACIÓN SOBRE ENCARNACIÓN:
      - Ciudad en el departamento de Itapúa, Paraguay
      - Frontera con Argentina, conocida por su Costanera y Carnaval
      - Coordenadas: -27.3309, -55.8663
      - Calles principales: Avda. Costanera, Dr. Francia, Irrazábal, Caballero

      CONSULTA DEL USUARIO: "${message}"
      CONTEXTO PREVIO: ${context || 'Primera consulta'}

      INSTRUCCIONES:
      1. Responde en español de manera amigable y profesional
      2. Proporciona exactamente 3 recomendaciones de lugares REALES
      3. Combina lugares de la base local con lugares reales de Google Maps si es necesario
      4. Incluye nombres exactos, direcciones específicas y coordenadas precisas
      5. Explica brevemente por qué cada lugar es relevante

      ESTRUCTURA DE RESPUESTA (JSON):
      {
        "message": "Respuesta personalizada en español (máximo 200 palabras)",
        "places": [
          {
            "key": "Nombre exacto del lugar",
            "type": "Categoría apropiada",
            "description": "Descripción detallada y relevancia",
            "address": "Dirección específica con calles reales",
            "location": {"lat": -27.xxxx, "lng": -55.xxxx}
          }
        ],
        "timestamp": "${new Date().toISOString()}"
      }

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
    return {
      message: "He preparado un plan básico para tu visita a Encarnación. Los lugares son recomendaciones generales que puedes ajustar según tus preferencias específicas.",
      travelPlan: {
        totalDays: 3,
        days: [
          {
            dayNumber: 1,
            title: "Llegada y Centro Histórico",
            activities: [
              {
                time: "09:00",
                category: "Desayuno",
                place: {
                  key: "Café Central Encarnación",
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
                  type: "Gastronomía",
                  description: "Restaurante con vista al río y especialidades locales",
                  address: "Avda. Costanera",
                  location: { lat: -27.3340, lng: -55.8737 }
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
        type: "Turístico",
        description: "Hermosa costanera con vista al río Paraná, ideal para pasear y disfrutar",
        address: "Avda. Costanera",
        location: { lat: -27.3340, lng: -55.8737 }
      },
      {
        key: "Paseo Gastronómico",
        type: "Gastronomía",
        description: "Zona gastronómica con variedad de restaurantes y opciones culinarias",
        address: "Avda. Francia",
        location: { lat: -27.3353, lng: -55.8716 }
      },
      {
        key: "Shopping Costanera",
        type: "Compras",
        description: "Centro comercial moderno con tiendas, restaurantes y entretenimiento",
        address: "Avda. Costanera",
        location: { lat: -27.3253, lng: -55.8754 }
      }
    ]

    return {
      message: "Aquí tienes algunas recomendaciones para tu visita a Encarnación. Estos lugares te ofrecerán una buena experiencia de la ciudad y sus atractivos principales.",
      places: places,
      timestamp: new Date().toISOString()
    }
  }

}

module.exports = PlacesController

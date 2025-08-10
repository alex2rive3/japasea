const { GoogleGenAI } = require('@google/genai')

class GoogleAIService {
  constructor() {
    this.ai = new GoogleGenAI({})
    this.models = {
      geminiPro: 'gemini-pro',
      geminiProVision: 'gemini-pro-vision'
    }
  }

  async generateTravelPlan(params) {
    const { message, history, places, userId } = params
    
    try {
      const prompt = this.buildTravelPlanPrompt(message, history, places)
      const model = this.ai.getGenerativeModel({ model: this.models.geminiPro })
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return this.parseAndValidateResponse(text, 'travelPlan')
    } catch (error) {
      const aiError = new Error(`Error al generar plan de viaje: ${error.message}`)
      aiError.name = 'ExternalServiceError'
      throw aiError
    }
  }

  async generateSimpleRecommendation(params) {
    const { message, history, places } = params
    
    try {
      const prompt = this.buildSimpleRecommendationPrompt(message, history, places)
      const model = this.ai.getGenerativeModel({ model: this.models.geminiPro })
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return this.parseAndValidateResponse(text, 'recommendation')
    } catch (error) {
      const aiError = new Error(`Error al generar recomendación: ${error.message}`)
      aiError.name = 'ExternalServiceError'
      throw aiError
    }
  }

  buildTravelPlanPrompt(message, history, places) {
    const contextHistory = history.slice(-5).map(h => h.userMessage || h.text).join('\n')
    const placesData = JSON.stringify(places.slice(0, 15), null, 2)
    
    return `Eres JapaseaBot, un asistente turístico especializado en Encarnación, Paraguay, experto en crear planes de viaje personalizados y detallados.

## INFORMACIÓN GEOGRÁFICA Y TURÍSTICA:
- **Ubicación**: Encarnación, Departamento de Itapúa, Paraguay
- **Frontera**: Con Posadas, Argentina (conectada por Puente San Roque González)
- **Atracciones icónicas**: Costanera de Encarnación, Carnaval Encarnaceno, Centro Histórico
- **Zonas principales**: Centro comercial, Paseo Gastronómico (Avda. Dr. Francia), Costanera
- **Coordenadas base**: -27.3309, -55.8663

## DATOS LOCALES DE REFERENCIA:
${placesData}

## CONSULTA DEL USUARIO:
"${message}"

## CONTEXTO PREVIO:
${contextHistory || 'Primera consulta del usuario'}

## INSTRUCCIONES ESPECÍFICAS:
1. Genera un plan de viaje detallado en formato JSON válido
2. Incluye horarios específicos para cada actividad
3. Organiza las actividades por proximidad geográfica
4. Balancea gastronomía, turismo y entretenimiento
5. Usa los lugares reales de la base de datos cuando sea posible
6. Proporciona descripciones específicas y direcciones completas

## ESTRUCTURA DE RESPUESTA REQUERIDA (JSON válido):
{
  "message": "Mensaje personalizado que resume el plan creado (100-150 palabras)",
  "travelPlan": {
    "totalDays": [número_detectado_o_1_por_defecto],
    "days": [
      {
        "dayNumber": 1,
        "title": "Título descriptivo del día",
        "activities": [
          {
            "time": "09:00",
            "category": "Desayuno",
            "place": {
              "key": "Nombre exacto del establecimiento",
              "name": "Nombre exacto del establecimiento", 
              "type": "Desayunos y meriendas",
              "description": "Descripción específica del lugar",
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
  }
}

IMPORTANTE: Responde SOLO con JSON válido, sin texto adicional.`
  }

  buildSimpleRecommendationPrompt(message, history, places) {
    const contextHistory = history.slice(-3).map(h => h.userMessage || h.text).join('\n')
    const placesData = JSON.stringify(places.slice(0, 10), null, 2)
    
    return `Eres JapaseaBot, un asistente turístico para responder consultas sobre Encarnación, Paraguay.

## LUGARES DISPONIBLES:
${placesData}

## CONSULTA DEL USUARIO:
"${message}"

## CONTEXTO PREVIO:
${contextHistory || 'Primera consulta'}

## INSTRUCCIONES:
1. Responde de manera concisa y útil
2. Usa los lugares de la base de datos cuando sea relevante
3. Proporciona información específica sobre Encarnación
4. Responde en español

## ESTRUCTURA DE RESPUESTA (JSON válido):
{
  "message": "Respuesta clara y útil en español",
  "recommendations": [
    {
      "place": {
        "key": "nombre_lugar",
        "name": "Nombre del lugar",
        "type": "Tipo de lugar",
        "description": "Por qué es relevante para la consulta",
        "address": "Dirección",
        "location": {
          "lat": -27.xxxx,
          "lng": -55.xxxx  
        }
      }
    }
  ]
}

IMPORTANTE: Responde SOLO con JSON válido, sin texto adicional.`
  }

  parseAndValidateResponse(text, type) {
    try {
      // Limpiar texto para extraer JSON válido
      let cleanText = text.trim()
      
      // Buscar el JSON dentro del texto
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0]
      }
      
      const parsed = JSON.parse(cleanText)
      
      // Validar estructura básica según el tipo
      if (type === 'travelPlan') {
        this.validateTravelPlanResponse(parsed)
      } else if (type === 'recommendation') {
        this.validateRecommendationResponse(parsed)
      }
      
      return parsed
    } catch (error) {
      console.warn('Error parsing AI response, returning fallback:', error.message)
      return this.getFallbackResponse(type)
    }
  }

  validateTravelPlanResponse(response) {
    if (!response.message || !response.travelPlan) {
      throw new Error('Invalid travel plan structure')
    }
    
    if (!response.travelPlan.days || !Array.isArray(response.travelPlan.days)) {
      throw new Error('Travel plan must have days array')
    }
  }

  validateRecommendationResponse(response) {
    if (!response.message) {
      throw new Error('Recommendation must have message')
    }
  }

  getFallbackResponse(type) {
    if (type === 'travelPlan') {
      return {
        message: "He generado un plan básico para tu visita a Encarnación. Te recomiendo explorar la Costanera y el centro histórico.",
        travelPlan: {
          totalDays: 1,
          days: [
            {
              dayNumber: 1,
              title: "Exploración de Encarnación",
              activities: [
                {
                  time: "10:00",
                  category: "Turismo",
                  place: {
                    key: "Costanera de Encarnación",
                    name: "Costanera de Encarnación",
                    type: "Entretenimiento",
                    description: "Hermoso paseo junto al río Paraná",
                    address: "Costanera de Encarnación",
                    location: { lat: -27.3309, lng: -55.8663 }
                  }
                }
              ]
            }
          ]
        }
      }
    } else {
      return {
        message: "Te recomiendo visitar la Costanera de Encarnación, es uno de los lugares más hermosos de la ciudad.",
        recommendations: [
          {
            place: {
              key: "Costanera de Encarnación",
              name: "Costanera de Encarnación", 
              type: "Entretenimiento",
              description: "Paseo emblemático junto al río Paraná",
              address: "Costanera de Encarnación",
              location: { lat: -27.3309, lng: -55.8663 }
            }
          }
        ]
      }
    }
  }

  async testConnection() {
    try {
      const model = this.ai.getGenerativeModel({ model: this.models.geminiPro })
      const result = await model.generateContent("Test connection")
      await result.response
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = GoogleAIService

const fs = require('fs')
const path = require('path')
const { GoogleGenerativeAI } = require('@google/generative-ai')

// Inicializar Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

// Controller para endpoints de lugares y AI
class ApiController {
  
  // Helper method para cargar lugares desde el archivo JSON
  static loadLugares() {
    try {
      const lugaresPath = path.join(__dirname, '../../lugares.json')
      const data = fs.readFileSync(lugaresPath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading lugares:', error)
      return []
    }
  }

  // GET /api/lugares - Obtener todos los lugares o filtrar por tipo
  static getLugares(req, res) {
    try {
      const { tipo } = req.query
      let lugares = ApiController.loadLugares()

      if (tipo) {
        lugares = lugares.filter(lugar => 
          lugar.type.toLowerCase().includes(tipo.toLowerCase())
        )
      }

      res.status(200).json(lugares)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to get lugares',
        error: error.message
      })
    }
  }

  // GET /api/lugares/buscar - Buscar lugares por consulta
  static buscarLugares(req, res) {
    try {
      const { q } = req.query
      
      if (!q) {
        return res.status(400).json({
          status: 'error',
          message: 'Query parameter "q" is required'
        })
      }

      const lugares = ApiController.loadLugares()
      const queryLower = q.toLowerCase()
      
      const resultados = lugares.filter(lugar =>
        lugar.key.toLowerCase().includes(queryLower) ||
        lugar.description.toLowerCase().includes(queryLower) ||
        lugar.type.toLowerCase().includes(queryLower) ||
        lugar.address.toLowerCase().includes(queryLower)
      )

      res.status(200).json(resultados)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to search lugares',
        error: error.message
      })
    }
  }

  // GET /api/lugares/aleatorios - Obtener lugares aleatorios
  static getLugaresAleatorios(req, res) {
    try {
      const { cantidad = 3 } = req.query
      const lugares = ApiController.loadLugares()
      
      // Mezclar array y tomar la cantidad solicitada
      const shuffled = [...lugares].sort(() => 0.5 - Math.random())
      const selectedLugares = shuffled.slice(0, parseInt(cantidad))

      res.status(200).json(selectedLugares)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to get random lugares',
        error: error.message
      })
    }
  }

  // POST /api/chat - Procesar mensajes del chat con AI
  static async processChat(req, res) {
    try {
      const { message, context } = req.body
      
      if (!message) {
        return res.status(400).json({
          status: 'error',
          message: 'Message is required'
        })
      }

      // Verificar si se configuró la API key
      if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key_here') {
        return res.status(500).json({
          status: 'error',
          message: 'Google API key not configured'
        })
      }

      // Cargar lugares para el contexto
      const lugares = ApiController.loadLugares()
      
      // Crear el contexto para la AI
      const lugaresContext = lugares.map(lugar => ({
        nombre: lugar.key,
        tipo: lugar.type,
        descripcion: lugar.description,
        direccion: lugar.address,
        ubicacion: lugar.location
      }))

      // Crear el prompt para la AI
      const prompt = `
        Eres un asistente turístico especializado en Encarnación, Paraguay. 
        Tienes acceso a la siguiente información de lugares:

        ${JSON.stringify(lugaresContext, null, 2)}

        Instrucciones:
        1. Responde de manera amigable y profesional
        2. Recomienda lugares específicos basándote en la consulta del usuario
        3. Siempre menciona nombres exactos de lugares de la lista
        4. Proporciona información útil y relevante
        5. Si no encuentras lugares específicos, sugiere explorar las categorías disponibles
        6. Responde en español
        7. Sé conciso pero informativo

        Consulta del usuario: ${message}
        
        Contexto adicional: ${context || 'Primera consulta'}
      `

      // Obtener respuesta de la AI
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const result = await model.generateContent(prompt)
      const response = await result.response
      const aiResponse = response.text()

      // Buscar lugares relevantes basándose en la consulta
      const messageWords = message.toLowerCase().split(' ')
      const relevantLugares = lugares.filter(lugar => {
        const searchText = `${lugar.key} ${lugar.description} ${lugar.type} ${lugar.address}`.toLowerCase()
        return messageWords.some(word => searchText.includes(word))
      })

      // Si no hay lugares relevantes, buscar por tipo
      let suggestedLugares = relevantLugares
      if (suggestedLugares.length === 0) {
        if (message.toLowerCase().includes('hotel') || message.toLowerCase().includes('alojamiento')) {
          suggestedLugares = lugares.filter(lugar => lugar.type === 'Alojamiento').slice(0, 3)
        } else if (message.toLowerCase().includes('comida') || message.toLowerCase().includes('restaurante')) {
          suggestedLugares = lugares.filter(lugar => lugar.type === 'Comida').slice(0, 3)
        } else if (message.toLowerCase().includes('café') || message.toLowerCase().includes('desayuno')) {
          suggestedLugares = lugares.filter(lugar => lugar.type === 'Desayunos y meriendas').slice(0, 3)
        } else if (message.toLowerCase().includes('turismo') || message.toLowerCase().includes('visitar')) {
          suggestedLugares = lugares.filter(lugar => lugar.type === 'Turístico').slice(0, 3)
        } else if (message.toLowerCase().includes('compras') || message.toLowerCase().includes('shopping')) {
          suggestedLugares = lugares.filter(lugar => lugar.type === 'Compras').slice(0, 3)
        }
      }

      // Si aún no hay lugares, tomar algunos aleatorios
      if (suggestedLugares.length === 0) {
        const shuffled = [...lugares].sort(() => 0.5 - Math.random())
        suggestedLugares = shuffled.slice(0, 3)
      }

      res.status(200).json({
        response: aiResponse,
        lugares: suggestedLugares,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      console.error('Error processing chat:', error)
      res.status(500).json({
        status: 'error',
        message: 'Failed to process chat message',
        error: error.message
      })
    }
  }
}

module.exports = ApiController

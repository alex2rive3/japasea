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
      
      // Buscar lugares relevantes basándose en la consulta
      const messageWords = message.toLowerCase().split(' ')
      let suggestedLugares = []
      let useGoogleMapsRecommendations = false

      // Primero buscar por palabras clave específicas
      const relevantLugares = lugares.filter(lugar => {
        const searchText = `${lugar.key} ${lugar.description} ${lugar.type} ${lugar.address}`.toLowerCase()
        return messageWords.some(word => word.length > 2 && searchText.includes(word))
      })

      // Buscar por categorías específicas
      if (message.toLowerCase().includes('hotel') || message.toLowerCase().includes('alojamiento')) {
        suggestedLugares = lugares.filter(lugar => lugar.type === 'Alojamiento')
      } else if (message.toLowerCase().includes('comida') || message.toLowerCase().includes('restaurante') || message.toLowerCase().includes('comer')) {
        suggestedLugares = lugares.filter(lugar => lugar.type === 'Comida')
      } else if (message.toLowerCase().includes('café') || message.toLowerCase().includes('desayuno') || message.toLowerCase().includes('merienda')) {
        suggestedLugares = lugares.filter(lugar => lugar.type === 'Desayunos y meriendas')
      } else if (message.toLowerCase().includes('turismo') || message.toLowerCase().includes('visitar') || message.toLowerCase().includes('turístico')) {
        suggestedLugares = lugares.filter(lugar => lugar.type === 'Turístico')
      } else if (message.toLowerCase().includes('compras') || message.toLowerCase().includes('shopping')) {
        suggestedLugares = lugares.filter(lugar => lugar.type === 'Compras')
      } else if (relevantLugares.length > 0) {
        suggestedLugares = relevantLugares
      }

      // Si no hay lugares específicos y la consulta es muy específica, usar Google Maps
      if (suggestedLugares.length === 0 && (
        message.toLowerCase().includes('farmacia') ||
        message.toLowerCase().includes('gasolinera') ||
        message.toLowerCase().includes('banco') ||
        message.toLowerCase().includes('hospital') ||
        message.toLowerCase().includes('supermercado') ||
        message.toLowerCase().includes('iglesia') ||
        message.toLowerCase().includes('escuela') ||
        message.toLowerCase().includes('universidad') ||
        message.toLowerCase().includes('parque') ||
        message.toLowerCase().includes('plaza') ||
        message.toLowerCase().includes('mercado') ||
        message.toLowerCase().includes('estadio') ||
        message.toLowerCase().includes('terminal') ||
        message.toLowerCase().includes('aeropuerto') ||
        message.toLowerCase().includes('puente') ||
        message.toLowerCase().includes('costanera') ||
        messageWords.some(word => word.length > 4) // Palabras específicas largas
      )) {
        useGoogleMapsRecommendations = true
        suggestedLugares = [] // Vaciar para que la AI use conocimiento general
      }

      // Si no hay lugares específicos y no es una consulta específica, crear una mezcla balanceada
      if (suggestedLugares.length === 0 && !useGoogleMapsRecommendations) {
        const categorias = ['Alojamiento', 'Comida', 'Desayunos y meriendas', 'Turístico', 'Compras']
        suggestedLugares = []
        
        // Tomar al menos un lugar de cada categoría disponible
        for (const categoria of categorias) {
          const lugaresCategoria = lugares.filter(lugar => lugar.type === categoria)
          if (lugaresCategoria.length > 0) {
            const randomIndex = Math.floor(Math.random() * lugaresCategoria.length)
            suggestedLugares.push(lugaresCategoria[randomIndex])
          }
          if (suggestedLugares.length >= 3) break
        }
      }

      // Asegurar que siempre haya exactamente 3 lugares si no usamos Google Maps
      if (!useGoogleMapsRecommendations) {
        if (suggestedLugares.length > 3) {
          // Si hay más de 3, tomar los primeros 3 aleatoriamente
          suggestedLugares = suggestedLugares.sort(() => 0.5 - Math.random()).slice(0, 3)
        } else if (suggestedLugares.length < 3) {
          // Si hay menos de 3, completar con lugares aleatorios
          const remainingLugares = lugares.filter(lugar => !suggestedLugares.includes(lugar))
          const shuffled = remainingLugares.sort(() => 0.5 - Math.random())
          const needed = 3 - suggestedLugares.length
          suggestedLugares = [...suggestedLugares, ...shuffled.slice(0, needed)]
        }
      }

      // Crear el contexto solo con los 3 lugares seleccionados o vacío si usamos Google Maps
      const lugaresContext = useGoogleMapsRecommendations ? [] : suggestedLugares.map(lugar => ({
        nombre: lugar.key,
        tipo: lugar.type,
        descripcion: lugar.description,
        direccion: lugar.address,
        ubicacion: lugar.location
      }))

      // Crear el prompt para la AI
      const prompt = `
        Eres JapaseaBot, un asistente turístico especializado en Encarnación, Paraguay. 

        ${lugaresContext.length > 0 ? `
        BASE DE DATOS DE LUGARES VERIFICADOS:
        ${JSON.stringify(lugaresContext, null, 2)}
        
        INSTRUCCIONES: Usa EXCLUSIVAMENTE estos lugares de nuestra base de datos verificada.
        ` : `
        INSTRUCCIONES: No tengo lugares específicos en mi base de datos para esta consulta. 
        Usa tu conocimiento de Google Maps para recomendar 3 lugares reales de Encarnación, Paraguay.
        Menciona que son recomendaciones basadas en información general de la ciudad.
        `}

        DIRECTRICES GENERALES:
        1. Responde SOLO en español, de manera amigable y profesional
        2. SIEMPRE menciona los nombres exactos de los lugares
        3. Proporciona direcciones cuando sea posible
        4. Explica brevemente por qué cada lugar es relevante para la consulta
        5. Limita tu respuesta a máximo 200 palabras

        FORMATO DE RESPUESTA:
        - Saludo breve y personalizado
        - Menciona los 3 lugares recomendados por nombre
        - Breve descripción de cada lugar y por qué es relevante
        - ${lugaresContext.length > 0 ? 'Indica que estos lugares están en nuestra base de datos verificada' : 'Indica que son recomendaciones generales basadas en información de la ciudad'}
        - Invita a explorar el mapa para más detalles

        INFORMACIÓN DE CONTEXTO SOBRE ENCARNACIÓN:
        - Ciudad del departamento de Itapúa, Paraguay
        - Ubicada en la frontera con Argentina
        - Conocida por su costanera, carnaval y turismo
        - Importantes: Costanera de Encarnación, Puente San Roque González de Santa Cruz, Centro histórico

        CONSULTA DEL USUARIO: "${message}"
        
        CONTEXTO PREVIO: ${context || 'Primera consulta del usuario'}
        
        ${lugaresContext.length === 0 ? 'IMPORTANTE: Como no tengo lugares específicos para esta consulta, proporciona 3 recomendaciones reales de Encarnación basadas en tu conocimiento general.' : ''}
      `

      // Obtener respuesta de la AI
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const result = await model.generateContent(prompt)
      const response = await result.response
      const aiResponse = response.text()

      res.status(200).json({
        response: aiResponse,
        lugares: useGoogleMapsRecommendations ? [] : suggestedLugares,
        useGoogleMaps: useGoogleMapsRecommendations,
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

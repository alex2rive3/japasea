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

      const places = PlacesController.loadPlaces()
      
      const messageWords = message.toLowerCase().split(' ')
      let suggestedPlaces = []
      let useGoogleMapsRecommendations = false

      const relevantPlaces = places.filter(place => {
        const searchText = `${place.key} ${place.description} ${place.type} ${place.address}`.toLowerCase()
        return messageWords.some(word => word.length > 2 && searchText.includes(word))
      })

      if (message.toLowerCase().includes('hotel') || message.toLowerCase().includes('accommodation')) {
        suggestedPlaces = places.filter(place => place.type === 'Accommodation')
      } else if (message.toLowerCase().includes('food') || message.toLowerCase().includes('restaurant') || message.toLowerCase().includes('eat')) {
        suggestedPlaces = places.filter(place => place.type === 'Food')
      } else if (message.toLowerCase().includes('cafe') || message.toLowerCase().includes('breakfast') || message.toLowerCase().includes('snack')) {
        suggestedPlaces = places.filter(place => place.type === 'Breakfast and Snacks')
      } else if (message.toLowerCase().includes('tourism') || message.toLowerCase().includes('visit') || message.toLowerCase().includes('tourist')) {
        suggestedPlaces = places.filter(place => place.type === 'Tourism')
      } else if (message.toLowerCase().includes('shopping') || message.toLowerCase().includes('store')) {
        suggestedPlaces = places.filter(place => place.type === 'Shopping')
      } else if (relevantPlaces.length > 0) {
        suggestedPlaces = relevantPlaces
      }

      if (suggestedPlaces.length === 0 && (
        message.toLowerCase().includes('pharmacy') ||
        message.toLowerCase().includes('gas station') ||
        message.toLowerCase().includes('bank') ||
        message.toLowerCase().includes('hospital') ||
        message.toLowerCase().includes('supermarket') ||
        message.toLowerCase().includes('church') ||
        message.toLowerCase().includes('school') ||
        message.toLowerCase().includes('university') ||
        message.toLowerCase().includes('park') ||
        message.toLowerCase().includes('plaza') ||
        message.toLowerCase().includes('market') ||
        message.toLowerCase().includes('stadium') ||
        message.toLowerCase().includes('terminal') ||
        message.toLowerCase().includes('airport') ||
        message.toLowerCase().includes('bridge') ||
        message.toLowerCase().includes('waterfront') ||
        messageWords.some(word => word.length > 4)
      )) {
        useGoogleMapsRecommendations = true
        suggestedPlaces = []
      }

      if (suggestedPlaces.length === 0 && !useGoogleMapsRecommendations) {
        const categories = ['Accommodation', 'Food', 'Breakfast and Snacks', 'Tourism', 'Shopping']
        suggestedPlaces = []
        
        for (const category of categories) {
          const categoryPlaces = places.filter(place => place.type === category)
          if (categoryPlaces.length > 0) {
            const randomIndex = Math.floor(Math.random() * categoryPlaces.length)
            suggestedPlaces.push(categoryPlaces[randomIndex])
          }
          if (suggestedPlaces.length >= 3) break
        }
      }

      if (!useGoogleMapsRecommendations) {
        if (suggestedPlaces.length > 3) {
          suggestedPlaces = suggestedPlaces.sort(() => 0.5 - Math.random()).slice(0, 3)
        } else if (suggestedPlaces.length < 3) {
          const remainingPlaces = places.filter(place => !suggestedPlaces.includes(place))
          const shuffled = remainingPlaces.sort(() => 0.5 - Math.random())
          const needed = 3 - suggestedPlaces.length
          suggestedPlaces = [...suggestedPlaces, ...shuffled.slice(0, needed)]
        }
      }

      const placesContext = useGoogleMapsRecommendations ? [] : suggestedPlaces.map(place => ({
        name: place.key,
        type: place.type,
        description: place.description,
        address: place.address,
        location: place.location
      }))

      const prompt = `
        You are JapaseaBot, a tourism assistant specialized in Encarnación, Paraguay.

        ${placesContext.length > 0 ? `
        AVAILABLE PLACES DATABASE:
        ${JSON.stringify(placesContext, null, 2)}
        
        INSTRUCTIONS: Use THESE places from our database.
        ` : `
        INSTRUCTIONS: Use your general knowledge to recommend 3 real places in Encarnación, Paraguay.
        The specific places will be provided by the system, but mention that they are recommendations based on updated information.
        `}

        GENERAL GUIDELINES:
        1. Respond ONLY in Spanish, in a friendly and professional manner
        2. ALWAYS mention the exact names of the places
        3. Provide addresses when possible
        4. Briefly explain why each place is relevant to the query
        5. Limit your response to a maximum of 200 words

        RESPONSE FORMAT:
        - Brief personalized greeting
        - Mention the 3 recommended places by name
        - Brief description of each place and why it's relevant
        - Invite to explore the map for more details

        CONTEXT INFORMATION ABOUT ENCARNACIÓN:
        - City in the Itapúa department, Paraguay
        - Located on the border with Argentina
        - Known for its waterfront, carnival and tourism
        - Important: Encarnación Waterfront, San Roque González de Santa Cruz Bridge, Historic center

        USER QUERY: "${message}"
        
        PREVIOUS CONTEXT: ${context || 'First user query'}
        
        ${placesContext.length === 0 ? 'IMPORTANT: Provide 3 relevant recommendations from Encarnación based on your general knowledge.' : ''}
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

      const aiResponse = response.text

      let finalPlaces = suggestedPlaces
      if (useGoogleMapsRecommendations) {
        console.log('Using Google Maps recommendations for:', message)
        finalPlaces = await PlacesController.getGoogleMapsPlaces(message)
        console.log('Final places from Google Maps:', finalPlaces)
      } else {
        console.log('Using database places:', finalPlaces.length, 'places')
      }

      res.status(200).json({
        response: aiResponse,
        places: finalPlaces,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      console.error('Error processing chat:', error)
      res.status(500).json({
        status: 'error',
        message: 'Error al procesar el mensaje de chat',
        error: error.message
      })
    }
  }

  static async getGoogleMapsPlaces(message) {
    try {
      let searchType = 'places'
      if (message.toLowerCase().includes('hotel') || message.toLowerCase().includes('accommodation')) {
        searchType = 'hotels'
      } else if (message.toLowerCase().includes('food') || message.toLowerCase().includes('restaurant') || message.toLowerCase().includes('eat')) {
        searchType = 'restaurants'
      } else if (message.toLowerCase().includes('cafe') || message.toLowerCase().includes('breakfast') || message.toLowerCase().includes('snack')) {
        searchType = 'cafes'
      } else if (message.toLowerCase().includes('tourism') || message.toLowerCase().includes('visit') || message.toLowerCase().includes('tourist')) {
        searchType = 'tourist places'
      } else if (message.toLowerCase().includes('shopping') || message.toLowerCase().includes('store')) {
        searchType = 'shopping centers'
      } else if (message.toLowerCase().includes('pharmacy')) {
        searchType = 'pharmacies'
      } else if (message.toLowerCase().includes('gas station')) {
        searchType = 'gas stations'
      } else if (message.toLowerCase().includes('bank')) {
        searchType = 'banks'
      } else if (message.toLowerCase().includes('hospital')) {
        searchType = 'hospitals'
      } else if (message.toLowerCase().includes('supermarket')) {
        searchType = 'supermarkets'
      } else if (message.toLowerCase().includes('church')) {
        searchType = 'churches'
      } else if (message.toLowerCase().includes('school') || message.toLowerCase().includes('university')) {
        searchType = 'educational institutions'
      } else if (message.toLowerCase().includes('park') || message.toLowerCase().includes('plaza')) {
        searchType = 'parks and plazas'
      }

      const googleMapsPrompt = `
        You are an assistant that extracts specific information about places in Encarnación, Paraguay.

        USER QUERY: "${message}"
        SEARCH TYPE: ${searchType}

        INSTRUCTIONS:
        1. Provide exactly 3 real ${searchType} places in Encarnación, Paraguay
        2. For each place, provide information in strict JSON format
        3. Use real Google Maps coordinates
        4. Include real and specific addresses
        5. Use exact names of establishments that exist in Encarnación

        JSON RESPONSE FORMAT:
        [
          {
            "key": "Exact place name",
            "type": "Appropriate category",
            "description": "Brief description of the place",
            "address": "Exact address with real streets",
            "location": {
              "lat": -27.xxxx,
              "lng": -55.xxxx
            }
          }
        ]

        CONTEXT INFORMATION:
        - Encarnación is located at approximately: -27.3309, -55.8663
        - Main avenues: Costanera, Dr. Francia, Irrazábal, Caballero
        - Important streets: 14 de Mayo, Mcal. Estigarribia, Cerro Corá
        - Commercial area: city center
        - Tourist area: waterfront and surroundings

        RESPOND ONLY WITH THE JSON ARRAY, NO ADDITIONAL TEXT.
      `

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: googleMapsPrompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 0,
          },
        }
      })

      const jsonResponse = response.text.trim()
      console.log('Google Maps raw response:', jsonResponse)

      try {
        const cleanedResponse = jsonResponse.replace(/```json\n?|\n?```/g, '').trim()
        const places = JSON.parse(cleanedResponse)
        
        if (Array.isArray(places) && places.length > 0) {
          const finalPlaces = places.slice(0, 3)
          
          const validatedPlaces = finalPlaces.map((place, index) => ({
            key: place.key || `${searchType} ${index + 1}`,
            type: place.type || 'General',
            description: place.description || `${searchType} recomendado en Encarnación`,
            address: place.address || 'Encarnación, Paraguay',
            location: {
              lat: place.location?.lat || (-27.3309 + (Math.random() - 0.5) * 0.02),
              lng: place.location?.lng || (-55.8663 + (Math.random() - 0.5) * 0.02)
            }
          }))
          
          console.log('Successfully parsed Google Maps places:', validatedPlaces)
          return validatedPlaces
        }
      } catch (parseError) {
        console.error('Error parsing Google Maps response:', parseError)
        console.log('Raw response that failed to parse:', jsonResponse)
      }

      console.log('Falling back to generateFallbackPlaces')
      return PlacesController.generateFallbackPlaces(message, searchType)

    } catch (error) {
      console.error('Error getting Google Maps places:', error)
      return PlacesController.generateFallbackPlaces(message, 'places')
    }
  }

  static generateFallbackPlaces(message, searchType) {
    let type = 'General'
    if (searchType.includes('hotel')) {
      type = 'Accommodation'
    } else if (searchType.includes('restaurant') || searchType.includes('food')) {
      type = 'Food'
    } else if (searchType.includes('cafe')) {
      type = 'Breakfast and Snacks'
    } else if (searchType.includes('tourist')) {
      type = 'Tourism'
    } else if (searchType.includes('shopping')) {
      type = 'Shopping'
    } else if (searchType.includes('pharmacy')) {
      type = 'Services'
    } else if (searchType.includes('bank')) {
      type = 'Services'
    } else if (searchType.includes('gas station')) {
      type = 'Services'
    } else if (searchType.includes('hospital')) {
      type = 'Services'
    } else if (searchType.includes('supermarket')) {
      type = 'Shopping'
    }

    const places = []
    const fallbackData = {
      'hotels': [
        { name: 'Hotel Central Encarnación', address: 'Avda. Dr. Francia c/ 14 de Mayo' },
        { name: 'Posada del Río', address: 'Avda. Costanera c/ Cerro Corá' },
        { name: 'Hotel Plaza', address: 'Mcal. Estigarribia c/ Tomás R. Pereira' }
      ],
      'restaurants': [
        { name: 'Parrilla La Costanera', address: 'Avda. Costanera c/ Dr. Francia' },
        { name: 'Restaurante El Mirador', address: 'Avda. Irrazábal c/ Caballero' },
        { name: 'Pizzería Italiana', address: '14 de Mayo c/ Mcal. Estigarribia' }
      ],
      'cafes': [
        { name: 'Café del Centro', address: 'Avda. Dr. Francia c/ 14 de Mayo' },
        { name: 'Panadería San José', address: 'Avda. Costanera c/ Cerro Corá' },
        { name: 'Heladería Colonial', address: 'Avda. Caballero c/ Lomas Valentinas' }
      ],
      'pharmacies': [
        { name: 'Farmacia San Rafael', address: 'Avda. Dr. Francia c/ 14 de Mayo' },
        { name: 'Farmacia Central', address: 'Mcal. Estigarribia c/ Tomás R. Pereira' },
        { name: 'Farmacia del Pueblo', address: 'Avda. Irrazábal c/ Caballero' }
      ],
      'banks': [
        { name: 'Banco Continental', address: 'Avda. Dr. Francia c/ 14 de Mayo' },
        { name: 'Banco Nacional de Fomento', address: 'Mcal. Estigarribia c/ Tomás R. Pereira' },
        { name: 'Banco Itaú', address: 'Avda. Caballero c/ Lomas Valentinas' }
      ],
      'supermarkets': [
        { name: 'Supermercado Stock', address: 'Avda. Dr. Francia c/ 14 de Mayo' },
        { name: 'Supermercado Real', address: 'Avda. Irrazábal c/ Caballero' },
        { name: 'Autoservicio Central', address: 'Mcal. Estigarribia c/ Tomás R. Pereira' }
      ],
      'tourist places': [
        { name: 'Costanera de Encarnación', address: 'Avda. Costanera' },
        { name: 'Plaza de Armas', address: '14 de Mayo c/ Mcal. Estigarribia' },
        { name: 'Museo de la Ciudad', address: 'Avda. Dr. Francia c/ Cerro Corá' }
      ],
      'default': [
        { name: 'Lugar Recomendado Centro', address: 'Avda. Dr. Francia c/ 14 de Mayo' },
        { name: 'Lugar Recomendado Costanera', address: 'Avda. Costanera' },
        { name: 'Lugar Recomendado Plaza', address: 'Mcal. Estigarribia c/ Tomás R. Pereira' }
      ]
    }

    const data = fallbackData[searchType] || fallbackData['default']
    
    for (let i = 0; i < 3; i++) {
      const item = data[i]
      places.push({
        key: item.name,
        type: type,
        description: `${item.name} - ${searchType} ubicado en Encarnación, Paraguay`,
        address: item.address,
        location: {
          lat: -27.3309 + (Math.random() - 0.5) * 0.02,
          lng: -55.8663 + (Math.random() - 0.5) * 0.02
        }
      })
    }

    console.log('Generated fallback places:', places)
    return places
  }
}

module.exports = PlacesController

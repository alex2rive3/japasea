import type { Place, ChatResponse } from '../types/places'

const API_BASE_URL = 'http://localhost:3001'

export const placesService = {
  async getPlacesByType(type?: string): Promise<Place[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places${type ? `?type=${encodeURIComponent(type)}` : ''}`)
      if (!response.ok) {
        throw new Error('Error al obtener lugares')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching places:', error)
      return []
    }
  },

  async searchPlaces(query: string): Promise<Place[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Error al buscar lugares')
      }
      return await response.json()
    } catch (error) {
      console.error('Error searching places:', error)
      return []
    }
  },

  async getRandomPlaces(count: number = 3): Promise<Place[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places/random?count=${count}`)
      if (!response.ok) {
        throw new Error('Error al obtener lugares aleatorios')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching random places:', error)
      return []
    }
  },

  async processChatMessage(message: string, context?: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context
        })
      })

      if (!response.ok) {
        throw new Error('Error al procesar mensaje de chat')
      }

      const data = await response.json()
      
      return {
        message: data.message || data.response,
        places: data.places || [],
        travelPlan: data.travelPlan,
        timestamp: data.timestamp || new Date().toISOString()
      }
    } catch (error) {
      console.error('Error processing chat message:', error)
      return {
        message: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        places: [],
        timestamp: new Date().toISOString()
      }
    }
  },

  isTravelPlan(response: ChatResponse): response is ChatResponse & { travelPlan: NonNullable<ChatResponse['travelPlan']> } {
    return response.travelPlan !== undefined
  },

  extractAllPlacesFromTravelPlan(response: ChatResponse): Place[] {
    if (!this.isTravelPlan(response)) {
      return response.places || []
    }

    const allPlaces: Place[] = []
    response.travelPlan.days.forEach(day => {
      day.activities.forEach(activity => {
        allPlaces.push(activity.place)
      })
    })
    
    return allPlaces
  }
}

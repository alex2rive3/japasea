import type { Place, ChatResponse } from '../types/places'

const API_BASE_URL = 'http://localhost:3001'

interface ChatHistorySession {
  _id: string
  sessionId: string
  lastActivity: string
  messages: Array<{
    text: string
    sender: 'user' | 'bot'
    timestamp: string
    context?: string
    response?: ChatResponse
  }>
}

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

  async processChatMessage(message: string, context?: string, sessionId?: string): Promise<ChatResponse> {
    try {
      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          context,
          sessionId
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
        timestamp: data.timestamp || new Date().toISOString(),
        sessionId: data.sessionId
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
  },

  async getChatHistory(limit: number = 10): Promise<{ status: string; data: ChatHistorySession[] }> {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const response = await fetch(`${API_BASE_URL}/api/chat/history?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener el historial del chat')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching chat history:', error)
      return { status: 'error', data: [] }
    }
  },

  async getChatSession(sessionId: string): Promise<{ status: string; data: ChatHistorySession | null }> {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const response = await fetch(`${API_BASE_URL}/api/chat/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener la sesión del chat')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching chat session:', error)
      return { status: 'error', data: null }
    }
  }
}

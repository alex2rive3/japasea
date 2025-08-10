import { placesService } from '../../../services/placesService'

class ChatService {
  async getChatHistory(userId: number) {
    try {
      return await placesService.getChatHistory(userId)
    } catch (error) {
      console.error('Error fetching chat history:', error)
      throw error
    }
  }

  async sendMessage(
    userInput: string, 
    _sessionId: string
  ): Promise<{ response: string; places?: any[]; travelPlan?: any }> {
    try {
      // Mock response for now - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        response: `Respuesta a: "${userInput}". Te puedo ayudar con información sobre lugares turísticos en Paraguay.`,
        places: [],
        travelPlan: undefined
      }
    } catch (error) {
      console.error('Error sending message:', error)
      throw new Error('Error al enviar mensaje. Por favor intenta de nuevo.')
    }
  }

  generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  formatTimestamp(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date)
  }

  shouldCreateNewSession(lastActivity: Date): boolean {
    const now = new Date()
    const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60)
    return diffMinutes > 30
  }
}

export const chatService = new ChatService()

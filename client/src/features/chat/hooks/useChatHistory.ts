import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { chatService } from '../services/chatService'
import type { Message } from '../types'

export function useChatHistory() {
  const { user } = useAuth()
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)

  const loadChatHistory = async (): Promise<Message[]> => {
    if (!user) return []
    
    setIsLoadingHistory(true)
    setHistoryError(null)

    try {
      const historyResponse = await chatService.getChatHistory(1)
      
      if (historyResponse.data && historyResponse.data.length > 0) {
        const latestSession = historyResponse.data[0]
        const lastActivity = new Date(latestSession.lastActivity)
        
        if (!chatService.shouldCreateNewSession(lastActivity)) {
          // Convertir mensajes del historial al formato esperado
          const historicalMessages: Message[] = latestSession.messages.map((msg, index) => ({
            id: index + 1,
            text: msg.text || 'Mensaje del historial',
            sender: msg.sender as 'user' | 'bot',
            timestamp: new Date(msg.timestamp || lastActivity),
          }))

          return historicalMessages
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
      setHistoryError('Error al cargar el historial')
    } finally {
      setIsLoadingHistory(false)
    }

    return []
  }

  return {
    loadChatHistory,
    isLoadingHistory,
    historyError
  }
}

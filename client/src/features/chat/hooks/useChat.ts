import { useState } from 'react'
import { chatService } from '../services/chatService'
import type { Message } from '../types/chat.types'
import type { Place } from '../../../types/lugares'

interface UseChatOptions {
  onPlacesUpdate?: (places: Place[]) => void
}

export function useChat(options: UseChatOptions = {}) {
  const { onPlacesUpdate } = options
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente virtual. ¿Cómo puedo ayudarte hoy?',
      type: 'bot',
      user: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [sessionId, setSessionId] = useState<string>(chatService.generateSessionId())
  const [botTyping, setBotTyping] = useState<boolean>(false)

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      type: 'user',
      user: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setBotTyping(true)

    try {
      const response = await chatService.sendMessage(text, sessionId)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        type: 'bot',
        user: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])

      if (response.places && response.places.length > 0 && onPlacesUpdate) {
        onPlacesUpdate(response.places)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, ocurrió un error. Por favor intenta de nuevo.',
        type: 'bot',
        user: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setBotTyping(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: '¡Hola! Soy tu asistente virtual. ¿Cómo puedo ayudarte hoy?',
        type: 'bot',
        user: 'bot',
        timestamp: new Date(),
      },
    ])
    setSessionId(chatService.generateSessionId())
  }

  return {
    messages,
    inputValue,
    setInputValue,
    botTyping,
    sendMessage,
    clearChat,
    sessionId
  }
}

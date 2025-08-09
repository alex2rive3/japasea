import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Divider,
  InputAdornment,
  Chip,
} from '@mui/material'
import { Send, Person, SmartToy, History } from '@mui/icons-material'
import { placesService } from '../services/placesService'
import TravelPlanComponent from './TravelPlanComponent'
import type { Place, TravelPlan } from '../types/places'
import { useAuth } from '../hooks/useAuth'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  places?: Place[]
  travelPlan?: TravelPlan
}

interface ChatComponentProps {
  onPlacesUpdate?: (places: Place[]) => void
}

export const ChatComponent = ({ onPlacesUpdate }: ChatComponentProps) => {
  const { user } = useAuth()
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! Soy tu asistente virtual. ¿Cómo puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [sessionId, setSessionId] = useState<string>(`session-${Date.now()}`)

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior })
    }
  }

  // Cargar historial cuando el componente se monta (si el usuario está autenticado)
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user) {
        try {
          const historyResponse = await placesService.getChatHistory(1)
          if (historyResponse.status === 'success' && historyResponse.data.length > 0) {
            const latestSession = historyResponse.data[0]
            
            // Si hay una sesión reciente (menos de 30 minutos), continuar con ella
            const lastActivity = new Date(latestSession.lastActivity)
            const now = new Date()
            const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60)
            
            if (diffMinutes < 30) {
              setSessionId(latestSession.sessionId)
              
              // Convertir mensajes del historial al formato del componente
              const historicalMessages: Message[] = latestSession.messages.map((msg, index) => ({
                id: index + 1,
                text: msg.text,
                sender: msg.sender,
                timestamp: new Date(msg.timestamp),
                places: Array.isArray(msg.response?.places) ? msg.response?.places : undefined,
                travelPlan: msg.response?.travelPlan?.days ? msg.response?.travelPlan : undefined
              }))
              
              if (historicalMessages.length > 0) {
                setMessages(historicalMessages)
                // esperar a que pinte y bajar al final
                setTimeout(() => scrollToBottom('auto'), 0)
              }
            }
          }
        } catch (error) {
          console.error('Error loading chat history:', error)
        }
      }
    }
    
    loadChatHistory()
  }, [user])

  // Bajar al final cuando cambie el número de mensajes
  useEffect(() => {
    scrollToBottom('smooth')
  }, [messages.length])

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: 'user',
        timestamp: new Date(),
      }

      setMessages([...messages, newMessage])
      const userInput = inputValue
      setInputValue('')

      setTimeout(async () => {
        try {
          const context = messages.slice(-3).map(msg => `${msg.sender}: ${msg.text}`).join('\n')
          
          const chatResponse = await placesService.processChatMessage(userInput, context, sessionId)

          // Actualizar sessionId si viene uno nuevo en la respuesta
          if (chatResponse.sessionId) {
            setSessionId(chatResponse.sessionId)
          }

          const places = chatResponse.places || []
          const allPlaces = placesService.isTravelPlan(chatResponse) 
            ? placesService.extractAllPlacesFromTravelPlan(chatResponse)
            : places

          const botResponse: Message = {
            id: messages.length + 2,
            text: chatResponse.message || 'Respuesta recibida',
            sender: 'bot',
            timestamp: new Date(),
            places: places,
            travelPlan: chatResponse.travelPlan
          }

          setMessages((prev) => [...prev, botResponse])
          
          if (onPlacesUpdate && allPlaces.length > 0) {
            onPlacesUpdate(allPlaces)
          }

        } catch (error) {
          console.error('Error processing chat message:', error)
          const errorResponse: Message = {
            id: messages.length + 2,
            text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
            sender: 'bot',
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorResponse])
        }
      }, 1000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enviar con Enter; salto de línea con Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handlePlaceClick = (place: Place) => {
    if (onPlacesUpdate) {
      onPlacesUpdate([place])
    }
  }

  return (
    <Box sx={{ 
      borderRadius: 2, 
      overflow: 'hidden', 
      height: '100%',
      width: '100%',
      bgcolor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #e9ecef'
    }}>
      <Box sx={{ 
        bgcolor: '#f8f9fa', 
        color: '#2c3e50', 
        p: 3, 
        textAlign: 'left',
        borderBottom: '1px solid #e9ecef',
        flexShrink: 0
      }}>
        <Typography variant="h5" component="h2" sx={{ 
          fontWeight: 600,
          mb: 1,
          color: '#2c3e50'
        }}>
          Chat con Planificador IA
        </Typography>
        <Typography variant="body2" sx={{ 
          color: '#6c757d',
          fontSize: '0.875rem'
        }}>
          Cuéntame tus preferencias de viaje para comenzar.
        </Typography>
        {user && (
          <Chip
            icon={<History />}
            label="Historial guardado"
            size="small"
            sx={{ mt: 1 }}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
      
        <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        minHeight: 0 // Allow flex child to shrink
      }}>
        {/* Área de mensajes */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          p: 2,
          maxWidth: '100%',
          bgcolor: '#ffffff',
          scrollBehavior: 'smooth',
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f8f9fa',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#dee2e6',
            borderRadius: '10px',
            '&:hover': {
              background: '#adb5bd',
            },
          },
          // Firefox scrollbar styling
          scrollbarWidth: 'thin',
          scrollbarColor: '#dee2e6 #f8f9fa',
        }} ref={messagesContainerRef}>
          <List sx={{ 
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            {messages.map((message) => (
              <ListItem key={message.id} sx={{ 
                alignItems: 'flex-start', 
                py: 2, 
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                border: 'none'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {message.sender === 'bot' && (
                    <Avatar 
                      sx={{ 
                        mr: 2, 
                        bgcolor: '#17a2b8',
                        width: 36,
                        height: 36,
                        flexShrink: 0
                      }}
                    >
                      <SmartToy sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}
                  <Box sx={{ 
                    flex: message.sender === 'user' ? '0 1 auto' : 1, 
                    minWidth: 0,
                    maxWidth: message.sender === 'user' ? '80%' : 'calc(100% - 52px)',
                    overflow: 'hidden'
                  }}>
                    <Box
                      sx={{
                        bgcolor: message.sender === 'user' ? '#007bff' : '#f8f9fa',
                        color: message.sender === 'user' ? 'white' : '#495057',
                        p: 2,
                        borderRadius: message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        display: 'inline-block',
                        maxWidth: '100%',
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        boxShadow: message.sender === 'user' ? '0 2px 8px rgba(0,123,255,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                        border: message.sender === 'bot' ? '1px solid #e9ecef' : 'none'
                      }}
                    >
                      <Typography variant="body2" sx={{ 
                        lineHeight: 1.4,
                        fontSize: '0.95rem'
                      }}>
                        {message.text}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ 
                      mt: 0.5, 
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#6c757d',
                      fontSize: '0.75rem',
                      textAlign: message.sender === 'user' ? 'right' : 'left'
                    }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                  {message.sender === 'user' && (
                    <Avatar 
                      sx={{ 
                        ml: 2, 
                        bgcolor: '#007bff',
                        width: 36,
                        height: 36,
                        flexShrink: 0
                      }}
                    >
                      <Person sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}
                </Box>
                
                 {/* Travel Plan Component */}
                 {message.travelPlan && message.sender === 'bot' && (
                  <Box sx={{ 
                    width: '100%', 
                    mt: 2, 
                    ml: message.sender === 'bot' ? 6 : 0,
                    maxWidth: message.sender === 'bot' ? 'calc(100% - 48px)' : '80%',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}>
                    <TravelPlanComponent 
                      travelPlan={message.travelPlan}
                      message={message.text}
                      onPlaceClick={handlePlaceClick}
                    />
                  </Box>
                )}

                 {/* Places List (recomendación simple) como cards */}
                 {Array.isArray(message.places) && message.places.length > 0 && message.sender === 'bot' && (
                   <Box sx={{
                     width: '100%',
                     mt: 2,
                     ml: 6,
                     maxWidth: 'calc(100% - 48px)'
                   }}>
                     <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
                       Recomendaciones
                     </Typography>
                     <Box sx={{ display: 'grid', gap: 1.5 }}>
                       {message.places.map((p, i) => (
                         <Box
                           key={`${p._id || p.id || i}-${i}`}
                           onClick={() => handlePlaceClick(p)}
                           sx={{
                             p: 1.5,
                             borderRadius: 1.5,
                             border: '1px solid #e9ecef',
                             bgcolor: '#ffffff',
                             cursor: 'pointer',
                             transition: 'all 0.2s ease',
                             '&:hover': {
                               bgcolor: '#f8f9fa',
                               transform: 'translateY(-1px)',
                               boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                             }
                           }}
                         >
                           <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.25 }}>
                             {p.key || p.name || 'Lugar sin nombre'}
                           </Typography>
                           {p.address && (
                             <Typography variant="caption" sx={{ color: '#666' }}>
                               {p.address}
                             </Typography>
                           )}
                         </Box>
                       ))}
                     </Box>
                   </Box>
                 )}
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Divider sx={{ bgcolor: '#e9ecef' }} />
        
        {/* Área de entrada */}
        <Box sx={{ p: 3, bgcolor: '#ffffff' }}>
          <TextField
            fullWidth
            size="medium"
            variant="outlined"
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            minRows={1}
            maxRows={6}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                bgcolor: '#f8f9fa',
                border: '1px solid #e9ecef',
                '&:hover': {
                  border: '1px solid #dee2e6',
                },
                '&.Mui-focused': {
                  border: '2px solid #007bff',
                  bgcolor: '#ffffff'
                },
                '& fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                py: 1.5,
                px: 2,
                fontSize: '0.95rem'
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#6c757d',
                opacity: 1
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    size="medium"
                    sx={{
                      bgcolor: inputValue.trim() ? '#007bff' : '#e9ecef',
                      color: inputValue.trim() ? 'white' : '#6c757d',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      mr: 0.5,
                      '&:hover': {
                        bgcolor: inputValue.trim() ? '#0056b3' : '#dee2e6',
                      }
                    }}
                  >
                    <Send sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

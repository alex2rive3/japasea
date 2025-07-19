import React, { useState } from 'react'
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
} from '@mui/material'
import { Send, Person, SmartToy } from '@mui/icons-material'
import { placesService } from '../services/placesService'
import TravelPlanComponent from './TravelPlanComponent'
import type { Place, TravelPlan } from '../types/places'

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! Soy tu asistente virtual. ¿Cómo puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')

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
          
          const chatResponse = await placesService.processChatMessage(userInput, context)

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
        }}>
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
            onKeyPress={handleKeyPress}
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

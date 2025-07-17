import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
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
  height?: string
  onPlacesUpdate?: (places: Place[]) => void
}

export const ChatComponent = ({ height = '500px', onPlacesUpdate }: ChatComponentProps) => {
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
    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', my: 2 }}>
      <Box sx={{ 
        bgcolor: 'secondary.main', 
        color: 'white', 
        p: 2, 
        textAlign: 'center' 
      }}>
        <Typography variant="h6" component="h2">
          <SmartToy sx={{ mr: 1, verticalAlign: 'middle' }} />
          Asistente de Chat
        </Typography>
      </Box>
      
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        {/* Área de mensajes */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
          <List>
            {messages.map((message) => (
              <ListItem key={message.id} sx={{ alignItems: 'flex-start', py: 1, flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <Avatar 
                    sx={{ 
                      mr: 2, 
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                      width: 32,
                      height: 32
                    }}
                  >
                    {message.sender === 'user' ? <Person /> : <SmartToy />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <ListItemText
                      primary={message.text}
                      secondary={message.timestamp.toLocaleTimeString()}
                      primaryTypographyProps={{
                        variant: 'body2',
                        sx: { 
                          bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                          color: message.sender === 'user' ? 'white' : 'text.primary',
                          p: 1,
                          borderRadius: 1,
                          display: 'inline-block',
                          maxWidth: '100%'
                        }
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                        sx: { mt: 0.5, display: 'block' }
                      }}
                    />
                  </Box>
                </Box>
                
                {/* Travel Plan Component */}
                {message.travelPlan && message.sender === 'bot' && (
                  <Box sx={{ width: '100%', mt: 1, ml: 4 }}>
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
        
        <Divider />
        
        {/* Área de entrada */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    size="small"
                  >
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Paper>
  )
}

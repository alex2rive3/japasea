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
import { lugaresService } from '../services/lugaresService'
import type { Lugar } from '../types/lugares'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  lugares?: Lugar[]
}

interface ChatComponentProps {
  height?: string
  onLugaresUpdate?: (lugares: Lugar[]) => void
}

export const ChatComponent = ({ height = '500px', onLugaresUpdate }: ChatComponentProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
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

      // Simular respuesta del bot con lugares
      setTimeout(async () => {
        try {
          let lugares: Lugar[] = []
          
          // Intentar buscar lugares basado en el mensaje del usuario
          if (userInput.toLowerCase().includes('hotel') || userInput.toLowerCase().includes('alojamiento')) {
            lugares = await lugaresService.getLugaresPorTipo('Alojamiento')
          } else if (userInput.toLowerCase().includes('comida') || userInput.toLowerCase().includes('restaurante') || userInput.toLowerCase().includes('comer')) {
            lugares = await lugaresService.getLugaresPorTipo('Comida')
          } else if (userInput.toLowerCase().includes('café') || userInput.toLowerCase().includes('desayuno') || userInput.toLowerCase().includes('merienda')) {
            lugares = await lugaresService.getLugaresPorTipo('Desayunos y meriendas')
          } else if (userInput.toLowerCase().includes('turismo') || userInput.toLowerCase().includes('visitar') || userInput.toLowerCase().includes('turístico')) {
            lugares = await lugaresService.getLugaresPorTipo('Turístico')
          } else if (userInput.toLowerCase().includes('compras') || userInput.toLowerCase().includes('shopping')) {
            lugares = await lugaresService.getLugaresPorTipo('Compras')
          } else {
            // Si no se encuentra una categoría específica, buscar por palabras clave
            lugares = await lugaresService.buscarLugares(userInput)
          }

          // Si no se encontraron lugares específicos, obtener lugares aleatorios
          if (lugares.length === 0) {
            lugares = await lugaresService.getLugaresAleatorios(3)
          }

          // Asegurar que haya al menos 3 lugares
          if (lugares.length < 3) {
            const adicionales = await lugaresService.getLugaresAleatorios(3 - lugares.length)
            lugares = [...lugares, ...adicionales]
          }

          // Tomar solo los primeros 3 lugares para evitar saturar
          lugares = lugares.slice(0, 3)

          const botResponse: Message = {
            id: messages.length + 2,
            text: generateBotResponse(userInput, lugares),
            sender: 'bot',
            timestamp: new Date(),
            lugares: lugares
          }

          setMessages((prev) => [...prev, botResponse])
          
          // Notificar al componente padre sobre los nuevos lugares
          if (onLugaresUpdate) {
            onLugaresUpdate(lugares)
          }
        } catch (error) {
          console.error('Error fetching lugares:', error)
          const errorResponse: Message = {
            id: messages.length + 2,
            text: 'Lo siento, hubo un error al buscar lugares. Por favor, intenta nuevamente.',
            sender: 'bot',
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorResponse])
        }
      }, 1000)
    }
  }

  const generateBotResponse = (userMessage: string, lugares?: Lugar[]): string => {
    if (lugares && lugares.length > 0) {
      const lugaresNames = lugares.map(lugar => lugar.key).join(', ')
      
      if (userMessage.toLowerCase().includes('hotel') || userMessage.toLowerCase().includes('alojamiento')) {
        return `¡Encontré excelentes opciones de alojamiento para ti! Te recomiendo: ${lugaresNames}. Puedes ver su ubicación en el mapa y más detalles en las tarjetas de abajo.`
      } else if (userMessage.toLowerCase().includes('comida') || userMessage.toLowerCase().includes('restaurante') || userMessage.toLowerCase().includes('comer')) {
        return `¡Perfecto! Aquí tienes algunas opciones gastronómicas recomendadas: ${lugaresNames}. Revisa el mapa para ver su ubicación exacta.`
      } else if (userMessage.toLowerCase().includes('café') || userMessage.toLowerCase().includes('desayuno') || userMessage.toLowerCase().includes('merienda')) {
        return `¡Qué buena elección! Te recomiendo estos lugares para desayunar o merendar: ${lugaresNames}. Puedes ver más información en el mapa.`
      } else if (userMessage.toLowerCase().includes('turismo') || userMessage.toLowerCase().includes('visitar') || userMessage.toLowerCase().includes('turístico')) {
        return `¡Excelente! Aquí tienes algunos lugares turísticos que debes visitar: ${lugaresNames}. Están marcados en el mapa para que puedas planificar tu visita.`
      } else if (userMessage.toLowerCase().includes('compras') || userMessage.toLowerCase().includes('shopping')) {
        return `¡Perfecto para ir de compras! Te recomiendo: ${lugaresNames}. Puedes ver su ubicación en el mapa y planificar tu ruta.`
      } else {
        return `Basándome en tu consulta, te recomiendo estos lugares: ${lugaresNames}. Puedes ver su ubicación en el mapa y más detalles en las tarjetas de abajo. ¿Te gustaría saber algo específico sobre alguno de estos lugares?`
      }
    }
    
    const responses = [
      'Interesante pregunta. ¿Podrías contarme más detalles sobre qué tipo de lugar buscas?',
      'Entiendo tu punto. ¿Hay algo específico que te gustaría saber sobre Encarnación?',
      'Gracias por compartir eso conmigo. ¿Cómo puedo ayudarte a encontrar lugares en la ciudad?',
      'Es una buena observación. ¿Qué opinas sobre explorar el mapa interactivo?',
      'Me parece muy útil tu comentario. ¿Necesitas ayuda para encontrar hoteles, restaurantes o lugares turísticos?',
    ]
    
    if (userMessage.toLowerCase().includes('mapa')) {
      return 'Veo que estás interesado en el mapa. Puedes hacer clic en los marcadores para ver más información sobre cada lugar. ¿Qué tipo de lugar te interesa?'
    }
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
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
          Chat Assistant
        </Typography>
      </Box>
      
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        {/* Área de mensajes */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
          <List>
            {messages.map((message) => (
              <ListItem key={message.id} sx={{ alignItems: 'flex-start', py: 1 }}>
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

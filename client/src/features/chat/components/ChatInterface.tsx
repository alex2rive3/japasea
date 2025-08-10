import { Box, Paper, Typography } from '@mui/material'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { TravelPlanDisplay } from './TravelPlanDisplay'
import { useChat } from '../hooks/useChat'
import { useAutoScroll } from '../hooks/useAutoScroll'
import type { TravelPlan } from '../types/chat.types'
import type { Place } from '../../../types/lugares'

interface ChatInterfaceProps {
  travelPlan?: TravelPlan
  onPlacesUpdate?: (places: Place[]) => void
}

export function ChatInterface({ travelPlan, onPlacesUpdate }: ChatInterfaceProps) {
  const {
    messages,
    inputValue,
    botTyping,
    setInputValue,
    sendMessage
  } = useChat({ onPlacesUpdate })

  const { messagesContainerRef } = useAutoScroll(messages)

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue)
      setInputValue('')
    }
  }

  return (
    <Paper
      elevation={3}
      sx={{
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'primary.main',
          color: 'white',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}
      >
        <Typography variant="h6" component="h2">
          💬 Asistente de Turismo
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Tu guía personal para Encarnación
        </Typography>
      </Box>

      {/* Travel Plan Display */}
      {travelPlan && (
        <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
          <TravelPlanDisplay travelPlan={travelPlan} />
        </Box>
      )}

      {/* Messages Area */}
      <MessageList
        messages={messages}
        loading={botTyping}
        containerRef={messagesContainerRef}
      />

      {/* Input Area */}
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={botTyping}
        placeholder="Pregunta sobre lugares turísticos, actividades, restaurantes..."
      />
    </Paper>
  )
}

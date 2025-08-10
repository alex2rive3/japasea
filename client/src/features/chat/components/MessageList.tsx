import { Box, Typography, CircularProgress } from '@mui/material'
import { MessageItem } from './MessageItem'
import type { MessageListProps } from '../types'

export function MessageList({ 
  messages, 
  loading = false,
  containerRef 
}: MessageListProps) {
  const hasMessages = messages && messages.length > 0

  if (!hasMessages && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          p: 3
        }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontStyle: 'italic' }}
        >
          ¡Hola! Soy tu asistente de turismo para Encarnación.
          <br />
          ¿En qué puedo ayudarte hoy?
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        px: 2,
        py: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5
      }}
    >
      {hasMessages && messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
        />
      ))}

      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 2
          }}
        >
          <CircularProgress size={24} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: 1 }}
          >
            Escribiendo...
          </Typography>
        </Box>
      )}
    </Box>
  )
}

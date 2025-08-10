import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
} from '@mui/material'
import { Person, SmartToy } from '@mui/icons-material'
import type { MessageItemProps } from '../types'

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.type === 'user'

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        px: 1
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: isUser ? 'row-reverse' : 'row',
          maxWidth: '80%',
          gap: 1
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            width: 32,
            height: 32
          }}
        >
          {isUser ? <Person fontSize="small" /> : <SmartToy fontSize="small" />}
        </Avatar>

        <Card
          sx={{
            backgroundColor: isUser ? 'primary.light' : 'grey.100',
            boxShadow: 1,
            borderRadius: '16px',
            '& .MuiCardContent-root': {
              '&:last-child': {
                paddingBottom: '12px'
              }
            }
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: isUser ? 'primary.contrastText' : 'text.primary',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {message.text}
            </Typography>
            
            <Typography
              variant="caption"
              sx={{
                color: isUser ? 'primary.contrastText' : 'text.secondary',
                display: 'block',
                mt: 1,
                opacity: 0.8
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

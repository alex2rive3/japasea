import { Container, Typography, Box } from '@mui/material'
import { ChatInterface } from '../index'

export function ChatPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="primary"
        >
          Chat con Asistente de Turismo
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Pregúntame sobre los mejores lugares turísticos de Encarnación,
          restaurantes recomendados, actividades culturales y mucho más.
          ¡Estoy aquí para ayudarte a planificar tu visita perfecta!
        </Typography>
      </Box>

      <ChatInterface />
    </Container>
  )
}

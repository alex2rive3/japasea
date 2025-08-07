import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Divider,
  TextField,
  IconButton,
  Badge,
  Paper,
} from '@mui/material'
import {
  Inbox as InboxIcon,
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Support as SupportIcon,
  Notifications as NotificationIcon,
  Info as InfoIcon,
} from '@mui/icons-material'

export const MessagesComponent = () => {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState('')

  // Datos de ejemplo
  const messages = [
    {
      id: 1,
      from: "Sistema Japasea",
      subject: "¡Bienvenido a Japasea!",
      preview: "Gracias por unirte a nuestra plataforma. Descubre los mejores lugares...",
      time: "2 horas",
      unread: true,
      type: "system",
      avatar: "🎉"
    },
    {
      id: 2,
      from: "Soporte Técnico",
      subject: "Tu consulta ha sido recibida",
      preview: "Hemos recibido tu consulta sobre la aplicación. Te responderemos pronto...",
      time: "1 día",
      unread: false,
      type: "support",
      avatar: "🛟"
    },
    {
      id: 3,
      from: "Notificaciones",
      subject: "Nuevos lugares agregados",
      preview: "Se han agregado 5 nuevos restaurantes en tu zona de interés...",
      time: "3 días",
      unread: false,
      type: "notification",
      avatar: "🍽️"
    },
    {
      id: 4,
      from: "Sistema Japasea",
      subject: "Actualización de términos",
      preview: "Hemos actualizado nuestros términos y condiciones...",
      time: "1 semana",
      unread: false,
      type: "system",
      avatar: "📄"
    }
  ]

  const selectedMessageData = selectedMessage ? messages.find(m => m.id === selectedMessage) : null

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'primary'
      case 'support': return 'success'
      case 'notification': return 'warning'
      default: return 'default'
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aquí iría la lógica para enviar el mensaje
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            fontWeight: 'bold'
          }}
        >
          <InboxIcon color="primary" fontSize="large" />
          Mensajes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Centro de comunicaciones y notificaciones
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 200px)' }}>
        {/* Lista de mensajes */}
        <Card sx={{ flex: 1, maxWidth: 400 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Buscar mensajes..."
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
            <List sx={{ p: 0, maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
              {messages.map((message, index) => (
                <Box key={message.id}>
                  <ListItem
                    button
                    onClick={() => setSelectedMessage(message.id)}
                    selected={selectedMessage === message.id}
                    sx={{
                      bgcolor: message.unread ? 'action.hover' : 'transparent',
                      '&:hover': {
                        bgcolor: 'action.selected'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge 
                        variant="dot" 
                        color="primary" 
                        invisible={!message.unread}
                      >
                        <Avatar sx={{ bgcolor: 'transparent', fontSize: '1.5rem' }}>
                          {message.avatar}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: message.unread ? 'bold' : 'normal',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '200px'
                            }}
                          >
                            {message.from}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {message.time}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: message.unread ? '500' : 'normal',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {message.subject}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              display: 'block'
                            }}
                          >
                            {message.preview}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < messages.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Vista del mensaje seleccionado */}
        <Card sx={{ flex: 2 }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedMessageData ? (
              <>
                {/* Header del mensaje */}
                <Box sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6">
                      {selectedMessageData.subject}
                    </Typography>
                    <IconButton size="small">
                      <MoreIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'transparent', fontSize: '1rem', width: 24, height: 24 }}>
                        {selectedMessageData.avatar}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {selectedMessageData.from}
                      </Typography>
                    </Box>
                    <Chip 
                      label={selectedMessageData.type === 'system' ? 'Sistema' : 
                            selectedMessageData.type === 'support' ? 'Soporte' : 'Notificación'}
                      size="small"
                      color={getMessageTypeColor(selectedMessageData.type) as any}
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Hace {selectedMessageData.time}
                    </Typography>
                  </Box>
                </Box>

                {/* Contenido del mensaje */}
                <Box sx={{ flex: 1, py: 2, overflow: 'auto' }}>
                  <Typography variant="body1" paragraph>
                    {selectedMessageData.preview}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Typography>
                  <Typography variant="body1">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                    culpa qui officia deserunt mollit anim id est laborum.
                  </Typography>
                </Box>

                {/* Respuesta rápida */}
                {selectedMessageData.type === 'support' && (
                  <Paper sx={{ p: 2, mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Responder
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Escribe tu respuesta..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        size="small"
                      />
                      <IconButton 
                        color="primary" 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                )}
              </>
            ) : (
              /* Vista por defecto cuando no hay mensaje seleccionado */
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center'
              }}>
                <InboxIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Selecciona un mensaje
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Elige un mensaje de la lista para ver su contenido
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Panel de acciones rápidas */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button 
          variant="outlined" 
          startIcon={<SupportIcon />}
          size="small"
        >
          Contactar Soporte
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<NotificationIcon />}
          size="small"
        >
          Configurar Notificaciones
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<InfoIcon />}
          size="small"
        >
          Centro de Ayuda
        </Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          🚧 Esta sección está en desarrollo. Próximamente podrás enviar mensajes directos y recibir notificaciones en tiempo real.
        </Typography>
      </Box>
    </Container>
  )
}
import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Chip,
  Divider,
  Alert
} from '@mui/material'
import {
  Notifications as NotificationIcon,
  NotificationsOff as NotificationOffIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  CheckCircle as ReadIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material'
import { adminService } from '../../services/adminService'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: string
  read: boolean
  userId?: string
  userName?: string
  actionUrl?: string
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [sendForm, setSendForm] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    targetUsers: 'all' as 'all' | 'active'
  })

  useEffect(() => {
    // Simular notificaciones
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Nuevo lugar pendiente',
        message: 'Restaurant La Casita requiere aprobación',
        type: 'warning',
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/admin/places'
      },
      {
        id: '2',
        title: 'Nueva reseña reportada',
        message: 'Una reseña ha sido reportada por contenido inapropiado',
        type: 'error',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        actionUrl: '/admin/reviews'
      },
      {
        id: '3',
        title: 'Nuevo usuario registrado',
        message: 'María González se ha registrado',
        type: 'info',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        userName: 'María González'
      }
    ]
    
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.read).length)
  }, [])

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const handleSendNotification = async () => {
    try {
      await adminService.sendBulkNotification({
        title: sendForm.title,
        message: sendForm.message,
        type: sendForm.type as any,
        targetUsers: sendForm.targetUsers
      })
      
      // Agregar a la lista local
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: sendForm.title,
        message: sendForm.message,
        type: sendForm.type,
        timestamp: new Date().toISOString(),
        read: true
      }
      
      setNotifications(prev => [newNotification, ...prev])
      setShowSendDialog(false)
      setSendForm({
        title: '',
        message: '',
        type: 'info',
        targetUsers: 'all'
      })
    } catch (error) {
      console.error('Error enviando notificación:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <WarningIcon sx={{ color: 'warning.main' }} />
      case 'error': return <WarningIcon sx={{ color: 'error.main' }} />
      case 'success': return <CheckCircle sx={{ color: 'success.main' }} />
      default: return <InfoIcon sx={{ color: 'info.main' }} />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `Hace ${minutes} minutos`
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `Hace ${hours} horas`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Botón de notificaciones */}
      <IconButton onClick={() => setShowNotifications(!showNotifications)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationIcon />
        </Badge>
      </IconButton>

      {/* Panel de notificaciones */}
      {showNotifications && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: 400,
            maxHeight: 500,
            overflow: 'hidden',
            mt: 1,
            boxShadow: 3,
            zIndex: 1300
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Notificaciones</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  startIcon={<SendIcon />}
                  onClick={() => setShowSendDialog(true)}
                >
                  Enviar
                </Button>
                {unreadCount > 0 && (
                  <Button size="small" onClick={handleMarkAllAsRead}>
                    Marcar todas como leídas
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>

          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No hay notificaciones"
                  secondary="Las nuevas notificaciones aparecerán aquí"
                />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                  secondaryAction={
                    <Stack direction="row">
                      {!notification.read && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <ReadIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'background.paper' }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {formatTimestamp(notification.timestamp)}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}

      {/* Diálogo para enviar notificación */}
      <Dialog
        open={showSendDialog}
        onClose={() => setShowSendDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enviar Notificación</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Título"
              value={sendForm.title}
              onChange={(e) => setSendForm(prev => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mensaje"
              value={sendForm.message}
              onChange={(e) => setSendForm(prev => ({ ...prev, message: e.target.value }))}
            />
            <TextField
              select
              fullWidth
              label="Tipo"
              value={sendForm.type}
              onChange={(e) => setSendForm(prev => ({ ...prev, type: e.target.value as any }))}
            >
              <MenuItem value="info">Información</MenuItem>
              <MenuItem value="warning">Advertencia</MenuItem>
              <MenuItem value="promotion">Promoción</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Destinatarios"
              value={sendForm.targetUsers}
              onChange={(e) => setSendForm(prev => ({ ...prev, targetUsers: e.target.value as any }))}
            >
              <MenuItem value="all">Todos los usuarios</MenuItem>
              <MenuItem value="active">Solo usuarios activos</MenuItem>
            </TextField>
            <Alert severity="info">
              Esta notificación será enviada a {sendForm.targetUsers === 'all' ? 'todos los usuarios' : 'usuarios activos'} del sistema.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSendDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendNotification}
            disabled={!sendForm.title || !sendForm.message}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

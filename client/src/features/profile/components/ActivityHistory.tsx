import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Alert,
  Card,
  CardContent,
  Chip,
  Stack,
} from '@mui/material'
import {
  History as HistoryIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  RateReview as ReviewIcon,
  Person as PersonIcon,
} from '@mui/icons-material'

// Datos mock para el historial de actividad
const mockActivity = [
  {
    id: 1,
    type: 'favorite',
    description: 'Agregaste "Restaurant Don Vito" a tus favoritos',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    icon: FavoriteIcon,
    color: 'error' as const
  },
  {
    id: 2,
    type: 'search',
    description: 'Buscaste "restaurantes Asunción"',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    icon: SearchIcon,
    color: 'info' as const
  },
  {
    id: 3,
    type: 'review',
    description: 'Escribiste una reseña para "Hotel Guaraní"',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    icon: ReviewIcon,
    color: 'success' as const
  },
  {
    id: 4,
    type: 'profile',
    description: 'Actualizaste tu perfil',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    icon: PersonIcon,
    color: 'primary' as const
  }
]

export function ActivityHistory() {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      favorite: 'Favorito',
      search: 'Búsqueda',
      review: 'Reseña',
      profile: 'Perfil'
    }
    return labels[type] || type
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Historial de Actividad
        </Typography>
      </Box>

      {mockActivity.length === 0 ? (
        <Alert severity="info">
          No hay actividad reciente que mostrar.
        </Alert>
      ) : (
        <List>
          {mockActivity.map((activity) => {
            const IconComponent = activity.icon
            return (
              <ListItem
                key={activity.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  p: 2
                }}
              >
                <ListItemIcon>
                  <IconComponent color={activity.color} />
                </ListItemIcon>
                <ListItemText
                  primary={activity.description}
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <Chip
                        label={getActivityTypeLabel(activity.type)}
                        size="small"
                        variant="outlined"
                        color={activity.color}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(activity.timestamp)}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            )
          })}
        </List>
      )}

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            📊 Próximamente: estadísticas detalladas de tu actividad
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Alert,
  Chip,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  Place as PlaceIcon,
} from '@mui/icons-material'
import { useFavorites } from '../../../hooks/useFavorites'

export function FavoritesList() {
  const { favorites, favoriteCount, removeFavorite } = useFavorites()

  if (favoriteCount === 0) {
    return (
      <Alert severity="info">
        No tienes lugares favoritos aún. ¡Explora y agrega algunos lugares a tus favoritos!
      </Alert>
    )
  }

  const handleRemoveFavorite = async (placeId: string) => {
    try {
      await removeFavorite(placeId)
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <FavoriteIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Mis Favoritos ({favoriteCount})
        </Typography>
      </Box>

      <List>
        {favorites.map((place) => (
          <ListItem
            key={place._id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="remove from favorites"
                onClick={() => handleRemoveFavorite(place._id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemIcon>
              <PlaceIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={place.name}
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {place.address}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={place.type}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

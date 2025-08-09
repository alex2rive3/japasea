
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  FavoriteBorder as FavoriteIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useFavorites } from '../hooks/useFavorites'

export const FavoritesComponent = () => {
  const { favorites, loading, error, refreshFavorites, removeFavorite } = useFavorites()

  const handleRemoveFavorite = async (placeId: string) => {
    try {
      await removeFavorite(placeId)
      await refreshFavorites()
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const handleRefresh = () => {
    refreshFavorites()
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
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
            <FavoriteIcon color="primary" fontSize="large" />
            Mis Favoritos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {favorites.length > 0 
              ? `Tienes ${favorites.length} lugar${favorites.length !== 1 ? 'es' : ''} favorito${favorites.length !== 1 ? 's' : ''}`
              : 'Aún no tienes lugares favoritos'
            }
          </Typography>
        </Box>
        <Tooltip title="Actualizar favoritos">
          <IconButton onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}



      {/* Lista de favoritos */}
      {favorites.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <FavoriteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes favoritos aún
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Descubre lugares desde el chat y marca los que más te gusten como favoritos
            </Typography>
            <Button variant="contained" href="/">
              Ir al Inicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}>
          {favorites.map((place) => (
            <Card 
              key={place._id}
              sx={{ 
                width: { 
                  xs: '100%', 
                  sm: 'calc(50% - 12px)', 
                  md: 'calc(33.333% - 16px)' 
                },
                maxWidth: { xs: '100%', sm: '350px', md: '380px' },
                height: 'auto',
                minHeight: '320px',
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Chip 
                    label={place.type} 
                    size="small" 
                    color="primary" 
                    variant="filled"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 1.5,
                      textTransform: 'capitalize'
                    }}
                  />
                  <Tooltip title="Eliminar de favoritos">
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveFavorite(place._id)}
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'error.main',
                          backgroundColor: 'error.light',
                          opacity: 0.1
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1.5,
                    lineHeight: 1.3
                  }}
                >
                  {place.name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5,
                    flexGrow: 1
                  }}
                >
                  {place.description}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  {place.address && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <LocationIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {place.address}
                      </Typography>
                    </Box>
                  )}

                  {place.rating && place.rating.average && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <StarIcon sx={{ fontSize: 18, mr: 1, color: 'warning.main' }} />
                      <Typography 
                        variant="body2" 
                        color="text.primary"
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}
                      >
                        {place.rating.average.toFixed(1)} ⭐ ({place.rating.count} reseñas)
                      </Typography>
                    </Box>
                  )}

                  {place.favoritedAt && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{
                        fontSize: '0.75rem',
                        fontStyle: 'italic'
                      }}
                    >
                      📅 Agregado: {new Date(place.favoritedAt).toLocaleDateString('es-ES')}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  )
}
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
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
  const { favorites, stats, loading, error, refreshFavorites, removeFavorite } = useFavorites()

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

      {/* Estadísticas */}
      {stats && favorites.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Estadísticas de Favoritos
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(stats.byType).map(([type, count]) => (
                <Chip 
                  key={type}
                  label={`${type}: ${count}`}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
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
        <Grid container spacing={3}>
          {favorites.map((place) => (
            <Grid item xs={12} md={6} lg={4} key={place._id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip 
                      label={place.type} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Tooltip title="Eliminar de favoritos">
                      <IconButton 
                        size="small" 
                        onClick={() => handleRemoveFavorite(place._id)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
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
                      overflow: 'hidden'
                    }}
                  >
                    {place.description}
                  </Typography>

                  {place.address && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {place.address}
                      </Typography>
                    </Box>
                  )}

                  {place.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <StarIcon sx={{ fontSize: 16, mr: 0.5, color: 'warning.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        {place.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  )}

                  {place.favoritedAt && (
                    <Typography variant="caption" color="text.secondary">
                      Agregado: {new Date(place.favoritedAt).toLocaleDateString('es-ES')}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}
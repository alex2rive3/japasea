import React, { useEffect } from 'react';
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
} from '@mui/material';
import {
  FavoriteBorder as FavoriteIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useFavorites } from '../hooks/useFavorites';
import type { Favorite } from '../types';

export const FavoritesComponent: React.FC = () => {
  const { 
    favorites, 
    loading, 
    error, 
    totalCount,
    fetchFavorites, 
    removeFavorite,
    clearError 
  } = useFavorites();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await removeFavorite({ favoriteId });
      // Refresh favorites after removal
      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleRefresh = () => {
    clearError();
    fetchFavorites();
  };

  if (loading && favorites.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
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
            {totalCount > 0 
              ? `Tienes ${totalCount} lugar${totalCount !== 1 ? 'es' : ''} en tus favoritos`
              : 'No tienes lugares favoritos aún'
            }
          </Typography>
        </Box>
        <Tooltip title="Actualizar">
          <IconButton onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Lista de favoritos */}
      {favorites.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <FavoriteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes lugares favoritos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Explora lugares increíbles y agrégalos a tus favoritos para encontrarlos fácilmente
            </Typography>
            <Button variant="contained" href="/">
              Explorar lugares
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
          {favorites.map((favorite: Favorite) => (
            <Card 
              key={favorite.id}
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
                    label={favorite.place?.type || 'Lugar'} 
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
                      onClick={() => handleRemoveFavorite(favorite.id)}
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
                  {favorite.place?.name || 'Lugar sin nombre'}
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
                  {favorite.place?.description || 'Sin descripción disponible'}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  {favorite.place?.address && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <LocationIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {favorite.place.address}
                      </Typography>
                    </Box>
                  )}

                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{
                      fontSize: '0.75rem',
                      fontStyle: 'italic'
                    }}
                  >
                    📅 Agregado el {new Date(favorite.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

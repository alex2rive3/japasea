import { useState } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  Snackbar,
  Alert,
} from '@mui/material'
import {
  Share,
  LocationOn,
} from '@mui/icons-material'
import { usePlaces } from '../hooks/usePlaces'
import { FavoriteButton } from '../../../components/FavoriteButton'
import type { Place } from '../types'

interface FeaturedPlaceCardProps {
  place: Place
  onPlaceClick?: (place: Place) => void
}

export const FeaturedPlaceCard = ({
  place,
  onPlaceClick,
}: FeaturedPlaceCardProps) => {
  const { selectPlace } = usePlaces()
  const [shareNotification, setShareNotification] = useState(false)

  const handleCardClick = () => {
    selectPlace(place)
    onPlaceClick?.(place)
  }

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.key,
          text: place.description,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      await navigator.clipboard.writeText(
        `${place.key}\n${place.description}\n${window.location.href}`
      )
      setShareNotification(true)
    }
  }

  // Get type color
  const getTypeColor = (type: string) => {
    const colors = {
      'Alojamiento': '#1976d2',
      'Gastronomía': '#d32f2f', 
      'Desayunos y meriendas': '#f57c00',
      'Entretenimiento': '#7b1fa2',
      'Comercios': '#388e3c',
      'Servicios': '#455a64',
    }
    return colors[type as keyof typeof colors] || '#757575'
  }
  
  const typeColor = getTypeColor(place.type)
  const imageUrl = place.images?.[0] || '/api/placeholder/300/200'

  return (
    <>
      <Card 
        onClick={handleCardClick}
        sx={{
          maxWidth: 350,
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={imageUrl}
            alt={place.key}
            sx={{
              objectFit: 'cover',
            }}
          />
          <Box 
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 1,
            }}
          >
            <FavoriteButton
              placeId={place.key}
              size="small"
            />
            <IconButton
              onClick={handleShareClick}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 1)',
                },
                width: 36,
                height: 36,
              }}
            >
              <Share sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
          <Chip
            label={place.type}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              bgcolor: typeColor,
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              color: 'text.primary',
              lineHeight: 1.3,
            }}
          >
            {place.key}
          </Typography>
          
          {place.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating 
                value={place.rating} 
                precision={0.1} 
                size="small" 
                readOnly 
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                ({place.rating.toFixed(1)})
              </Typography>
            </Box>
          )}
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {place.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ color: 'text.secondary', mr: 0.5, fontSize: 18 }} />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              {place.address}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={shareNotification}
        autoHideDuration={3000}
        onClose={() => setShareNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShareNotification(false)} 
          severity="success"
          variant="filled"
        >
          Enlace copiado al portapapeles
        </Alert>
      </Snackbar>
    </>
  )
}

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
} from '@mui/material'
import {
  FavoriteBorder,
  Share,
  LocationOn,
} from '@mui/icons-material'

interface FeaturedPlaceCardProps {
  title: string
  description: string
  imageUrl?: string
  rating?: number
  category: string
  location: string
  onFavoriteClick?: () => void
  onShareClick?: () => void
}

export const FeaturedPlaceCard = ({
  title,
  description,
  imageUrl = '/api/placeholder/300/200',
  rating = 4.5,
  category,
  location,
  onFavoriteClick,
  onShareClick,
}: FeaturedPlaceCardProps) => {
  return (
    <Card 
      sx={{
        maxWidth: 350,
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden',
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
          alt={title}
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
          <IconButton
            onClick={onFavoriteClick}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 1)',
              },
              width: 36,
              height: 36,
            }}
          >
            <FavoriteBorder sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            onClick={onShareClick}
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
          label={category}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
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
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating 
            value={rating} 
            precision={0.1} 
            size="small" 
            readOnly 
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            ({rating})
          </Typography>
        </Box>
        
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
          {description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ color: 'text.secondary', mr: 0.5, fontSize: 18 }} />
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: '0.875rem' }}
          >
            {location}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

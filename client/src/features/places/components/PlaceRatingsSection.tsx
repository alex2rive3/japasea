import {
  Box,
  Typography,
  Stack,
  Rating,
  Chip
} from '@mui/material'
import type { PlaceRatingsSectionProps } from '../types/place.types'

export function PlaceRatingsSection({ place }: PlaceRatingsSectionProps) {
  // Check if place has reviews property (it might be dynamically added)
  const reviews = (place as any).reviews
  
  if (!reviews || reviews.length === 0) {
    return null
  }

  const averageRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Reseñas ({reviews.length})
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Rating value={averageRating} readOnly precision={0.1} />
        <Typography variant="body2" sx={{ ml: 1 }}>
          {averageRating.toFixed(1)} de 5 estrellas
        </Typography>
      </Box>

      <Stack spacing={2}>
        {reviews.slice(0, 3).map((review: any, index: number) => (
          <Box 
            key={index} 
            sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: 'divider',
              borderRadius: 1 
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 1 
            }}>
              <Typography variant="subtitle2" fontWeight="medium">
                {review.userName || 'Usuario anónimo'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Rating 
                  value={review.rating} 
                  readOnly 
                  size="small"
                />
                <Chip
                  label={review.rating}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              </Stack>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              {review.comment}
            </Typography>
            
            {review.date && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ mt: 1, display: 'block' }}
              >
                {new Date(review.date).toLocaleDateString('es-ES')}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

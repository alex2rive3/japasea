import {
  Box,
  Grid,
  Card,
  CardMedia
} from '@mui/material'
import { usePlaceImages } from '../hooks/usePlaceImages'
import type { PlaceImageGalleryProps } from '../types/place.types'

export function PlaceImageGallery({ 
  images, 
  placeName
}: PlaceImageGalleryProps) {
  const { imageError, handleImageError } = usePlaceImages(null)

  return (
    <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
      <Grid container spacing={0.5} sx={{ height: '100%' }}>
        {images.slice(0, 4).map((image, index) => (
          <Grid 
            key={index}
            size={images.length === 1 ? 12 : 6} 
            sx={{ 
              height: images.length === 1 ? '100%' : '50%' 
            }}
          >
            <Card sx={{ height: '100%', borderRadius: 0 }}>
              <CardMedia
                component="img"
                height="100%"
                image={imageError[`image-${index}`] ? undefined : image.url}
                alt={image.caption || placeName}
                onError={() => handleImageError(`image-${index}`)}
                sx={{
                  objectFit: 'cover',
                  bgcolor: 'grey.200'
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

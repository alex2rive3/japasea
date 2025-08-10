import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip
} from '@mui/material'
import {
  LocationOn,
  Phone
} from '@mui/icons-material'
import { FavoriteButton } from '../../../components/FavoriteButton'
import { MapDataUtils } from '../utils/mapUtils'
import type { MapPopupProps } from '../types/map.types'

export function MapPopup({ place }: MapPopupProps) {
  const phone = MapDataUtils.extractPhoneFromDescription(place.description)
  const cleanDescription = MapDataUtils.cleanDescriptionText(place.description)
  const typeColor = MapDataUtils.getTypeColor(place.type)

  return (
    <Card sx={{ minWidth: 250, maxWidth: 300, boxShadow: 'none' }}>
      <CardContent sx={{ pb: '16px !important' }}>
        {/* Header with title and actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 1 
        }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ fontWeight: 'bold', flexGrow: 1 }}
          >
            {place.key || place.name || 'Lugar'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip 
              label={place.type || 'Lugar'} 
              color={typeColor}
              size="small"
            />
            <FavoriteButton 
              placeId={place._id || place.key || ''}
              placeName={place.key || place.name || ''}
              size="small"
            />
          </Box>
        </Box>
        
        {/* Address */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ 
            color: 'text.secondary', 
            mr: 1, 
            fontSize: 16 
          }} />
          <Typography variant="body2" color="text.secondary">
            {place.address}
          </Typography>
        </Box>
        
        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.primary" 
          sx={{ mb: 1 }}
        >
          {cleanDescription}
        </Typography>
        
        {/* Phone */}
        {phone && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 1 
          }}>
            <Phone sx={{ 
              color: 'text.secondary', 
              mr: 1, 
              fontSize: 16 
            }} />
            <Typography variant="body2" color="primary">
              {phone}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

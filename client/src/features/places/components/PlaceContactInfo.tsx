import {
  Box,
  Typography,
  Stack,
  Chip
} from '@mui/material'
import {
  LocationOn,
  Phone,
  Email,
  Language,
  Schedule
} from '@mui/icons-material'
import type { PlaceContactInfoProps } from '../types/place.types'

export function PlaceContactInfo({ place }: PlaceContactInfoProps) {
  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      {/* Basic Info */}
      <Box>
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
          {place.description}
        </Typography>
        
        {place.type && (
          <Chip 
            label={place.type} 
            color="primary" 
            variant="outlined" 
            sx={{ mb: 2 }} 
          />
        )}
      </Box>

      {/* Contact Details */}
      <Stack spacing={1.5}>
        {place.address && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ 
              mr: 2, 
              color: 'primary.main',
              fontSize: 20 
            }} />
            <Typography variant="body2">
              {place.address}
            </Typography>
          </Box>
        )}
        
        {place.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Phone sx={{ 
              mr: 2, 
              color: 'primary.main',
              fontSize: 20 
            }} />
            <Typography variant="body2">
              {place.phone}
            </Typography>
          </Box>
        )}
        
        {place.email && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Email sx={{ 
              mr: 2, 
              color: 'primary.main',
              fontSize: 20 
            }} />
            <Typography variant="body2">
              {place.email}
            </Typography>
          </Box>
        )}
        
        {place.website && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Language sx={{ 
              mr: 2, 
              color: 'primary.main',
              fontSize: 20 
            }} />
            <Typography variant="body2">
              {place.website}
            </Typography>
          </Box>
        )}
        
        {place.openingHours && place.openingHours.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Schedule sx={{ 
              mr: 2, 
              color: 'primary.main',
              fontSize: 20,
              mt: 0.2
            }} />
            <Stack spacing={0.5}>
              <Typography variant="body2" fontWeight="medium">
                Horarios de atención:
              </Typography>
              {place.openingHours.map((hours: string, index: number) => (
                <Typography 
                  key={index} 
                  variant="body2" 
                  color="text.secondary"
                >
                  {hours}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Stack>
  )
}

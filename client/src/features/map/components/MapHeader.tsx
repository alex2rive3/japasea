import { Box, Typography } from '@mui/material'
import type { MapHeaderProps } from '../types/map.types'

export function MapHeader({ 
  title = "Mapa Interactivo",
  subtitle = "Explora destinos, hoteles y actividades."
}: MapHeaderProps) {
  return (
    <Box sx={{ 
      p: 3,
      pb: 2,
      bgcolor: '#f8f9fa',
      borderBottom: '1px solid #e9ecef',
      flexShrink: 0
    }}>
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          fontWeight: 600,
          color: '#2c3e50',
          mb: 1,
          fontSize: '1.5rem'
        }}
      >
        {title}
      </Typography>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#6c757d',
          fontSize: '0.875rem'
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  )
}

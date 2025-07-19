import { useState } from 'react'
import { Box } from '@mui/material'
import { MapComponent } from './MapComponent'
import { ChatComponent } from './ChatComponent'
import type { Place } from '../types/places'

export function HomeComponent() {
  const [places, setPlaces] = useState<Place[]>([])

  const handlePlacesUpdate = (newPlaces: Place[]) => {
    setPlaces(newPlaces)
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 1,
      flexDirection: { xs: 'column', md: 'row' },
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      p: 1
    }}>
      {/* Chat Component - Left Half on desktop, top on mobile */}
      <Box sx={{ 
        flex: 1,
        minWidth: 0,
        minHeight: { xs: 0, md: 'auto' },
        overflow: 'hidden',
        borderRadius: 0,
        boxShadow: 'none',
        bgcolor: '#ffffff'
      }}>
        <ChatComponent 
          onPlacesUpdate={handlePlacesUpdate}
        />
      </Box>
      
      {/* Map Component - Right Half on desktop, bottom on mobile */}
      <Box sx={{ 
        flex: 1,
        minWidth: 0,
        minHeight: { xs: 0, md: 'auto' },
        overflow: 'hidden',
        borderRadius: 0,
        boxShadow: 'none',
        bgcolor: '#ffffff'
      }}>
        <MapComponent 
          places={places}
        />
      </Box>
    </Box>
  )
}

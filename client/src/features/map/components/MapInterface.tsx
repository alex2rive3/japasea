import { Box } from '@mui/material'
import { MapHeader } from './MapHeader'
import { InteractiveMapContainer } from './InteractiveMapContainer'
import { useMapData } from '../hooks/useMapData'
import type { MapComponentProps } from '../types/map.types'

export function MapInterface({ 
  center, 
  zoom, 
  places = [] 
}: MapComponentProps) {
  const { mapCenter, mapZoom, places: mapPlaces } = useMapData({
    center,
    zoom,
    places
  })

  return (
    <Box sx={{ 
      bgcolor: 'background.paper',
      borderRadius: 0,
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: 'none'
    }}>
      <MapHeader />
      
      <InteractiveMapContainer
        center={mapCenter}
        zoom={mapZoom}
        places={mapPlaces}
      />
    </Box>
  )
}

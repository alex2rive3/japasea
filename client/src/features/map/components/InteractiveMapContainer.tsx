import { MapContainer, TileLayer } from 'react-leaflet'
import { Box } from '@mui/material'
import { MapMarker } from './MapMarker'
import { useMapInstance } from '../hooks/useMapInstance'
import type { MapContainerProps } from '../types/map.types'
import 'leaflet/dist/leaflet.css'

export function InteractiveMapContainer({ 
  center, 
  zoom, 
  places,
  onMapReady
}: MapContainerProps) {
  const { handleMapReady } = useMapInstance()

  const onMapCreated = (map: L.Map) => {
    handleMapReady(map)
    onMapReady?.(map)
  }

  return (
    <Box sx={{ 
      flex: 1,
      position: 'relative',
      minHeight: 0,
      width: '100%',
      overflow: 'hidden',
      borderRadius: 0
    }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ 
          height: '100%', 
          width: '100%',
          zIndex: 1
        }}
        key={`${places.length}-${center.join(',')}`}
        scrollWheelZoom={true}
        zoomControl={true}
        ref={onMapCreated}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {places.map((place, index) => (
          <MapMarker
            key={place._id || place.id || place.key || index}
            place={place}
            index={index}
          />
        ))}
      </MapContainer>
    </Box>
  )
}

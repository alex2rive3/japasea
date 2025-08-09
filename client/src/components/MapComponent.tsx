import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Box, Typography, Card, CardContent, Chip } from '@mui/material'
import { LocationOn, Phone } from '@mui/icons-material'
import { useEffect, useRef } from 'react'
import type { Place } from '../types/places'
import { FavoriteButton } from './FavoriteButton'

const iconPrototype = L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown }
delete iconPrototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapComponentProps {
  center?: [number, number]
  zoom?: number
  places?: Place[]
}

export const MapComponent = ({ 
  center = [-27.3328, -55.8664], // More centered on Encarnación city
  zoom = 15, // Closer zoom to see the city better
  places = []
}: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // Force map to invalidate size when component mounts or resizes
    const handleResize = () => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.invalidateSize()
        }, 100)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Call once on mount

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const extractPhone = (description: string): string | null => {
    const phoneRegex = /(\d{4}\s?\d{3}\s?\d{3})/g
    const match = description.match(phoneRegex)
    return match ? match[0] : null
  }

  const getTypeColor = (type: string | undefined): "primary" | "secondary" | "success" | "warning" | "info" => {
    if (!type) return 'primary'
    
    switch (type.toLowerCase()) {
      case 'alojamiento':
        return 'primary'
      case 'desayunos y meriendas':
        return 'secondary'
      case 'comida':
        return 'warning'
      case 'turístico':
        return 'success'
      case 'compras':
        return 'info'
      default:
        return 'primary'
    }
  }

  const mapCenter = places.length > 0 
    ? [places[0].location.lat, places[0].location.lng] as [number, number]
    : center

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
      {/* Header Section */}
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
          Mapa Interactivo
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#6c757d',
            fontSize: '0.875rem'
          }}
        >
          Explora destinos, hoteles y actividades.
        </Typography>
      </Box>

      {/* Map Container */}
      <Box sx={{ 
        flex: 1,
        position: 'relative',
        minHeight: 0, // Allow flex child to shrink
        width: '100%',
        overflow: 'hidden',
        borderRadius: 0 // Remove border radius for full coverage
      }}>
        <MapContainer 
          center={mapCenter} 
          zoom={zoom} 
          style={{ 
            height: '100%', 
            width: '100%',
            zIndex: 1
          }}
          key={`${places.length}-${mapCenter.join(',')}`}
          scrollWheelZoom={true}
          zoomControl={true}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {places.map((place, index) => {
            const phone = extractPhone(place.description)
            const uniqueKey = place.id || place._id || `${place.key}-${index}`
            
            return (
              <Marker 
                key={uniqueKey} 
                position={[place.location.lat, place.location.lng]}
              >
                <Popup>
                  <Card sx={{ minWidth: 250, maxWidth: 300, boxShadow: 'none' }}>
                    <CardContent sx={{ pb: '16px !important' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                          {place.key}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Chip 
                            label={place.type || 'Lugar'} 
                            color={getTypeColor(place.type)}
                            size="small"
                          />
                          <FavoriteButton 
                            placeId={place._id || place.key}
                            placeName={place.key}
                            size="small"
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ color: 'text.secondary', mr: 1, fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                          {place.address}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                        {place.description.replace(/Teléfono:.*/, '').trim()}
                      </Typography>
                      
                      {phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Phone sx={{ color: 'text.secondary', mr: 1, fontSize: 16 }} />
                          <Typography variant="body2" color="primary">
                            {phone}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </Box>
    </Box>
  )
}

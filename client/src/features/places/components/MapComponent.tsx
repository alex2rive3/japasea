import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Box, Typography, Button, Chip } from '@mui/material'
import { LocationOn, Phone, Info } from '@mui/icons-material'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'
import 'leaflet/dist/leaflet.css'
import type { Place as PlaceType } from '../types'
import { FavoriteButton } from '../../../components/FavoriteButton'
import { extractPhone } from '../utils/phoneUtils'
import { usePlaces } from '../hooks/usePlaces'

interface MapComponentProps {
  center?: [number, number]
  zoom?: number
  onPlaceClick?: (place: PlaceType) => void
}

const DEFAULT_CENTER: [number, number] = [-27.3356, -55.8739]
const DEFAULT_ZOOM = 14

const getMarkerColor = (type: string | undefined): string => {
  if (!type) return 'red'
  
  switch (type.toLowerCase()) {
    case 'accommodation':
      return 'blue'
    case 'breakfast and snacks':
      return 'orange'
    case 'food':
      return 'green'
    case 'tourism':
      return 'violet'
    case 'shopping':
      return 'grey'
    default:
      return 'red'
  }
}

const createColoredIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export const MapComponent: React.FC<MapComponentProps> = ({
  onPlaceClick,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM
}) => {
  const { t } = useTranslation()
  const { places, selectedPlace, fetchPlaces } = usePlaces()
  const mapRef = useRef<L.Map | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>(center)
  const [mapZoom, setMapZoom] = useState<number>(zoom)

  // Fetch places when component mounts
  useEffect(() => {
    fetchPlaces()
  }, [fetchPlaces])

  useEffect(() => {
    if (selectedPlace && mapRef.current) {
      const newCenter: [number, number] = [selectedPlace.location.lat, selectedPlace.location.lng]
      setMapCenter(newCenter)
      setMapZoom(16)
      mapRef.current.setView(newCenter, 16)
    }
  }, [selectedPlace])

  const getTypeColor = (type: string | undefined) => {
    if (!type) return 'primary'
    
    switch (type.toLowerCase()) {
      case 'accommodation':
        return 'secondary'
      case 'breakfast and snacks':
        return 'warning'
      case 'food':
        return 'success'
      case 'tourism':
        return 'success'
      case 'shopping':
        return 'info'
      default:
        return 'primary'
    }
  }

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        ref={(map) => {
          if (map) {
            mapRef.current = map
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {places.map((place: PlaceType) => {
          const markerColor = getMarkerColor(place.type)
          const icon = createColoredIcon(markerColor)
          const phone = extractPhone(place.description)
          const cleanDescription = place.description.replace(/Teléfono:.*/, '').trim()
          
          return (
            <Marker
              key={place.key}
              position={[place.location.lat, place.location.lng]}
              icon={icon}
            >
              <Popup maxWidth={300} minWidth={250}>
                <Box sx={{ p: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography 
                      variant="h6" 
                      component="h4" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        color: 'primary.main',
                        pr: 1,
                        flex: 1
                      }}
                    >
                      {place.key}
                    </Typography>
                    <FavoriteButton placeId={place.key} placeName={place.key} size="small" />
                  </Box>
                  
                  <Chip 
                    label={place.type || t('places.place')} 
                    color={getTypeColor(place.type)}
                    size="small"
                    sx={{ mb: 1.5, fontSize: '0.75rem' }}
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                    <LocationOn sx={{ color: 'primary.main', mr: 0.5, fontSize: 16, mt: 0.2 }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ fontSize: '0.8rem', lineHeight: 1.3 }}
                    >
                      {place.address}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.primary" 
                    sx={{ 
                      mb: 1.5, 
                      fontSize: '0.8rem',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {cleanDescription}
                  </Typography>
                  
                  {phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Phone sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
                      <Typography 
                        component="a" 
                        href={`tel:${phone}`}
                        sx={{ 
                          color: 'success.main',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 'medium',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {phone}
                      </Typography>
                    </Box>
                  )}
                  
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => onPlaceClick?.(place)}
                    startIcon={<Info sx={{ fontSize: 14 }} />}
                    fullWidth
                    sx={{ 
                      fontSize: '0.75rem',
                      textTransform: 'none',
                      py: 0.5
                    }}
                  >
                    {t('places.viewDetails')}
                  </Button>
                </Box>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </Box>
  )
}

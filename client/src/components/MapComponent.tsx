import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Box, Paper, Typography, Card, CardContent, Chip } from '@mui/material'
import { LocationOn, Phone } from '@mui/icons-material'
import type { Lugar } from '../types/lugares'

// Fix para los iconos de Leaflet
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
  height?: string
  lugares?: Lugar[]
}

export const MapComponent = ({ 
  center = [-27.331130101011254, -55.865929123942415], // Encarnación, Paraguay
  zoom = 13,
  height = '400px',
  lugares = []
}: MapComponentProps) => {
  const extractPhone = (description: string): string | null => {
    const phoneRegex = /(\d{4}\s?\d{3}\s?\d{3})/g
    const match = description.match(phoneRegex)
    return match ? match[0] : null
  }

  const getTypeColor = (type: string): "primary" | "secondary" | "success" | "warning" | "info" => {
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

  // Si hay lugares, centrar el mapa en el primer lugar
  const mapCenter = lugares.length > 0 
    ? [lugares[0].location.lat, lugares[0].location.lng] as [number, number]
    : center

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', my: 2 }}>
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 2, 
        textAlign: 'center' 
      }}>
        <Typography variant="h6" component="h2">
          <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
          Mapa Interactivo - Encarnación, Paraguay
        </Typography>
      </Box>
      <Box sx={{ height, width: '100%' }}>
        <MapContainer 
          center={mapCenter} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          key={lugares.length} // Forzar re-render cuando cambien los lugares
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {lugares.map((lugar) => {
            const phone = extractPhone(lugar.description)
            
            return (
              <Marker 
                key={lugar.key} 
                position={[lugar.location.lat, lugar.location.lng]}
              >
                <Popup>
                  <Card sx={{ minWidth: 250, maxWidth: 300, boxShadow: 'none' }}>
                    <CardContent sx={{ pb: '16px !important' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                          {lugar.key}
                        </Typography>
                        <Chip 
                          label={lugar.type} 
                          color={getTypeColor(lugar.type)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ color: 'text.secondary', mr: 1, fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                          {lugar.address}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                        {lugar.description.replace(/Teléfono:.*/, '').trim()}
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
    </Paper>
  )
}

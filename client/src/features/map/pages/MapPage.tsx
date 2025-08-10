import { Container, Typography, Box } from '@mui/material'
import { MapInterface } from '../components/MapInterface'
import type { Place } from '../../../types/places'

interface MapPageProps {
  places?: Place[]
}

export function MapPage({ places = [] }: MapPageProps) {
  return (
    <Container maxWidth="xl" sx={{ py: 2, height: '100vh' }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          color="primary"
          sx={{ textAlign: 'center' }}
        >
          Mapa de Encarnación
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto'
          }}
        >
          Descubre todos los lugares turísticos, restaurantes y puntos de interés
          de Encarnación en nuestro mapa interactivo.
        </Typography>
      </Box>

      <Box sx={{ height: '80vh' }}>
        <MapInterface places={places} />
      </Box>
    </Container>
  )
}

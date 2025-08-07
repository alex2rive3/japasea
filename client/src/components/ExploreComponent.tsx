import React from 'react'
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
} from '@mui/material'
import {
  Explore as ExploreIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
} from '@mui/icons-material'

export const ExploreComponent = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            fontWeight: 'bold'
          }}
        >
          <ExploreIcon color="primary" fontSize="large" />
          Explorar Lugares
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Descubre los mejores lugares de Encarnación, Paraguay
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Lugares Turísticos</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Explora los destinos más populares y atracciones principales de la ciudad.
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label="Playas" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Museos" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Parques" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Historia" size="small" sx={{ mr: 1, mb: 1 }} />
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<SearchIcon />}
                fullWidth
              >
                Buscar Lugares Turísticos
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">🍽️ Gastronomía</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Encuentra los mejores restaurantes y experiencias culinarias locales.
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label="Comida Paraguaya" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Parrillas" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Cafeterías" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Postres" size="small" sx={{ mr: 1, mb: 1 }} />
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<SearchIcon />}
                fullWidth
              >
                Explorar Restaurantes
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">🏨 Alojamiento</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Descubre hoteles, hostales y opciones de hospedaje.
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label="Hoteles" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Hostales" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Apartamentos" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="B&B" size="small" sx={{ mr: 1, mb: 1 }} />
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<SearchIcon />}
                fullWidth
              >
                Buscar Alojamiento
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">🛍️ Entretenimiento</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Actividades nocturnas, compras y entretenimiento.
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label="Vida Nocturna" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Compras" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Eventos" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Deportes" size="small" sx={{ mr: 1, mb: 1 }} />
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<SearchIcon />}
                fullWidth
              >
                Explorar Entretenimiento
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          🚧 Esta sección está en desarrollo. Próximamente podrás explorar lugares con filtros avanzados y mapa interactivo.
        </Typography>
      </Box>
    </Container>
  )
}
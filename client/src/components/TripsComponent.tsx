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
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import {
  CardTravel as TripIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Flight as FlightIcon,
} from '@mui/icons-material'

export const TripsComponent = () => {
  // Datos de ejemplo para mostrar la interfaz
  const upcomingTrips = [
    {
      id: 1,
      title: "Weekend en la Costanera",
      dates: "15-17 Mar 2024",
      places: 3,
      status: "Próximo"
    },
    {
      id: 2,
      title: "Tour Gastronómico",
      dates: "22-23 Mar 2024", 
      places: 5,
      status: "Planificando"
    }
  ]

  const pastTrips = [
    {
      id: 3,
      title: "Exploración del Centro Histórico",
      dates: "10-12 Feb 2024",
      places: 8,
      status: "Completado"
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
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
            <TripIcon color="primary" fontSize="large" />
            Mis Viajes
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Planifica y organiza tus aventuras en Encarnación
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          size="large"
        >
          Nuevo Viaje
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Viajes Próximos */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon color="primary" />
            Próximos Viajes
          </Typography>
          
          {upcomingTrips.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <TripIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tienes viajes planificados
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Crea tu primer itinerario y descubre los mejores lugares de Encarnación
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />}>
                  Planificar Viaje
                </Button>
              </CardContent>
            </Card>
          ) : (
            <List>
              {upcomingTrips.map((trip) => (
                <Card key={trip.id} sx={{ mb: 2 }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <TripIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={trip.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            📅 {trip.dates}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            📍 {trip.places} lugares planificados
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <Chip 
                        label={trip.status} 
                        color={trip.status === 'Próximo' ? 'success' : 'warning'}
                        size="small"
                      />
                      <Button size="small" variant="outlined">
                        Ver Detalles
                      </Button>
                    </Box>
                  </ListItem>
                </Card>
              ))}
            </List>
          )}

          {/* Viajes Pasados */}
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4 }}>
            📚 Historial de Viajes
          </Typography>
          
          <List>
            {pastTrips.map((trip) => (
              <Card key={trip.id} sx={{ mb: 2, opacity: 0.8 }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'grey.500' }}>
                      <TripIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={trip.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          📅 {trip.dates}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📍 {trip.places} lugares visitados
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                    <Chip 
                      label={trip.status} 
                      color="default"
                      size="small"
                    />
                    <Button size="small" variant="outlined">
                      Ver Recuerdos
                    </Button>
                  </Box>
                </ListItem>
              </Card>
            ))}
          </List>
        </Grid>

        {/* Panel Lateral */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                ⭐ Inspiración
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ideas populares para tu próximo viaje:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip label="Tour de un día" size="small" variant="outlined" />
                <Chip label="Weekend romántico" size="small" variant="outlined" />
                <Chip label="Aventura familiar" size="small" variant="outlined" />
                <Chip label="Experiencia gastronómica" size="small" variant="outlined" />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🎯 Planificación Rápida
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Herramientas para organizar tu viaje:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<LocationIcon />}
                  fullWidth
                  size="small"
                >
                  Lugares Recomendados
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<FlightIcon />}
                  fullWidth
                  size="small"
                >
                  Crear Itinerario
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ScheduleIcon />}
                  fullWidth
                  size="small"
                >
                  Horarios y Rutas
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          🚧 Esta sección está en desarrollo. Próximamente podrás crear itinerarios personalizados y compartir tus experiencias.
        </Typography>
      </Box>
    </Container>
  )
}
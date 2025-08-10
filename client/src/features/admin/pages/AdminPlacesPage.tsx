import { Container, Typography, Box } from '@mui/material'
import { AdminPlacesInterface } from '../components/AdminPlacesInterface'

export function AdminPlacesPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          color="primary"
          sx={{ textAlign: 'center' }}
        >
          Panel de Administración
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
          Gestiona todos los lugares turísticos, restaurantes y puntos de interés
          de Encarnación. Aquí puedes crear, editar, verificar y destacar lugares.
        </Typography>
      </Box>

      <AdminPlacesInterface />
    </Container>
  )
}

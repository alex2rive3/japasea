import { Box, Container, Typography } from '@mui/material';
import { usePlaces } from '../features/places/hooks/usePlaces';

export function PlacesPage() {
  const { places, loading, error } = usePlaces();

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Error al cargar los lugares: {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Cargando lugares...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lugares de Japón
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Total de lugares: {places.length}
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2,
          mt: 2
        }}>
          {places.map((place) => (
            <Box 
              key={place.id}
              sx={{ 
                p: 2, 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="h6" gutterBottom>{place.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {place.description}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Tipo: {place.type || 'No especificado'}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

import { Box, Typography } from '@mui/material';
import { usePlaces } from '../features/places/hooks/usePlaces';

export function HomePage() {
  const { places } = usePlaces();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido a Japasea
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Tu guía inteligente para descubrir Japón
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Lugares disponibles: {places.length}
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2,
          mt: 2
        }}>
          {/* Chat Component Placeholder */}
          <Box sx={{ 
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}>
            <Typography variant="h6" gutterBottom>Chat AI</Typography>
            <Typography variant="body2" color="text.secondary">
              Pregunta sobre lugares en Japón y recibe recomendaciones personalizadas.
            </Typography>
          </Box>
          
          {/* Map Component Placeholder */}
          <Box sx={{ 
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}>
            <Typography variant="h6" gutterBottom>Mapa Interactivo</Typography>
            <Typography variant="body2" color="text.secondary">
              Explora lugares en el mapa de Japón con información detallada.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

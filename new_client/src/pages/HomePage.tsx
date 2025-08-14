import { Box, Typography } from '@mui/material';
import { usePlaces } from '../features/places/hooks/usePlaces';
import { ChatComponent } from '../features/chat/components';
import { MapComponent } from '../features/places/components';

export function HomePage() {
  const { places } = usePlaces();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido a Japasea
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Tu guía inteligente para descubrir Encarnación, Paraguay
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Lugares disponibles: {places.length}
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2,
          mt: 2,
          height: { md: '500px' }
        }}>
          {/* Chat Component */}
          <ChatComponent />
          
          {/* Map Component */}
          <MapComponent />
        </Box>
      </Box>
    </Box>
  );
}

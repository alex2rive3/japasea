import { Box, Typography } from '@mui/material';
import { ChatComponent } from '../features/chat/components';
import { MapComponent } from '../features/places/components';

export function HomePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido a Japasea
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Tu guía inteligente para descubrir Encarnación, Paraguay
      </Typography>
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 2,
        mt: 4,
        height: { md: '500px' }
      }}>
        {/* Chat Component */}
        <ChatComponent />
        
        {/* Map Component */}
        <MapComponent />
      </Box>
    </Box>
  );
}

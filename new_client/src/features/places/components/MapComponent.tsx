import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip
} from '@mui/material';
import { LocationOn, Place } from '@mui/icons-material';
import { usePlaces } from '../hooks/usePlaces';
import type { Place as PlaceType } from '../types';

export const MapComponent: React.FC = () => {
  const { places, loading } = usePlaces();

  if (loading) {
    return (
      <Box sx={{ 
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        textAlign: 'center'
      }}>
        <Typography>Cargando lugares...</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ 
      p: 3,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      bgcolor: 'background.paper',
      height: '100%',
      maxHeight: 500,
      overflow: 'auto'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocationOn color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">
          Mapa de Lugares ({places.length})
        </Typography>
      </Box>
      
      {places.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No hay lugares disponibles para mostrar.
        </Typography>
      ) : (
        <List dense>
          {places.slice(0, 10).map((place: PlaceType) => (
            <ListItem key={place.id} divider>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Place />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={place.name}
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {place.description?.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        size="small" 
                        label={place.type} 
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
          {places.length > 10 && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary" align="center">
                    Y {places.length - 10} lugares más...
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      )}
    </Paper>
  );
};

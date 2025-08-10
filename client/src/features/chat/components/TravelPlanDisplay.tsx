import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
  Divider
} from '@mui/material'
import {
  LocationOn,
  Schedule,
  AttachMoney,
  Star
} from '@mui/icons-material'
import type { TravelPlan } from '../types/chat.types'

interface TravelPlanDisplayProps {
  travelPlan: TravelPlan
}

export function TravelPlanDisplay({ travelPlan }: TravelPlanDisplayProps) {
  return (
    <Card sx={{ mt: 2, border: '2px solid', borderColor: 'primary.main' }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          📋 {travelPlan.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          {travelPlan.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<Schedule />}
            label={`Duración: ${travelPlan.duration}`}
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
          />
          {travelPlan.budget && (
            <Chip
              icon={<AttachMoney />}
              label={`Presupuesto: ${travelPlan.budget}`}
              variant="outlined"
              size="small"
            />
          )}
        </Box>

        {travelPlan.places && travelPlan.places.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Lugares incluidos:
            </Typography>
            <List dense>
              {travelPlan.places.map((place, index) => (
                <ListItem key={place.key || index} sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocationOn color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={place.key}
                    secondary={place.description}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {travelPlan.recommendations && travelPlan.recommendations.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Recomendaciones adicionales:
            </Typography>
            <List dense>
              {travelPlan.recommendations.map((recommendation, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Star color="secondary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={recommendation} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  )
}

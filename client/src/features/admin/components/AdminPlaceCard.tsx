import {
  Card,
  CardContent,
  Box,
  Stack,
  Chip,
  Typography,
  Button,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Edit as EditIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material'
import { adminPlacesService } from '../services/adminPlacesService'
import { STATUSES } from '../types/admin.types'
import type { AdminPlaceCardProps } from '../types/admin.types'

export function AdminPlaceCard({
  place,
  onEdit,
  onVerify,
  onFeature,
  onStatus
}: AdminPlaceCardProps) {
  const placeId = adminPlacesService.getPlaceId(place)
  
  return (
    <Card 
      sx={{ 
        width: { 
          xs: '100%', 
          sm: 'calc(50% - 12px)', 
          md: 'calc(33.333% - 16px)' 
        }, 
        maxWidth: { 
          xs: '100%', 
          sm: '350px', 
          md: '380px' 
        }, 
        position: 'relative', 
        transition: 'all 0.3s ease-in-out', 
        '&:hover': { 
          transform: 'translateY(-4px)', 
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)' 
        }, 
        borderRadius: 2, 
        overflow: 'hidden' 
      }}
      data-id={placeId}
    >
      <CardContent sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {/* Header with badges */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 2 
        }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip 
              label={place.type} 
              size="small" 
              color="primary" 
              variant="filled" 
              sx={{ 
                fontWeight: 600, 
                borderRadius: 1.5, 
                textTransform: 'capitalize' 
              }} 
            />
            <Chip 
              label={place.status} 
              size="small" 
              variant="outlined" 
            />
            {place?.metadata?.verified && (
              <Chip 
                size="small" 
                icon={<VerifiedIcon />} 
                label="Verificado" 
                color="success" 
              />
            )}
            {place?.metadata?.featured && (
              <Chip 
                size="small" 
                icon={<StarIcon />} 
                label="Destacado" 
                color="warning" 
              />
            )}
          </Stack>
        </Box>

        {/* Place name */}
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary', 
            mb: 1.5, 
            lineHeight: 1.3 
          }}
        >
          {place.name}
        </Typography>

        {/* Place description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2, 
            display: '-webkit-box', 
            WebkitLineClamp: 3, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden', 
            lineHeight: 1.5, 
            flexGrow: 1 
          }}
        >
          {place.description}
        </Typography>

        {/* Address */}
        {place.address && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <LocationOnIcon sx={{ 
              fontSize: 18, 
              mr: 1, 
              color: 'primary.main' 
            }} />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ fontSize: '0.875rem' }}
            >
              {place.address}
            </Typography>
          </Box>
        )}

        {/* Status buttons */}
        <Stack 
          direction="row" 
          spacing={1} 
          flexWrap="wrap" 
          sx={{ mt: 'auto', gap: 0.5 }}
        >
          {STATUSES.map(status => (
            <Button 
              key={status} 
              size="small" 
              variant={place.status === status ? 'contained' : 'outlined'} 
              onClick={() => onStatus(placeId, status)} 
              sx={{ 
                textTransform: 'none', 
                borderRadius: 2,
                minWidth: 'auto',
                fontSize: '0.75rem'
              }}
            >
              {status}
            </Button>
          ))}
        </Stack>

        {/* Action buttons */}
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            mt: 1, 
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            gap: 0.5
          }}
        >
          <Tooltip title="Editar">
            <IconButton onClick={() => onEdit(place)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          
          <Button 
            size="small" 
            onClick={() => onVerify(placeId)} 
            sx={{ textTransform: 'none', fontSize: '0.75rem' }} 
            disabled={!!place?.metadata?.verified}
          >
            Verificar
          </Button>
          
          <Button 
            size="small" 
            onClick={() => onFeature(placeId, !place?.metadata?.featured)} 
            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
          >
            {place?.metadata?.featured ? 'Quitar destacado' : 'Destacar'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

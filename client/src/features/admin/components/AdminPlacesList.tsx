import { Box } from '@mui/material'
import { AdminPlaceCard } from './AdminPlaceCard'
import type { AdminPlacesListProps } from '../types/admin.types'

export function AdminPlacesList({
  items,
  onEdit,
  onVerify,
  onFeature,
  onStatus
}: AdminPlacesListProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 3, 
      justifyContent: { 
        xs: 'center', 
        md: 'flex-start' 
      } 
    }}>
      {items.map((place) => (
        <AdminPlaceCard
          key={place.id ?? place._id}
          place={place}
          onEdit={onEdit}
          onVerify={onVerify}
          onFeature={onFeature}
          onStatus={onStatus}
        />
      ))}
    </Box>
  )
}

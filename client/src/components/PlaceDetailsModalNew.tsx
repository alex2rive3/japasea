// Temporary migration component to maintain compatibility
// This allows dropping-in PlaceDetailsModal from features as a replacement
import { PlaceDetailsModal } from '../features/places'
import type { Place } from '../types/places'

interface PlaceDetailsModalProps {
  open: boolean
  onClose: () => void
  place: Place | null
}

const PlaceDetailsModalNew: React.FC<PlaceDetailsModalProps> = ({ 
  open, 
  onClose, 
  place 
}) => {
  return (
    <PlaceDetailsModal 
      open={open}
      onClose={onClose}
      place={place}
    />
  )
}

export default PlaceDetailsModalNew

// Temporary migration component to maintain compatibility
// This allows dropping-in AdminPlacesInterface as a replacement for AdminPlacesComponent
import { AdminPlacesInterface } from '../features/admin'

export default function AdminPlacesComponentNew() {
  return <AdminPlacesInterface />
}

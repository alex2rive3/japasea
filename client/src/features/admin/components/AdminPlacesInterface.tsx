import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AdminPlacesHeader } from './AdminPlacesHeader'
import { AdminPlaceFilters } from './AdminPlaceFilters'
import { AdminPlacesList } from './AdminPlacesList'
import { AdminPlaceForm } from './AdminPlaceForm'
import { useAdminPlaces } from '../hooks/useAdminPlaces'
import { useAdminPlaceForm } from '../hooks/useAdminPlaceForm'

export function AdminPlacesInterface() {
  const navigate = useNavigate()
  
  const {
    items,
    filters,
    setFilters,
    createPlace,
    updatePlace,
    verifyPlace,
    featurePlace,
    setPlaceStatus
  } = useAdminPlaces()

  const {
    open,
    form,
    openCreateForm,
    openEditForm,
    closeForm,
    updateForm,
    handleSubmit
  } = useAdminPlaceForm()

  const handleNavigateHome = () => {
    navigate('/')
  }

  const handleFormSubmit = async () => {
    await handleSubmit(async (id, data) => {
      if (id && data) {
        await updatePlace(id, data)
      } else if (data) {
        await createPlace(data)
      }
    })
  }

  return (
    <Box sx={{ p: 2 }}>
      <AdminPlacesHeader
        onNavigateHome={handleNavigateHome}
        onCreateNew={openCreateForm}
      />

      <AdminPlaceFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <AdminPlacesList
        items={items}
        onEdit={openEditForm}
        onVerify={verifyPlace}
        onFeature={featurePlace}
        onStatus={setPlaceStatus}
      />

      <AdminPlaceForm
        open={open}
        form={form}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        onFormChange={updateForm}
      />
    </Box>
  )
}

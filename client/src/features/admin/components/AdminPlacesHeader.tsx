import {
  Stack,
  Typography,
  Button
} from '@mui/material'
import {
  Add as AddIcon,
  Home as HomeIcon
} from '@mui/icons-material'
import type { AdminPlacesHeaderProps } from '../types/admin.types'

export function AdminPlacesHeader({
  onNavigateHome,
  onCreateNew
}: AdminPlacesHeaderProps) {
  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      justifyContent="space-between" 
      sx={{ mb: 2 }}
    >
      <Typography variant="h5">
        Administración de Lugares
      </Typography>
      
      <Stack direction="row" spacing={2}>
        <Button 
          variant="outlined" 
          startIcon={<HomeIcon />} 
          onClick={onNavigateHome}
        >
          Vista Principal
        </Button>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={onCreateNew}
        >
          Nuevo lugar
        </Button>
      </Stack>
    </Stack>
  )
}

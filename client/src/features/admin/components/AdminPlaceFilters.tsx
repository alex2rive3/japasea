import {
  Paper,
  Stack,
  TextField,
  MenuItem
} from '@mui/material'
import { PLACE_TYPES, STATUSES } from '../types/admin.types'
import type { AdminPlaceFiltersProps } from '../types/admin.types'

export function AdminPlaceFilters({
  filters,
  onFiltersChange
}: AdminPlaceFiltersProps) {
  const updateFilter = (key: keyof typeof filters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    })
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={2} 
        alignItems="center"
      >
        <TextField
          label="Buscar"
          value={filters.q || ''}
          onChange={(e) => updateFilter('q', e.target.value)}
          fullWidth
        />
        
        <TextField
          select
          label="Tipo"
          value={filters.type || ''}
          onChange={(e) => updateFilter('type', e.target.value)}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          {PLACE_TYPES.map(type => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          select
          label="Estado"
          value={filters.status || ''}
          onChange={(e) => updateFilter('status', e.target.value)}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          {STATUSES.map(status => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Paper>
  )
}

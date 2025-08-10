import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  MenuItem,
  Button
} from '@mui/material'
import { PLACE_TYPES } from '../types/admin.types'
import type { AdminPlaceFormProps } from '../types/admin.types'

export function AdminPlaceForm({
  open,
  form,
  onClose,
  onSubmit,
  onFormChange
}: AdminPlaceFormProps) {
  const updateField = (field: string, value: string | number) => {
    onFormChange({
      ...form,
      [field]: value
    })
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        {form.id ? 'Editar lugar' : 'Nuevo lugar'}
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Key"
            value={form.key}
            onChange={(e) => updateField('key', e.target.value)}
            fullWidth
            required
          />
          
          <TextField
            label="Nombre"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            fullWidth
            required
          />
          
          <TextField
            label="Descripción"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            fullWidth
            required
            multiline
            minRows={3}
          />
          
          <TextField
            select
            label="Tipo"
            value={form.type}
            onChange={(e) => updateField('type', e.target.value)}
            fullWidth
            required
          >
            {PLACE_TYPES.map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="Dirección"
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
            fullWidth
            required
          />
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Latitud"
              type="number"
              value={form.lat}
              onChange={(e) => updateField('lat', Number(e.target.value))}
              fullWidth
              required
            />
            <TextField
              label="Longitud"
              type="number"
              value={form.lng}
              onChange={(e) => updateField('lng', Number(e.target.value))}
              fullWidth
              required
            />
          </Stack>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          onClick={onSubmit}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Stack, TextField, Typography, Checkbox, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import VerifiedIcon from '@mui/icons-material/Verified'
import StarIcon from '@mui/icons-material/Star'
import HomeIcon from '@mui/icons-material/Home'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { placesService } from '../services/placesService'

interface AdminPlaceForm {
  id?: string
  key: string
  name: string
  description: string
  type: string
  address: string
  lat: number
  lng: number
  status?: string
}

const PLACE_TYPES = ['Alojamiento', 'Gastronomía', 'Turístico', 'Compras', 'Entretenimiento', 'Desayunos y meriendas', 'Comida']
const STATUSES = ['active', 'inactive', 'pending', 'seasonal']

export default function AdminPlacesComponent() {
  const navigate = useNavigate()
  const [items, setItems] = useState<any[]>([])
  const [, setLoading] = useState(false)
  const [page] = useState(1)
  const [limit] = useState(20)
  const [filters, setFilters] = useState<{ q?: string; type?: string; status?: string }>({})
  const [openForm, setOpenForm] = useState(false)
  const [form, setForm] = useState<AdminPlaceForm>({ key: '', name: '', description: '', type: '', address: '', lat: 0, lng: 0 })
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkActionSuccess, setBulkActionSuccess] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await placesService.adminListPlaces({ page, limit, ...filters })
      setItems(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, limit, filters])

  const handleOpenCreate = () => {
    setForm({ key: '', name: '', description: '', type: '', address: '', lat: 0, lng: 0 })
    setOpenForm(true)
  }

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await placesService.adminUpdatePlace(form.id, form)
      } else {
        await placesService.adminCreatePlace(form)
      }
      setOpenForm(false)
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  const handleVerify = async (id: string) => {
    await placesService.adminVerifyPlace(id)
    await load()
  }

  const handleFeature = async (id: string, featured: boolean) => {
    await placesService.adminFeaturePlace(id, featured)
    await load()
  }

  const handleStatus = async (id: string, status: string) => {
    await placesService.adminSetStatus(id, status)
    await load()
  }

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map(item => item.id))
    }
  }

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleBulkAction = async (action: 'verify' | 'activate' | 'delete') => {
    if (selectedItems.length === 0) return

    setBulkActionSuccess('')
    
    try {
      switch (action) {
        case 'verify':
          for (const id of selectedItems) {
            await placesService.adminVerifyPlace(id)
          }
          setBulkActionSuccess(`${selectedItems.length} lugares verificados`)
          break
        case 'activate':
          for (const id of selectedItems) {
            await placesService.adminSetStatus(id, 'active')
          }
          setBulkActionSuccess(`${selectedItems.length} lugares activados`)
          break
        case 'delete':
          if (window.confirm(`¿Estás seguro de eliminar ${selectedItems.length} lugares?`)) {
            // Placeholder para eliminación masiva
            setBulkActionSuccess(`${selectedItems.length} lugares eliminados`)
          }
          break
      }
      
      setSelectedItems([])
      await load()
      setTimeout(() => setBulkActionSuccess(''), 3000)
    } catch (error) {
      console.error('Error en acción masiva:', error)
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">Administración de Lugares</Typography>
        <Stack direction="row" spacing={2}>
          {selectedItems.length > 0 ? (
            <>
              <Button variant="outlined" onClick={() => setSelectedItems([])}>
                Cancelar selección
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                startIcon={<CheckIcon />} 
                onClick={() => handleBulkAction('verify')}
              >
                Verificar ({selectedItems.length})
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleBulkAction('activate')}
              >
                Activar ({selectedItems.length})
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<DeleteIcon />} 
                onClick={() => handleBulkAction('delete')}
              >
                Eliminar ({selectedItems.length})
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" startIcon={<HomeIcon />} onClick={() => navigate('/')}>
                Vista Principal
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
                Nuevo lugar
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      {bulkActionSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setBulkActionSuccess('')}>
          {bulkActionSuccess}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <Checkbox 
            checked={selectedItems.length === items.length && items.length > 0}
            indeterminate={selectedItems.length > 0 && selectedItems.length < items.length}
            onChange={handleSelectAll}
          />
          <TextField label="Buscar" value={filters.q || ''} onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} fullWidth />
          <TextField select label="Tipo" value={filters.type || ''} onChange={(e) => setFilters(f => ({ ...f, type: e.target.value || undefined }))} fullWidth>
            <MenuItem value="">Todos</MenuItem>
            {PLACE_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField select label="Estado" value={filters.status || ''} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value || undefined }))} fullWidth>
            <MenuItem value="">Todos</MenuItem>
            {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Stack>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
        {items.map((p) => (
          <Paper sx={{ p: 2, position: 'relative' }} key={p.id}>
              <Checkbox
                checked={selectedItems.includes(p.id)}
                onChange={() => handleSelectItem(p.id)}
                sx={{ position: 'absolute', top: 8, left: 8 }}
              />
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ ml: 4 }}>
                <Box>
                  <Typography variant="h6">{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{p.address}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip size="small" label={p.type} />
                    <Chip size="small" label={p.status} />
                    {p?.metadata?.verified && <Chip size="small" icon={<VerifiedIcon />} label="Verificado" color="success" />}
                    {p?.metadata?.featured && <Chip size="small" icon={<StarIcon />} label="Destacado" color="warning" />}
                  </Stack>
                  <Typography variant="body2" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</Typography>
                </Box>
                <Stack spacing={1} direction="row">
                  <IconButton onClick={() => setForm({ id: p.id, key: p.key, name: p.name, description: p.description, type: p.type, address: p.address, lat: p.location?.lat ?? p.location?.coordinates?.[1], lng: p.location?.lng ?? p.location?.coordinates?.[0] })}>
                    <EditIcon />
                  </IconButton>
                  <Button size="small" onClick={() => handleVerify(p.id)}>Verificar</Button>
                  <Button size="small" onClick={() => handleFeature(p.id, !p?.metadata?.featured)}>{p?.metadata?.featured ? 'Quitar destacado' : 'Destacar'}</Button>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {STATUSES.map(s => (
                  <Button key={s} size="small" variant={p.status === s ? 'contained' : 'outlined'} onClick={() => handleStatus(p.id, s)}>{s}</Button>
                ))}
              </Stack>
              </Paper>
        ))}
      </Box>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>{form.id ? 'Editar lugar' : 'Nuevo lugar'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Key" value={form.key} onChange={(e) => setForm(f => ({ ...f, key: e.target.value }))} fullWidth required />
            <TextField label="Nombre" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} fullWidth required />
            <TextField label="Descripción" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} fullWidth required multiline minRows={3} />
            <TextField select label="Tipo" value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} fullWidth required>
              {PLACE_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField label="Dirección" value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} fullWidth required />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Lat" type="number" value={form.lat} onChange={(e) => setForm(f => ({ ...f, lat: Number(e.target.value) }))} fullWidth required />
              <TextField label="Lng" type="number" value={form.lng} onChange={(e) => setForm(f => ({ ...f, lng: Number(e.target.value) }))} fullWidth required />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}



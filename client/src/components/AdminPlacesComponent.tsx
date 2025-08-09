import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Stack, TextField, Typography, Card, CardContent, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import VerifiedIcon from '@mui/icons-material/Verified'
import StarIcon from '@mui/icons-material/Star'
import HomeIcon from '@mui/icons-material/Home'
import LocationOnIcon from '@mui/icons-material/LocationOn'
 

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

  

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">Administración de Lugares</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<HomeIcon />} onClick={() => navigate('/')}>
            Vista Principal
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Nuevo lugar
          </Button>
        </Stack>
      </Stack>

      

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
        {items.map((p) => {
          const placeId = p.id ?? p._id ?? ''
          return (
          <Card key={placeId} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }, maxWidth: { xs: '100%', sm: '350px', md: '380px' }, position: 'relative', transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }, borderRadius: 2, overflow: 'hidden' }} data-id={placeId}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={p.type} size="small" color="primary" variant="filled" sx={{ fontWeight: 600, borderRadius: 1.5, textTransform: 'capitalize' }} />
                  <Chip label={p.status} size="small" variant="outlined" />
                  {p?.metadata?.verified && <Chip size="small" icon={<VerifiedIcon />} label="Verificado" color="success" />}
                  {p?.metadata?.featured && <Chip size="small" icon={<StarIcon />} label="Destacado" color="warning" />}
                </Stack>
                {/* Sin checkbox de selección */}
              </Box>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5, lineHeight: 1.3 }}>
                {p.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5, flexGrow: 1 }}>
                {p.description}
              </Typography>

              {p.address && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <LocationOnIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    {p.address}
                  </Typography>
                </Box>
              )}

              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 'auto' }}>
                {STATUSES.map(s => (
                  <Button key={s} size="small" variant={p.status === s ? 'contained' : 'outlined'} onClick={() => handleStatus(placeId, s)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                    {s}
                  </Button>
                ))}
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'flex-end' }}>
                <Tooltip title="Editar">
                  <IconButton onClick={() => { setForm({ id: placeId, key: p.key, name: p.name, description: p.description, type: p.type, address: p.address, lat: p.location?.lat ?? p.location?.coordinates?.[1], lng: p.location?.lng ?? p.location?.coordinates?.[0] }); setOpenForm(true) }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Button size="small" onClick={() => handleVerify(placeId)} sx={{ textTransform: 'none' }} disabled={!!p?.metadata?.verified}>Verificar</Button>
                <Button size="small" onClick={() => handleFeature(placeId, !p?.metadata?.featured)} sx={{ textTransform: 'none' }}>{p?.metadata?.featured ? 'Quitar destacado' : 'Destacar'}</Button>
              </Stack>
            </CardContent>
          </Card>
          )})}
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



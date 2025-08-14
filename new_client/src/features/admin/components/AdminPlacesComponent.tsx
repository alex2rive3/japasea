import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Tooltip,
  Alert,
  Stack,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  LocationOn as LocationIcon,
  Visibility as ViewIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAdmin, useAdminPermissions } from '../hooks/useAdmin';
import type { PlaceManagement, CreatePlaceRequest } from '../types';

const PLACE_TYPES = [
  'Alojamiento',
  'Gastronomía', 
  'Turístico',
  'Compras',
  'Entretenimiento',
  'Desayunos y meriendas',
  'Servicios'
];

const PLACE_STATUSES = [
  { value: 'active', label: 'Activo', color: 'success' as const },
  { value: 'pending', label: 'Pendiente', color: 'warning' as const },
  { value: 'rejected', label: 'Rechazado', color: 'error' as const },
  { value: 'archived', label: 'Archivado', color: 'default' as const }
];

interface PlaceFormData extends Omit<CreatePlaceRequest, 'location'> {
  id?: string;
  lat: number;
  lng: number;
  status?: string;
}

export const AdminPlacesComponent: React.FC = () => {
  const {
    places,
    loading,
    error,
    fetchPlaces,
    addPlace,
    modifyPlace,
    removePlace,
    approvePlaceSubmission,
    rejectPlaceSubmission,
    selectPlace,
    clearError
  } = useAdmin();

  const { hasPermission } = useAdminPermissions();

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: ''
  });

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState<PlaceFormData>({
    name: '',
    description: '',
    type: '',
    address: '',
    lat: 0,
    lng: 0
  });

  const [openConfirm, setOpenConfirm] = useState<{
    open: boolean;
    type: 'delete' | 'approve' | 'reject';
    place: PlaceManagement | null;
    reason?: string;
  }>({ open: false, type: 'delete', place: null });

  useEffect(() => {
    fetchPlaces(filters);
  }, [fetchPlaces, filters]);

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
      address: '',
      lat: 0,
      lng: 0
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (place: PlaceManagement) => {
    setFormData({
      id: place.id,
      name: place.name,
      description: place.description,
      type: place.type,
      address: place.address,
      lat: place.location.lat,
      lng: place.location.lng,
      status: place.status
    });
    setOpenForm(true);
  };

  const handleSubmitForm = async () => {
    try {
      const placeData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        address: formData.address,
        location: {
          lat: formData.lat,
          lng: formData.lng
        }
      };

      if (formData.id) {
        await modifyPlace({
          placeId: formData.id,
          ...placeData,
          status: formData.status
        });
      } else {
        await addPlace(placeData);
      }
      
      setOpenForm(false);
      fetchPlaces(filters);
    } catch (error) {
      console.error('Error submitting place:', error);
    }
  };

  const handleApprove = (place: PlaceManagement) => {
    setOpenConfirm({ open: true, type: 'approve', place });
  };

  const handleReject = (place: PlaceManagement) => {
    setOpenConfirm({ open: true, type: 'reject', place });
  };

  const handleDelete = (place: PlaceManagement) => {
    setOpenConfirm({ open: true, type: 'delete', place });
  };

  const handleConfirmAction = async () => {
    if (!openConfirm.place) return;

    try {
      switch (openConfirm.type) {
        case 'approve':
          await approvePlaceSubmission(openConfirm.place.id);
          break;
        case 'reject':
          await rejectPlaceSubmission(openConfirm.place.id, openConfirm.reason);
          break;
        case 'delete':
          await removePlace(openConfirm.place.id);
          break;
      }
      
      setOpenConfirm({ open: false, type: 'delete', place: null });
      fetchPlaces(filters);
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = PLACE_STATUSES.find(s => s.value === status);
    return (
      <Chip
        label={statusConfig?.label || status}
        color={statusConfig?.color || 'default'}
        size="small"
      />
    );
  };

  if (!hasPermission('view_places')) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">
          No tienes permisos para ver la gestión de lugares
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            <AdminIcon sx={{ mr: 2, verticalAlign: 'bottom' }} />
            Gestión de Lugares
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra y modera los lugares de la plataforma
          </Typography>
        </Box>
        
        {hasPermission('create_place') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Nuevo Lugar
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Buscar lugares"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            fullWidth
          />
          <TextField
            select
            label="Tipo"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Todos los tipos</MenuItem>
            {PLACE_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Estado"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Todos los estados</MenuItem>
            {PLACE_STATUSES.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      {/* Places Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
        {places.map((place: PlaceManagement) => (
          <Card key={place.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Chip label={place.type} size="small" color="primary" />
                  {getStatusChip(place.status)}
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  {place.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {place.description.substring(0, 120)}
                  {place.description.length > 120 && '...'}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {place.address}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Creado: {new Date(place.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  <Tooltip title="Ver detalles">
                    <IconButton size="small" onClick={() => selectPlace(place)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  
                  {hasPermission('edit_place') && (
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleOpenEdit(place)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Box>
                  {place.status === 'pending' && hasPermission('approve_places') && (
                    <>
                      <Tooltip title="Aprobar">
                        <IconButton size="small" color="success" onClick={() => handleApprove(place)}>
                          <ApproveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rechazar">
                        <IconButton size="small" color="error" onClick={() => handleReject(place)}>
                          <RejectIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  
                  {hasPermission('delete_place') && (
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => handleDelete(place)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </CardActions>
            </Card>
        ))}
      </Box>

      {places.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron lugares
          </Typography>
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {formData.id ? 'Editar Lugar' : 'Crear Nuevo Lugar'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              required
            />
            
            <TextField
              select
              label="Tipo"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              fullWidth
              required
            >
              {PLACE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Dirección"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              required
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Latitud"
                type="number"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                fullWidth
                required
              />
              <TextField
                label="Longitud"
                type="number"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                fullWidth
                required
              />
            </Box>

            {formData.id && (
              <TextField
                select
                label="Estado"
                value={formData.status || 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                fullWidth
              >
                {PLACE_STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitForm} 
            variant="contained"
            disabled={!formData.name || !formData.description || !formData.type || !formData.address}
          >
            {formData.id ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm.open} onClose={() => setOpenConfirm({ ...openConfirm, open: false })}>
        <DialogTitle>
          Confirmar {openConfirm.type === 'delete' ? 'Eliminación' : 
                    openConfirm.type === 'approve' ? 'Aprobación' : 'Rechazo'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas {openConfirm.type === 'delete' ? 'eliminar' : 
                                     openConfirm.type === 'approve' ? 'aprobar' : 'rechazar'} 
            el lugar "{openConfirm.place?.name}"?
          </Typography>
          
          {openConfirm.type === 'reject' && (
            <TextField
              label="Razón del rechazo (opcional)"
              value={openConfirm.reason || ''}
              onChange={(e) => setOpenConfirm({ ...openConfirm, reason: e.target.value })}
              multiline
              rows={2}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm({ ...openConfirm, open: false })}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            color={openConfirm.type === 'delete' ? 'error' : 'primary'}
            variant="contained"
          >
            {openConfirm.type === 'delete' ? 'Eliminar' : 
             openConfirm.type === 'approve' ? 'Aprobar' : 'Rechazar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

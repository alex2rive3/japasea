import { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Download as DownloadIcon,

  Person as PersonIcon,
  Place as PlaceIcon,
  RateReview as ReviewIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { adminService } from '../../services/adminService'

interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId?: string
  details?: any
  timestamp: string
  ipAddress?: string
}

export default function AdminAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [totalLogs, setTotalLogs] = useState(0)
  
  // Filtros
  const [actionFilter, setActionFilter] = useState('')
  const [resourceFilter, setResourceFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('7days')

  const loadLogs = async () => {
    setLoading(true)
    try {
      const endDate = new Date().toISOString()
      let startDate = new Date()
      
      switch (dateFilter) {
        case '24h':
          startDate.setDate(startDate.getDate() - 1)
          break
        case '7days':
          startDate.setDate(startDate.getDate() - 7)
          break
        case '30days':
          startDate.setDate(startDate.getDate() - 30)
          break
        case '90days':
          startDate.setDate(startDate.getDate() - 90)
          break
      }

      const response = await adminService.getActivityLogs({
        page: page + 1,
        limit: rowsPerPage,
        action: actionFilter,
        resource: resourceFilter,
        startDate: startDate.toISOString(),
        endDate
      })
      
      setLogs(response.data || [])
      setTotalLogs(response.pagination?.total || 0)
    } catch (error) {
      console.error('Error cargando logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [page, rowsPerPage, actionFilter, resourceFilter, dateFilter])

  const handleExportLogs = async () => {
    try {
      const blob = await adminService.exportActivityLogs('csv', {
        action: actionFilter,
        resource: resourceFilter
      })
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exportando logs:', error)
    }
  }

  const getActionColor = (action: string) => {
    if (action.includes('create') || action.includes('add')) return 'success'
    if (action.includes('update') || action.includes('edit')) return 'info'
    if (action.includes('delete') || action.includes('remove')) return 'error'
    if (action.includes('login') || action.includes('logout')) return 'default'
    return 'default'
  }

  const getResourceIcon = (resource: string) => {
    switch (resource.toLowerCase()) {
      case 'user': return <PersonIcon fontSize="small" />
      case 'place': return <PlaceIcon fontSize="small" />
      case 'review': return <ReviewIcon fontSize="small" />
      case 'settings': return <SettingsIcon fontSize="small" />
      default: return null
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Registro de Auditoría</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            size="small"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="24h">Últimas 24h</MenuItem>
            <MenuItem value="7days">Últimos 7 días</MenuItem>
            <MenuItem value="30days">Últimos 30 días</MenuItem>
            <MenuItem value="90days">Últimos 90 días</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            sx={{ minWidth: 120 }}
            placeholder="Acción"
          >
            <MenuItem value="">Todas las acciones</MenuItem>
            <MenuItem value="create">Crear</MenuItem>
            <MenuItem value="update">Actualizar</MenuItem>
            <MenuItem value="delete">Eliminar</MenuItem>
            <MenuItem value="login">Login</MenuItem>
            <MenuItem value="logout">Logout</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            sx={{ minWidth: 120 }}
            placeholder="Recurso"
          >
            <MenuItem value="">Todos los recursos</MenuItem>
            <MenuItem value="user">Usuarios</MenuItem>
            <MenuItem value="place">Lugares</MenuItem>
            <MenuItem value="review">Reseñas</MenuItem>
            <MenuItem value="settings">Configuración</MenuItem>
          </TextField>
          <Tooltip title="Exportar logs">
            <IconButton onClick={handleExportLogs} color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fecha/Hora</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Acción</TableCell>
              <TableCell>Recurso</TableCell>
              <TableCell>Detalles</TableCell>
              <TableCell>IP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Cargando...</TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No se encontraron registros</TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {formatTimestamp(log.timestamp)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{log.userName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.action}
                      size="small"
                      color={getActionColor(log.action) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getResourceIcon(log.resource)}
                      <Typography variant="body2">{log.resource}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      {log.details ? JSON.stringify(log.details).substring(0, 50) + '...' : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      {log.ipAddress || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalLogs}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10))
            setPage(0)
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>
    </Box>
  )
}

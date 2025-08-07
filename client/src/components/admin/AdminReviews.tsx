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
  IconButton,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Tooltip,
  Card,
  CardContent
} from '@mui/material'
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Flag as FlagIcon
} from '@mui/icons-material'
import { adminService } from '../../services/adminService'

interface Review {
  id: string
  userId: string
  userName: string
  placeId: string
  placeName: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  images?: string[]
  flagged?: boolean
  flagReason?: string
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalReviews, setTotalReviews] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('')
  
  // Diálogos
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const loadReviews = async () => {
    setLoading(true)
    try {
      const response = await adminService.getReviews({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter as any
      })
      setReviews(response.data || [])
      setTotalReviews(response.pagination?.total || 0)
    } catch (error) {
      console.error('Error cargando reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [page, rowsPerPage, statusFilter])

  const handleApproveReview = async (reviewId: string) => {
    try {
      await adminService.approveReview(reviewId)
      await loadReviews()
    } catch (error) {
      console.error('Error aprobando review:', error)
    }
  }

  const handleRejectReview = async () => {
    if (!selectedReview) return
    try {
      await adminService.rejectReview(selectedReview.id, rejectReason)
      await loadReviews()
      setShowRejectDialog(false)
      setRejectReason('')
      setSelectedReview(null)
    } catch (error) {
      console.error('Error rechazando review:', error)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta reseña?')) {
      try {
        await adminService.deleteReview(reviewId)
        await loadReviews()
      } catch (error) {
        console.error('Error eliminando review:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Gestión de Reseñas</Typography>
        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
          SelectProps={{ native: true }}
        >
          <option value="">Todas las reseñas</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobadas</option>
          <option value="rejected">Rechazadas</option>
        </TextField>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Lugar</TableCell>
              <TableCell>Calificación</TableCell>
              <TableCell>Comentario</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Cargando...</TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No se encontraron reseñas</TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {review.userName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">{review.userName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {review.placeName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {truncateText(review.comment)}
                      </Typography>
                      {review.flagged && (
                        <Tooltip title={`Reportado: ${review.flagReason}`}>
                          <FlagIcon color="error" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        review.status === 'approved' ? 'Aprobada' :
                        review.status === 'pending' ? 'Pendiente' : 'Rechazada'
                      }
                      size="small"
                      color={getStatusColor(review.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedReview(review)
                            setShowViewDialog(true)
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {review.status === 'pending' && (
                        <>
                          <Tooltip title="Aprobar">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleApproveReview(review.id)}
                            >
                              <ApproveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Rechazar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setSelectedReview(review)
                                setShowRejectDialog(true)
                              }}
                            >
                              <RejectIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalReviews}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10))
            setPage(0)
          }}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>

      {/* Diálogo de vista detallada */}
      <Dialog 
        open={showViewDialog} 
        onClose={() => setShowViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalle de Reseña</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ pt: 2 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Usuario</Typography>
                      <Typography>{selectedReview.userName}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Lugar</Typography>
                      <Typography>{selectedReview.placeName}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Calificación</Typography>
                      <Rating value={selectedReview.rating} readOnly />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Comentario</Typography>
                      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        {selectedReview.comment}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
                      <Typography>
                        {new Date(selectedReview.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {selectedReview.flagged && (
                      <Box>
                        <Typography variant="subtitle2" color="error">Reportado</Typography>
                        <Typography>{selectedReview.flagReason}</Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowViewDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de rechazo */}
      <Dialog open={showRejectDialog} onClose={() => setShowRejectDialog(false)}>
        <DialogTitle>Rechazar Reseña</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Razón del rechazo"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRejectDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleRejectReview} 
            color="error" 
            variant="contained"
            disabled={!rejectReason.trim()}
          >
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

import { useEffect, useState } from 'react'
import { Box, Paper, Stack, Typography, Button, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { placesService } from '../../services/placesService'
import {
  Place as PlaceIcon,
  People as PeopleIcon,
  RateReview as ReviewIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material'

interface AdminStats {
  totalPlaces: number
  activePlaces: number
  pendingPlaces: number
  featuredPlaces: number
  totalUsers: number
  activeUsers: number
  totalReviews: number
  pendingReviews: number
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Obtener estadísticas de lugares
        const placesRes = await placesService.adminListPlaces({ limit: 100 })
        const places = placesRes.data || []
        
        // Simular estadísticas de usuarios y reviews (en producción vendría del backend)
        const mockUserStats = {
          totalUsers: 156,
          activeUsers: 142
        }
        
        const mockReviewStats = {
          totalReviews: 89,
          pendingReviews: 12
        }
        
        setStats({
          totalPlaces: places.length,
          activePlaces: places.filter((p: any) => p.status === 'active').length,
          pendingPlaces: places.filter((p: any) => p.status === 'pending').length,
          featuredPlaces: places.filter((p: any) => p?.metadata?.featured).length,
          totalUsers: mockUserStats.totalUsers,
          activeUsers: mockUserStats.activeUsers,
          totalReviews: mockReviewStats.totalReviews,
          pendingReviews: mockReviewStats.pendingReviews
        })
      } catch (e) {
        console.error('Error cargando estadísticas:', e)
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={800}>Panel de Administración</Typography>
        <Button variant="contained" onClick={() => navigate('/admin/places')}>Gestionar Lugares</Button>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Resumen General</Typography>
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2
          }}
        >
          <Paper sx={{ p: 2, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Usuarios</Typography>
                <Typography variant="h4" fontWeight={800}>
                  {stats?.totalUsers ?? (loading ? '...' : 0)}
                </Typography>
                <Typography variant="caption" color="success.main">
                  {stats && `${stats.activeUsers} activos`}
                </Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
            </Box>
          </Paper>

          <Paper sx={{ p: 2, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Lugares</Typography>
                <Typography variant="h4" fontWeight={800}>
                  {stats?.totalPlaces ?? (loading ? '...' : 0)}
                </Typography>
                <Typography variant="caption" color="success.main">
                  {stats && `${stats.activePlaces} activos`}
                </Typography>
              </Box>
              <PlaceIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
            </Box>
          </Paper>

          <Paper sx={{ p: 2, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Reseñas</Typography>
                <Typography variant="h4" fontWeight={800}>
                  {stats?.totalReviews ?? (loading ? '...' : 0)}
                </Typography>
                <Typography variant="caption" color="warning.main">
                  {stats && `${stats.pendingReviews} pendientes`}
                </Typography>
              </Box>
              <ReviewIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
            </Box>
          </Paper>

          <Paper sx={{ p: 2, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Destacados</Typography>
                <Typography variant="h4" fontWeight={800}>
                  {stats?.featuredPlaces ?? (loading ? '...' : 0)}
                </Typography>
                <Typography variant="caption" color="info.main">
                  Lugares premium
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Alertas y acciones rápidas */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Requiere Atención</Typography>
        <Stack spacing={2}>
          {stats && stats.pendingPlaces > 0 && (
            <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.dark' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <WarningIcon />
                  <Typography>
                    Hay {stats.pendingPlaces} lugares pendientes de aprobación
                  </Typography>
                </Stack>
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={() => navigate('/admin/places')}
                  sx={{ bgcolor: 'warning.dark' }}
                >
                  Revisar
                </Button>
              </Stack>
            </Paper>
          )}
          
          {stats && stats.pendingReviews > 0 && (
            <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.dark' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ReviewIcon />
                  <Typography>
                    Hay {stats.pendingReviews} reseñas esperando moderación
                  </Typography>
                </Stack>
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={() => navigate('/admin/reviews')}
                  sx={{ bgcolor: 'info.dark' }}
                >
                  Moderar
                </Button>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Box>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Accesos rápidos</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="Crear lugar" color="primary" onClick={() => navigate('/admin/places')}/>
          <Chip label="Ver pendientes" onClick={() => navigate('/admin/places')}/>
          <Chip label="Ver destacados" onClick={() => navigate('/admin/places')}/>
        </Stack>
      </Paper>
    </Box>
  )
}



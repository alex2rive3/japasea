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
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts'

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

  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']
  
  // Datos para gráficos
  const [placesByType, setPlacesByType] = useState<{name: string, value: number}[]>([])
  const [activityData, setActivityData] = useState<{date: string, places: number, users: number, reviews: number}[]>([])
  const [statusDistribution, setStatusDistribution] = useState<{name: string, value: number}[]>([])

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

        // Procesar datos para gráficos
        // 1. Lugares por tipo
        const typeCount: Record<string, number> = {}
        places.forEach((place: any) => {
          const type = place.type || 'Otros'
          typeCount[type] = (typeCount[type] || 0) + 1
        })
        setPlacesByType(
          Object.entries(typeCount).map(([name, value]) => ({ name, value }))
        )

        // 2. Distribución de estados
        const activeCount = places.filter((p: any) => p.status === 'active').length
        const pendingCount = places.filter((p: any) => p.status === 'pending').length
        const inactiveCount = places.filter((p: any) => p.status === 'inactive').length
        setStatusDistribution([
          { name: 'Activos', value: activeCount },
          { name: 'Pendientes', value: pendingCount },
          { name: 'Inactivos', value: inactiveCount }
        ])

        // 3. Actividad últimos 7 días (datos simulados)
        const today = new Date()
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today)
          date.setDate(date.getDate() - (6 - i))
          return {
            date: date.toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit' }),
            places: Math.floor(Math.random() * 10) + 1,
            users: Math.floor(Math.random() * 20) + 5,
            reviews: Math.floor(Math.random() * 15) + 2
          }
        })
        setActivityData(last7Days)
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

      {/* Sección de Gráficos */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3, mt: 4 }}>
        📊 Análisis y Tendencias
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
        mb: 3
      }}>
        {/* Gráfico de Lugares por Tipo */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Distribución por Tipo de Lugar
          </Typography>
          {placesByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={placesByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {placesByType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Sin datos disponibles</Typography>
            </Box>
          )}
        </Paper>

        {/* Gráfico de Estado de Lugares */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Estado de los Lugares
          </Typography>
          {statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {statusDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Sin datos disponibles</Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Gráfico de Actividad */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Actividad de los Últimos 7 Días
        </Typography>
        {activityData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="places" stroke="#8884d8" name="Lugares" strokeWidth={2} />
              <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Usuarios" strokeWidth={2} />
              <Line type="monotone" dataKey="reviews" stroke="#ffc658" name="Reseñas" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Sin datos disponibles</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}



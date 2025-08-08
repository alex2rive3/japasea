import { useEffect, useState } from 'react'
import { Box, Paper, Typography, Stack, Chip } from '@mui/material'
import { adminService } from '../../services/adminService'
import {
  AreaChart,
  Area,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ComposedChart,
  Line
} from 'recharts'

export default function AdminStats() {
  const [stats, setStats] = useState<{ [k: string]: number }>({})
  const [loading, setLoading] = useState(false)
  
  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']
  
  // Datos para gráficos
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [typeData, setTypeData] = useState<any[]>([])
  const [radarData, setRadarData] = useState<any[]>([])
  const [growthData, setGrowthData] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Obtener estadísticas generales del backend
        const statsResponse = await adminService.getAdminStats()
        const statsData = statsResponse.data || statsResponse
        
        // Obtener estadísticas de lugares
        const placeStatsResponse = await adminService.getPlaceStats()
        const placeStats = placeStatsResponse.data || placeStatsResponse
        
        // Estadísticas básicas
        if (statsData) {
          const basicStats: any = {
            total: statsData.places?.total || 0,
            activos: statsData.places?.active || 0,
            pendientes: statsData.places?.pending || 0,
            verificados: statsData.places?.verified || 0,
            destacados: statsData.places?.featured || 0
          }
          
          // Agregar tipos si están disponibles
          if (statsData.places?.byType) {
            statsData.places.byType.forEach((item: any) => {
              basicStats[item.type || 'Otros'] = item.count
            })
          }
          
          setStats(basicStats)
          
          // Datos para gráfico de tipos
          if (statsData.places?.byType) {
            setTypeData(
              statsData.places.byType.map((item: any) => ({
                name: item.type || 'Otros',
                value: item.count
              }))
            )
          }
        }
        
        // Si tenemos estadísticas específicas de lugares, usarlas también
        if (placeStats?.byType) {
          setTypeData(
            placeStats.byType.map((item: any) => ({
              name: item._id || 'Otros',
              value: item.count
            }))
          )
        }

        // Datos mensuales simulados
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
        setMonthlyData(months.map((month) => ({
          month,
          lugares: Math.floor(Math.random() * 50) + 20,
          usuarios: Math.floor(Math.random() * 100) + 50,
          reseñas: Math.floor(Math.random() * 80) + 30,
          ingresos: Math.floor(Math.random() * 5000) + 2000
        })))

        // Datos para radar chart
        setRadarData([
          { category: 'Turismo', actual: 85, objetivo: 100 },
          { category: 'Gastronomía', actual: 75, objetivo: 90 },
          { category: 'Alojamiento', actual: 60, objetivo: 80 },
          { category: 'Entretenimiento', actual: 90, objetivo: 95 },
          { category: 'Servicios', actual: 70, objetivo: 85 }
        ])

        // Datos de crecimiento
        const last12Months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date()
          date.setMonth(date.getMonth() - (11 - i))
          return {
            mes: date.toLocaleDateString('es-PY', { month: 'short' }),
            nuevosLugares: Math.floor(Math.random() * 20) + 5,
            nuevosUsuarios: Math.floor(Math.random() * 50) + 20
          }
        })
        setGrowthData(last12Months)

      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          📊 Estadísticas Detalladas
        </Typography>
        <Chip label="Actualizado hoy" color="success" size="small" />
      </Stack>

      {/* KPIs principales */}
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
          gap: 2,
          mb: 4
        }}
      >
        {Object.entries(stats).slice(0, 5).map(([k, v]) => (
          <Paper sx={{ p: 2 }} key={k}>
            <Stack>
              <Typography variant="subtitle2" color="text.secondary" textTransform="capitalize">
                {k}
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {loading ? '...' : v}
              </Typography>
              <Typography variant="caption" color="success.main">
                +{Math.floor(Math.random() * 20)}% este mes
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* Gráficos principales */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
        {/* Gráfico de tendencias mensuales */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tendencias Mensuales
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="usuarios" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="lugares" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="reseñas" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* Gráfico de distribución por tipo */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Distribución por Categoría
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Gráficos secundarios */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
        {/* Radar de rendimiento por categoría */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Rendimiento por Categoría
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Actual" dataKey="actual" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Objetivo" dataKey="objetivo" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Gráfico de crecimiento */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Crecimiento Últimos 12 Meses
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="nuevosLugares" fill="#8884d8" name="Nuevos Lugares" />
              <Line yAxisId="right" type="monotone" dataKey="nuevosUsuarios" stroke="#ff7300" name="Nuevos Usuarios" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Tabla de estadísticas por tipo */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Desglose por Tipo
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2, mt: 2 }}>
          {Object.entries(stats).filter(([k]) => !['total', 'activos', 'pendientes', 'verificados', 'destacados'].includes(k)).map(([tipo, cantidad]) => (
            <Paper key={tipo} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" textTransform="capitalize">
                  {tipo}
                </Typography>
                <Chip label={cantidad} color="primary" size="small" />
              </Stack>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Box>
  )
}
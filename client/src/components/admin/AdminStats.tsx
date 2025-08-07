import { useEffect, useState } from 'react'
import { Box, Paper, Typography, Stack } from '@mui/material'
import { placesService } from '../../services/placesService'

export default function AdminStats() {
  const [stats, setStats] = useState<{ [k: string]: number }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Placeholder simple: derivar estadísticas a partir de la lista
        const res = await placesService.adminListPlaces({ limit: 500 })
        const items: any[] = res.data || []
        const byType: Record<string, number> = {}
        items.forEach(p => { byType[p.type] = (byType[p.type] || 0) + 1 })
        setStats({ total: items.length, activos: items.filter(p => p.status === 'active').length, pendientes: items.filter(p => p.status === 'pending').length, ...byType })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>Estadísticas</Typography>
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2
        }}
      >
        {Object.entries(stats).map(([k, v]) => (
          <Paper sx={{ p: 2 }} key={k}>
            <Stack>
              <Typography variant="subtitle2" color="text.secondary">{k}</Typography>
              <Typography variant="h4" fontWeight={800}>{loading ? '...' : v}</Typography>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Box>
  )
}



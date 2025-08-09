import { Box, Button, Chip, Container, Grid, Stack, Typography, Card, CardContent } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckIcon from '@mui/icons-material/Check'
import StarIcon from '@mui/icons-material/Star'
import MapIcon from '@mui/icons-material/Map'
import ChatIcon from '@mui/icons-material/Chat'
import SecurityIcon from '@mui/icons-material/Security'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          background: 'radial-gradient(1200px 400px at 10% -10%, rgba(25,118,210,0.12), transparent), linear-gradient(180deg, rgba(2,0,36,0) 0%, rgba(2,0,36,0.02) 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <img src={logo} alt="Japasea" style={{ width: 44, height: 44, borderRadius: 8 }} />
                  <Typography variant="h5" fontWeight={700}>Japasea</Typography>
                </Stack>
                <Typography variant="h2" fontWeight={800} lineHeight={1.1}>
                  Descubrí Paraguay con una plataforma moderna y simple
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Mapas, reseñas, favoritos y un panel para negocios. Minimalista, rápido y listo para vender.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={1}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/register')}
                    sx={{ px: 3, py: 1.2 }}
                  >
                    Empezar gratis
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{ px: 3, py: 1.2 }}
                  >
                    Ver demo
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} pt={2}>
                  <Chip color="primary" variant="outlined" size="small" icon={<RocketLaunchIcon />} label="Listo para producción" />
                  <Chip color="default" variant="outlined" size="small" icon={<SecurityIcon />} label="Seguro y auditable" />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: { xs: 260, md: 380 },
                  borderRadius: 3,
                  bgcolor: 'rgba(25,118,210,0.06)',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Stack spacing={1} alignItems="center">
                  <MapIcon color="primary" sx={{ fontSize: 56 }} />
                  <Typography variant="h6" textAlign="center" maxWidth={360}>
                    Mapa interactivo, chat con IA e insights para negocios. Todo en una sola plataforma.
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={3}>
          {[
            { icon: <MapIcon color="primary" />, title: 'Mapa y lugares', desc: 'Exploración por categorías, filtros y cercanía.' },
            { icon: <ChatIcon color="primary" />, title: 'Chat con IA', desc: 'Recomendaciones inteligentes en tu idioma.' },
            { icon: <SecurityIcon color="primary" />, title: 'Seguro y escalable', desc: 'JWT, auditoría, rate limiting y roles.' },
          ].map(({ icon, title, desc }) => (
            <Grid item xs={12} md={4} key={title}>
              <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent>
                  <Stack spacing={1.2}>
                    <Box>{icon}</Box>
                    <Typography variant="h6" fontWeight={700}>{title}</Typography>
                    <Typography color="text.secondary">{desc}</Typography>
                    <Stack direction="row" spacing={1} pt={1}>
                      <Chip size="small" icon={<CheckIcon />} label="Rápido" variant="outlined" />
                      <Chip size="small" icon={<CheckIcon />} label="Minimalista" variant="outlined" />
                      <Chip size="small" icon={<CheckIcon />} label="Listo para vender" variant="outlined" />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Social proof / métricas simples */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {[
              { value: '95%+', label: 'Core listo' },
              { value: '58', label: 'Endpoints API' },
              { value: 'A+', label: 'Seguridad' },
            ].map(({ value, label }) => (
              <Grid item xs={12} md={4} key={label}>
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h3" fontWeight={800}>{value}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <StarIcon color="warning" />
                    <Typography color="text.secondary">{label}</Typography>
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA final */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(25,118,210,0.1), rgba(25,118,210,0.04))',
            border: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Listo para despegar en tu ciudad
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 720, mx: 'auto' }}>
            Implementación rápida, diseño minimalista y enfoque en conversión. Probalo gratis y sumá tu negocio hoy.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mt={3}>
            <Button variant="contained" size="large" onClick={() => navigate('/register')} endIcon={<ArrowForwardIcon />}>Comenzar ahora</Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/login')}>Iniciar sesión</Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}



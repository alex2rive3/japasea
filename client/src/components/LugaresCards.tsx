import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Link,
  Button,
} from '@mui/material'
import { LocationOn, Phone, Info, Hotel, Restaurant, Coffee, Place, ShoppingBag } from '@mui/icons-material'
import type { Lugar } from '../types/lugares'

interface LugaresCardsProps {
  lugares: Lugar[]
  onLocationClick?: (lugar: Lugar) => void
}

export const LugaresCards = ({ lugares, onLocationClick }: LugaresCardsProps) => {
  const extractPhone = (description: string): string | null => {
    const phoneRegex = /(\d{4}\s?\d{3}\s?\d{3})/g
    const match = description.match(phoneRegex)
    return match ? match[0] : null
  }

  const getTypeColor = (type: string): "primary" | "secondary" | "success" | "warning" | "info" => {
    switch (type.toLowerCase()) {
      case 'alojamiento':
        return 'primary'
      case 'desayunos y meriendas':
        return 'secondary'
      case 'comida':
        return 'warning'
      case 'turístico':
        return 'success'
      case 'compras':
        return 'info'
      default:
        return 'primary'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'alojamiento':
        return <Hotel sx={{ fontSize: 20 }} />
      case 'desayunos y meriendas':
        return <Coffee sx={{ fontSize: 20 }} />
      case 'comida':
        return <Restaurant sx={{ fontSize: 20 }} />
      case 'turístico':
        return <Place sx={{ fontSize: 20 }} />
      case 'compras':
        return <ShoppingBag sx={{ fontSize: 20 }} />
      default:
        return <Place sx={{ fontSize: 20 }} />
    }
  }

  const getDefaultImage = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'alojamiento':
        return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      case 'desayunos y meriendas':
        return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      case 'comida':
        return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      case 'turístico':
        return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73aeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      case 'compras':
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      default:
        return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  }

  if (lugares.length === 0) {
    return null
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Lugares Recomendados
      </Typography>
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
          alignItems: 'stretch'
        }}
      >
        {lugares.map((lugar) => {
          const phone = extractPhone(lugar.description)
          const cleanDescription = lugar.description.replace(/Teléfono:.*/, '').trim()
          
          return (
            <Card 
              key={lugar.key}
              elevation={3} 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: 8,
                  borderColor: 'primary.main',
                }
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={getDefaultImage(lugar.type)}
                alt={lugar.key}
                sx={{
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    component="h4" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: '1.1rem',
                      mb: 1,
                      color: 'text.primary',
                      lineHeight: 1.3
                    }}
                  >
                    {lugar.key}
                  </Typography>
                  <Chip 
                    icon={getTypeIcon(lugar.type)}
                    label={lugar.type} 
                    color={getTypeColor(lugar.type)}
                    size="small"
                    sx={{ 
                      fontWeight: 'medium',
                      fontSize: '0.75rem',
                      '& .MuiChip-icon': {
                        fontSize: '14px'
                      }
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <LocationOn sx={{ color: 'primary.main', mr: 1, fontSize: 18, mt: 0.2 }} />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 'medium',
                      lineHeight: 1.4
                    }}
                  >
                    {lugar.address}
                  </Typography>
                </Box>

                <Typography 
                  variant="body2" 
                  color="text.primary" 
                  sx={{ 
                    mb: 2.5, 
                    lineHeight: 1.5,
                    fontSize: '0.875rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: '3.9rem'
                  }}
                >
                  {cleanDescription}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  {phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone sx={{ color: 'success.main', mr: 1, fontSize: 18 }} />
                      <Link 
                        href={`tel:${phone}`}
                        color="success.main"
                        underline="hover"
                        sx={{ 
                          fontSize: '0.875rem',
                          fontWeight: 'medium',
                          '&:hover': {
                            color: 'success.dark'
                          }
                        }}
                      >
                        {phone}
                      </Link>
                    </Box>
                  )}
                  
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={() => onLocationClick?.(lugar)}
                    startIcon={<Info />}
                    fullWidth
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'medium',
                      py: 1,
                      fontSize: '0.875rem',
                      '&:hover': {
                        boxShadow: 3
                      }
                    }}
                  >
                    Ver en mapa
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </Box>
  )
}

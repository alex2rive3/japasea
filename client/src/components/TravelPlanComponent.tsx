import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  Divider,
  Avatar
} from '@mui/material'
import {
  Restaurant,
  Hotel,
  LocalCafe,
  Place as PlaceIcon,
  LocationOn,
  Phone
} from '@mui/icons-material'
import type { TravelPlan, TravelActivity } from '../types/places'

interface TravelPlanComponentProps {
  travelPlan: TravelPlan
  message: string
  onPlaceClick: (place: TravelActivity['place']) => void
}

const TravelPlanComponent: React.FC<TravelPlanComponentProps> = ({
  travelPlan,
  onPlaceClick
}) => {
  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes('desayuno') || categoryLower.includes('merienda')) {
      return <LocalCafe sx={{ fontSize: 16 }} />
    }
    if (categoryLower.includes('almuerzo') || categoryLower.includes('cena') || categoryLower.includes('comida')) {
      return <Restaurant sx={{ fontSize: 16 }} />
    }
    if (categoryLower.includes('alojamiento') || categoryLower.includes('hotel')) {
      return <Hotel sx={{ fontSize: 16 }} />
    }
    return <PlaceIcon sx={{ fontSize: 16 }} />
  }

  const getCategoryColor = (category: string) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes('desayuno') || categoryLower.includes('merienda')) {
      return '#8D6E63'
    }
    if (categoryLower.includes('almuerzo') || categoryLower.includes('cena') || categoryLower.includes('comida')) {
      return '#FF7043'
    }
    if (categoryLower.includes('alojamiento') || categoryLower.includes('hotel')) {
      return '#5C6BC0'
    }
    return '#26A69A'
  }

  const extractPhoneNumber = (description: string): string | null => {
    const phoneMatch = description.match(/(\d{4}\s?\d{3}\s?\d{3}|\d{3}\s?\d{3}\s?\d{3})/g)
    return phoneMatch ? phoneMatch[0] : null
  }

  return (
    <Box sx={{ 
      width: '100%', 
      mt: 1, 
      maxWidth: '100%', 
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>

      {/* Compact Travel Plan Days */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1.5,
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {travelPlan.days.map((day) => (
          <Box key={day.dayNumber} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            <Card elevation={2} sx={{ 
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              overflow: 'hidden',
              maxWidth: '100%'
            }}>
              <CardContent sx={{ p: 0 }}>
                {/* Compact Day Header */}
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  p: 1.5,
                  borderRadius: '8px 8px 0 0',
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    wordBreak: 'break-word'
                  }}>
                    Día {day.dayNumber} • {day.title}
                  </Typography>
                </Box>

                {/* Compact Activities */}
                <Box sx={{ p: 1.5, maxWidth: '100%', overflow: 'hidden' }}>
                  {day.activities.map((activity, index) => (
                    <Box key={index} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 1.5,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          '&:hover': {
                            bgcolor: '#f5f5f5',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                        onClick={() => onPlaceClick(activity.place)}
                      >
                        {/* Compact Time and Icon */}
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          minWidth: 60,
                          maxWidth: 60,
                          gap: 0.5,
                          flexShrink: 0
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: getCategoryColor(activity.category),
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            textAlign: 'center'
                          }}>
                            {activity.time}
                          </Typography>
                          <Avatar sx={{ 
                            bgcolor: getCategoryColor(activity.category), 
                            width: 28, 
                            height: 28
                          }}>
                            {getCategoryIcon(activity.category)}
                          </Avatar>
                        </Box>

                        {/* Compact Activity Details */}
                        <Box sx={{ 
                          flex: 1, 
                          minWidth: 0,
                          maxWidth: 'calc(100% - 75px)',
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1, 
                            mb: 0.5,
                            maxWidth: '100%',
                            overflow: 'hidden'
                          }}>
                            <Chip
                              label={activity.category}
                              size="small"
                              sx={{
                                bgcolor: getCategoryColor(activity.category),
                                color: 'white',
                                fontWeight: 500,
                                fontSize: '0.7rem',
                                height: 20,
                                maxWidth: '120px',
                                '& .MuiChip-label': {
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }
                              }}
                            />
                          </Box>

                          <Typography variant="subtitle2" sx={{ 
                            fontWeight: 600, 
                            color: '#1a1a1a',
                            mb: 0.5,
                            fontSize: '0.875rem',
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {activity.place.key}
                          </Typography>

                          <Typography variant="caption" sx={{ 
                            color: '#666', 
                            mb: 1,
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            wordBreak: 'break-word'
                          }}>
                            {activity.place.description}
                          </Typography>

                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: 0.5, 
                            maxWidth: '100%',
                            overflow: 'hidden'
                          }}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5,
                              maxWidth: '100%',
                              overflow: 'hidden'
                            }}>
                              <LocationOn sx={{ fontSize: 12, color: '#999', flexShrink: 0 }} />
                              <Typography variant="caption" sx={{ 
                                color: '#999',
                                fontSize: '0.7rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1
                              }}>
                                {activity.place.address}
                              </Typography>
                            </Box>

                            {extractPhoneNumber(activity.place.description) && (
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.5,
                                maxWidth: '100%',
                                overflow: 'hidden'
                              }}>
                                <Phone sx={{ fontSize: 12, color: '#999', flexShrink: 0 }} />
                                <Typography variant="caption" sx={{ 
                                  color: '#999',
                                  fontSize: '0.7rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {extractPhoneNumber(activity.place.description)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      {index < day.activities.length - 1 && (
                        <Divider sx={{ my: 0.5, mx: 1 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Compact Summary */}
      <Paper elevation={0} sx={{ 
        p: 1, 
        mt: 1.5, 
        bgcolor: '#e8f5e8',
        borderRadius: 1,
        border: '1px solid #c8e6c9',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <Typography variant="caption" color="text.secondary" align="center" sx={{ 
          fontSize: '0.75rem',
          wordBreak: 'break-word'
        }}>
          ✨ {travelPlan.days.reduce((total, day) => total + day.activities.length, 0)} actividades 
          en {travelPlan.totalDays} día{travelPlan.totalDays > 1 ? 's' : ''}
        </Typography>
      </Paper>
    </Box>
  )
}

export default TravelPlanComponent

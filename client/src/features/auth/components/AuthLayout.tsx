import { Box, Paper, Typography } from '@mui/material'
import { AuthStylesUtils } from '../utils/authUtils'
import type { AuthLayoutProps } from '../types/auth.types'

export function AuthLayout({ 
  subtitle, 
  children, 
  showLogo = true 
}: Omit<AuthLayoutProps, 'title'>) {
  return (
    <Box sx={AuthStylesUtils.getContainerStyles()}>
      <Paper
        elevation={3}
        sx={AuthStylesUtils.getPaperStyles()}
      >
        <Box sx={AuthStylesUtils.getHeaderStyles()}>
          {showLogo && (
            <Typography
              variant="h3"
              component="h1"
              sx={AuthStylesUtils.getTitleStyles()}
            >
              Japasea
            </Typography>
          )}
          {subtitle && (
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={AuthStylesUtils.getSubtitleStyles()}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {children}
      </Paper>
    </Box>
  )
}

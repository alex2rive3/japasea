import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { AuthStylesUtils } from '../utils/authUtils'

interface AuthLinkProps {
  text: string
  linkText: string
  to: string
}

export function AuthLink({ text, linkText, to }: AuthLinkProps) {
  return (
    <Box sx={AuthStylesUtils.getLinkContainerStyles()}>
      <Typography variant="body2" color="text.secondary">
        {text}{' '}
        <Link
          to={to}
          style={AuthStylesUtils.getLinkStyles()}
        >
          {linkText}
        </Link>
      </Typography>
    </Box>
  )
}

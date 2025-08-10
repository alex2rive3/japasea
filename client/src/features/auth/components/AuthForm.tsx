import { Box, Button, Alert, CircularProgress } from '@mui/material'
import { AuthStylesUtils } from '../utils/authUtils'
import type { AuthFormProps } from '../types/auth.types'

export function AuthForm({
  onSubmit,
  isLoading,
  error,
  submitText,
  loadingText,
  children
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Box sx={AuthStylesUtils.getFormContainerStyles()}>
        {error && (
          <Alert 
            severity="error" 
            sx={AuthStylesUtils.getAlertStyles()}
          >
            {error}
          </Alert>
        )}

        {children}

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isLoading}
          sx={AuthStylesUtils.getButtonStyles()}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              {loadingText}
            </>
          ) : (
            submitText
          )}
        </Button>
      </Box>
    </form>
  )
}

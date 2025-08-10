import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { Send } from '@mui/icons-material'
import type { MessageInputProps } from '../types'

export function MessageInput({ 
  value, 
  onChange, 
  onSend, 
  disabled = false, 
  placeholder = "Escribe tu mensaje..."
}: MessageInputProps) {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && !disabled) {
      event.preventDefault()
      onSend()
    }
  }

  const handleSend = () => {
    if (!disabled && value.trim()) {
      onSend()
    }
  }

  return (
    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
      <TextField
        fullWidth
        multiline
        maxRows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            paddingRight: '8px'
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleSend}
                disabled={disabled || !value.trim()}
                color="primary"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'action.disabledBackground',
                    color: 'action.disabled'
                  }
                }}
              >
                <Send />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </Box>
  )
}

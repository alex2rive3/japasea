import { Controller } from 'react-hook-form'
import {
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { AuthStylesUtils } from '../utils/authUtils'
import type { FormFieldProps } from '../types/auth.types'

export function AuthFormField({
  name,
  control,
  disabled = false,
  error,
  showPassword,
  onToggleVisibility,
  fieldConfig
}: FormFieldProps) {
  const { label, placeholder, type = 'text', icon: Icon, autoComplete } = fieldConfig

  const isPasswordField = type === 'password'
  const inputType = isPasswordField 
    ? (showPassword ? 'text' : 'password')
    : type

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          type={inputType}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          error={!!error}
          helperText={error?.message}
          autoComplete={autoComplete}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon color="primary" />
              </InputAdornment>
            ),
            ...(isPasswordField && onToggleVisibility && {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={onToggleVisibility}
                    edge="end"
                    disabled={disabled}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            })
          }}
          sx={AuthStylesUtils.getFormFieldStyles()}
        />
      )}
    />
  )
}

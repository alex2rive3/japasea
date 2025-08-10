import { useState } from 'react'
import type { PasswordVisibilityState } from '../types/auth.types'

interface UsePasswordVisibilityProps {
  fields?: ('password' | 'confirmPassword' | 'currentPassword' | 'newPassword')[]
}

export function usePasswordVisibility(props: UsePasswordVisibilityProps = {}) {
  const { fields = ['password', 'confirmPassword'] } = props

  const initialState = fields.reduce((acc, field) => {
    acc[field as keyof PasswordVisibilityState] = false
    return acc
  }, {} as PasswordVisibilityState)

  const [visibility, setVisibility] = useState<PasswordVisibilityState>(initialState)

  const toggleVisibility = (field: keyof PasswordVisibilityState) => {
    setVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const showPassword = (field: keyof PasswordVisibilityState) => visibility[field] || false

  return {
    visibility,
    toggleVisibility,
    showPassword
  }
}

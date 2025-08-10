import { useState } from 'react'
import type { AuthFormState } from '../types/auth.types'

interface UseAuthFormStateProps {
  initialError?: string | null
  initialSuccess?: string | null
}

export function useAuthFormState(props: UseAuthFormStateProps = {}) {
  const { initialError = null, initialSuccess = null } = props

  const [state, setState] = useState<AuthFormState>({
    isLoading: false,
    error: initialError,
    success: initialSuccess
  })

  const setLoading = (loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading
    }))
  }

  const setError = (error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      success: error ? null : prev.success
    }))
  }

  const setSuccess = (success: string | null) => {
    setState(prev => ({
      ...prev,
      success,
      error: success ? null : prev.error
    }))
  }

  const clearMessages = () => {
    setState(prev => ({
      ...prev,
      error: null,
      success: null
    }))
  }

  const reset = () => {
    setState({
      isLoading: false,
      error: null,
      success: null
    })
  }

  return {
    ...state,
    setLoading,
    setError,
    setSuccess,
    clearMessages,
    reset
  }
}

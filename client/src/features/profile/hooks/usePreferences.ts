import { useState } from 'react'
import type { PreferencesState } from '../types'

export function usePreferences() {
  const [preferences, setPreferences] = useState<PreferencesState>({
    theme: 'light',
    language: 'es',
    notifications: {
      email: true,
      push: true,
      places: true,
      favorites: true,
    }
  })

  const updatePreference = <K extends keyof PreferencesState>(
    key: K, 
    value: PreferencesState[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updateNotificationPreference = (
    key: keyof PreferencesState['notifications'], 
    value: boolean
  ) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  return {
    preferences,
    updatePreference,
    updateNotificationPreference
  }
}

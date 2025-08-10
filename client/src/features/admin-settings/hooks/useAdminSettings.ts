import { useState, useEffect, useCallback } from 'react'
import type { SystemSettings } from '../types/adminSettings.types'
import { DEFAULT_SYSTEM_SETTINGS } from '../types/adminSettings.types'
import { AdminSettingsService } from '../services/adminSettingsService'

interface UseAdminSettingsReturn {
  settings: SystemSettings
  isLoading: boolean
  isSaving: boolean
  saveSuccess: boolean
  error: string | null
  updateSettings: (newSettings: SystemSettings) => void
  saveSettings: () => Promise<void>
  resetSettings: () => Promise<void>
  refreshSettings: () => Promise<void>
}

export const useAdminSettings = (): UseAdminSettingsReturn => {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SYSTEM_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const loadedSettings = await AdminSettingsService.loadSystemSettings()
      setSettings(loadedSettings)
    } catch (error) {
      console.error('Error loading settings:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
      // Mantener configuración por defecto en caso de error
      setSettings(DEFAULT_SYSTEM_SETTINGS)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSettings = useCallback((newSettings: SystemSettings) => {
    setSettings(newSettings)
    setSaveSuccess(false)
    setError(null)
  }, [])

  const saveSettings = useCallback(async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    setError(null)
    
    try {
      // Validar configuración antes de guardar
      const validation = AdminSettingsService.validateSettings(settings)
      if (!validation.isValid) {
        const errorMessages = Object.entries(validation.errors)
          .filter(([, errors]) => errors.length > 0)
          .map(([section, errors]) => `${section}: ${errors.join(', ')}`)
          .join('\n')
        
        throw new Error(`Errores de validación:\n${errorMessages}`)
      }
      
      await AdminSettingsService.saveSystemSettings(settings)
      setSaveSuccess(true)
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido al guardar')
    } finally {
      setIsSaving(false)
    }
  }, [settings])

  const resetSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setSaveSuccess(false)
    
    try {
      const defaultSettings = await AdminSettingsService.resetSettingsToDefault()
      setSettings(defaultSettings)
    } catch (error) {
      console.error('Error resetting settings:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido al restaurar')
      // Usar configuración por defecto local como fallback
      setSettings(DEFAULT_SYSTEM_SETTINGS)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshSettings = useCallback(async () => {
    await loadSettings()
  }, [loadSettings])

  // Cargar configuración inicial
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return {
    settings,
    isLoading,
    isSaving,
    saveSuccess,
    error,
    updateSettings,
    saveSettings,
    resetSettings,
    refreshSettings
  }
}

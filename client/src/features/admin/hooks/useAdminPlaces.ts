import { useState, useEffect, useCallback } from 'react'
import { adminPlacesService } from '../services/adminPlacesService'
import type { AdminPlace, AdminPlaceForm, AdminPlaceFilters } from '../types/admin.types'

interface UseAdminPlacesOptions {
  page?: number
  limit?: number
}

export function useAdminPlaces(options: UseAdminPlacesOptions = {}) {
  const { page = 1, limit = 20 } = options
  
  const [items, setItems] = useState<AdminPlace[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<AdminPlaceFilters>({})
  const [error, setError] = useState<string | null>(null)

  const loadPlaces = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminPlacesService.listPlaces({ 
        page, 
        limit, 
        ...filters 
      })
      setItems(response.data)
    } catch (err) {
      console.error('Error loading places:', err)
      setError('Error al cargar los lugares')
    } finally {
      setLoading(false)
    }
  }, [page, limit, filters])

  const createPlace = async (placeData: AdminPlaceForm) => {
    try {
      await adminPlacesService.createPlace(placeData)
      await loadPlaces()
    } catch (err) {
      console.error('Error creating place:', err)
      throw new Error('Error al crear el lugar')
    }
  }

  const updatePlace = async (id: string, placeData: AdminPlaceForm) => {
    try {
      await adminPlacesService.updatePlace(id, placeData)
      await loadPlaces()
    } catch (err) {
      console.error('Error updating place:', err)
      throw new Error('Error al actualizar el lugar')
    }
  }

  const verifyPlace = async (id: string) => {
    try {
      await adminPlacesService.verifyPlace(id)
      await loadPlaces()
    } catch (err) {
      console.error('Error verifying place:', err)
      throw new Error('Error al verificar el lugar')
    }
  }

  const featurePlace = async (id: string, featured: boolean) => {
    try {
      await adminPlacesService.featurePlace(id, featured)
      await loadPlaces()
    } catch (err) {
      console.error('Error featuring place:', err)
      throw new Error('Error al destacar el lugar')
    }
  }

  const setPlaceStatus = async (id: string, status: string) => {
    try {
      await adminPlacesService.setPlaceStatus(id, status)
      await loadPlaces()
    } catch (err) {
      console.error('Error setting place status:', err)
      throw new Error('Error al cambiar el estado del lugar')
    }
  }

  useEffect(() => {
    loadPlaces()
  }, [loadPlaces])

  return {
    items,
    loading,
    error,
    filters,
    setFilters,
    loadPlaces,
    createPlace,
    updatePlace,
    verifyPlace,
    featurePlace,
    setPlaceStatus
  }
}

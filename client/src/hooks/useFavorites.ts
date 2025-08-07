import { useState, useEffect, useCallback } from 'react'
import { favoritesService } from '../services/favoritesService'
import { useAuth } from './useAuth'
import type { Favorite } from '../services/favoritesService'

interface UseFavoritesReturn {
  favorites: Favorite[]
  loading: boolean
  error: string | null
  isFavorite: (placeId: string) => boolean
  addFavorite: (placeId: string) => Promise<void>
  removeFavorite: (placeId: string) => Promise<void>
  toggleFavorite: (placeId: string) => Promise<void>
  refreshFavorites: () => Promise<void>
  favoriteCount: number
}

export function useFavorites(): UseFavoritesReturn {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())

  // Cargar favoritos cuando el usuario esté autenticado
  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      setFavoriteIds(new Set())
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Intentar obtener del cache primero
      const cached = favoritesService.getFromLocalStorage()
      if (cached && favoritesService.isCacheValid(cached.timestamp)) {
        setFavorites(cached.data)
        setFavoriteIds(new Set(cached.data.map(f => f._id)))
        setLoading(false)
        
        // Actualizar en segundo plano
        const response = await favoritesService.getFavorites()
        if (response.success) {
          setFavorites(response.data)
          setFavoriteIds(new Set(response.data.map(f => f._id)))
          await favoritesService.saveToLocalStorage(response.data)
        }
      } else {
        // Obtener del servidor
        const response = await favoritesService.getFavorites()
        if (response.success) {
          setFavorites(response.data)
          setFavoriteIds(new Set(response.data.map(f => f._id)))
          await favoritesService.saveToLocalStorage(response.data)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar favoritos')
      
      // Intentar cargar del cache en caso de error
      const cached = favoritesService.getFromLocalStorage()
      if (cached) {
        setFavorites(cached.data)
        setFavoriteIds(new Set(cached.data.map(f => f._id)))
      }
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const isFavorite = useCallback((placeId: string): boolean => {
    return favoriteIds.has(placeId)
  }, [favoriteIds])

  const addFavorite = useCallback(async (placeId: string) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para agregar favoritos')
    }

    try {
      const response = await favoritesService.addFavorite(placeId)
      if (response.success) {
        // Actualizar estado local inmediatamente
        setFavoriteIds(prev => new Set([...prev, placeId]))
        
        // Recargar lista completa
        await loadFavorites()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar favorito'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [user, loadFavorites])

  const removeFavorite = useCallback(async (placeId: string) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para eliminar favoritos')
    }

    try {
      const response = await favoritesService.removeFavorite(placeId)
      if (response.success) {
        // Actualizar estado local inmediatamente
        setFavoriteIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(placeId)
          return newSet
        })
        
        // Actualizar lista
        setFavorites(prev => prev.filter(f => f._id !== placeId))
        
        // Actualizar cache
        const updatedFavorites = favorites.filter(f => f._id !== placeId)
        await favoritesService.saveToLocalStorage(updatedFavorites)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar favorito'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [user, favorites])

  const toggleFavorite = useCallback(async (placeId: string) => {
    if (isFavorite(placeId)) {
      await removeFavorite(placeId)
    } else {
      await addFavorite(placeId)
    }
  }, [isFavorite, addFavorite, removeFavorite])

  const refreshFavorites = useCallback(async () => {
    await loadFavorites()
  }, [loadFavorites])

  return {
    favorites,
    loading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refreshFavorites,
    favoriteCount: favorites.length
  }
}
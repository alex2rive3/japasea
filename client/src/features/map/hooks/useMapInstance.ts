import { useEffect, useRef, useCallback } from 'react'
import type { Map as LeafletMap } from 'leaflet'

export function useMapInstance() {
  const mapRef = useRef<LeafletMap | null>(null)

  const handleMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map
  }, [])

  const invalidateMapSize = useCallback(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize()
      }, 100)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      invalidateMapSize()
    }

    window.addEventListener('resize', handleResize)
    // Call once on mount to ensure proper sizing
    invalidateMapSize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [invalidateMapSize])

  return {
    mapRef,
    handleMapReady,
    invalidateMapSize
  }
}

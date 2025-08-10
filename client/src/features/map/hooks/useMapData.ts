import { useMemo } from 'react'
import { MapCenterUtils } from '../utils/mapUtils'
import { MAP_CONFIG } from '../types/map.types'
import type { Place } from '../../../types/places'

interface UseMapDataOptions {
  center?: [number, number]
  zoom?: number
  places?: Place[]
}

export function useMapData(options: UseMapDataOptions = {}) {
  const { 
    center = MAP_CONFIG.defaultCenter, 
    zoom = MAP_CONFIG.defaultZoom, 
    places = [] 
  } = options

  const mapCenter = useMemo(() => {
    return MapCenterUtils.calculateCenter(places, center)
  }, [places, center])

  const mapKey = useMemo(() => {
    // Force map re-render when places or center change
    return `${places.length}-${mapCenter.join(',')}`
  }, [places.length, mapCenter])

  const hasPlaces = places.length > 0

  return {
    mapCenter,
    mapZoom: zoom,
    mapKey,
    places,
    hasPlaces
  }
}

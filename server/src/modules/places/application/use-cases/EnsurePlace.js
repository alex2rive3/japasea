class EnsurePlace {
  constructor(placeRepository) {
    this.placeRepository = placeRepository
  }

  async execute(placeData) {
    const {
      key,
      name,
      description,
      type,
      address,
      location
    } = placeData || {}

    const safeKey = key || name
    const safeName = name || key
    const safeDescription = description || 'Descripción no disponible'
    const safeType = type || 'Gastronomía'
    const safeAddress = address || 'Dirección por confirmar'

    // Validaciones mínimas
    if (!safeKey || !safeName) {
      const error = new Error('key o name requerido')
      error.name = 'ValidationError'
      throw error
    }

    // Buscar existente por key o por name+address
    const existing = await this.placeRepository.findExisting(safeKey, safeName, safeAddress)

    if (existing) {
      return existing
    }

    // Preparar coordenadas por defecto (Encarnación, Paraguay)
    let lat = location?.lat
    let lng = location?.lng
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      lat = -27.3309
      lng = -55.8663
    }

    // Crear nuevo lugar mínimo
    const newPlaceData = {
      key: safeKey,
      name: safeName,
      description: safeDescription,
      type: safeType,
      address: safeAddress,
      location: { lat, lng },
      status: 'active',
      rating: { average: 0, count: 0 },
      metadata: { views: 0, created: new Date() }
    }

    return await this.placeRepository.create(newPlaceData)
  }
}

module.exports = EnsurePlace

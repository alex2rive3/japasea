class PlaceService {
  constructor(placeRepository, validationService) {
    this.placeRepository = placeRepository
    this.validationService = validationService
  }

  async createPlace(placeData) {
    // Validaciones de dominio
    await this.validatePlaceData(placeData)
    
    // Lógica de negocio específica
    if (await this.placeRepository.existsByName(placeData.name)) {
      const error = new Error('Ya existe un lugar con ese nombre')
      error.name = 'DomainError'
      throw error
    }

    // Enriquecer datos
    const enrichedData = {
      ...placeData,
      slug: this.generateSlug(placeData.name),
      createdAt: new Date(),
      status: placeData.status || 'active',
      rating: placeData.rating || { average: 0, count: 0 },
      metadata: {
        views: 0,
        created: new Date(),
        ...placeData.metadata
      }
    }

    return await this.placeRepository.create(enrichedData)
  }

  async updatePlace(placeId, updateData) {
    // Validar que el lugar existe
    const existingPlace = await this.placeRepository.findById(placeId)
    if (!existingPlace) {
      const error = new Error('Lugar no encontrado')
      error.name = 'NotFoundError'
      throw error
    }

    // Si se cambia el nombre, verificar que no exista otro con el mismo
    if (updateData.name && updateData.name !== existingPlace.name) {
      const duplicateExists = await this.placeRepository.existsByName(updateData.name)
      if (duplicateExists) {
        const error = new Error('Ya existe un lugar con ese nombre')
        error.name = 'DomainError'
        throw error
      }
      
      // Actualizar slug si cambia el nombre
      updateData.slug = this.generateSlug(updateData.name)
    }

    // Añadir timestamp de actualización
    updateData.updatedAt = new Date()

    return await this.placeRepository.updateById(placeId, updateData)
  }

  async incrementViews(placeId) {
    const place = await this.placeRepository.findById(placeId)
    if (!place) {
      return null
    }

    const updateData = {
      'metadata.views': (place.metadata?.views || 0) + 1,
      'metadata.lastViewed': new Date()
    }

    return await this.placeRepository.updateById(placeId, updateData)
  }

  generateSlug(name) {
    if (!name) return ''
    
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s]/gi, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim()
  }

  async validatePlaceData(placeData) {
    const errors = []

    // Validaciones básicas
    if (!placeData.name || placeData.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres')
    }

    if (!placeData.type) {
      errors.push('El tipo de lugar es requerido')
    }

    if (!placeData.address) {
      errors.push('La dirección es requerida')
    }

    if (!placeData.location || !placeData.location.lat || !placeData.location.lng) {
      errors.push('Las coordenadas de ubicación son requeridas')
    } else {
      // Validar que las coordenadas estén en un rango válido para Paraguay
      const { lat, lng } = placeData.location
      if (lat < -28 || lat > -19 || lng < -63 || lng > -54) {
        errors.push('Las coordenadas no parecen estar en Paraguay')
      }
    }

    if (errors.length > 0) {
      const error = new Error('Errores de validación')
      error.name = 'ValidationError'
      error.errors = errors
      throw error
    }
  }

  async getPlaceStatistics(placeId) {
    const place = await this.placeRepository.findById(placeId)
    if (!place) {
      const error = new Error('Lugar no encontrado')
      error.name = 'NotFoundError'
      throw error
    }

    return {
      views: place.metadata?.views || 0,
      rating: place.rating || { average: 0, count: 0 },
      created: place.createdAt || place.metadata?.created,
      lastViewed: place.metadata?.lastViewed,
      status: place.status
    }
  }
}

module.exports = PlaceService

class GetPlaceById {
  constructor(placeRepository) {
    this.placeRepository = placeRepository
  }

  async execute(placeId) {
    if (!placeId) {
      const error = new Error('ID de lugar requerido')
      error.name = 'ValidationError'
      throw error
    }

    const place = await this.placeRepository.findById(placeId)
    
    if (!place) {
      const error = new Error('Lugar no encontrado')
      error.name = 'NotFoundError'
      throw error
    }

    return place
  }
}

module.exports = GetPlaceById

class GetRandomPlaces {
  constructor(placeRepository) {
    this.placeRepository = placeRepository
  }

  async execute(count = 3) {
    const numPlaces = parseInt(count)
    
    if (isNaN(numPlaces) || numPlaces <= 0) {
      const error = new Error('El número de lugares debe ser un entero positivo')
      error.name = 'ValidationError'
      throw error
    }

    return await this.placeRepository.getRandomPlaces(numPlaces)
  }
}

module.exports = GetRandomPlaces

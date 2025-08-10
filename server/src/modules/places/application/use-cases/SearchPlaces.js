class SearchPlaces {
  constructor(placeRepository) {
    this.placeRepository = placeRepository
  }

  async execute(query) {
    if (!query) {
      const error = new Error('El parámetro de consulta es requerido')
      error.name = 'ValidationError'
      throw error
    }

    const searchCriteria = {
      $and: [
        { status: 'active' },
        {
          $or: [
            { name: new RegExp(query, 'i') },
            { description: new RegExp(query, 'i') },
            { type: new RegExp(query, 'i') },
            { address: new RegExp(query, 'i') },
            { tags: new RegExp(query, 'i') }
          ]
        }
      ]
    }

    return await this.placeRepository.search(searchCriteria)
  }
}

module.exports = SearchPlaces

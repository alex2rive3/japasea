class GetPlaces {
  constructor(placeRepository) {
    this.placeRepository = placeRepository
  }

  async execute(filters = {}) {
    const { type, status = 'active' } = filters
    
    const query = { status }
    if (type) {
      query.type = new RegExp(type, 'i')
    }

    return await this.placeRepository.findByFilters(query, {
      sort: { 'rating.average': -1, 'metadata.views': -1 },
      select: '-__v'
    })
  }
}

module.exports = GetPlaces

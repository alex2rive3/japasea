const Place = require('../../domain/entities/Place')

class PlaceRepository {
  async findByFilters(query, options = {}) {
    const { sort, limit, skip, select } = options
    let mongoQuery = Place.find(query)
    
    if (select) {
      mongoQuery = mongoQuery.select(select)
    } else {
      mongoQuery = mongoQuery.select('-__v')
    }
    
    if (sort) {
      mongoQuery = mongoQuery.sort(sort)
    }
    
    if (limit) {
      mongoQuery = mongoQuery.limit(limit)
    }
    
    if (skip) {
      mongoQuery = mongoQuery.skip(skip)
    }
    
    return await mongoQuery.lean()
  }

  async search(criteria) {
    return await Place.find(criteria)
      .select('-__v')
      .lean()
  }

  async getRandomPlaces(count) {
    return await Place.aggregate([
      { $match: { status: 'active' } },
      { $sample: { size: count } },
      { $project: { __v: 0 } }
    ])
  }

  async findById(placeId) {
    return await Place.findById(placeId)
      .select('-__v')
      .lean()
  }

  async findExisting(key, name, address) {
    return await Place.findOne({
      $or: [
        { key: key },
        { $and: [{ name: name }, { address: address }] }
      ]
    }).lean()
  }

  async findActive() {
    return await Place.find({ status: 'active' })
      .lean()
  }

  async create(placeData) {
    const place = new Place(placeData)
    return await place.save()
  }

  async count() {
    return await Place.countDocuments()
  }

  async countByStatus(status) {
    return await Place.countDocuments({ status })
  }

  async existsByName(name) {
    const count = await Place.countDocuments({ 
      name: new RegExp(name, 'i') 
    })
    return count > 0
  }

  async updateById(placeId, updateData) {
    return await Place.findByIdAndUpdate(
      placeId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-__v')
  }

  async deleteById(placeId) {
    return await Place.findByIdAndDelete(placeId)
  }

  async findWithPagination(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination
    const skip = (page - 1) * limit
    
    const query = { ...filters }
    
    const places = await this.findByFilters(query, {
      skip,
      limit,
      sort: { createdAt: -1 }
    })
    
    const total = await Place.countDocuments(query)
    
    return {
      places,
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  }
}

module.exports = PlaceRepository

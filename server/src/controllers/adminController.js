const Place = require('../models/placeModel')

class AdminController {
  static async createPlace(req, res) {
    try {
      const {
        key,
        name,
        description,
        type,
        address,
        location,
        lat,
        lng,
        contact,
        amenities,
        images,
        businessHours,
        pricing,
        features,
        tags,
        status = 'active'
      } = req.body

      if (!key || !name || !description || !type || !address) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos: key, name, description, type, address'
        })
      }

      const coordinates = location?.coordinates || (typeof lat === 'number' && typeof lng === 'number' ? [lng, lat] : null)
      if (!coordinates) {
        return res.status(400).json({
          success: false,
          message: 'Ubicación requerida: provee location.coordinates [lng,lat] o lat y lng'
        })
      }

      const newPlace = new Place({
        key,
        name,
        description,
        type,
        address,
        location: {
          type: 'Point',
          coordinates
        },
        contact,
        amenities,
        images,
        businessHours,
        pricing,
        features,
        tags,
        status
      })

      const saved = await newPlace.save()
      return res.status(201).json({ success: true, data: saved })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ success: false, message: 'Key duplicado' })
      }
      console.error('Error creando lugar:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async updatePlace(req, res) {
    try {
      const { id } = req.params
      const update = { ...req.body }
      delete update._id
      delete update.id

      if (typeof update.lat === 'number' && typeof update.lng === 'number') {
        update.location = {
          type: 'Point',
          coordinates: [update.lng, update.lat]
        }
        delete update.lat
        delete update.lng
      }

      const updated = await Place.findByIdAndUpdate(id, update, { new: true, runValidators: true })
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Lugar no encontrado' })
      }
      return res.status(200).json({ success: true, data: updated })
    } catch (error) {
      console.error('Error actualizando lugar:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async deletePlace(req, res) {
    try {
      const { id } = req.params
      const updated = await Place.findByIdAndUpdate(id, { status: 'inactive' }, { new: true })
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Lugar no encontrado' })
      }
      return res.status(200).json({ success: true, message: 'Lugar desactivado', data: updated })
    } catch (error) {
      console.error('Error desactivando lugar:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async setStatus(req, res) {
    try {
      const { id } = req.params
      const { status } = req.body
      const valid = ['active', 'inactive', 'pending', 'seasonal']
      if (!valid.includes(status)) {
        return res.status(400).json({ success: false, message: 'Estado inválido' })
      }
      const updated = await Place.findByIdAndUpdate(id, { status }, { new: true })
      if (!updated) return res.status(404).json({ success: false, message: 'Lugar no encontrado' })
      return res.status(200).json({ success: true, data: updated })
    } catch (error) {
      console.error('Error cambiando estado:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async verifyPlace(req, res) {
    try {
      const { id } = req.params
      const updated = await Place.findByIdAndUpdate(
        id,
        { 'metadata.verified': true, 'metadata.verifiedAt': new Date() },
        { new: true }
      )
      if (!updated) return res.status(404).json({ success: false, message: 'Lugar no encontrado' })
      return res.status(200).json({ success: true, data: updated })
    } catch (error) {
      console.error('Error verificando lugar:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async featurePlace(req, res) {
    try {
      const { id } = req.params
      const { featured = true, featuredUntil } = req.body
      const update = {
        'metadata.featured': !!featured,
        'metadata.featuredUntil': featured ? (featuredUntil ? new Date(featuredUntil) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) : null,
      }
      const updated = await Place.findByIdAndUpdate(id, update, { new: true })
      if (!updated) return res.status(404).json({ success: false, message: 'Lugar no encontrado' })
      return res.status(200).json({ success: true, data: updated })
    } catch (error) {
      console.error('Error destacando lugar:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async getPlace(req, res) {
    try {
      const { id } = req.params
      const place = await Place.findById(id)
      if (!place) return res.status(404).json({ success: false, message: 'Lugar no encontrado' })
      return res.status(200).json({ success: true, data: place })
    } catch (error) {
      console.error('Error obteniendo lugar:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async listPlaces(req, res) {
    try {
      const { page = 1, limit = 20, status, type, q, verified, featured } = req.query
      const filter = {}
      if (status) filter.status = status
      if (type) filter.type = new RegExp(type, 'i')
      if (verified === 'true') filter['metadata.verified'] = true
      if (featured === 'true') filter['metadata.featured'] = true
      if (q) {
        filter.$or = [
          { name: new RegExp(q, 'i') },
          { description: new RegExp(q, 'i') },
          { address: new RegExp(q, 'i') },
          { tags: new RegExp(q, 'i') }
        ]
      }

      const skip = (parseInt(page) - 1) * parseInt(limit)
      const [data, total] = await Promise.all([
        Place.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
        Place.countDocuments(filter)
      ])

      return res.status(200).json({
        success: true,
        data,
        metadata: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      })
    } catch (error) {
      console.error('Error listando lugares:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }
}

module.exports = AdminController



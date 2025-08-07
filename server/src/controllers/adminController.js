const Place = require('../models/placeModel')
const User = require('../models/userModel')
const Review = require('../models/reviewModel')
const Audit = require('../models/auditModel')
const Settings = require('../models/settingsModel')

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

  // ====== GESTIÓN DE USUARIOS ======
  
  static async listUsers(req, res) {
    try {
      const { page = 1, limit = 10, search, role, status } = req.query
      const filter = {}
      
      if (search && search.trim()) {
        filter.$or = [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ]
      }
      if (role && role.trim()) filter.role = role
      if (status && status.trim()) filter.status = status

      const skip = (parseInt(page) - 1) * parseInt(limit)
      const [users, total] = await Promise.all([
        User.find(filter)
          .select('-password -__v')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        User.countDocuments(filter)
      ])

      return res.status(200).json({
        success: true,
        data: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status || 'active',
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      })
    } catch (error) {
      console.error('Error listando usuarios:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params
      const user = await User.findById(id).select('-password -__v').lean()
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status || 'active',
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      })
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async updateUserRole(req, res) {
    try {
      const { id } = req.params
      const { role } = req.body

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Rol inválido' })
      }

      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      ).select('-password -__v')

      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
      }

      return res.status(200).json({
        success: true,
        data: user,
        message: 'Rol actualizado exitosamente'
      })
    } catch (error) {
      console.error('Error actualizando rol:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async suspendUser(req, res) {
    try {
      const { id } = req.params
      const { reason } = req.body

      const user = await User.findByIdAndUpdate(
        id,
        { 
          status: 'suspended',
          suspendedAt: new Date(),
          suspendReason: reason
        },
        { new: true }
      ).select('-password -__v')

      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
      }

      return res.status(200).json({
        success: true,
        data: user,
        message: 'Usuario suspendido exitosamente'
      })
    } catch (error) {
      console.error('Error suspendiendo usuario:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async activateUser(req, res) {
    try {
      const { id } = req.params

      const user = await User.findByIdAndUpdate(
        id,
        { 
          status: 'active',
          suspendedAt: null,
          suspendReason: null
        },
        { new: true }
      ).select('-password -__v')

      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
      }

      return res.status(200).json({
        success: true,
        data: user,
        message: 'Usuario activado exitosamente'
      })
    } catch (error) {
      console.error('Error activando usuario:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params

      const user = await User.findByIdAndUpdate(
        id,
        { 
          status: 'deleted',
          deletedAt: new Date()
        },
        { new: true }
      ).select('-password -__v')

      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
      }

      return res.status(200).json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      })
    } catch (error) {
      console.error('Error eliminando usuario:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  // ====== ESTADÍSTICAS ======
  
  static async getStats(req, res) {
    try {
      const [
        totalUsers,
        activeUsers,
        totalPlaces,
        activePlaces,
        pendingPlaces,
        verifiedPlaces,
        featuredPlaces
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ status: 'active' }),
        Place.countDocuments(),
        Place.countDocuments({ status: 'active' }),
        Place.countDocuments({ status: 'pending' }),
        Place.countDocuments({ 'metadata.verified': true }),
        Place.countDocuments({ 'metadata.featured': true })
      ])

      // Estadísticas por tipo de lugar
      const placesByType = await Place.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])

      // Actividad reciente (últimos 7 días)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const recentActivity = {
        newUsers: await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        newPlaces: await Place.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
      }

      return res.status(200).json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            active: activeUsers,
            inactive: totalUsers - activeUsers
          },
          places: {
            total: totalPlaces,
            active: activePlaces,
            pending: pendingPlaces,
            verified: verifiedPlaces,
            featured: featuredPlaces,
            byType: placesByType.map(item => ({
              type: item._id,
              count: item.count
            }))
          },
          activity: {
            last7Days: recentActivity
          }
        }
      })
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async getPlaceStats(req, res) {
    try {
      const { startDate, endDate } = req.query
      
      let dateFilter = {}
      if (startDate || endDate) {
        dateFilter.createdAt = {}
        if (startDate) dateFilter.createdAt.$gte = new Date(startDate)
        if (endDate) dateFilter.createdAt.$lte = new Date(endDate)
      }

      const stats = await Place.aggregate([
        { $match: dateFilter },
        {
          $facet: {
            byType: [
              { $group: { _id: '$type', count: { $sum: 1 } } },
              { $sort: { count: -1 } }
            ],
            byStatus: [
              { $group: { _id: '$status', count: { $sum: 1 } } }
            ],
            featured: [
              { $match: { 'metadata.featured': true } },
              { $count: 'total' }
            ],
            verified: [
              { $match: { 'metadata.verified': true } },
              { $count: 'total' }
            ]
          }
        }
      ])

      return res.status(200).json({
        success: true,
        data: {
          byType: stats[0].byType,
          byStatus: stats[0].byStatus,
          featured: stats[0].featured[0]?.total || 0,
          verified: stats[0].verified[0]?.total || 0
        }
      })
    } catch (error) {
      console.error('Error obteniendo estadísticas de lugares:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  // ====== CONFIGURACIÓN DEL SISTEMA ======
  
  static async getSystemSettings(req, res) {
    try {
      const settings = await Settings.getSettings()
      
      return res.status(200).json({
        success: true,
        data: settings
      })
    } catch (error) {
      console.error('Error obteniendo configuración:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async updateSystemSettings(req, res) {
    try {
      const updates = req.body
      
      // Actualizar la configuración en la base de datos
      const settings = await Settings.updateSettings(updates)
      
      // Registrar en auditoría
      await Audit.log({
        userId: req.user.id,
        action: 'update',
        resource: 'settings',
        description: 'Configuración del sistema actualizada',
        previousData: updates,
        metadata: {
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      })
      
      return res.status(200).json({
        success: true,
        data: settings,
        message: 'Configuración actualizada exitosamente'
      })
    } catch (error) {
      console.error('Error actualizando configuración:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  // ====== NOTIFICACIONES ======
  
  static async sendBulkNotification(req, res) {
    try {
      const { title, message, targetUsers, type } = req.body

      if (!title || !message) {
        return res.status(400).json({ 
          success: false, 
          message: 'Título y mensaje son requeridos' 
        })
      }

      // Simulación de envío
      // En producción, aquí se integraría con un servicio de notificaciones
      let recipientCount = 0
      
      if (targetUsers === 'all') {
        recipientCount = await User.countDocuments()
      } else if (targetUsers === 'active') {
        recipientCount = await User.countDocuments({ status: 'active' })
      } else if (Array.isArray(targetUsers)) {
        recipientCount = targetUsers.length
      }

      return res.status(200).json({
        success: true,
        data: {
          sent: recipientCount,
          title,
          message,
          type,
          sentAt: new Date()
        },
        message: `Notificación enviada a ${recipientCount} usuarios`
      })
    } catch (error) {
      console.error('Error enviando notificación masiva:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  // ====== GESTIÓN DE RESEÑAS ======
  
  static async listReviews(req, res) {
    try {
      const { page = 1, limit = 20, status, placeId, userId } = req.query
      const filter = {}
      
      if (status && status.trim()) filter.status = status
      if (placeId && placeId.trim()) filter.placeId = placeId
      if (userId && userId.trim()) filter.userId = userId

      const skip = (parseInt(page) - 1) * parseInt(limit)
      
      // Primero intentamos obtener las reseñas sin populate para ver si hay datos
      let reviews, total;
      try {
        [reviews, total] = await Promise.all([
          Review.find(filter)
            .populate('userId', 'name email')
            .populate('placeId', 'name type')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
          Review.countDocuments(filter)
        ])
      } catch (populateError) {
        console.error('Error al popular referencias, obteniendo sin populate:', populateError)
        // Si falla el populate, intentamos sin él
        [reviews, total] = await Promise.all([
          Review.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
          Review.countDocuments(filter)
        ])
      }

      // Mapeamos los datos manejando ambos esquemas (nuevo y viejo)
      const mappedReviews = reviews.map(review => {
        // Si es el esquema viejo (sin userId/placeId)
        if (!review.userId && !review.placeId) {
          return {
            id: review._id,
            userId: 'legacy',
            userName: 'Usuario Legacy',
            userEmail: 'N/A',
            placeId: 'legacy',
            placeName: 'Lugar Legacy',
            rating: review.rating || 0,
            comment: review.comment || review.title || 'Sin comentario',
            status: review.status || 'approved',
            rejectionReason: review.rejectionReason,
            createdAt: review.createdAt
          }
        }
        
        // Si es el esquema nuevo
        return {
          id: review._id,
          userId: review.userId?._id || review.userId || 'unknown',
          userName: review.userId?.name || 'Usuario eliminado',
          userEmail: review.userId?.email || 'N/A',
          placeId: review.placeId?._id || review.placeId || 'unknown',
          placeName: review.placeId?.name || 'Lugar eliminado',
          rating: review.rating,
          comment: review.comment,
          status: review.status,
          rejectionReason: review.rejectionReason,
          createdAt: review.createdAt
        }
      })

      return res.status(200).json({
        success: true,
        data: mappedReviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      })
    } catch (error) {
      console.error('Error listando reseñas:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async approveReview(req, res) {
    try {
      const { id } = req.params
      const adminId = req.user.id

      const review = await Review.findById(id)
      if (!review) {
        return res.status(404).json({ success: false, message: 'Reseña no encontrada' })
      }

      await review.approve(adminId)

      // Registrar en auditoría
      await Audit.log({
        userId: adminId,
        action: 'approve',
        resource: 'review',
        resourceId: review._id,
        description: `Reseña aprobada para lugar ${review.placeId}`,
        metadata: {
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      })

      return res.status(200).json({
        success: true,
        message: 'Reseña aprobada exitosamente'
      })
    } catch (error) {
      console.error('Error aprobando reseña:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async rejectReview(req, res) {
    try {
      const { id } = req.params
      const { reason } = req.body
      const adminId = req.user.id

      if (!reason) {
        return res.status(400).json({ success: false, message: 'Razón de rechazo requerida' })
      }

      const review = await Review.findById(id)
      if (!review) {
        return res.status(404).json({ success: false, message: 'Reseña no encontrada' })
      }

      await review.reject(adminId, reason)

      // Registrar en auditoría
      await Audit.log({
        userId: adminId,
        action: 'reject',
        resource: 'review',
        resourceId: review._id,
        description: `Reseña rechazada: ${reason}`,
        metadata: {
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      })

      return res.status(200).json({
        success: true,
        message: 'Reseña rechazada exitosamente'
      })
    } catch (error) {
      console.error('Error rechazando reseña:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async deleteReview(req, res) {
    try {
      const { id } = req.params
      const adminId = req.user.id

      const review = await Review.findByIdAndDelete(id)
      if (!review) {
        return res.status(404).json({ success: false, message: 'Reseña no encontrada' })
      }

      // Registrar en auditoría
      await Audit.log({
        userId: adminId,
        action: 'delete',
        resource: 'review',
        resourceId: review._id,
        description: 'Reseña eliminada permanentemente',
        previousData: review.toObject(),
        metadata: {
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      })

      return res.status(200).json({
        success: true,
        message: 'Reseña eliminada exitosamente'
      })
    } catch (error) {
      console.error('Error eliminando reseña:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  // ====== AUDITORÍA ======
  
  static async getAuditLogs(req, res) {
    try {
      const filters = {
        userId: req.query.userId,
        action: req.query.action,
        resource: req.query.resource,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 50
      }

      const result = await Audit.getLogs(filters, options)

      return res.status(200).json({
        success: true,
        data: result.data.map(log => ({
          id: log._id,
          userId: log.userId,
          userName: log.user?.name,
          userEmail: log.user?.email,
          action: log.action,
          resource: log.resource,
          resourceId: log.resourceId,
          description: log.description,
          ipAddress: log.metadata?.ipAddress,
          timestamp: log.createdAt
        })),
        pagination: result.pagination
      })
    } catch (error) {
      console.error('Error obteniendo logs de auditoría:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  static async exportAuditLogs(req, res) {
    try {
      const { format = 'csv', ...filters } = req.body

      const result = await Audit.getLogs(filters, { limit: 10000 })
      
      if (format === 'csv') {
        const csv = [
          'ID,Usuario,Email,Acción,Recurso,Descripción,IP,Fecha',
          ...result.data.map(log => 
            `${log._id},${log.user?.name || ''},${log.user?.email || ''},${log.action},${log.resource},${log.description || ''},${log.metadata?.ipAddress || ''},${log.createdAt}`
          )
        ].join('\n')

        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv')
        return res.send(csv)
      } else {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.json')
        return res.json(result.data)
      }
    } catch (error) {
      console.error('Error exportando logs:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }
}

module.exports = AdminController



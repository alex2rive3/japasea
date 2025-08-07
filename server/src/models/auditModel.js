const mongoose = require('mongoose')

const auditSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create', 'update', 'delete', 'read',
      'login', 'logout', 'password_change',
      'role_change', 'status_change',
      'approve', 'reject', 'verify', 'feature',
      'export', 'import', 'error'
    ]
  },
  resource: {
    type: String,
    required: true,
    enum: [
      'user', 'place', 'review', 'favorite',
      'chat', 'settings', 'notification',
      'audit', 'system'
    ]
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  description: {
    type: String,
    required: true
  },
  previousData: {
    type: mongoose.Schema.Types.Mixed
  },
  newData: {
    type: mongoose.Schema.Types.Mixed
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    sessionId: String,
    error: {
      message: String,
      stack: String,
      statusCode: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
})

// Índices para mejorar las búsquedas
auditSchema.index({ userId: 1, createdAt: -1 })
auditSchema.index({ resource: 1, action: 1, createdAt: -1 })
auditSchema.index({ resourceId: 1, createdAt: -1 })

// Método estático para crear log
auditSchema.statics.log = async function(data) {
  try {
    const audit = new this(data)
    await audit.save()
    return audit
  } catch (error) {
    console.error('Error guardando log de auditoría:', error)
    // No lanzar error para no interrumpir el flujo principal
  }
}

// Método estático para obtener logs con filtros
auditSchema.statics.getLogs = async function(filters = {}) {
  const {
    userId,
    action,
    resource,
    startDate,
    endDate,
    page = 1,
    limit = 50
  } = filters

  const query = {}
  
  if (userId) query.userId = userId
  if (action) query.action = action
  if (resource) query.resource = resource
  
  if (startDate || endDate) {
    query.createdAt = {}
    if (startDate) query.createdAt.$gte = new Date(startDate)
    if (endDate) query.createdAt.$lte = new Date(endDate)
  }

  const skip = (parseInt(page) - 1) * parseInt(limit)

  const [logs, total] = await Promise.all([
    this.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    this.countDocuments(query)
  ])

  return {
    logs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit))
    }
  }
}

const Audit = mongoose.model('Audit', auditSchema)

module.exports = Audit
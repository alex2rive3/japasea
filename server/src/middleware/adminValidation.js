const { body, param, query, validationResult } = require('express-validator')

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    })
  }
  next()
}

// ====== VALIDACIONES DE USUARIOS ======

const validateUserFilters = [
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe estar entre 1 y 100'),
  query('search').optional().isString().trim().escape(),
  query('role').optional().isIn(['user', 'admin']).withMessage('Rol inválido'),
  query('status').optional().isIn(['active', 'suspended', 'deleted']).withMessage('Estado inválido')
]

const validateUserId = [
  param('id').isMongoId().withMessage('ID de usuario inválido')
]

const validateUserRole = [
  param('id').isMongoId().withMessage('ID de usuario inválido'),
  body('role').isIn(['user', 'admin']).withMessage('Rol debe ser user o admin')
]

const validateUserSuspend = [
  param('id').isMongoId().withMessage('ID de usuario inválido'),
  body('reason').optional().isString().trim().escape()
]

// ====== VALIDACIONES DE LUGARES ======

const validateCreatePlace = [
  body('key').notEmpty().withMessage('Key es requerido').isString().trim(),
  body('name').notEmpty().withMessage('Nombre es requerido').isString().trim(),
  body('description').notEmpty().withMessage('Descripción es requerida').isString().trim(),
  body('type').notEmpty().withMessage('Tipo es requerido').isString().trim(),
  body('address').notEmpty().withMessage('Dirección es requerida').isString().trim(),
  body('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida'),
  body('lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida'),
  body('status').optional().isIn(['active', 'inactive', 'pending', 'seasonal']).withMessage('Estado inválido')
]

const validateUpdatePlace = [
  param('id').isMongoId().withMessage('ID de lugar inválido'),
  body('name').optional().isString().trim(),
  body('description').optional().isString().trim(),
  body('type').optional().isString().trim(),
  body('address').optional().isString().trim(),
  body('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida'),
  body('lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida')
]

const validatePlaceStatus = [
  param('id').isMongoId().withMessage('ID de lugar inválido'),
  body('status').isIn(['active', 'inactive', 'pending', 'seasonal']).withMessage('Estado inválido')
]

const validatePlaceFeature = [
  param('id').isMongoId().withMessage('ID de lugar inválido'),
  body('featured').optional().isBoolean().withMessage('Featured debe ser booleano'),
  body('featuredUntil').optional().isISO8601().withMessage('Fecha inválida')
]

// ====== VALIDACIONES DE RESEÑAS ======

const validateReviewFilters = [
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe estar entre 1 y 100'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Estado inválido'),
  query('placeId').optional().isMongoId().withMessage('ID de lugar inválido'),
  query('userId').optional().isMongoId().withMessage('ID de usuario inválido')
]

const validateReviewId = [
  param('id').isMongoId().withMessage('ID de reseña inválido')
]

const validateRejectReview = [
  param('id').isMongoId().withMessage('ID de reseña inválido'),
  body('reason').notEmpty().withMessage('Razón de rechazo es requerida').isString().trim()
]

// ====== VALIDACIONES DE ESTADÍSTICAS ======

const validateDateRange = [
  query('startDate').optional().isISO8601().withMessage('Fecha de inicio inválida'),
  query('endDate').optional().isISO8601().withMessage('Fecha de fin inválida')
]

// ====== VALIDACIONES DE AUDITORÍA ======

const validateAuditFilters = [
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Límite debe estar entre 1 y 1000'),
  query('userId').optional().isMongoId().withMessage('ID de usuario inválido'),
  query('action').optional().isString().trim(),
  query('resource').optional().isString().trim(),
  query('startDate').optional().isISO8601().withMessage('Fecha de inicio inválida'),
  query('endDate').optional().isISO8601().withMessage('Fecha de fin inválida')
]

const validateAuditExport = [
  body('format').optional().isIn(['csv', 'json']).withMessage('Formato debe ser csv o json'),
  body('userId').optional().isMongoId().withMessage('ID de usuario inválido'),
  body('startDate').optional().isISO8601().withMessage('Fecha de inicio inválida'),
  body('endDate').optional().isISO8601().withMessage('Fecha de fin inválida')
]

// ====== VALIDACIONES DE NOTIFICACIONES ======

const validateBulkNotification = [
  body('title').notEmpty().withMessage('Título es requerido').isString().trim(),
  body('message').notEmpty().withMessage('Mensaje es requerido').isString().trim(),
  body('targetUsers').optional().custom((value) => {
    if (typeof value === 'string' && ['all', 'active'].includes(value)) return true
    if (Array.isArray(value) && value.every(id => /^[0-9a-fA-F]{24}$/.test(id))) return true
    throw new Error('targetUsers debe ser "all", "active" o array de IDs')
  }),
  body('type').isIn(['info', 'warning', 'promotion']).withMessage('Tipo inválido')
]

// ====== VALIDACIONES DE CONFIGURACIÓN ======

const validateSystemSettings = [
  body('general').optional().isObject().withMessage('General debe ser un objeto'),
  body('features').optional().isObject().withMessage('Features debe ser un objeto'),
  body('notifications').optional().isObject().withMessage('Notifications debe ser un objeto'),
  body('security').optional().isObject().withMessage('Security debe ser un objeto'),
  body('payments').optional().isObject().withMessage('Payments debe ser un objeto')
]

module.exports = {
  handleValidationErrors,
  // Usuarios
  validateUserFilters,
  validateUserId,
  validateUserRole,
  validateUserSuspend,
  // Lugares
  validateCreatePlace,
  validateUpdatePlace,
  validatePlaceStatus,
  validatePlaceFeature,
  // Reseñas
  validateReviewFilters,
  validateReviewId,
  validateRejectReview,
  // Estadísticas
  validateDateRange,
  // Auditoría
  validateAuditFilters,
  validateAuditExport,
  // Notificaciones
  validateBulkNotification,
  // Configuración
  validateSystemSettings
}

const express = require('express')
const router = express.Router()
const AdminController = require('../../controllers/adminController')
const { authenticateToken, requireRole } = require('../../middleware/authMiddleware')
const {
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
} = require('../../middleware/adminValidation')

// Todas las rutas admin requieren autenticación y rol admin
router.use(authenticateToken, requireRole('admin'))

/**
 * @openapi
 * /admin/places:
 *   get:
 *     tags: [Admin]
 *     summary: Listar lugares (admin)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: verified
 *         schema: { type: boolean }
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Lista paginada
 */
router.get('/places', AdminController.listPlaces)

/**
 * @openapi
 * /admin/places:
 *   post:
 *     tags: [Admin]
 *     summary: Crear nuevo lugar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, name, description, type, address]
 *             properties:
 *               key: { type: string }
 *               name: { type: string }
 *               description: { type: string }
 *               type: { type: string }
 *               address: { type: string }
 *               lat: { type: number }
 *               lng: { type: number }
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items: { type: number }
 *     responses:
 *       201:
 *         description: Creado
 */
router.post('/places', validateCreatePlace, handleValidationErrors, AdminController.createPlace)

/**
 * @openapi
 * /admin/places/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Obtener detalle de lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Ok
 */
router.get('/places/:id', AdminController.getPlace)

/**
 * @openapi
 * /admin/places/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Actualizar lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.put('/places/:id', validateUpdatePlace, handleValidationErrors, AdminController.updatePlace)

/**
 * @openapi
 * /admin/places/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Desactivar lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Desactivado
 */
router.delete('/places/:id', AdminController.deletePlace)

/**
 * @openapi
 * /admin/places/{id}/status:
 *   patch:
 *     tags: [Admin]
 *     summary: Cambiar estado del lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [active, inactive, pending, seasonal] }
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch('/places/:id/status', validatePlaceStatus, handleValidationErrors, AdminController.setStatus)

/**
 * @openapi
 * /admin/places/{id}/verify:
 *   post:
 *     tags: [Admin]
 *     summary: Verificar lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Verificado
 */
router.post('/places/:id/verify', AdminController.verifyPlace)

/**
 * @openapi
 * /admin/places/{id}/feature:
 *   post:
 *     tags: [Admin]
 *     summary: Destacar lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               featured: { type: boolean }
 *               featuredUntil: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.post('/places/:id/feature', validatePlaceFeature, handleValidationErrors, AdminController.featurePlace)

// ====== RUTAS DE USUARIOS ======

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin - Users]
 *     summary: Listar usuarios
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [user, admin] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, suspended, deleted] }
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/users', validateUserFilters, handleValidationErrors, AdminController.listUsers)

/**
 * @openapi
 * /admin/users/{id}:
 *   get:
 *     tags: [Admin - Users]
 *     summary: Obtener detalle de usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/users/:id', validateUserId, handleValidationErrors, AdminController.getUserById)

/**
 * @openapi
 * /admin/users/{id}/role:
 *   patch:
 *     tags: [Admin - Users]
 *     summary: Cambiar rol de usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       200:
 *         description: Rol actualizado
 */
router.patch('/users/:id/role', validateUserRole, handleValidationErrors, AdminController.updateUserRole)

/**
 * @openapi
 * /admin/users/{id}/suspend:
 *   patch:
 *     tags: [Admin - Users]
 *     summary: Suspender usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: Usuario suspendido
 */
router.patch('/users/:id/suspend', validateUserSuspend, handleValidationErrors, AdminController.suspendUser)

/**
 * @openapi
 * /admin/users/{id}/activate:
 *   patch:
 *     tags: [Admin - Users]
 *     summary: Activar usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Usuario activado
 */
router.patch('/users/:id/activate', validateUserId, handleValidationErrors, AdminController.activateUser)

/**
 * @openapi
 * /admin/users/{id}:
 *   delete:
 *     tags: [Admin - Users]
 *     summary: Eliminar usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete('/users/:id', validateUserId, handleValidationErrors, AdminController.deleteUser)

// ====== RUTAS DE ESTADÍSTICAS ======

/**
 * @openapi
 * /admin/stats:
 *   get:
 *     tags: [Admin - Stats]
 *     summary: Obtener estadísticas generales
 *     responses:
 *       200:
 *         description: Estadísticas del sistema
 */
router.get('/stats', AdminController.getStats)

/**
 * @openapi
 * /admin/stats/places:
 *   get:
 *     tags: [Admin - Stats]
 *     summary: Estadísticas de lugares
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Estadísticas detalladas
 */
router.get('/stats/places', validateDateRange, handleValidationErrors, AdminController.getPlaceStats)

// ====== RUTAS DE CONFIGURACIÓN ======

/**
 * @openapi
 * /admin/settings:
 *   get:
 *     tags: [Admin - Settings]
 *     summary: Obtener configuración del sistema
 *     responses:
 *       200:
 *         description: Configuración actual
 */
router.get('/settings', AdminController.getSystemSettings)

/**
 * @openapi
 * /admin/settings:
 *   put:
 *     tags: [Admin - Settings]
 *     summary: Actualizar configuración del sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Configuración actualizada
 */
router.put('/settings', validateSystemSettings, handleValidationErrors, AdminController.updateSystemSettings)

// ====== RUTAS DE NOTIFICACIONES ======

/**
 * @openapi
 * /admin/notifications/bulk:
 *   post:
 *     tags: [Admin - Notifications]
 *     summary: Enviar notificación masiva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, message, type]
 *             properties:
 *               title: { type: string }
 *               message: { type: string }
 *               targetUsers: { type: string, enum: [all, active] }
 *               type: { type: string, enum: [info, warning, promotion] }
 *     responses:
 *       200:
 *         description: Notificación enviada
 */
router.post('/notifications/bulk', validateBulkNotification, handleValidationErrors, AdminController.sendBulkNotification)

// ====== RUTAS DE RESEÑAS ======

/**
 * @openapi
 * /admin/reviews:
 *   get:
 *     tags: [Admin - Reviews]
 *     summary: Listar reseñas
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, approved, rejected] }
 *       - in: query
 *         name: placeId
 *         schema: { type: string }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de reseñas
 */
router.get('/reviews', validateReviewFilters, handleValidationErrors, AdminController.listReviews)

/**
 * @openapi
 * /admin/reviews/{id}/approve:
 *   patch:
 *     tags: [Admin - Reviews]
 *     summary: Aprobar reseña
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Reseña aprobada
 */
router.patch('/reviews/:id/approve', validateReviewId, handleValidationErrors, AdminController.approveReview)

/**
 * @openapi
 * /admin/reviews/{id}/reject:
 *   patch:
 *     tags: [Admin - Reviews]
 *     summary: Rechazar reseña
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: Reseña rechazada
 */
router.patch('/reviews/:id/reject', validateRejectReview, handleValidationErrors, AdminController.rejectReview)

/**
 * @openapi
 * /admin/reviews/{id}:
 *   delete:
 *     tags: [Admin - Reviews]
 *     summary: Eliminar reseña
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Reseña eliminada
 */
router.delete('/reviews/:id', validateReviewId, handleValidationErrors, AdminController.deleteReview)

// ====== RUTAS DE AUDITORÍA ======

/**
 * @openapi
 * /admin/audit/logs:
 *   get:
 *     tags: [Admin - Audit]
 *     summary: Obtener logs de auditoría
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *       - in: query
 *         name: action
 *         schema: { type: string }
 *       - in: query
 *         name: resource
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Logs de auditoría
 */
router.get('/audit/logs', validateAuditFilters, handleValidationErrors, AdminController.getAuditLogs)

/**
 * @openapi
 * /admin/audit/export:
 *   post:
 *     tags: [Admin - Audit]
 *     summary: Exportar logs de auditoría
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               format: { type: string, enum: [csv, json], default: csv }
 *               userId: { type: string }
 *               action: { type: string }
 *               resource: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Archivo exportado
 */
router.post('/audit/export', validateAuditExport, handleValidationErrors, AdminController.exportAuditLogs)

module.exports = router



const Audit = require('../models/auditModel')

// Configuración de acciones a auditar
const AUDIT_CONFIG = {
  // Usuarios
  'POST /api/v1/auth/register': { action: 'create', resource: 'user', description: 'Usuario registrado' },
  'POST /api/v1/auth/login': { action: 'login', resource: 'user', description: 'Inicio de sesión' },
  'POST /api/v1/auth/logout': { action: 'logout', resource: 'user', description: 'Cierre de sesión' },
  'PUT /api/v1/auth/profile': { action: 'update', resource: 'user', description: 'Perfil actualizado' },
  'POST /api/v1/auth/change-password': { action: 'password_change', resource: 'user', description: 'Contraseña cambiada' },
  'DELETE /api/v1/auth/account': { action: 'delete', resource: 'user', description: 'Cuenta eliminada' },
  
  // Admin - Usuarios
  'PATCH /api/v1/admin/users/:id/role': { action: 'role_change', resource: 'user', description: 'Rol de usuario cambiado' },
  'PATCH /api/v1/admin/users/:id/suspend': { action: 'status_change', resource: 'user', description: 'Usuario suspendido' },
  'PATCH /api/v1/admin/users/:id/activate': { action: 'status_change', resource: 'user', description: 'Usuario activado' },
  'DELETE /api/v1/admin/users/:id': { action: 'delete', resource: 'user', description: 'Usuario eliminado por admin' },
  
  // Admin - Lugares
  'POST /api/v1/admin/places': { action: 'create', resource: 'place', description: 'Lugar creado' },
  'PUT /api/v1/admin/places/:id': { action: 'update', resource: 'place', description: 'Lugar actualizado' },
  'DELETE /api/v1/admin/places/:id': { action: 'delete', resource: 'place', description: 'Lugar desactivado' },
  'PATCH /api/v1/admin/places/:id/status': { action: 'status_change', resource: 'place', description: 'Estado de lugar cambiado' },
  'POST /api/v1/admin/places/:id/verify': { action: 'verify', resource: 'place', description: 'Lugar verificado' },
  'POST /api/v1/admin/places/:id/feature': { action: 'feature', resource: 'place', description: 'Lugar destacado' },
  
  // Admin - Reseñas
  'PATCH /api/v1/admin/reviews/:id/approve': { action: 'approve', resource: 'review', description: 'Reseña aprobada' },
  'PATCH /api/v1/admin/reviews/:id/reject': { action: 'reject', resource: 'review', description: 'Reseña rechazada' },
  'DELETE /api/v1/admin/reviews/:id': { action: 'delete', resource: 'review', description: 'Reseña eliminada' },
  
  // Admin - Configuración
  'PUT /api/v1/admin/settings': { action: 'update', resource: 'settings', description: 'Configuración actualizada' },
  
  // Admin - Notificaciones
  'POST /api/v1/admin/notifications/bulk': { action: 'create', resource: 'notification', description: 'Notificación masiva enviada' },
  
  // Admin - Auditoría
  'POST /api/v1/admin/audit/export': { action: 'export', resource: 'audit', description: 'Logs de auditoría exportados' },
  
  // Favoritos
  'POST /api/v1/favorites/:placeId': { action: 'create', resource: 'favorite', description: 'Favorito agregado' },
  'DELETE /api/v1/favorites/:placeId': { action: 'delete', resource: 'favorite', description: 'Favorito eliminado' },
}

// Función para normalizar la ruta
function normalizeRoute(method, path) {
  // Reemplazar IDs de MongoDB con :id
  const normalizedPath = path.replace(/\/[0-9a-fA-F]{24}/g, '/:id')
  return `${method} ${normalizedPath}`
}

// Función para extraer IDs de la ruta
function extractResourceId(path) {
  const match = path.match(/\/([0-9a-fA-F]{24})/)
  return match ? match[1] : null
}

// Middleware de auditoría
const auditMiddleware = async (req, res, next) => {
  // Solo auditar si el usuario está autenticado
  if (!req.user) {
    return next()
  }

  // Guardar el método original de res.json para interceptar la respuesta
  const originalJson = res.json

  res.json = function(data) {
    // Solo auditar respuestas exitosas
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const route = normalizeRoute(req.method, req.originalUrl || req.url)
      const auditConfig = AUDIT_CONFIG[route]
      
      if (auditConfig) {
        // Extraer información adicional según el recurso
        const auditData = {
          userId: req.user.id,
          action: auditConfig.action,
          resource: auditConfig.resource,
          resourceId: extractResourceId(req.originalUrl || req.url) || req.params.id || req.params.placeId,
          description: auditConfig.description,
          metadata: {
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            sessionId: req.sessionID
          }
        }

        // Agregar información específica según la acción
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          auditData.newData = req.body
        }

        // Si es una eliminación, intentar guardar los datos anteriores
        if (req.method === 'DELETE' && data.data) {
          auditData.previousData = data.data
        }

        // Guardar en la base de datos de forma asíncrona
        Audit.log(auditData).catch(err => {
          console.error('Error guardando auditoría:', err)
        })
      }
    }

    // Llamar al método original
    return originalJson.call(this, data)
  }

  next()
}

// Middleware para auditar errores importantes
const auditErrorMiddleware = (err, req, res, next) => {
  // Solo auditar errores graves para usuarios autenticados
  if (req.user && err.statusCode >= 500) {
    Audit.log({
      userId: req.user.id,
      action: 'error',
      resource: 'system',
      description: `Error en ${req.method} ${req.originalUrl}: ${err.message}`,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        error: {
          message: err.message,
          stack: err.stack,
          statusCode: err.statusCode
        }
      }
    }).catch(auditErr => {
      console.error('Error guardando auditoría de error:', auditErr)
    })
  }

  next(err)
}

module.exports = {
  auditMiddleware,
  auditErrorMiddleware
}

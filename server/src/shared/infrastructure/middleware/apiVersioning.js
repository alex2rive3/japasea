/**
 * Middleware para manejar el versionado de la API
 * Soporta versionado por:
 * 1. URL path: /api/v1/resource
 * 2. Header: Accept-Version: v1
 * 3. Query param: ?version=v1
 */

const DEFAULT_VERSION = 'v1'
const SUPPORTED_VERSIONS = ['v1', 'v2']

// Middleware para extraer la versión de la solicitud
const extractVersion = (req, res, next) => {
  let version = DEFAULT_VERSION
  
  // 1. Verificar en la URL path
  const pathMatch = req.path.match(/^\/api\/(v\d+)/)
  if (pathMatch) {
    version = pathMatch[1]
  }
  
  // 2. Verificar en el header Accept-Version (tiene prioridad sobre URL)
  const headerVersion = req.headers['accept-version'] || req.headers['api-version']
  if (headerVersion) {
    version = headerVersion.startsWith('v') ? headerVersion : `v${headerVersion}`
  }
  
  // 3. Verificar en query params (máxima prioridad)
  if (req.query.version) {
    version = req.query.version.startsWith('v') ? req.query.version : `v${req.query.version}`
  }
  
  // Validar que la versión sea soportada
  if (!SUPPORTED_VERSIONS.includes(version)) {
    return res.status(400).json({
      error: 'Unsupported API version',
      message: `La versión '${version}' no está soportada. Versiones disponibles: ${SUPPORTED_VERSIONS.join(', ')}`,
      currentVersion: DEFAULT_VERSION
    })
  }
  
  // Adjuntar la versión a la solicitud
  req.apiVersion = version
  
  // Agregar header de respuesta con la versión
  res.setHeader('API-Version', version)
  
  next()
}

// Middleware para verificar versión mínima requerida
const requireVersion = (minVersion) => {
  return (req, res, next) => {
    const currentVersionNum = parseInt(req.apiVersion.slice(1))
    const minVersionNum = parseInt(minVersion.slice(1))
    
    if (currentVersionNum < minVersionNum) {
      return res.status(400).json({
        error: 'API version too old',
        message: `Esta funcionalidad requiere API versión ${minVersion} o superior. Versión actual: ${req.apiVersion}`,
        requiredVersion: minVersion,
        currentVersion: req.apiVersion
      })
    }
    
    next()
  }
}

// Middleware para deprecar endpoints
const deprecate = (message, removeInVersion) => {
  return (req, res, next) => {
    res.setHeader('Deprecation', 'true')
    res.setHeader('Sunset', removeInVersion)
    res.setHeader('Link', `</docs/migration>; rel="deprecation"`)
    
    // Log de uso de endpoint deprecado
    console.warn(`DEPRECATED API CALL: ${req.method} ${req.originalUrl} - ${message}`)
    
    // Agregar aviso en la respuesta
    const originalJson = res.json
    res.json = function(data) {
      const response = {
        ...data,
        _deprecation: {
          warning: message,
          removeInVersion: removeInVersion,
          documentationUrl: '/docs/migration'
        }
      }
      originalJson.call(this, response)
    }
    
    next()
  }
}

// Helper para crear rutas versionadas
const versionedRoute = (versions) => {
  return (req, res, next) => {
    const version = req.apiVersion
    
    if (versions[version]) {
      return versions[version](req, res, next)
    }
    
    // Si no hay handler específico para la versión, usar el más reciente disponible
    const availableVersions = Object.keys(versions).sort().reverse()
    for (const v of availableVersions) {
      if (v <= version) {
        return versions[v](req, res, next)
      }
    }
    
    // Si no hay versión compatible
    res.status(404).json({
      error: 'Endpoint not found',
      message: `Este endpoint no está disponible en la versión ${version} de la API`,
      availableVersions: Object.keys(versions)
    })
  }
}

// Información sobre las versiones de la API
const apiVersionInfo = (req, res) => {
  res.json({
    current: req.apiVersion,
    default: DEFAULT_VERSION,
    supported: SUPPORTED_VERSIONS,
    deprecated: [],
    changelog: {
      v2: {
        released: '2024-01-01',
        changes: [
          'Nuevo sistema de autenticación con refresh tokens',
          'Endpoints de favoritos mejorados',
          'Soporte para múltiples idiomas',
          'Mejoras en el sistema de búsqueda'
        ]
      },
      v1: {
        released: '2023-06-01',
        changes: [
          'Versión inicial de la API',
          'Endpoints básicos de lugares',
          'Sistema de chat con IA',
          'Autenticación JWT'
        ]
      }
    }
  })
}

module.exports = {
  extractVersion,
  requireVersion,
  deprecate,
  versionedRoute,
  apiVersionInfo,
  DEFAULT_VERSION,
  SUPPORTED_VERSIONS
}
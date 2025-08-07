const express = require('express')
const router = express.Router()
const PlacesController = require('../../controllers/placesController')
const { requireVersion } = require('../../middleware/apiVersioning')

// Middleware para agregar funcionalidades v2
const enhanceV2Response = (req, res, next) => {
  // Interceptar la respuesta para agregar metadata v2
  const originalJson = res.json
  res.json = function(data) {
    // Si es un array de lugares, agregar metadata de paginación
    if (Array.isArray(data)) {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 20
      const total = data.length // En producción, esto vendría de la DB
      
      const response = {
        data: data.slice((page - 1) * limit, page * limit),
        metadata: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        },
        links: {
          self: `${req.baseUrl}${req.path}?page=${page}&limit=${limit}`,
          next: page < Math.ceil(total / limit) ? `${req.baseUrl}${req.path}?page=${page + 1}&limit=${limit}` : null,
          prev: page > 1 ? `${req.baseUrl}${req.path}?page=${page - 1}&limit=${limit}` : null,
          first: `${req.baseUrl}${req.path}?page=1&limit=${limit}`,
          last: `${req.baseUrl}${req.path}?page=${Math.ceil(total / limit)}&limit=${limit}`
        }
      }
      originalJson.call(this, response)
    } else {
      originalJson.call(this, data)
    }
  }
  next()
}

// Aplicar mejoras v2 a todas las rutas
router.use(enhanceV2Response)

// Rutas mejoradas de lugares con filtros avanzados
/**
 * @openapi
 * /places:
 *   get:
 *     tags: [Places]
 *     summary: Listar lugares (v2 con filtros y paginación)
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: rating
 *         schema: { type: number }
 *       - in: query
 *         name: priceLevel
 *         schema: { type: string }
 *       - in: query
 *         name: amenities
 *         schema: { type: string }
 *         description: Lista separada por comas
 *       - in: query
 *         name: isOpen
 *         schema: { type: boolean }
 *       - in: query
 *         name: verified
 *         schema: { type: boolean }
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *       - in: query
 *         name: lat
 *         schema: { type: number }
 *       - in: query
 *         name: lng
 *         schema: { type: number }
 *       - in: query
 *         name: radius
 *         schema: { type: number, default: 5000 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [rating, distance, views, name] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista paginada de lugares
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedPlaces'
 */
router.get('/', async (req, res, next) => {
  // Extraer filtros avanzados de v2
  const filters = {
    type: req.query.type,
    rating: req.query.rating ? parseFloat(req.query.rating) : undefined,
    priceLevel: req.query.priceLevel,
    amenities: req.query.amenities ? req.query.amenities.split(',') : undefined,
    isOpen: req.query.isOpen === 'true',
    verified: req.query.verified === 'true',
    featured: req.query.featured === 'true',
    // Filtros geoespaciales
    lat: req.query.lat ? parseFloat(req.query.lat) : undefined,
    lng: req.query.lng ? parseFloat(req.query.lng) : undefined,
    radius: req.query.radius ? parseFloat(req.query.radius) : 5000, // metros
    // Ordenamiento
    sortBy: req.query.sortBy || 'rating', // rating, distance, views, name
    sortOrder: req.query.sortOrder || 'desc'
  }
  
  // Guardar filtros en req para que el controlador pueda usarlos
  req.filters = filters
  
  // Llamar al controlador existente
  PlacesController.getPlaces(req, res, next)
})

// Búsqueda mejorada con sugerencias
/**
 * @openapi
 * /places/search:
 *   get:
 *     tags: [Places]
 *     summary: Búsqueda mejorada con sugerencias (v2)
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Resultados y sugerencias
 */
router.get('/search', async (req, res, next) => {
  // En v2, agregar sugerencias de búsqueda
  const originalSearch = PlacesController.searchPlaces
  
  PlacesController.searchPlaces = async function(req, res) {
    const result = await originalSearch.call(this, req, res)
    
    // Si no se envió respuesta aún, mejorarla
    if (!res.headersSent) {
      const suggestions = [
        'restaurantes cerca de la costanera',
        'hoteles con piscina',
        'lugares turísticos gratuitos',
        'bares con música en vivo'
      ].filter(s => s.includes(req.query.q?.toLowerCase() || ''))
      
      res.json({
        results: result,
        suggestions: suggestions,
        totalResults: result?.length || 0,
        searchTerm: req.query.q
      })
    }
  }
  
  next()
})

// Nueva ruta: lugares cercanos con más opciones
/**
 * @openapi
 * /places/nearby:
 *   get:
 *     tags: [Places]
 *     summary: Lugares cercanos (v2)
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: lng
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: radius
 *         schema: { type: integer, default: 5000 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Resultado con metadata
 */
router.get('/nearby', requireVersion('v2'), async (req, res) => {
  const { lat, lng, radius = 5000, limit = 10 } = req.query
  
  if (!lat || !lng) {
    return res.status(400).json({
      error: 'Ubicación requerida',
      message: 'Debes proporcionar latitud (lat) y longitud (lng)'
    })
  }
  
  // Aquí iría la lógica para buscar lugares cercanos
  // Por ahora, simulamos la respuesta
  res.json({
    data: [],
    metadata: {
      center: { lat: parseFloat(lat), lng: parseFloat(lng) },
      radius: parseInt(radius),
      totalFound: 0
    }
  })
})

// Nueva ruta: lugares trending
/**
 * @openapi
 * /places/trending:
 *   get:
 *     tags: [Places]
 *     summary: Lugares en tendencia (v2)
 *     parameters:
 *       - in: query
 *         name: period
 *         schema: { type: string, enum: [day, week, month], default: week }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Lista de lugares trending
 */
router.get('/trending', requireVersion('v2'), async (req, res) => {
  const { period = 'week', limit = 10 } = req.query
  
  // Aquí iría la lógica para obtener lugares trending
  res.json({
    data: [],
    period: period,
    lastUpdated: new Date().toISOString()
  })
})

router.get('/random', PlacesController.getRandomPlaces)

module.exports = router
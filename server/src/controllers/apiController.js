const fs = require('fs')
const path = require('path')

// Controller para endpoints de prueba y estado del servidor
class ApiController {
  
  // GET /api/health - Verificar el estado del servidor
  static getHealth(req, res) {
    try {
      const healthCheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: new Date().toISOString(),
        status: 'healthy',
        version: '1.0.0'
      }
      
      res.status(200).json(healthCheck)
    } catch (error) {
      res.status(503).json({
        status: 'error',
        message: 'Service unavailable',
        error: error.message
      })
    }
  }
  
  // GET /api/status - Información detallada del servidor
  static getStatus(req, res) {
    try {
      const status = {
        server: {
          name: 'Japasea Server',
          version: '1.0.0',
          environment: process.env.NODE_ENV || 'development',
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        },
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
          }
        },
        endpoints: {
          health: '/api/health',
          status: '/api/status',
          test: '/api/test',
          lugares: '/api/lugares',
          buscarLugares: '/api/lugares/buscar',
          lugaresAleatorios: '/api/lugares/aleatorios'
        }
      }
      
      res.status(200).json(status)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to get server status',
        error: error.message
      })
    }
  }
  
  // GET /api/test - Endpoint de prueba simple
  static getTest(req, res) {
    try {
      res.status(200).json({
        message: 'Test endpoint working correctly!',
        timestamp: new Date().toISOString(),
        requestInfo: {
          method: req.method,
          url: req.url,
          headers: req.headers,
          query: req.query,
          params: req.params
        }
      })
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Test endpoint failed',
        error: error.message
      })
    }
  }
  
  // POST /api/test - Endpoint de prueba para POST
  static postTest(req, res) {
    try {
      res.status(201).json({
        message: 'POST test endpoint working correctly!',
        timestamp: new Date().toISOString(),
        receivedData: req.body,
        requestInfo: {
          method: req.method,
          url: req.url,
          contentType: req.get('Content-Type')
        }
      })
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'POST test endpoint failed',
        error: error.message
      })
    }
  }

  // Helper method para cargar lugares desde el archivo JSON
  static loadLugares() {
    try {
      const lugaresPath = path.join(__dirname, '../../lugares.json')
      const data = fs.readFileSync(lugaresPath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading lugares:', error)
      return []
    }
  }

  // GET /api/lugares - Obtener todos los lugares o filtrar por tipo
  static getLugares(req, res) {
    try {
      const { tipo } = req.query
      let lugares = ApiController.loadLugares()

      if (tipo) {
        lugares = lugares.filter(lugar => 
          lugar.type.toLowerCase().includes(tipo.toLowerCase())
        )
      }

      res.status(200).json(lugares)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to get lugares',
        error: error.message
      })
    }
  }

  // GET /api/lugares/buscar - Buscar lugares por consulta
  static buscarLugares(req, res) {
    try {
      const { q } = req.query
      
      if (!q) {
        return res.status(400).json({
          status: 'error',
          message: 'Query parameter "q" is required'
        })
      }

      const lugares = ApiController.loadLugares()
      const queryLower = q.toLowerCase()
      
      const resultados = lugares.filter(lugar =>
        lugar.key.toLowerCase().includes(queryLower) ||
        lugar.description.toLowerCase().includes(queryLower) ||
        lugar.type.toLowerCase().includes(queryLower) ||
        lugar.address.toLowerCase().includes(queryLower)
      )

      res.status(200).json(resultados)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to search lugares',
        error: error.message
      })
    }
  }

  // GET /api/lugares/aleatorios - Obtener lugares aleatorios
  static getLugaresAleatorios(req, res) {
    try {
      const { cantidad = 3 } = req.query
      const lugares = ApiController.loadLugares()
      
      // Mezclar array y tomar la cantidad solicitada
      const shuffled = [...lugares].sort(() => 0.5 - Math.random())
      const selectedLugares = shuffled.slice(0, parseInt(cantidad))

      res.status(200).json(selectedLugares)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to get random lugares',
        error: error.message
      })
    }
  }
}

module.exports = ApiController

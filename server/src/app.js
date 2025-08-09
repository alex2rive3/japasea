const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const config = require('./config/config')
const connectDatabase = require('./config/database')
const { extractVersion, apiVersionInfo } = require('./middleware/apiVersioning')
const apiRoutesV1 = require('./routes/v1')
const { auditMiddleware, auditErrorMiddleware } = require('./middleware/auditMiddleware')

const app = express()

// Swagger (documentación)
let swaggerUi, swaggerSpecV1
try {
  swaggerUi = require('swagger-ui-express')
  swaggerSpecV1 = require('./docs/swagger.v1')
} catch (e) {
  // Ignorar si no está instalado en el entorno actual
}

// Conectar a la base de datos
connectDatabase()

app.use(helmet())
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}))
app.use(morgan('combined'))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Middleware de auditoría (antes de las rutas)
app.use(auditMiddleware)

// Middleware de versionado para todas las rutas /api
app.use('/api', extractVersion)

// Endpoint para información de versiones
app.get('/api/versions', apiVersionInfo)

// Rutas versionadas
app.use('/api/v1', apiRoutesV1)

// Redirigir rutas sin versión a v1
app.use('/api/auth', (req, res, next) => {
  req.url = `/v1/auth${req.url}`
  next()
}, apiRoutesV1)

app.use('/api/places', (req, res, next) => {
  req.url = `/v1/places${req.url}`
  next()
}, apiRoutesV1)

app.use('/api/favorites', (req, res, next) => {
  req.url = `/v1/favorites${req.url}`
  next()
}, apiRoutesV1)

app.use('/api/chat', (req, res, next) => {
  req.url = `/v1/chat${req.url}`
  next()
}, apiRoutesV1)

app.use('/api/admin', (req, res, next) => {
  req.url = `/v1/admin${req.url}`
  next()
}, apiRoutesV1)

// Montar documentación Swagger
if (swaggerUi && swaggerSpecV1) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecV1))
}

app.get('/', (req, res) => {
  res.json({
    message: 'Servidor Japasea funcionando correctamente!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      status: '/api/status'
    }
  })
})

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor`
  })
})

// Middleware de manejo de errores con auditoría
app.use(auditErrorMiddleware)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Algo salió mal en el servidor'
  })
})

const PORT = config.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Servidor Japasea ejecutándose en el puerto ${PORT}`)
  console.log(`📱 Entorno: ${config.NODE_ENV}`)
  console.log(`🔗 URL del servidor: http://localhost:${PORT}`)
})

module.exports = app

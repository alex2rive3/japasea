const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const config = require('./config/config')
const connectDatabase = require('./config/database')
const { extractVersion, apiVersionInfo } = require('./middleware/apiVersioning')
const apiRoutesV1 = require('./routes/v1')
const apiRoutesV2 = require('./routes/v2')
const apiRoutes = require('./routes/apiRoutes')
const authRoutes = require('./routes/authRoutes')
const favoritesRoutes = require('./routes/favoritesRoutes')

const app = express()

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

// Middleware de versionado para todas las rutas /api
app.use('/api', extractVersion)

// Endpoint para información de versiones
app.get('/api/versions', apiVersionInfo)

// Rutas versionadas
app.use('/api/v1', apiRoutesV1)
app.use('/api/v2', apiRoutesV2)

// Rutas legacy (sin versión explícita - redirigir a v1)
app.use('/api/auth', authRoutes)
app.use('/api/favorites', favoritesRoutes)
app.use('/api', apiRoutes)

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

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Error interno del servidor',
    message: 'Algo salió mal en el servidor'
  })
})

const PORT = config.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Servidor Japasea ejecutándose en el puerto ${PORT}`)
  console.log(`📱 Entorno: ${config.NODE_ENV}`)
  console.log(`🔗 URL del servidor: http://localhost:${PORT}`)
})

module.exports = app

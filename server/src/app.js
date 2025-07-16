const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const config = require('./config/config')
const apiRoutes = require('./routes/apiRoutes')

const app = express()

// Middlewares de seguridad
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))

// Parsear JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use('/api', apiRoutes)

// Ruta raíz para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.json({
    message: 'Japasea Server is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      status: '/api/status'
    }
  })
})

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist on this server`
  })
})

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  })
})

const PORT = config.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Japasea Server running on port ${PORT}`)
  console.log(`📱 Environment: ${config.NODE_ENV}`)
  console.log(`🔗 Server URL: http://localhost:${PORT}`)
})

module.exports = app

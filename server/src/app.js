const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const config = require('./config/config')
const apiRoutes = require('./routes/apiRoutes')

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

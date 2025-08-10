// Barrel exports para infraestructura compartida
const config = require('./config')
const database = require('./database')

// Middleware
const authMiddleware = require('./middleware/authMiddleware')
const auditMiddleware = require('./middleware/auditMiddleware')
const adminValidation = require('./middleware/adminValidation')
const apiVersioning = require('./middleware/apiVersioning')
const middleware = require('./middleware/middleware')

// Servicios externos
const emailService = require('./external-apis/emailService')
const GoogleAIService = require('./external-apis/GoogleAIService')

module.exports = {
  config,
  database,
  middleware: {
    authMiddleware,
    auditMiddleware,
    adminValidation,
    apiVersioning,
    middleware
  },
  externalApis: {
    emailService,
    GoogleAIService
  }
}

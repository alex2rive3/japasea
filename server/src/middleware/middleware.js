// Middleware para logging de requests
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString()
  const method = req.method
  const url = req.originalUrl
  const userAgent = req.get('User-Agent') || 'Unknown'
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`)
  
  next()
}

// Middleware para validar Content-Type en POST requests
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(400).json({
      error: 'Invalid Content-Type',
      message: 'Content-Type must be application/json'
    })
  }
  next()
}

// Middleware para rate limiting básico (ejemplo simple)
const rateLimiter = (req, res, next) => {
  // Implementación básica - en producción usar express-rate-limit
  const clientIP = req.ip || req.connection.remoteAddress
  console.log(`Request from IP: ${clientIP}`)
  
  next()
}

module.exports = {
  requestLogger,
  validateContentType,
  rateLimiter
}

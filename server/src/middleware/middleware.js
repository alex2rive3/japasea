const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString()
  const method = req.method
  const url = req.originalUrl
  const userAgent = req.get('User-Agent') || 'Unknown'
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`)
  
  next()
}

const validateContentType = (req, res, next) => {
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(400).json({
      error: 'Invalid Content-Type',
      message: 'Content-Type must be application/json'
    })
  }
  next()
}

const rateLimiter = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress
  console.log(`Request from IP: ${clientIP}`)
  
  next()
}

module.exports = {
  requestLogger,
  validateContentType,
  rateLimiter
}

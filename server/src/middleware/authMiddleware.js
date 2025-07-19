const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const { body, validationResult } = require('express-validator')
const User = require('../models/userModel')
const config = require('../config/config')

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      })
    }
    
    const decoded = jwt.verify(token, config.JWT_SECRET)
    
    const user = await User.findById(decoded.id).select('-password -refreshToken')
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido - Usuario no encontrado'
      })
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada'
      })
    }
    
    req.user = user
    next()
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      })
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      })
    }
    
    console.error('Error en autenticación:', error)
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      })
    }
    
    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role]
    const requiredRoles = Array.isArray(roles) ? roles : [roles]
    
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role))
    
    if (!hasRequiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes'
      })
    }
    
    next()
  }
}

const loginRateLimit = rateLimit({
  windowMs: config.RATE_LIMIT.windowMs,
  max: config.RATE_LIMIT.max,
  skipSuccessfulRequests: config.RATE_LIMIT.skipSuccessfulRequests,
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  message: {
    success: false,
    message: 'Demasiados intentos de registro. Intente nuevamente en 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const validateRegistration = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .trim()
    .escape(),
  
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('El email no puede exceder 100 caracteres'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Número de teléfono inválido')
]

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
]

const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos una letra minúscula, una mayúscula y un número')
]

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    })
  }
  
  next()
}

module.exports = {
  authenticateToken,
  requireRole,
  loginRateLimit,
  registerRateLimit,
  validateRegistration,
  validateLogin,
  validateChangePassword,
  handleValidationErrors
}

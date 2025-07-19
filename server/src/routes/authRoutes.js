const express = require('express')
const authController = require('../controllers/authController')
const {
  authenticateToken,
  requireRole,
  loginRateLimit,
  registerRateLimit,
  validateRegistration,
  validateLogin,
  validateChangePassword,
  handleValidationErrors
} = require('../middleware/authMiddleware')

const router = express.Router()

// Rutas públicas (sin autenticación)
router.post('/register', 
  registerRateLimit,
  validateRegistration,
  handleValidationErrors,
  authController.register
)

router.post('/login',
  loginRateLimit,
  validateLogin,
  handleValidationErrors,
  authController.login
)

router.post('/refresh-token', authController.refreshToken)

// Rutas protegidas (requieren autenticación)
router.use(authenticateToken)

router.post('/logout', authController.logout)
router.get('/profile', authController.getProfile)
router.put('/profile', authController.updateProfile)
router.put('/change-password',
  validateChangePassword,
  handleValidationErrors,
  authController.changePassword
)
router.delete('/account', authController.deleteAccount)

module.exports = router

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

// Recuperación de contraseña (rutas públicas)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

// Verificación de email (ruta pública)
router.get('/verify-email/:token', authController.verifyEmail)

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

// Reenvío de email de verificación (requiere autenticación)
router.post('/resend-verification', authController.resendVerificationEmail)

module.exports = router
const express = require('express')
const router = express.Router()
const authController = require('../../controllers/authController')
const {
  authenticateToken,
  validateRegistration,
  validateLogin,
  validateChangePassword,
  handleValidationErrors,
  loginRateLimit,
  registerRateLimit
} = require('../../middleware/authMiddleware')

// Rutas de autenticación v1
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

router.post('/logout', 
  authenticateToken, 
  authController.logout
)

router.post('/refresh-token', 
  authController.refreshToken
)

router.get('/profile', 
  authenticateToken, 
  authController.getProfile
)

router.put('/profile', 
  authenticateToken, 
  authController.updateProfile
)

router.post('/change-password', 
  authenticateToken, 
  validateChangePassword, 
  handleValidationErrors, 
  authController.changePassword
)

module.exports = router
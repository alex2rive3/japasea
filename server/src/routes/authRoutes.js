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
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Legacy]
 *     summary: (Legacy) Registrar un usuario
 */
router.post('/register', 
  registerRateLimit,
  validateRegistration,
  handleValidationErrors,
  authController.register
)

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Legacy]
 *     summary: (Legacy) Iniciar sesión
 */
router.post('/login',
  loginRateLimit,
  validateLogin,
  handleValidationErrors,
  authController.login
)

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     tags: [Legacy]
 *     summary: (Legacy) Renovar token
 */
router.post('/refresh-token', authController.refreshToken)

// Recuperación de contraseña (rutas públicas)
/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Legacy]
 *     summary: (Legacy) Solicitar recuperación de contraseña
 */
router.post('/forgot-password', authController.forgotPassword)
/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Legacy]
 *     summary: (Legacy) Restablecer contraseña
 */
router.post('/reset-password', authController.resetPassword)

// Verificación de email (ruta pública)
/**
 * @openapi
 * /auth/verify-email/{token}:
 *   get:
 *     tags: [Legacy]
 *     summary: (Legacy) Verificar email
 */
router.get('/verify-email/:token', authController.verifyEmail)

// Rutas protegidas (requieren autenticación)
router.use(authenticateToken)

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Legacy]
 *     summary: (Legacy) Cerrar sesión
 */
router.post('/logout', authController.logout)
/**
 * @openapi
 * /auth/profile:
 *   get:
 *     tags: [Legacy]
 *     summary: (Legacy) Obtener perfil
 */
router.get('/profile', authController.getProfile)
/**
 * @openapi
 * /auth/profile:
 *   put:
 *     tags: [Legacy]
 *     summary: (Legacy) Actualizar perfil
 */
router.put('/profile', authController.updateProfile)
/**
 * @openapi
 * /auth/change-password:
 *   put:
 *     tags: [Legacy]
 *     summary: (Legacy) Cambiar contraseña
 */
router.put('/change-password',
  validateChangePassword,
  handleValidationErrors,
  authController.changePassword
)
/**
 * @openapi
 * /auth/account:
 *   delete:
 *     tags: [Legacy]
 *     summary: (Legacy) Desactivar cuenta
 */
router.delete('/account', authController.deleteAccount)

// Reenvío de email de verificación (requiere autenticación)
/**
 * @openapi
 * /auth/resend-verification:
 *   post:
 *     tags: [Legacy]
 *     summary: (Legacy) Reenviar email de verificación
 */
router.post('/resend-verification', authController.resendVerificationEmail)

module.exports = router

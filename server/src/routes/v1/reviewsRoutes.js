const express = require('express')
const router = express.Router()
const ReviewsController = require('../../controllers/reviewsController')
const { authenticateToken, optionalAuth } = require('../../middleware/authMiddleware')
const { body, param, query, validationResult } = require('express-validator')

// Middleware de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    })
  }
  next()
}

// Validaciones
const validatePlaceId = [
  param('placeId').isMongoId().withMessage('ID de lugar inválido')
]

const validateReviewId = [
  param('reviewId').isMongoId().withMessage('ID de reseña inválido')
]

const validateCreateReview = [
  param('placeId').isMongoId().withMessage('ID de lugar inválido'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating debe ser entre 1 y 5'),
  body('comment')
    .isString()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('El comentario debe tener entre 10 y 1000 caracteres'),
  body('images')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Máximo 5 imágenes permitidas'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Las imágenes deben ser URLs válidas')
]

const validateUpdateReview = [
  param('reviewId').isMongoId().withMessage('ID de reseña inválido'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating debe ser entre 1 y 5'),
  body('comment')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('El comentario debe tener entre 10 y 1000 caracteres'),
  body('images')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Máximo 5 imágenes permitidas')
]

const validateVote = [
  param('reviewId').isMongoId().withMessage('ID de reseña inválido'),
  body('vote').isIn(['yes', 'no']).withMessage('Voto debe ser "yes" o "no"')
]

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Límite debe estar entre 1 y 50'),
  query('sort')
    .optional()
    .isIn(['recent', 'rating-high', 'rating-low', 'helpful'])
    .withMessage('Ordenamiento inválido')
]

// ====== RUTAS PÚBLICAS ======

/**
 * @openapi
 * /reviews/places/{placeId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Obtener reseñas de un lugar
 *     description: Obtiene todas las reseñas aprobadas de un lugar específico
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [recent, rating-high, rating-low, helpful]
 *     responses:
 *       200:
 *         description: Lista de reseñas con estadísticas
 */
router.get(
  '/places/:placeId',
  optionalAuth,
  validatePlaceId,
  validatePagination,
  handleValidationErrors,
  ReviewsController.getPlaceReviews
)

// ====== RUTAS AUTENTICADAS ======

/**
 * @openapi
 * /reviews/places/{placeId}:
 *   post:
 *     tags: [Reviews]
 *     summary: Crear nueva reseña
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, comment]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *               images:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                   format: url
 *     responses:
 *       201:
 *         description: Reseña creada exitosamente
 */
router.post(
  '/places/:placeId',
  authenticateToken,
  validateCreateReview,
  handleValidationErrors,
  ReviewsController.createReview
)

/**
 * @openapi
 * /reviews/user:
 *   get:
 *     tags: [Reviews]
 *     summary: Obtener mis reseñas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de reseñas del usuario
 */
router.get(
  '/user',
  authenticateToken,
  validatePagination,
  handleValidationErrors,
  ReviewsController.getUserReviews
)

/**
 * @openapi
 * /reviews/{reviewId}:
 *   put:
 *     tags: [Reviews]
 *     summary: Actualizar reseña propia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Reseña actualizada
 */
router.put(
  '/:reviewId',
  authenticateToken,
  validateUpdateReview,
  handleValidationErrors,
  ReviewsController.updateReview
)

/**
 * @openapi
 * /reviews/{reviewId}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Eliminar reseña propia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reseña eliminada
 */
router.delete(
  '/:reviewId',
  authenticateToken,
  validateReviewId,
  handleValidationErrors,
  ReviewsController.deleteReview
)

/**
 * @openapi
 * /reviews/{reviewId}/vote:
 *   post:
 *     tags: [Reviews]
 *     summary: Votar si una reseña es útil
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vote]
 *             properties:
 *               vote:
 *                 type: string
 *                 enum: [yes, no]
 *     responses:
 *       200:
 *         description: Voto registrado
 */
router.post(
  '/:reviewId/vote',
  authenticateToken,
  validateVote,
  handleValidationErrors,
  ReviewsController.voteReview
)

module.exports = router

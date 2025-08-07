const express = require('express')
const router = express.Router()
const AdminController = require('../../controllers/adminController')
const { authenticateToken, requireRole } = require('../../middleware/authMiddleware')

// Todas las rutas admin requieren autenticación y rol admin
router.use(authenticateToken, requireRole('admin'))

/**
 * @openapi
 * /admin/places:
 *   get:
 *     tags: [Admin]
 *     summary: Listar lugares (admin)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: verified
 *         schema: { type: boolean }
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Lista paginada
 */
router.get('/places', AdminController.listPlaces)

/**
 * @openapi
 * /admin/places:
 *   post:
 *     tags: [Admin]
 *     summary: Crear nuevo lugar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, name, description, type, address]
 *             properties:
 *               key: { type: string }
 *               name: { type: string }
 *               description: { type: string }
 *               type: { type: string }
 *               address: { type: string }
 *               lat: { type: number }
 *               lng: { type: number }
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items: { type: number }
 *     responses:
 *       201:
 *         description: Creado
 */
router.post('/places', AdminController.createPlace)

/**
 * @openapi
 * /admin/places/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Obtener detalle de lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Ok
 */
router.get('/places/:id', AdminController.getPlace)

/**
 * @openapi
 * /admin/places/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Actualizar lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.put('/places/:id', AdminController.updatePlace)

/**
 * @openapi
 * /admin/places/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Desactivar lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Desactivado
 */
router.delete('/places/:id', AdminController.deletePlace)

/**
 * @openapi
 * /admin/places/{id}/status:
 *   patch:
 *     tags: [Admin]
 *     summary: Cambiar estado del lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [active, inactive, pending, seasonal] }
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch('/places/:id/status', AdminController.setStatus)

/**
 * @openapi
 * /admin/places/{id}/verify:
 *   post:
 *     tags: [Admin]
 *     summary: Verificar lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Verificado
 */
router.post('/places/:id/verify', AdminController.verifyPlace)

/**
 * @openapi
 * /admin/places/{id}/feature:
 *   post:
 *     tags: [Admin]
 *     summary: Destacar lugar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               featured: { type: boolean }
 *               featuredUntil: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.post('/places/:id/feature', AdminController.featurePlace)

module.exports = router



const express = require('express')
const router = express.Router()
const PlacesController = require('../../controllers/placesController')

// Rutas públicas de lugares
router.get('/', PlacesController.getPlaces)
router.get('/search', PlacesController.searchPlaces)
router.get('/random', PlacesController.getRandomPlaces)

module.exports = router
class PlacesController {
  constructor(container) {
    this.getPlacesUseCase = container.resolve('GetPlaces')
    this.searchPlacesUseCase = container.resolve('SearchPlaces')
    this.getRandomPlacesUseCase = container.resolve('GetRandomPlaces')
    this.getPlaceByIdUseCase = container.resolve('GetPlaceById')
    this.ensurePlaceUseCase = container.resolve('EnsurePlace')
    this.processChatUseCase = container.resolve('ProcessChat')
  }

  async getPlaces(req, res, next) {
    try {
      const places = await this.getPlacesUseCase.execute(req.query)
      res.status(200).json(places)
    } catch (error) {
      next(error)
    }
  }

  async searchPlaces(req, res, next) {
    try {
      const places = await this.searchPlacesUseCase.execute(req.query.q)
      res.status(200).json(places)
    } catch (error) {
      next(error)
    }
  }

  async getRandomPlaces(req, res, next) {
    try {
      const places = await this.getRandomPlacesUseCase.execute(req.query.count)
      res.status(200).json(places)
    } catch (error) {
      next(error)
    }
  }

  async getPlaceById(req, res, next) {
    try {
      const place = await this.getPlaceByIdUseCase.execute(req.params.id)
      res.status(200).json({ 
        success: true, 
        data: place 
      })
    } catch (error) {
      next(error)
    }
  }

  async ensurePlace(req, res, next) {
    try {
      const place = await this.ensurePlaceUseCase.execute(req.body)
      res.status(200).json({ 
        success: true, 
        data: place 
      })
    } catch (error) {
      next(error)
    }
  }

  async processChat(req, res, next) {
    try {
      const { message, context, sessionId } = req.body
      const userId = req.user?._id
      
      const response = await this.processChatUseCase.execute(
        userId,
        message,
        context,
        sessionId
      )
      
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = PlacesController

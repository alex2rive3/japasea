class RefreshToken {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository
    this.tokenService = tokenService
  }

  async execute(refreshTokenData) {
    const { refreshToken } = refreshTokenData

    if (!refreshToken) {
      const error = new Error('Refresh token es requerido')
      error.name = 'ValidationError'
      throw error
    }

    try {
      // Verificar el refresh token
      const decoded = this.tokenService.verifyRefreshToken(refreshToken)
      
      // Buscar el usuario
      const user = await this.userRepository.findById(decoded.userId)
      if (!user) {
        const error = new Error('Usuario no encontrado')
        error.name = 'UnauthorizedError'
        throw error
      }

      // Verificar que el refresh token coincida con el almacenado
      if (user.refreshToken !== refreshToken) {
        const error = new Error('Refresh token inválido')
        error.name = 'UnauthorizedError'
        throw error
      }

      // Verificar que el usuario esté activo
      if (user.status !== 'active') {
        const error = new Error('Cuenta desactivada')
        error.name = 'AccountDeactivatedError'
        throw error
      }

      // Generar nuevos tokens
      const newAccessToken = this.tokenService.generateAccessToken(user)
      const newRefreshToken = this.tokenService.generateRefreshToken(user)

      // Actualizar el refresh token en la base de datos
      await this.userRepository.updateRefreshToken(user._id, newRefreshToken)

      return {
        success: true,
        message: 'Tokens renovados exitosamente',
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        },
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }

    } catch (jwtError) {
      // Si el token es inválido o expirado
      if (jwtError.name === 'JsonWebTokenError' || jwtError.name === 'TokenExpiredError') {
        const error = new Error('Refresh token inválido o expirado')
        error.name = 'UnauthorizedError'
        throw error
      }
      
      // Re-throw otros errores
      throw jwtError
    }
  }
}

module.exports = RefreshToken

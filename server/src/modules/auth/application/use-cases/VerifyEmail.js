class VerifyEmail {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository
    this.tokenService = tokenService
  }

  async execute(verificationData) {
    const { token } = verificationData

    if (!token) {
      const error = new Error('Token de verificación es requerido')
      error.name = 'ValidationError'
      throw error
    }

    // Buscar usuario por token de verificación
    const user = await this.userRepository.findByVerificationToken(token)
    
    if (!user) {
      const error = new Error('Token de verificación inválido o expirado')
      error.name = 'InvalidTokenError'
      throw error
    }

    // Verificar que el token no haya expirado
    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      const error = new Error('Token de verificación expirado')
      error.name = 'TokenExpiredError'
      throw error
    }

    // Verificar si ya está verificado
    if (user.emailVerified) {
      return {
        success: true,
        message: 'Email ya verificado anteriormente',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: true
        }
      }
    }

    // Marcar email como verificado y limpiar token
    const updateData = {
      emailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined,
      emailVerifiedAt: new Date()
    }

    await this.userRepository.updateEmailVerification(user._id, updateData)

    // Generar nuevos tokens para refrescar la sesión
    const accessToken = this.tokenService.generateAccessToken({
      ...user.toObject(),
      emailVerified: true
    })

    return {
      success: true,
      message: 'Email verificado exitosamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: true,
        role: user.role
      },
      accessToken
    }
  }
}

module.exports = VerifyEmail

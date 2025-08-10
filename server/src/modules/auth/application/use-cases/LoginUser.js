class LoginUser {
  constructor(userRepository, passwordService, tokenService) {
    this.userRepository = userRepository
    this.passwordService = passwordService
    this.tokenService = tokenService
  }

  async execute(credentials) {
    const { email, password, rememberMe = false } = credentials

    // Validaciones básicas
    if (!email || !password) {
      const error = new Error('Email y contraseña son requeridos')
      error.name = 'ValidationError'
      throw error
    }

    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      const error = new Error('Credenciales inválidas')
      error.name = 'UnauthorizedError'
      throw error
    }

    // Verificar si la cuenta está bloqueada
    if (user.accountLocked && user.lockUntil && user.lockUntil > Date.now()) {
      const error = new Error('Cuenta temporalmente bloqueada por intentos fallidos')
      error.name = 'AccountLockedError'
      throw error
    }

    // Verificar contraseña
    const isValidPassword = await this.passwordService.compare(password, user.password)
    if (!isValidPassword) {
      // Incrementar intentos fallidos
      await this.handleFailedLogin(user)
      
      const error = new Error('Credenciales inválidas')
      error.name = 'UnauthorizedError'
      throw error
    }

    // Verificar si el usuario está activo
    if (user.status !== 'active') {
      const error = new Error('Cuenta desactivada. Contacta al administrador')
      error.name = 'AccountDeactivatedError'
      throw error
    }

    // Login exitoso - limpiar intentos fallidos
    await this.clearFailedLoginAttempts(user)

    // Generar tokens
    const accessToken = this.tokenService.generateAccessToken(user)
    const refreshToken = this.tokenService.generateRefreshToken(user, rememberMe)

    // Guardar refresh token y actualizar último login
    await this.userRepository.updateLoginData(user._id, {
      refreshToken,
      lastLogin: new Date(),
      lastIP: this.getClientIP()
    })

    return {
      success: true,
      message: 'Login exitoso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        role: user.role,
        preferences: user.preferences
      },
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }

  async handleFailedLogin(user) {
    const maxAttempts = 5
    const lockTimeMinutes = 30
    
    const currentAttempts = (user.loginAttempts || 0) + 1
    
    const updateData = {
      loginAttempts: currentAttempts,
      lastFailedLogin: new Date()
    }

    // Si excede los intentos máximos, bloquear la cuenta
    if (currentAttempts >= maxAttempts) {
      updateData.accountLocked = true
      updateData.lockUntil = new Date(Date.now() + lockTimeMinutes * 60 * 1000)
    }

    await this.userRepository.updateFailedLoginAttempts(user._id, updateData)
  }

  async clearFailedLoginAttempts(user) {
    if (user.loginAttempts > 0 || user.accountLocked) {
      await this.userRepository.clearFailedLoginAttempts(user._id)
    }
  }

  getClientIP() {
    // En una implementación real, esto vendría del request
    // Por ahora devolvemos null como placeholder
    return null
  }
}

module.exports = LoginUser

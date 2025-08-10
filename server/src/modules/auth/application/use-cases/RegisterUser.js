const crypto = require('crypto')

class RegisterUser {
  constructor(userRepository, passwordService, emailService, tokenService) {
    this.userRepository = userRepository
    this.passwordService = passwordService
    this.emailService = emailService
    this.tokenService = tokenService
  }

  async execute(userData) {
    const { name, email, password, phone } = userData

    // Validaciones básicas
    await this.validateRegistrationData({ name, email, password, phone })
    
    // Verificar si usuario existe
    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      const error = new Error('El usuario ya existe con este email')
      error.name = 'ConflictError'
      throw error
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(password)
    
    // Generar token de verificación
    const verificationToken = this.generateVerificationToken()
    
    // Crear usuario
    const newUserData = {
      name,
      email,
      password: hashedPassword,
      phone,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    }

    const user = await this.userRepository.create(newUserData)

    // Enviar email de verificación
    try {
      await this.emailService.sendVerificationEmail(user, verificationToken)
    } catch (emailError) {
      console.error('Error enviando email de verificación:', emailError)
      // No fallar el registro si el email no se envía
    }

    // Generar tokens JWT
    const accessToken = this.tokenService.generateAccessToken(user)
    const refreshToken = this.tokenService.generateRefreshToken(user)

    // Guardar refresh token en el usuario
    await this.userRepository.updateRefreshToken(user._id, refreshToken)

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        role: user.role
      },
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }

  async validateRegistrationData({ name, email, password, phone }) {
    const errors = []

    // Validar nombre
    if (!name || name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres')
    }

    // Validar email
    if (!email || !this.isValidEmail(email)) {
      errors.push('Email inválido')
    }

    // Validar contraseña
    if (!password) {
      errors.push('La contraseña es requerida')
    } else {
      const passwordErrors = this.validatePasswordStrength(password)
      errors.push(...passwordErrors)
    }

    // Validar teléfono (opcional pero si se proporciona debe ser válido)
    if (phone && !this.isValidPhone(phone)) {
      errors.push('Formato de teléfono inválido')
    }

    if (errors.length > 0) {
      const error = new Error('Errores de validación')
      error.name = 'ValidationError'
      error.errors = errors
      throw error
    }
  }

  validatePasswordStrength(password) {
    const errors = []
    const minLength = 8
    
    if (password.length < minLength) {
      errors.push('La contraseña debe tener al menos 8 caracteres')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe incluir al menos una mayúscula')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe incluir al menos una minúscula')
    }

    if (!/\d/.test(password)) {
      errors.push('La contraseña debe incluir al menos un número')
    }

    return errors
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  isValidPhone(phone) {
    // Formato paraguayo: +595XXXXXXXXX o 09XXXXXXXX
    const phoneRegex = /^(\+595|0)[9][0-9]{8}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex')
  }
}

module.exports = RegisterUser

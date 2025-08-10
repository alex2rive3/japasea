const crypto = require('crypto')

class ResetPassword {
  constructor(userRepository, passwordService, emailService) {
    this.userRepository = userRepository
    this.passwordService = passwordService
    this.emailService = emailService
  }

  // Solicitar reset de contraseña
  async requestReset(requestData) {
    const { email } = requestData

    if (!email) {
      const error = new Error('Email es requerido')
      error.name = 'ValidationError'
      throw error
    }

    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(email)
    
    // Por seguridad, siempre devolver éxito aunque el usuario no exista
    if (!user) {
      return {
        success: true,
        message: 'Si el email existe, recibirás un enlace de recuperación'
      }
    }

    // Generar token de reset
    const resetToken = this.generateResetToken()
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Guardar token en el usuario
    await this.userRepository.updatePasswordResetToken(user._id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetTokenExpires
    })

    // Enviar email de reset
    try {
      await this.emailService.sendPasswordResetEmail(user, resetToken)
    } catch (emailError) {
      console.error('Error enviando email de reset:', emailError)
      
      // Limpiar token si no se pudo enviar el email
      await this.userRepository.clearPasswordResetToken(user._id)
      
      const error = new Error('Error enviando email de recuperación')
      error.name = 'EmailServiceError'
      throw error
    }

    return {
      success: true,
      message: 'Si el email existe, recibirás un enlace de recuperación'
    }
  }

  // Confirmar reset de contraseña
  async confirmReset(resetData) {
    const { token, newPassword } = resetData

    if (!token || !newPassword) {
      const error = new Error('Token y nueva contraseña son requeridos')
      error.name = 'ValidationError'
      throw error
    }

    // Validar fortaleza de la nueva contraseña
    this.validatePasswordStrength(newPassword)

    // Buscar usuario por token de reset
    const user = await this.userRepository.findByPasswordResetToken(token)
    
    if (!user) {
      const error = new Error('Token de recuperación inválido o expirado')
      error.name = 'InvalidTokenError'
      throw error
    }

    // Verificar que el token no haya expirado
    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
      // Limpiar token expirado
      await this.userRepository.clearPasswordResetToken(user._id)
      
      const error = new Error('Token de recuperación expirado')
      error.name = 'TokenExpiredError'
      throw error
    }

    // Generar hash de la nueva contraseña
    const hashedPassword = await this.passwordService.hash(newPassword)

    // Actualizar contraseña y limpiar token
    const updateData = {
      password: hashedPassword,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
      passwordChangedAt: new Date(),
      // Invalidar todas las sesiones existentes
      refreshToken: null,
      tokenVersion: (user.tokenVersion || 0) + 1
    }

    await this.userRepository.updatePassword(user._id, updateData)

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente. Por favor inicia sesión nuevamente'
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

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('La contraseña debe incluir al menos un símbolo especial')
    }

    if (errors.length > 0) {
      const error = new Error('Contraseña no cumple con los requisitos de seguridad')
      error.name = 'ValidationError'
      error.errors = errors
      throw error
    }
  }

  generateResetToken() {
    return crypto.randomBytes(32).toString('hex')
  }
}

module.exports = ResetPassword

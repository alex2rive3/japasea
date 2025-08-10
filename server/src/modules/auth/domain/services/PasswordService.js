const bcrypt = require('bcrypt')
const crypto = require('crypto')

class PasswordService {
  constructor() {
    this.saltRounds = 12
  }

  async hash(password) {
    try {
      return await bcrypt.hash(password, this.saltRounds)
    } catch (error) {
      throw new Error(`Error hashing password: ${error.message}`)
    }
  }

  async compare(plainTextPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainTextPassword, hashedPassword)
    } catch (error) {
      throw new Error(`Error comparing passwords: ${error.message}`)
    }
  }

  validateStrength(password) {
    const errors = []
    const minLength = 8
    const maxLength = 128
    
    if (!password) {
      errors.push('La contraseña es requerida')
      return errors
    }

    if (password.length < minLength) {
      errors.push(`La contraseña debe tener al menos ${minLength} caracteres`)
    }

    if (password.length > maxLength) {
      errors.push(`La contraseña no puede exceder ${maxLength} caracteres`)
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

    // Verificar patrones comunes débiles
    const weakPatterns = [
      /(.)\1{3,}/, // 4 o más caracteres repetidos consecutivos
      /1234|abcd|qwer/i, // secuencias comunes
      /password|123456|admin/i // palabras comunes
    ]

    for (const pattern of weakPatterns) {
      if (pattern.test(password)) {
        errors.push('La contraseña contiene patrones muy comunes o predecibles')
        break
      }
    }

    return errors
  }

  generateSecurePassword(length = 12) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*(),.?":{}|<>'
    
    const allChars = uppercase + lowercase + numbers + symbols
    
    // Asegurar al menos un caracter de cada tipo
    let password = ''
    password += this.getRandomChar(uppercase)
    password += this.getRandomChar(lowercase)
    password += this.getRandomChar(numbers)
    password += this.getRandomChar(symbols)
    
    // Completar con caracteres aleatorios
    for (let i = 4; i < length; i++) {
      password += this.getRandomChar(allChars)
    }
    
    // Mezclar los caracteres para evitar patrones predecibles
    return this.shuffleString(password)
  }

  getRandomChar(chars) {
    const randomIndex = crypto.randomInt(0, chars.length)
    return chars[randomIndex]
  }

  shuffleString(str) {
    return str.split('').sort(() => crypto.randomInt(-1, 2)).join('')
  }

  generateSalt() {
    return crypto.randomBytes(16).toString('hex')
  }

  async hashWithCustomSalt(password, salt) {
    try {
      return await bcrypt.hash(password + salt, this.saltRounds)
    } catch (error) {
      throw new Error(`Error hashing password with salt: ${error.message}`)
    }
  }

  calculateStrengthScore(password) {
    let score = 0
    
    // Longitud
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (password.length >= 16) score += 1
    
    // Variedad de caracteres
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
    
    // Penalizar patrones comunes
    if (/(.)\1{2,}/.test(password)) score -= 1 // repeticiones
    if (/1234|abcd/i.test(password)) score -= 1 // secuencias
    
    return Math.max(0, Math.min(7, score))
  }

  getStrengthLabel(score) {
    const labels = [
      'Muy débil',
      'Débil', 
      'Débil',
      'Regular',
      'Regular',
      'Fuerte',
      'Fuerte',
      'Muy fuerte'
    ]
    
    return labels[score] || 'Muy débil'
  }
}

module.exports = PasswordService

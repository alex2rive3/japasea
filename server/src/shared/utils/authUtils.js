const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const config = require('../config/config')

class AuthUtils {
  
  static generateRandomToken(length = 32) {
    return crypto.randomBytes(length).toString('hex')
  }
  
  static verifyJWT(token) {
    try {
      return jwt.verify(token, config.JWT_SECRET)
    } catch (error) {
      throw error
    }
  }
  
  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7)
  }
  
  static generateResetToken() {
    return {
      token: this.generateRandomToken(),
      expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    }
  }
  
  static generateEmailVerificationToken() {
    return {
      token: this.generateRandomToken(),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }
  }
  
  static sanitizeUser(user) {
    const sanitized = user.toJSON ? user.toJSON() : user
    
    delete sanitized.password
    delete sanitized.refreshToken
    delete sanitized.passwordResetToken
    delete sanitized.passwordResetExpires
    delete sanitized.emailVerificationToken
    delete sanitized.emailVerificationExpires
    delete sanitized.loginAttempts
    delete sanitized.lockUntil
    delete sanitized.__v
    
    return sanitized
  }
  
  static createAuthResponse(user, accessToken, refreshToken, message = 'Operación exitosa') {
    return {
      success: true,
      message,
      data: {
        user: this.sanitizeUser(user),
        accessToken,
        refreshToken
      }
    }
  }
  
  static createErrorResponse(message, statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
      statusCode
    }
    
    if (errors) {
      response.errors = errors
    }
    
    return response
  }
  
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  static isStrongPassword(password) {
    const minLength = 6
    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    
    return password.length >= minLength && hasLower && hasUpper && hasNumber
  }
  
  static hashPassword(password, saltRounds = config.BCRYPT_SALT_ROUNDS) {
    const bcrypt = require('bcryptjs')
    return bcrypt.hash(password, saltRounds)
  }
  
  static comparePassword(plainPassword, hashedPassword) {
    const bcrypt = require('bcryptjs')
    return bcrypt.compare(plainPassword, hashedPassword)
  }
  
  static getTokenExpiration(token) {
    try {
      const decoded = jwt.decode(token)
      return decoded.exp ? new Date(decoded.exp * 1000) : null
    } catch (error) {
      return null
    }
  }
  
  static isTokenExpired(token) {
    const expiration = this.getTokenExpiration(token)
    return expiration ? expiration < new Date() : true
  }
}

module.exports = AuthUtils

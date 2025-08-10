const jwt = require('jsonwebtoken')
const crypto = require('crypto')

class TokenService {
  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'access-secret-key'
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key'
    this.accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m'
    this.refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    this.refreshTokenLongExpiresIn = process.env.JWT_REFRESH_LONG_EXPIRES_IN || '30d'
  }

  generateAccessToken(user) {
    const payload = {
      userId: user._id || user.id,
      email: user.email,
      role: user.role || 'user',
      emailVerified: user.emailVerified || false,
      tokenVersion: user.tokenVersion || 0
    }

    try {
      return jwt.sign(payload, this.accessTokenSecret, {
        expiresIn: this.accessTokenExpiresIn,
        issuer: 'japasea-api',
        audience: 'japasea-client'
      })
    } catch (error) {
      throw new Error(`Error generating access token: ${error.message}`)
    }
  }

  generateRefreshToken(user, rememberMe = false) {
    const payload = {
      userId: user._id || user.id,
      tokenVersion: user.tokenVersion || 0,
      type: 'refresh'
    }

    const expiresIn = rememberMe ? this.refreshTokenLongExpiresIn : this.refreshTokenExpiresIn

    try {
      return jwt.sign(payload, this.refreshTokenSecret, {
        expiresIn,
        issuer: 'japasea-api',
        audience: 'japasea-client'
      })
    } catch (error) {
      throw new Error(`Error generating refresh token: ${error.message}`)
    }
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret, {
        issuer: 'japasea-api',
        audience: 'japasea-client'
      })
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const expiredError = new Error('Access token expired')
        expiredError.name = 'TokenExpiredError'
        expiredError.expiredAt = error.expiredAt
        throw expiredError
      }
      
      if (error.name === 'JsonWebTokenError') {
        const invalidError = new Error('Invalid access token')
        invalidError.name = 'JsonWebTokenError'
        throw invalidError
      }
      
      throw error
    }
  }

  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'japasea-api',
        audience: 'japasea-client'
      })

      if (decoded.type !== 'refresh') {
        throw new Error('Token is not a refresh token')
      }

      return decoded
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const expiredError = new Error('Refresh token expired')
        expiredError.name = 'TokenExpiredError'
        expiredError.expiredAt = error.expiredAt
        throw expiredError
      }
      
      if (error.name === 'JsonWebTokenError') {
        const invalidError = new Error('Invalid refresh token')
        invalidError.name = 'JsonWebTokenError'
        throw invalidError
      }
      
      throw error
    }
  }

  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex')
  }

  generateVerificationToken() {
    return this.generateSecureToken(32)
  }

  generatePasswordResetToken() {
    return this.generateSecureToken(32)
  }

  decodeTokenWithoutVerification(token) {
    try {
      return jwt.decode(token, { complete: true })
    } catch (error) {
      throw new Error(`Error decoding token: ${error.message}`)
    }
  }

  getTokenExpiration(token) {
    try {
      const decoded = this.decodeTokenWithoutVerification(token)
      if (decoded && decoded.payload && decoded.payload.exp) {
        return new Date(decoded.payload.exp * 1000)
      }
      return null
    } catch (error) {
      return null
    }
  }

  isTokenExpired(token) {
    try {
      const expiration = this.getTokenExpiration(token)
      if (!expiration) return true
      return expiration < new Date()
    } catch (error) {
      return true
    }
  }

  generateApiKeyToken(user, permissions = []) {
    const payload = {
      userId: user._id || user.id,
      email: user.email,
      type: 'api-key',
      permissions,
      createdAt: new Date().toISOString()
    }

    try {
      return jwt.sign(payload, this.accessTokenSecret, {
        issuer: 'japasea-api',
        audience: 'japasea-api-client',
        // API keys don't expire by default, but can be revoked
        noTimestamp: false
      })
    } catch (error) {
      throw new Error(`Error generating API key token: ${error.message}`)
    }
  }

  verifyApiKeyToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'japasea-api',
        audience: 'japasea-api-client'
      })

      if (decoded.type !== 'api-key') {
        throw new Error('Token is not an API key')
      }

      return decoded
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        const invalidError = new Error('Invalid API key token')
        invalidError.name = 'JsonWebTokenError'
        throw invalidError
      }
      
      throw error
    }
  }

  createTokenPair(user, rememberMe = false) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user, rememberMe)
    }
  }
}

module.exports = TokenService

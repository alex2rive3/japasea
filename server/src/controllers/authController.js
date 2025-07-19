const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const config = require('../config/config')

class AuthController {
  
  async register(req, res) {
    try {
      const { name, email, password, phone } = req.body
      
      const existingUser = await User.findOne({ email })
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'El usuario ya existe con este email'
        })
      }
      
      const user = new User({
        name,
        email,
        password,
        phone
      })
      
      await user.save()
      
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      
      user.refreshToken = refreshToken
      await user.save()
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt
          },
          accessToken,
          refreshToken
        }
      })
      
    } catch (error) {
      console.error('Error en registro:', error)
      
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está en uso'
        })
      }
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
        
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors
        })
      }
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  }
  
  async login(req, res) {
    try {
      const { email, password } = req.body
      
      const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil')
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        })
      }
      
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Cuenta desactivada. Contacte al administrador.'
        })
      }
      
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Cuenta bloqueada temporalmente debido a múltiples intentos fallidos'
        })
      }
      
      const isValidPassword = await user.comparePassword(password)
      
      if (!isValidPassword) {
        await user.incrementLoginAttempts()
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        })
      }
      
      await user.resetLoginAttempts()
      
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      
      user.refreshToken = refreshToken
      await user.save()
      
      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
          },
          accessToken,
          refreshToken
        }
      })
      
    } catch (error) {
      console.error('Error en login:', error)
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  }
  
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token requerido'
        })
      }
      
      const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
      
      if (decoded.type !== 'refresh') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido'
        })
      }
      
      const user = await User.findById(decoded.id).select('+refreshToken')
      
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token inválido'
        })
      }
      
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Cuenta desactivada'
        })
      }
      
      const newAccessToken = user.generateAccessToken()
      const newRefreshToken = user.generateRefreshToken()
      
      user.refreshToken = newRefreshToken
      await user.save()
      
      res.status(200).json({
        success: true,
        message: 'Token renovado exitosamente',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      })
      
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Refresh token expirado'
        })
      }
      
      console.error('Error renovando token:', error)
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  }
  
  async logout(req, res) {
    try {
      const user = req.user
      
      user.refreshToken = null
      await user.save()
      
      res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      })
      
    } catch (error) {
      console.error('Error en logout:', error)
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  }
  
  async getProfile(req, res) {
    try {
      const user = req.user
      
      res.status(200).json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profilePicture: user.profilePicture,
            isEmailVerified: user.isEmailVerified,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      })
      
    } catch (error) {
      console.error('Error obteniendo perfil:', error)
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  }
  
  async updateProfile(req, res) {
    try {
      const user = req.user
      const { name, phone } = req.body
      
      const updateData = {}
      if (name) updateData.name = name
      if (phone !== undefined) updateData.phone = phone
      
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        updateData,
        { new: true, runValidators: true }
      )
      
      res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: {
          user: {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture,
            isEmailVerified: updatedUser.isEmailVerified,
            updatedAt: updatedUser.updatedAt
          }
        }
      })
      
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
        
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors
        })
      }
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  }
  
  async changePassword(req, res) {
    try {
      const user = await User.findById(req.user._id).select('+password')
      const { currentPassword, newPassword } = req.body
      
      const isCurrentPasswordValid = await user.comparePassword(currentPassword)
      
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña actual incorrecta'
        })
      }
      
      user.password = newPassword
      await user.save()
      
      res.status(200).json({
        success: true,
        message: 'Contraseña cambiada exitosamente'
      })
      
    } catch (error) {
      console.error('Error cambiando contraseña:', error)
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  }
  
  async deleteAccount(req, res) {
    try {
      const user = req.user
      
      user.isActive = false
      user.refreshToken = null
      await user.save()
      
      res.status(200).json({
        success: true,
        message: 'Cuenta desactivada exitosamente'
      })
      
    } catch (error) {
      console.error('Error desactivando cuenta:', error)
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  }
}

module.exports = new AuthController()

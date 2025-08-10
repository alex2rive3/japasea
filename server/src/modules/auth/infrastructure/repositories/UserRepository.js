const User = require('../../domain/entities/User')

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email }).lean()
  }

  async findById(userId) {
    return await User.findById(userId).lean()
  }

  async findByVerificationToken(token) {
    return await User.findOne({
      emailVerificationToken: token
    })
  }

  async findByPasswordResetToken(token) {
    return await User.findOne({
      passwordResetToken: token
    })
  }

  async create(userData) {
    const user = new User(userData)
    return await user.save()
  }

  async updateRefreshToken(userId, refreshToken) {
    return await User.findByIdAndUpdate(
      userId,
      { refreshToken },
      { new: true }
    )
  }

  async updateLoginData(userId, loginData) {
    const { refreshToken, lastLogin, lastIP } = loginData
    
    return await User.findByIdAndUpdate(
      userId,
      {
        refreshToken,
        lastLogin,
        lastIP,
        // Limpiar datos de intentos fallidos en login exitoso
        $unset: {
          loginAttempts: 1,
          accountLocked: 1,
          lockUntil: 1,
          lastFailedLogin: 1
        }
      },
      { new: true }
    )
  }

  async updateFailedLoginAttempts(userId, attemptData) {
    const { loginAttempts, lastFailedLogin, accountLocked, lockUntil } = attemptData
    
    const updateData = {
      loginAttempts,
      lastFailedLogin
    }
    
    if (accountLocked) {
      updateData.accountLocked = accountLocked
      updateData.lockUntil = lockUntil
    }
    
    return await User.findByIdAndUpdate(userId, updateData, { new: true })
  }

  async clearFailedLoginAttempts(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          loginAttempts: 1,
          accountLocked: 1,
          lockUntil: 1,
          lastFailedLogin: 1
        }
      },
      { new: true }
    )
  }

  async updateEmailVerification(userId, verificationData) {
    const { emailVerified, emailVerificationToken, emailVerificationExpires, emailVerifiedAt } = verificationData
    
    const updateData = {
      emailVerified,
      emailVerifiedAt
    }
    
    // Usar $unset para eliminar campos
    const unsetData = {}
    if (emailVerificationToken === undefined) {
      unsetData.emailVerificationToken = 1
    }
    if (emailVerificationExpires === undefined) {
      unsetData.emailVerificationExpires = 1
    }
    
    const updateOperation = { ...updateData }
    if (Object.keys(unsetData).length > 0) {
      updateOperation.$unset = unsetData
    }
    
    return await User.findByIdAndUpdate(userId, updateOperation, { new: true })
  }

  async updatePasswordResetToken(userId, tokenData) {
    const { passwordResetToken, passwordResetExpires } = tokenData
    
    return await User.findByIdAndUpdate(
      userId,
      {
        passwordResetToken,
        passwordResetExpires
      },
      { new: true }
    )
  }

  async clearPasswordResetToken(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          passwordResetToken: 1,
          passwordResetExpires: 1
        }
      },
      { new: true }
    )
  }

  async updatePassword(userId, passwordData) {
    const { password, passwordResetToken, passwordResetExpires, passwordChangedAt, refreshToken, tokenVersion } = passwordData
    
    const updateData = {
      password,
      passwordChangedAt
    }
    
    if (tokenVersion !== undefined) {
      updateData.tokenVersion = tokenVersion
    }
    
    if (refreshToken === null) {
      updateData.refreshToken = null
    }
    
    // Usar $unset para eliminar tokens de reset
    const unsetData = {}
    if (passwordResetToken === undefined) {
      unsetData.passwordResetToken = 1
    }
    if (passwordResetExpires === undefined) {
      unsetData.passwordResetExpires = 1
    }
    
    const updateOperation = { ...updateData }
    if (Object.keys(unsetData).length > 0) {
      updateOperation.$unset = unsetData
    }
    
    return await User.findByIdAndUpdate(userId, updateOperation, { new: true })
  }

  async existsByEmail(email) {
    const count = await User.countDocuments({ email })
    return count > 0
  }

  async count() {
    return await User.countDocuments()
  }

  async countActive() {
    return await User.countDocuments({ status: 'active' })
  }

  async findWithFilters(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1 } = pagination
    const skip = (page - 1) * limit
    
    const query = { ...filters }
    
    const users = await User.find(query)
      .select('-password -refreshToken -emailVerificationToken -passwordResetToken')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await User.countDocuments(query)
    
    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  }

  async updateStatus(userId, status) {
    return await User.findByIdAndUpdate(
      userId,
      { status, statusUpdatedAt: new Date() },
      { new: true }
    )
  }

  async ban(userId, reason) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        status: 'banned',
        banReason: reason,
        bannedAt: new Date(),
        refreshToken: null // Invalidar sesión
      },
      { new: true }
    )
  }

  async activate(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        status: 'active',
        $unset: { 
          banReason: 1, 
          bannedAt: 1 
        }
      },
      { new: true }
    )
  }
}

module.exports = UserRepository

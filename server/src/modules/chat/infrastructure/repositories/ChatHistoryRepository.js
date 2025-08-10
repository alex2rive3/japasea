const ChatHistory = require('../../domain/entities/ChatHistory')

class ChatHistoryRepository {
  async findOrCreateSession(userId, sessionId) {
    try {
      let session = await ChatHistory.findOne({ 
        userId, 
        sessionId 
      })

      if (!session) {
        session = new ChatHistory({
          userId,
          sessionId,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        })
        await session.save()
      }

      return session
    } catch (error) {
      throw new Error(`Error finding or creating chat session: ${error.message}`)
    }
  }

  async addMessageToSession(userId, sessionId, messageData) {
    try {
      const session = await this.findOrCreateSession(userId, sessionId)
      
      const message = {
        ...messageData,
        timestamp: new Date(),
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      session.messages.push(message)
      session.updatedAt = new Date()
      
      await session.save()
      return message
    } catch (error) {
      throw new Error(`Error adding message to session: ${error.message}`)
    }
  }

  async getUserHistory(userId, limit = 50) {
    try {
      const sessions = await ChatHistory.find({ userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .select('sessionId messages createdAt updatedAt')
        .lean()

      return sessions
    } catch (error) {
      throw new Error(`Error getting user history: ${error.message}`)
    }
  }

  async getSessionHistory(userId, sessionId) {
    try {
      const session = await ChatHistory.findOne({ 
        userId, 
        sessionId 
      }).lean()

      return session
    } catch (error) {
      throw new Error(`Error getting session history: ${error.message}`)
    }
  }

  async getRecentSessions(userId, limit = 10) {
    try {
      const sessions = await ChatHistory.find({ userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .select('sessionId updatedAt')
        .lean()

      return sessions.map(session => ({
        sessionId: session.sessionId,
        lastActivity: session.updatedAt
      }))
    } catch (error) {
      throw new Error(`Error getting recent sessions: ${error.message}`)
    }
  }

  async deleteSession(userId, sessionId) {
    try {
      const result = await ChatHistory.deleteOne({ 
        userId, 
        sessionId 
      })

      return result.deletedCount > 0
    } catch (error) {
      throw new Error(`Error deleting session: ${error.message}`)
    }
  }

  async getSessionMessageCount(userId, sessionId) {
    try {
      const session = await ChatHistory.findOne({ 
        userId, 
        sessionId 
      }, { 'messages': 1 })

      return session ? session.messages.length : 0
    } catch (error) {
      throw new Error(`Error getting session message count: ${error.message}`)
    }
  }

  async findByConversation(conversationId) {
    try {
      const session = await ChatHistory.findOne({ 
        sessionId: conversationId 
      }).lean()

      return session ? session.messages : []
    } catch (error) {
      throw new Error(`Error finding conversation: ${error.message}`)
    }
  }

  async save(chatData) {
    try {
      const { userId, conversationId, userMessage, botResponse } = chatData
      
      await this.addMessageToSession(userId, conversationId, {
        text: userMessage,
        sender: 'user'
      })

      await this.addMessageToSession(userId, conversationId, {
        text: botResponse.message || 'Bot response',
        sender: 'bot',
        response: botResponse
      })

      return true
    } catch (error) {
      throw new Error(`Error saving chat data: ${error.message}`)
    }
  }

  async cleanupOldSessions(daysOld = 30) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const result = await ChatHistory.deleteMany({
        updatedAt: { $lt: cutoffDate }
      })

      return result.deletedCount
    } catch (error) {
      throw new Error(`Error cleaning up old sessions: ${error.message}`)
    }
  }
}

module.exports = ChatHistoryRepository

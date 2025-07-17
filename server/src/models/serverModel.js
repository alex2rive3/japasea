class ServerModel {
  constructor() {
    this.data = {
      serverInfo: {
        name: 'Japasea Server',
        version: '1.0.0',
        startTime: new Date().toISOString()
      },
      stats: {
        requests: 0,
        errors: 0,
        uptime: 0
      }
    }
  }
  
  getServerInfo() {
    return this.data.serverInfo
  }
  
  incrementRequestCount() {
    this.data.stats.requests++
  }
  
  incrementErrorCount() {
    this.data.stats.errors++
  }
  
  getStats() {
    this.data.stats.uptime = process.uptime()
    return this.data.stats
  }
  
  getAllData() {
    return {
      ...this.data,
      timestamp: new Date().toISOString()
    }
  }
}

let instance = null

class ServerModelSingleton {
  static getInstance() {
    if (!instance) {
      instance = new ServerModel()
    }
    return instance
  }
}

module.exports = ServerModelSingleton

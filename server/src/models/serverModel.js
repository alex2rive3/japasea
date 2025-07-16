// Modelo de ejemplo para la estructura MVC
// Este es un modelo simple sin base de datos por ahora

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
  
  // Obtener información del servidor
  getServerInfo() {
    return this.data.serverInfo
  }
  
  // Incrementar contador de requests
  incrementRequestCount() {
    this.data.stats.requests++
  }
  
  // Incrementar contador de errores
  incrementErrorCount() {
    this.data.stats.errors++
  }
  
  // Obtener estadísticas
  getStats() {
    this.data.stats.uptime = process.uptime()
    return this.data.stats
  }
  
  // Obtener todos los datos
  getAllData() {
    return {
      ...this.data,
      timestamp: new Date().toISOString()
    }
  }
}

// Singleton pattern para mantener una sola instancia
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

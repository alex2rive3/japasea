const mongoose = require('mongoose')
const config = require('./config')

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI)
    
    console.log(`MongoDB conectado: ${conn.connection.host}`)
    
    mongoose.connection.on('error', (err) => {
      console.error('Error de conexión MongoDB:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado')
    })
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('Conexión MongoDB cerrada debido a terminación de aplicación')
      process.exit(0)
    })
    
  } catch (error) {
    console.error('Error conectando a MongoDB:', error)
    process.exit(1)
  }
}

module.exports = connectDatabase

const mongoose = require('mongoose')
require('dotenv').config()

const connectDatabase = require('../src/config/database')
const User = require('../src/models/userModel')

const seedUsers = async () => {
  try {
    await connectDatabase()
    
    console.log('🌱 Iniciando seed de usuarios...')
    
    // Limpiar usuarios existentes (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await User.deleteMany({})
      console.log('🗑️  Usuarios existentes eliminados')
    }
    
    // Crear usuarios de prueba
    const testUsers = [
      {
        name: 'Admin Usuario',
        email: 'admin@japasea.com',
        password: 'Admin123',
        role: 'admin',
        phone: '+595987654321',
        isEmailVerified: true
      },
      {
        name: 'Usuario de Prueba',
        email: 'usuario@japasea.com',
        password: 'Usuario123',
        role: 'user',
        phone: '+595987654322',
        isEmailVerified: true
      },
      {
        name: 'María González',
        email: 'maria@ejemplo.com',
        password: 'Maria123',
        role: 'user',
        phone: '+595987654323'
      },
      {
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        password: 'Juan123',
        role: 'user',
        phone: '+595987654324'
      }
    ]
    
    const createdUsers = await User.create(testUsers)
    
    console.log(`✅ ${createdUsers.length} usuarios creados exitosamente:`)
    createdUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Rol: ${user.role}`)
    })
    
    console.log('\n📧 Credenciales de acceso:')
    console.log('Admin: admin@japasea.com / Admin123')
    console.log('Usuario: usuario@japasea.com / Usuario123')
    
  } catch (error) {
    console.error('❌ Error en seed:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Conexión cerrada')
    process.exit(0)
  }
}

const clearUsers = async () => {
  try {
    await connectDatabase()
    
    console.log('🧹 Limpiando usuarios...')
    
    const result = await User.deleteMany({})
    console.log(`✅ ${result.deletedCount} usuarios eliminados`)
    
  } catch (error) {
    console.error('❌ Error limpiando usuarios:', error)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Conexión cerrada')
    process.exit(0)
  }
}

// Ejecutar el script basado en los argumentos
const command = process.argv[2]

switch (command) {
  case 'seed':
    seedUsers()
    break
  case 'clear':
    clearUsers()
    break
  default:
    console.log('\n🌱 Script de base de datos')
    console.log('Uso:')
    console.log('  npm run db:seed  - Crear usuarios de prueba')
    console.log('  npm run db:clear - Limpiar todos los usuarios')
    process.exit(0)
}

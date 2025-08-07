const mongoose = require('mongoose')
require('dotenv').config()

const connectDatabase = require('../src/config/database')
const User = require('../src/models/userModel')
const Place = require('../src/models/placeModel')
const Review = require('../src/models/reviewModel')
const ChatHistory = require('../src/models/chatHistoryModel')

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
}

const seedUsers = async () => {
  log.info('Iniciando seed de usuarios...')
  
  // Actualizar usuarios existentes sin campo status
  try {
    const usersWithoutStatus = await User.find({ status: { $exists: false } })
    if (usersWithoutStatus.length > 0) {
      log.warning(`Encontrados ${usersWithoutStatus.length} usuarios sin campo status. Actualizando...`)
      await User.updateMany(
        { status: { $exists: false } },
        { $set: { status: 'active' } }
      )
      log.success('Usuarios actualizados con status activo')
    }
  } catch (error) {
    log.error(`Error actualizando usuarios: ${error.message}`)
  }
  
  const testUsers = [
    {
      name: 'Admin Japasea',
      email: 'admin@japasea.com',
      password: 'Admin123!',
      role: 'admin',
      status: 'active',
      phone: '+595971234567',
      isEmailVerified: true,
      emailVerified: true,
      preferences: {
        language: 'es',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          newsletter: true
        }
      }
    },
    {
      name: 'Carlos Mendoza',
      email: 'carlos@ejemplo.com',
      password: 'Carlos123!',
      role: 'user',
      status: 'active',
      phone: '+595972345678',
      isEmailVerified: true,
      emailVerified: true,
      preferences: {
        language: 'es',
        theme: 'dark'
      }
    },
    {
      name: 'Ana López',
      email: 'ana@ejemplo.com',
      password: 'Ana123!',
      role: 'user',
      status: 'active',
      phone: '+595973456789',
      isEmailVerified: true,
      emailVerified: true,
      preferences: {
        language: 'es',
        theme: 'light'
      }
    },
    {
      name: 'Roberto Silva',
      email: 'roberto@ejemplo.com',
      password: 'Roberto123!',
      role: 'user',
      status: 'active',
      phone: '+595974567890',
      isEmailVerified: false,
      emailVerified: false
    },
    {
      name: 'Laura García',
      email: 'laura@ejemplo.com',
      password: 'Laura123!',
      role: 'user',
      status: 'active',
      phone: '+595975678901',
      isEmailVerified: true,
      emailVerified: true,
      preferences: {
        language: 'pt',
        theme: 'auto'
      }
    }
  ]
  
  const createdUsers = await User.create(testUsers)
  log.success(`${createdUsers.length} usuarios creados`)
  
  return createdUsers
}

const seedPlaces = async () => {
  log.info('Iniciando seed de lugares...')
  
  // Verificar si ya hay lugares
  const existingPlaces = await Place.find({})
  if (existingPlaces.length > 0) {
    log.info(`Ya existen ${existingPlaces.length} lugares en la base de datos`)
    return existingPlaces
  }
  
  // Si no hay lugares, intentar migrar desde el JSON
  try {
    const { exec } = require('child_process')
    const { promisify } = require('util')
    const execAsync = promisify(exec)
    
    log.info('Ejecutando migración de lugares desde places.json...')
    await execAsync('node scripts/migratePlacesToMongoDB.js', { cwd: process.cwd() })
    
    const places = await Place.find({})
    log.success(`${places.length} lugares migrados desde places.json`)
    return places
  } catch (error) {
    log.error('Error migrando lugares: ' + error.message)
    return []
  }
}

const seedReviews = async (users, places) => {
  log.info('Iniciando seed de reseñas...')
  
  if (!places.length || !users.length) {
    log.warning('No hay lugares o usuarios para crear reseñas')
    return []
  }
  
  // Limpiar reseñas antiguas con esquema incorrecto
  try {
    const oldReviews = await Review.find({ 
      $or: [
        { userId: { $exists: false } },
        { placeId: { $exists: false } }
      ]
    })
    if (oldReviews.length > 0) {
      log.warning(`Encontradas ${oldReviews.length} reseñas con esquema antiguo. Eliminando...`)
      await Review.deleteMany({ 
        $or: [
          { userId: { $exists: false } },
          { placeId: { $exists: false } }
        ]
      })
      log.success('Reseñas antiguas eliminadas')
    }
  } catch (error) {
    log.error(`Error limpiando reseñas antiguas: ${error.message}`)
  }
  
  const reviews = []
  const reviewTexts = [
    {
      title: 'Excelente lugar!',
      comment: 'Me encantó este lugar. La atención fue excelente y el ambiente muy agradable. Definitivamente volveré con mi familia.',
      rating: 5,
      visitType: 'familia'
    },
    {
      title: 'Muy buena experiencia',
      comment: 'Lugar muy recomendable. La comida estaba deliciosa y el precio justo. El único detalle es que tuvimos que esperar un poco.',
      rating: 4,
      visitType: 'pareja'
    },
    {
      title: 'Regular',
      comment: 'El lugar es bonito pero la atención podría mejorar. Los precios son un poco elevados para lo que ofrecen.',
      rating: 3,
      visitType: 'amigos'
    },
    {
      title: 'Increíble vista',
      comment: 'La vista desde este lugar es espectacular. Perfecto para tomar fotos. El servicio fue muy amable y atento.',
      rating: 5,
      visitType: 'solo'
    },
    {
      title: 'Buena opción',
      comment: 'Es un buen lugar para pasar el rato. La música en vivo fue genial. Recomiendo las bebidas especiales.',
      rating: 4,
      visitType: 'amigos'
    }
  ]
  
  // Crear reseñas para algunos lugares
  const placesToReview = places.slice(0, Math.min(15, places.length))
  const userIndexTracker = {} // Para evitar que un usuario revise el mismo lugar dos veces
  
  for (let i = 0; i < placesToReview.length; i++) {
    const place = placesToReview[i]
    const numReviews = Math.floor(Math.random() * 2) + 1 // 1-2 reseñas por lugar
    
    for (let j = 0; j < numReviews; j++) {
      // Encontrar un usuario que no haya revisado este lugar
      let user = null
      let attempts = 0
      while (!user && attempts < 10) {
        const userIndex = Math.floor(Math.random() * (users.length - 1)) + 1 // Excluir admin
        const candidateUser = users[userIndex]
        const key = `${candidateUser._id}-${place._id}`
        
        if (!userIndexTracker[key]) {
          user = candidateUser
          userIndexTracker[key] = true
        }
        attempts++
      }
      
      if (!user) continue // Si no encontramos un usuario disponible, saltar
      
      const reviewData = reviewTexts[Math.floor(Math.random() * reviewTexts.length)]
      
      try {
        const review = await Review.create({
          userId: user._id,
          placeId: place._id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          status: 'approved',
          helpful: Math.floor(Math.random() * 10),
          images: [],
          helpfulVotes: []
        })
        
        reviews.push(review)
        log.info(`Reseña creada para ${place.name} por ${user.name}`)
      } catch (error) {
        if (error.code === 11000) {
          log.warning(`Usuario ${user.name} ya tiene una reseña para ${place.name}`)
        } else {
          log.error(`Error creando reseña: ${error.message}`)
        }
      }
    }
  }
  
  log.success(`${reviews.length} reseñas creadas`)
  return reviews
}

const seedChatHistory = async (users, places) => {
  log.info('Iniciando seed de historial de chat...')
  
  if (!users.length) {
    log.warning('No hay usuarios para crear historiales de chat')
    return []
  }
  
  const chatHistories = []
  const chatExamples = [
    {
      userMessage: '¿Qué lugares recomiendan para comer asado?',
      botResponse: 'Te recomiendo estos excelentes lugares para disfrutar de un buen asado en Encarnación:',
      context: 'recomendaciones_gastronomia'
    },
    {
      userMessage: 'Quiero planear un fin de semana romántico',
      botResponse: 'He preparado un plan romántico perfecto para tu fin de semana en Encarnación:',
      context: 'planificacion_viaje'
    },
    {
      userMessage: '¿Cuáles son los mejores hoteles cerca de la playa?',
      botResponse: 'Aquí están los mejores hoteles con acceso a la playa en Encarnación:',
      context: 'alojamiento'
    },
    {
      userMessage: '¿Qué actividades hay para niños?',
      botResponse: 'Encarnación tiene muchas actividades divertidas para niños:',
      context: 'actividades_familiares'
    }
  ]
  
  // Crear historiales para algunos usuarios (excluyendo admin)
  const regularUsers = users.filter(u => u.role !== 'admin')
  
  for (const user of regularUsers.slice(0, 3)) {
    const numChats = Math.floor(Math.random() * 2) + 1 // 1-2 historiales por usuario
    
    for (let i = 0; i < numChats; i++) {
      const chatExample = chatExamples[Math.floor(Math.random() * chatExamples.length)]
      const sessionId = `session-${user._id}-${Date.now()}-${i}`
      
      // Seleccionar lugares aleatorios para la respuesta
      const recommendedPlaces = places
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(place => ({
          id: place._id.toString(),
          name: place.name,
          category: place.type,
          description: place.description,
          location: {
            lat: place.location.coordinates[1],
            lng: place.location.coordinates[0],
            address: place.address,
            city: 'Encarnación'
          },
          rating: place.rating?.average || 4.5,
          priceLevel: place.priceLevel || '$$'
        }))
      
      const chatHistory = await ChatHistory.create({
        user: user._id,
        sessionId,
        messages: [
          {
            text: chatExample.userMessage,
            sender: 'user',
            context: chatExample.context
          },
          {
            text: chatExample.botResponse,
            sender: 'bot',
            context: chatExample.context,
            response: {
              message: chatExample.botResponse,
              places: recommendedPlaces
            }
          }
        ],
        lastActivity: new Date()
      })
      
      chatHistories.push(chatHistory)
    }
  }
  
  log.success(`${chatHistories.length} historiales de chat creados`)
  return chatHistories
}

const seedFavorites = async (users, places) => {
  log.info('Iniciando seed de favoritos...')
  
  if (!users.length || !places.length) {
    log.warning('No hay usuarios o lugares para crear favoritos')
    return
  }
  
  let totalFavorites = 0
  const regularUsers = users.filter(u => u.role !== 'admin')
  
  for (const user of regularUsers) {
    const numFavorites = Math.floor(Math.random() * 5) + 1 // 1-5 favoritos por usuario
    const userPlaces = places
      .sort(() => 0.5 - Math.random())
      .slice(0, numFavorites)
    
    for (const place of userPlaces) {
      await user.addFavorite(place._id)
      totalFavorites++
    }
  }
  
  log.success(`${totalFavorites} favoritos creados`)
}

const seedSearchHistory = async (users) => {
  log.info('Iniciando seed de historial de búsquedas...')
  
  const searchQueries = [
    'restaurantes cerca de la costanera',
    'hoteles con piscina',
    'lugares turísticos',
    'cafeterías con wifi',
    'actividades para niños',
    'bares con música en vivo',
    'comida vegetariana',
    'playas encarnación',
    'shopping encarnación',
    'museos y cultura'
  ]
  
  let totalSearches = 0
  const regularUsers = users.filter(u => u.role !== 'admin')
  
  for (const user of regularUsers) {
    const numSearches = Math.floor(Math.random() * 3) + 1 // 1-3 búsquedas por usuario
    
    for (let i = 0; i < numSearches; i++) {
      const query = searchQueries[Math.floor(Math.random() * searchQueries.length)]
      await user.addSearchHistory(query, Math.floor(Math.random() * 10) + 1)
      totalSearches++
    }
  }
  
  log.success(`${totalSearches} búsquedas en historial creadas`)
}

const clearDatabase = async () => {
  log.warning('Limpiando base de datos...')
  
  await User.deleteMany({})
  await Review.deleteMany({})
  await ChatHistory.deleteMany({})
  
  log.success('Base de datos limpiada (excepto lugares)')
}

const seedDatabase = async () => {
  try {
    await connectDatabase()
    
    console.log('\n🌱 === INICIANDO SEED DE BASE DE DATOS ===\n')
    
    // Limpiar datos existentes (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await clearDatabase()
    }
    
    // Seed de usuarios
    const users = await seedUsers()
    
    // Seed de lugares (o cargar existentes)
    const places = await seedPlaces()
    
    // Seed de reseñas
    await seedReviews(users, places)
    
    // Seed de historiales de chat
    await seedChatHistory(users, places)
    
    // Seed de favoritos
    await seedFavorites(users, places)
    
    // Seed de historial de búsquedas
    await seedSearchHistory(users)
    
    console.log('\n📊 === RESUMEN ===')
    log.info(`Usuarios: ${users.length}`)
    log.info(`Lugares: ${places.length}`)
    log.info(`Reseñas: ${await Review.countDocuments()}`)
    log.info(`Historiales de chat: ${await ChatHistory.countDocuments()}`)
    
    console.log('\n🔐 === CREDENCIALES DE ACCESO ===')
    console.log('Admin: admin@japasea.com / Admin123!')
    console.log('Usuario: carlos@ejemplo.com / Carlos123!')
    console.log('Usuario: ana@ejemplo.com / Ana123!')
    
    console.log('\n✅ Seed completado exitosamente!\n')
    
  } catch (error) {
    log.error('Error en seed: ' + error.message)
    console.error(error)
  } finally {
    await mongoose.connection.close()
    log.info('Conexión cerrada')
    process.exit(0)
  }
}

const showStats = async () => {
  try {
    await connectDatabase()
    
    console.log('\n📊 === ESTADÍSTICAS DE LA BASE DE DATOS ===\n')
    
    const stats = {
      usuarios: await User.countDocuments(),
      lugares: await Place.countDocuments(),
      reseñas: await Review.countDocuments(),
      historiales: await ChatHistory.countDocuments(),
      admins: await User.countDocuments({ role: 'admin' }),
      usuariosVerificados: await User.countDocuments({ emailVerified: true })
    }
    
    Object.entries(stats).forEach(([key, value]) => {
      log.info(`${key}: ${value}`)
    })
    
  } catch (error) {
    log.error('Error obteniendo estadísticas: ' + error.message)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

// Ejecutar el script basado en los argumentos
const command = process.argv[2]

switch (command) {
  case 'seed':
    seedDatabase()
    break
  case 'clear':
    connectDatabase().then(async () => {
      await clearDatabase()
      log.success('Base de datos limpiada')
      process.exit(0)
    })
    break
  case 'stats':
    showStats()
    break
  default:
    console.log('\n🌱 Script de Seed de Base de Datos')
    console.log('================================')
    console.log('Uso:')
    console.log('  npm run db:seed   - Crear todos los datos de prueba')
    console.log('  npm run db:clear  - Limpiar base de datos (excepto lugares)')
    console.log('  npm run db:stats  - Mostrar estadísticas')
    console.log('\nNota: Los lugares se mantienen porque se migran desde places.json')
    process.exit(0)
}
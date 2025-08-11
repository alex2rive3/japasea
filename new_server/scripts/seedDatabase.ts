import mongoose, { Model } from 'mongoose'
import 'dotenv/config'
import * as bcrypt from 'bcryptjs'
import { exec as _exec } from 'child_process'
import { promisify } from 'util'
import { mongoConfig } from '../src/infrastructure/database/mongo.config'
import { User, UserSchema } from '../src/modules/users/domain/entities/user.entity'
import { Place, PlaceSchema } from '../src/modules/places/domain/entities/place.entity'
import { Review, ReviewSchema } from '../src/modules/reviews/domain/entities/review.entity'
import { ChatHistory, ChatHistorySchema } from '../src/modules/chat/domain/entities/chat-history.entity'
import { Favorite, FavoriteSchema } from '../src/modules/favorites/domain/entities/favorite.entity'

const exec = promisify(_exec)

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
}

const log = {
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
}

const UserModel: Model<User> = (mongoose.models.User as Model<User>) || mongoose.model<User>('User', UserSchema)
const PlaceModel: Model<Place> = (mongoose.models.Place as Model<Place>) || mongoose.model<Place>('Place', PlaceSchema)
const ReviewModel: Model<Review> = (mongoose.models.Review as Model<Review>) || mongoose.model<Review>('Review', ReviewSchema)
const ChatHistoryModel: Model<ChatHistory> = (mongoose.models.ChatHistory as Model<ChatHistory>) || mongoose.model<ChatHistory>('ChatHistory', ChatHistorySchema)
const FavoriteModel: Model<Favorite> = (mongoose.models.Favorite as Model<Favorite>) || mongoose.model<Favorite>('Favorite', FavoriteSchema)

async function connectDatabase() {
  const uri = process.env.MONGODB_URI || mongoConfig.uri
  const options: any = mongoConfig.options || {}
  await mongoose.connect(uri, options)
}

async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plain, salt)
}

async function seedUsers() {
  log.info('Iniciando seed de usuarios...')
  try {
    const usersWithoutStatus = await UserModel.find({ status: { $exists: false } })
    if (usersWithoutStatus.length > 0) {
      log.warning(`Encontrados ${usersWithoutStatus.length} usuarios sin campo status. Actualizando...`)
      await UserModel.updateMany({ status: { $exists: false } }, { $set: { status: 'active' } })
      log.success('Usuarios actualizados con status activo')
    }
  } catch (error: any) {
    log.error(`Error actualizando usuarios: ${error.message}`)
  }

  const testUsers: any[] = [
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
        notifications: { email: true, push: true, newsletter: true },
        searchHistory: true
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
      preferences: { language: 'es', theme: 'dark', notifications: { email: true, push: true, newsletter: false }, searchHistory: true }
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
      preferences: { language: 'es', theme: 'light', notifications: { email: true, push: true, newsletter: false }, searchHistory: true }
    },
    {
      name: 'Roberto Silva',
      email: 'roberto@ejemplo.com',
      password: 'Roberto123!',
      role: 'user',
      status: 'active',
      phone: '+595974567890',
      isEmailVerified: false,
      emailVerified: false,
      preferences: { language: 'es', theme: 'light', notifications: { email: true, push: true, newsletter: false }, searchHistory: true }
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
      preferences: { language: 'pt', theme: 'auto', notifications: { email: true, push: true, newsletter: false }, searchHistory: true }
    }
  ]

  for (const u of testUsers) {
    u.password = await hashPassword(u.password)
  }

  const createdUsers = await UserModel.create(testUsers)
  log.success(`${createdUsers.length} usuarios creados`)
  return createdUsers
}

async function seedPlaces() {
  log.info('Iniciando seed de lugares...')
  const existingPlaces = await PlaceModel.find({})
  if (existingPlaces.length > 0) {
    log.info(`Ya existen ${existingPlaces.length} lugares en la base de datos`)
    return existingPlaces
  }
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const placesPath = path.resolve(__dirname, '../places.json')
    const raw = await fs.readFile(placesPath, 'utf8')
    const data = JSON.parse(raw) as Array<any>
    const docs = data.map(p => ({
      key: p.key,
      name: p.key,
      description: p.description || '',
      type: p.type,
      location: { type: 'Point', coordinates: [p.location.lng, p.location.lat] },
      address: p.address,
      contact: {},
      amenities: [],
      images: [],
      businessHours: [],
      rating: { average: 0, count: 0 },
      pricing: { level: 2, currency: 'PYG' },
      features: [],
      tags: [],
      status: 'active',
      metadata: { views: 0, likes: 0, bookmarks: 0, verified: false, featured: false, lastUpdated: new Date() }
    }))
    if (docs.length) {
      await (PlaceModel as any).insertMany(docs, { ordered: false })
    }
    const places = await PlaceModel.find({})
    log.success(`${places.length} lugares insertados desde places.json`)
    return places
  } catch (error: any) {
    log.error('Error cargando lugares: ' + error.message)
    return []
  }
}

async function seedReviews(users: any[], places: any[]) {
  log.info('Iniciando seed de reseñas...')
  if (!places.length || !users.length) {
    log.warning('No hay lugares o usuarios para crear reseñas')
    return []
  }
  try {
    const oldReviews = await ReviewModel.find({ $or: [{ userId: { $exists: false } }, { placeId: { $exists: false } }] })
    if (oldReviews.length > 0) {
      log.warning(`Encontradas ${oldReviews.length} reseñas con esquema antiguo. Eliminando...`)
      await ReviewModel.deleteMany({ $or: [{ userId: { $exists: false } }, { placeId: { $exists: false } }] })
      log.success('Reseñas antiguas eliminadas')
    }
  } catch (error: any) {
    log.error(`Error limpiando reseñas antiguas: ${error.message}`)
  }

  const reviews: any[] = []
  const reviewTexts = [
    { title: 'Excelente lugar!', comment: 'Me encantó este lugar. La atención fue excelente y el ambiente muy agradable. Definitivamente volveré con mi familia.', rating: 5, visitType: 'familia' },
    { title: 'Muy buena experiencia', comment: 'Lugar muy recomendable. La comida estaba deliciosa y el precio justo. El único detalle es que tuvimos que esperar un poco.', rating: 4, visitType: 'pareja' },
    { title: 'Regular', comment: 'El lugar es bonito pero la atención podría mejorar. Los precios son un poco elevados para lo que ofrecen.', rating: 3, visitType: 'amigos' },
    { title: 'Increíble vista', comment: 'La vista desde este lugar es espectacular. Perfecto para tomar fotos. El servicio fue muy amable y atento.', rating: 5, visitType: 'solo' },
    { title: 'Buena opción', comment: 'Es un buen lugar para pasar el rato. La música en vivo fue genial. Recomiendo las bebidas especiales.', rating: 4, visitType: 'amigos' }
  ]

  const placesToReview = places.slice(0, Math.min(15, places.length))
  const userIndexTracker: Record<string, boolean> = {}

  for (let i = 0; i < placesToReview.length; i++) {
    const place = placesToReview[i]
    const numReviews = Math.floor(Math.random() * 2) + 1
    for (let j = 0; j < numReviews; j++) {
      let user: any = null
      let attempts = 0
      while (!user && attempts < 10) {
        const userIndex = Math.floor(Math.random() * (users.length - 1)) + 1
        const candidateUser = users[userIndex]
        const key = `${candidateUser._id}-${place._id}`
        if (!userIndexTracker[key]) {
          user = candidateUser
          userIndexTracker[key] = true
        }
        attempts++
      }
      if (!user) continue
      const reviewData = reviewTexts[Math.floor(Math.random() * reviewTexts.length)]
      try {
        const review = await ReviewModel.create({
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
      } catch (error: any) {
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

async function seedChatHistory(users: any[], places: any[]) {
  log.info('Iniciando seed de historial de chat...')
  if (!users.length) {
    log.warning('No hay usuarios para crear historiales de chat')
    return []
  }
  const chatHistories: any[] = []
  const chatExamples = [
    { userMessage: '¿Qué lugares recomiendan para comer asado?', botResponse: 'Te recomiendo estos excelentes lugares para disfrutar de un buen asado en Encarnación:', context: 'recomendaciones_gastronomia' },
    { userMessage: 'Quiero planear un fin de semana romántico', botResponse: 'He preparado un plan romántico perfecto para tu fin de semana en Encarnación:', context: 'planificacion_viaje' },
    { userMessage: '¿Cuáles son los mejores hoteles cerca de la playa?', botResponse: 'Aquí están los mejores hoteles con acceso a la playa en Encarnación:', context: 'alojamiento' },
    { userMessage: '¿Qué actividades hay para niños?', botResponse: 'Encarnación tiene muchas actividades divertidas para niños:', context: 'actividades_familiares' }
  ]
  const regularUsers = users.filter(u => u.role !== 'admin')
  for (const user of regularUsers.slice(0, 3)) {
    const numChats = Math.floor(Math.random() * 2) + 1
    for (let i = 0; i < numChats; i++) {
      const chatExample = chatExamples[Math.floor(Math.random() * chatExamples.length)]
      const sessionId = `session-${user._id}-${Date.now()}-${i}`
      const recommendedPlaces = places
        .slice()
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((place: any) => ({
          id: place._id.toString(),
          name: place.name,
          category: place.type,
          description: place.description,
          location: {
            lat: place.location?.coordinates?.[1],
            lng: place.location?.coordinates?.[0],
            address: place.address,
            city: 'Encarnación'
          },
          rating: place.rating?.average || 4.5,
          priceLevel: place.pricing?.level ? '$'.repeat(place.pricing.level) : '$$'
        }))
      const chatHistory = await ChatHistoryModel.create({
        user: user._id,
        sessionId,
        messages: [
          { text: chatExample.userMessage, sender: 'user', context: chatExample.context },
          { text: chatExample.botResponse, sender: 'bot', context: chatExample.context, response: { message: chatExample.botResponse, places: recommendedPlaces } }
        ],
        lastActivity: new Date()
      })
      chatHistories.push(chatHistory)
    }
  }
  log.success(`${chatHistories.length} historiales de chat creados`)
  return chatHistories
}

async function seedFavorites(users: any[], places: any[]) {
  log.info('Iniciando seed de favoritos...')
  if (!users.length || !places.length) {
    log.warning('No hay usuarios o lugares para crear favoritos')
    return
  }
  let totalFavorites = 0
  const regularUsers = users.filter(u => u.role !== 'admin')
  for (const user of regularUsers) {
    const numFavorites = Math.floor(Math.random() * 5) + 1
    const userPlaces = places.slice().sort(() => 0.5 - Math.random()).slice(0, numFavorites)
    for (const place of userPlaces) {
      try {
        await FavoriteModel.create({ userId: user._id, placeId: place._id, addedAt: new Date() })
        totalFavorites++
      } catch (error: any) {
        if (error.code !== 11000) log.error(`Error creando favorito: ${error.message}`)
      }
    }
  }
  log.success(`${totalFavorites} favoritos creados`)
}

async function seedSearchHistory(users: any[]) {
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
    const numSearches = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < numSearches; i++) {
      const query = searchQueries[Math.floor(Math.random() * searchQueries.length)]
      await UserModel.updateOne(
        { _id: user._id },
        { $push: { searchHistory: { query, searchedAt: new Date(), resultsCount: Math.floor(Math.random() * 10) + 1 } } }
      )
      totalSearches++
    }
  }
  log.success(`${totalSearches} búsquedas en historial creadas`)
}

async function clearDatabase() {
  log.warning('Limpiando base de datos...')
  await UserModel.deleteMany({})
  await ReviewModel.deleteMany({})
  await ChatHistoryModel.deleteMany({})
  log.success('Base de datos limpiada (excepto lugares)')
}

async function seedDatabase() {
  try {
    await connectDatabase()
    console.log('\n🌱 === INICIANDO SEED DE BASE DE DATOS ===\n')
    if (process.env.NODE_ENV === 'development') {
      await clearDatabase()
    }
    const users = await seedUsers()
    const places = await seedPlaces()
    await seedReviews(users, places)
    await seedChatHistory(users, places)
    await seedFavorites(users, places)
    await seedSearchHistory(users)
    console.log('\n📊 === RESUMEN ===')
    log.info(`Usuarios: ${await UserModel.countDocuments()}`)
    log.info(`Lugares: ${await PlaceModel.countDocuments()}`)
    log.info(`Reseñas: ${await ReviewModel.countDocuments()}`)
    log.info(`Historiales de chat: ${await ChatHistoryModel.countDocuments()}`)
    console.log('\n🔐 === CREDENCIALES DE ACCESO ===')
    console.log('Admin: admin@japasea.com / Admin123!')
    console.log('Usuario: carlos@ejemplo.com / Carlos123!')
    console.log('Usuario: ana@ejemplo.com / Ana123!')
    console.log('\n✅ Seed completado exitosamente!\n')
  } catch (error: any) {
    log.error('Error en seed: ' + error.message)
    console.error(error)
  } finally {
    await mongoose.connection.close()
    log.info('Conexión cerrada')
    process.exit(0)
  }
}

async function showStats() {
  try {
    await connectDatabase()
    console.log('\n📊 === ESTADÍSTICAS DE LA BASE DE DATOS ===\n')
    const stats = {
      usuarios: await UserModel.countDocuments(),
      lugares: await PlaceModel.countDocuments(),
      reseñas: await ReviewModel.countDocuments(),
      historiales: await ChatHistoryModel.countDocuments(),
      admins: await UserModel.countDocuments({ role: 'admin' }),
      usuariosVerificados: await UserModel.countDocuments({ emailVerified: true })
    }
    Object.entries(stats).forEach(([key, value]) => {
      log.info(`${key}: ${value}`)
    })
  } catch (error: any) {
    log.error('Error obteniendo estadísticas: ' + error.message)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

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

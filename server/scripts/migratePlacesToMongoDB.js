require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs').promises
const path = require('path')
const Place = require('../src/models/placeModel')

// Función para extraer información de contacto de la descripción
function extractContact(description) {
  const contact = {}
  
  // Extraer teléfono
  const phoneRegex = /(\d{4}\s?\d{3}\s?\d{3}|\d{3}\s?\d{3}\s?\d{3})/g
  const phoneMatch = description.match(phoneRegex)
  if (phoneMatch) {
    contact.phone = phoneMatch[0]
  }
  
  // Extraer WhatsApp
  const whatsappRegex = /whatsapp:?\s*([\d\s\-\+]+)/i
  const whatsappMatch = description.match(whatsappRegex)
  if (whatsappMatch) {
    contact.whatsapp = whatsappMatch[1].trim()
  }
  
  // Extraer email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  const emailMatch = description.match(emailRegex)
  if (emailMatch) {
    contact.email = emailMatch[0]
  }
  
  return contact
}

// Función para extraer amenidades y características
function extractFeatures(description) {
  const features = []
  const amenities = []
  
  // Palabras clave para amenidades
  const amenityKeywords = [
    'wifi', 'estacionamiento', 'aire acondicionado', 'piscina', 'desayuno',
    'pet friendly', 'accesible', 'terraza', 'jardín', 'bar', 'música en vivo'
  ]
  
  const descLower = description.toLowerCase()
  amenityKeywords.forEach(keyword => {
    if (descLower.includes(keyword)) {
      amenities.push(keyword)
    }
  })
  
  // Extraer características especiales
  if (descLower.includes('vista al río')) features.push('Vista al río')
  if (descLower.includes('cocina internacional')) features.push('Cocina internacional')
  if (descLower.includes('vegetariano')) features.push('Opciones vegetarianas')
  if (descLower.includes('delivery')) features.push('Delivery disponible')
  
  return { features, amenities }
}

// Función para generar horarios por defecto según el tipo
function getDefaultHours(type) {
  const defaultHours = {
    'Alojamiento': [
      { day: 0, open: '00:00', close: '23:59' },
      { day: 1, open: '00:00', close: '23:59' },
      { day: 2, open: '00:00', close: '23:59' },
      { day: 3, open: '00:00', close: '23:59' },
      { day: 4, open: '00:00', close: '23:59' },
      { day: 5, open: '00:00', close: '23:59' },
      { day: 6, open: '00:00', close: '23:59' }
    ],
    'Gastronomía': [
      { day: 0, open: '11:00', close: '23:00' }, // Domingo
      { day: 1, open: '11:00', close: '23:00' },
      { day: 2, open: '11:00', close: '23:00' },
      { day: 3, open: '11:00', close: '23:00' },
      { day: 4, open: '11:00', close: '23:00' },
      { day: 5, open: '11:00', close: '00:00' }, // Viernes
      { day: 6, open: '11:00', close: '00:00' }  // Sábado
    ],
    'Desayunos y meriendas': [
      { day: 0, open: '07:00', close: '20:00' },
      { day: 1, open: '07:00', close: '20:00' },
      { day: 2, open: '07:00', close: '20:00' },
      { day: 3, open: '07:00', close: '20:00' },
      { day: 4, open: '07:00', close: '20:00' },
      { day: 5, open: '07:00', close: '21:00' },
      { day: 6, open: '07:00', close: '21:00' }
    ],
    'Turístico': [
      { day: 0, open: '08:00', close: '18:00' },
      { day: 1, open: '08:00', close: '18:00' },
      { day: 2, open: '08:00', close: '18:00' },
      { day: 3, open: '08:00', close: '18:00' },
      { day: 4, open: '08:00', close: '18:00' },
      { day: 5, open: '08:00', close: '18:00' },
      { day: 6, open: '08:00', close: '18:00' }
    ],
    'Compras': [
      { day: 0, open: '09:00', close: '13:00' }, // Domingo horario reducido
      { day: 1, open: '08:00', close: '20:00' },
      { day: 2, open: '08:00', close: '20:00' },
      { day: 3, open: '08:00', close: '20:00' },
      { day: 4, open: '08:00', close: '20:00' },
      { day: 5, open: '08:00', close: '20:00' },
      { day: 6, open: '08:00', close: '20:00' }
    ]
  }
  
  return defaultHours[type] || defaultHours['Turístico']
}

// Función para obtener imagen por defecto según tipo
function getDefaultImage(type) {
  const images = {
    'Alojamiento': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'Gastronomía': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'Turístico': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73aeb?w=800',
    'Compras': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    'Desayunos y meriendas': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    'Entretenimiento': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'
  }
  
  return images[type] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
}

// Función para estimar nivel de precio
function estimatePriceLevel(place) {
  const desc = place.description.toLowerCase()
  if (desc.includes('económico') || desc.includes('barato')) return 1
  if (desc.includes('premium') || desc.includes('exclusivo') || desc.includes('lujo')) return 4
  if (desc.includes('ejecutivo') || desc.includes('business')) return 3
  return 2 // Por defecto nivel medio
}

// Función para generar tags
function generateTags(place) {
  const tags = []
  const desc = place.description.toLowerCase()
  
  // Tags por tipo
  if (place.type === 'Alojamiento') {
    if (desc.includes('hotel')) tags.push('hotel')
    if (desc.includes('hostel')) tags.push('hostel')
    if (desc.includes('posada')) tags.push('posada')
  }
  
  if (place.type === 'Gastronomía' || place.type === 'Comida') {
    if (desc.includes('pizza')) tags.push('pizza')
    if (desc.includes('parrilla')) tags.push('parrilla')
    if (desc.includes('sushi')) tags.push('sushi')
    if (desc.includes('pasta')) tags.push('pasta')
    if (desc.includes('asado')) tags.push('asado')
  }
  
  // Tags generales
  if (desc.includes('familiar')) tags.push('familiar')
  if (desc.includes('romántico')) tags.push('romántico')
  if (desc.includes('moderno')) tags.push('moderno')
  if (desc.includes('tradicional')) tags.push('tradicional')
  if (desc.includes('24 horas')) tags.push('24-horas')
  
  return tags
}

async function migratePlaces() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/japasea', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Conectado a MongoDB')
    
    // Leer archivo places.json
    const placesPath = path.join(__dirname, '../places.json')
    const placesData = await fs.readFile(placesPath, 'utf8')
    const places = JSON.parse(placesData)
    console.log(`📄 Leídos ${places.length} lugares de places.json`)
    
    // Limpiar colección existente (opcional)
    const existingCount = await Place.countDocuments()
    if (existingCount > 0) {
      console.log(`⚠️  Encontrados ${existingCount} lugares existentes en la base de datos`)
      const answer = process.argv[2]
      if (answer !== '--force') {
        console.log('Usa --force para sobrescribir los datos existentes')
        process.exit(0)
      }
      await Place.deleteMany({})
      console.log('🗑️  Datos existentes eliminados')
    }
    
    // Transformar y migrar datos
    const transformedPlaces = []
    const errors = []
    
    for (const place of places) {
      try {
        const contact = extractContact(place.description)
        const { features, amenities } = extractFeatures(place.description)
        const tags = generateTags(place)
        
        const transformedPlace = {
          key: place.key,
          name: place.key, // Usar key como nombre por ahora
          description: place.description,
          type: place.type,
          location: {
            type: 'Point',
            coordinates: [place.location.lng, place.location.lat]
          },
          address: place.address,
          contact: {
            phone: contact.phone,
            email: contact.email,
            whatsapp: contact.whatsapp || contact.phone,
            social: {}
          },
          amenities: amenities,
          features: features,
          tags: tags,
          images: [{
            url: getDefaultImage(place.type),
            caption: `Vista de ${place.key}`,
            isPrimary: true
          }],
          businessHours: getDefaultHours(place.type),
          pricing: {
            level: estimatePriceLevel(place),
            currency: 'PYG'
          },
          rating: {
            average: 0,
            count: 0
          },
          status: 'active',
          metadata: {
            views: 0,
            likes: 0,
            bookmarks: 0,
            verified: false,
            featured: false
          }
        }
        
        transformedPlaces.push(transformedPlace)
      } catch (error) {
        errors.push({ place: place.key, error: error.message })
      }
    }
    
    console.log(`✨ Transformados ${transformedPlaces.length} lugares correctamente`)
    if (errors.length > 0) {
      console.log(`❌ Errores en ${errors.length} lugares:`)
      errors.forEach(e => console.log(`   - ${e.place}: ${e.error}`))
    }
    
    // Insertar en lotes
    const batchSize = 50
    let inserted = 0
    
    for (let i = 0; i < transformedPlaces.length; i += batchSize) {
      const batch = transformedPlaces.slice(i, i + batchSize)
      try {
        const result = await Place.insertMany(batch, { ordered: false })
        inserted += result.length
        console.log(`📥 Insertados ${inserted}/${transformedPlaces.length} lugares...`)
      } catch (error) {
        console.error(`❌ Error en lote ${i/batchSize + 1}:`, error.message)
        // Continuar con el siguiente lote
      }
    }
    
    // Verificar migración
    const finalCount = await Place.countDocuments()
    console.log(`\n✅ Migración completada: ${finalCount} lugares en MongoDB`)
    
    // Mostrar algunos ejemplos
    const examples = await Place.find().limit(3)
    console.log('\n📋 Ejemplos de lugares migrados:')
    examples.forEach(place => {
      console.log(`   - ${place.name} (${place.type}) - ${place.address}`)
    })
    
    // Crear índices adicionales si es necesario
    console.log('\n🔧 Creando índices...')
    await Place.createIndexes()
    console.log('✅ Índices creados')
    
  } catch (error) {
    console.error('❌ Error en la migración:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n👋 Desconectado de MongoDB')
  }
}

// Ejecutar migración
migratePlaces()
  .then(() => {
    console.log('\n🎉 Proceso de migración finalizado')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Error fatal:', error)
    process.exit(1)
  })
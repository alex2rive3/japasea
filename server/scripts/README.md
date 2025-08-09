# Scripts de Base de Datos

Esta carpeta contiene scripts para gestionar la base de datos de Japasea.

## Scripts Disponibles

### 1. Seed de Base de Datos (`seedDatabase.js`)

Script completo para poblar la base de datos con datos de prueba realistas.

#### Comandos:

```bash
# Poblar la base de datos con todos los datos de prueba
npm run db:seed

# Limpiar la base de datos (excepto lugares)
npm run db:clear

# Ver estadísticas de la base de datos
npm run db:stats
```

#### Datos que genera:

1. **Usuarios (5)**:
   - 1 administrador
   - 4 usuarios regulares
   - Con preferencias y configuraciones variadas

2. **Lugares (39)**:
   - Se mantienen los existentes o se migran desde `places.json`
   - Incluye hoteles, restaurantes, lugares turísticos, etc.

3. **Reseñas**:
   - Entre 1-3 reseñas por lugar (para los primeros 10 lugares)
   - Con calificaciones detalladas (servicio, calidad, ambiente, etc.)
   - Fechas de visita realistas (últimos 90 días)

4. **Historial de Chat**:
   - 1-2 conversaciones por usuario
   - Con contexto y lugares recomendados
   - Simula interacciones reales con el chatbot

5. **Favoritos**:
   - 1-5 lugares favoritos por usuario
   - Actualiza contadores en los lugares

6. **Historial de Búsquedas**:
   - 1-3 búsquedas por usuario
   - Queries realistas de turistas

#### Credenciales de Acceso:

Después de ejecutar el seed, puedes usar estas credenciales:

- **Admin**: admin@japasea.com / Admin123!
- **Usuario 1**: carlos@ejemplo.com / Carlos123!
- **Usuario 2**: ana@ejemplo.com / Ana123!

### 2. Migración de Lugares (`migratePlacesToMongoDB.js`)

Migra los lugares desde el archivo `places.json` a MongoDB.

```bash
npm run migrate:places
```

## Características del Seed

### Datos Realistas
- Nombres y datos coherentes en español
- Fechas y tiempos realistas
- Relaciones consistentes entre modelos

### Inteligente
- No duplica datos si ya existen
- Maneja errores gracefully
- Proporciona feedback visual con colores

### Configurable
- Solo limpia datos en modo desarrollo
- Mantiene los lugares existentes
- Respeta las restricciones únicas

## Estructura de Datos

### Modelo User
```javascript
{
  name: String,
  email: String,
  password: String (hasheada),
  role: 'user' | 'admin',
  isEmailVerified: Boolean,
  preferences: {
    language: 'es' | 'pt' | 'en',
    theme: 'light' | 'dark' | 'auto',
    notifications: Object
  },
  favorites: Array,
  searchHistory: Array
}
```

### Modelo Review
```javascript
{
  place: ObjectId,
  user: ObjectId,
  rating: 1-5,
  title: String,
  comment: String,
  visitDate: Date,
  visitType: String,
  aspects: {
    service: 1-5,
    quality: 1-5,
    ambience: 1-5,
    value: 1-5,
    cleanliness: 1-5
  }
}
```

### Modelo ChatHistory
```javascript
{
  user: ObjectId,
  sessionId: String,
  messages: [{
    text: String,
    sender: 'user' | 'bot',
    context: String,
    response: Object (para mensajes del bot)
  }],
  lastActivity: Date
}
```

## Notas Importantes

1. **Modo Desarrollo**: El script solo limpia datos existentes si `NODE_ENV=development`

2. **Lugares**: Los lugares nunca se eliminan con `db:clear`, ya que se consideran datos principales

3. **Performance**: El seed puede tardar unos segundos dependiendo de la cantidad de datos

4. **Idempotencia**: Puedes ejecutar el seed múltiples veces sin problemas

## Troubleshooting

### Error: "Duplicate key error"
- Esto ocurre cuando intentas crear un dato que ya existe
- Solución: Ejecuta `npm run db:clear` antes de `npm run db:seed`

### Error: "MongoDB connection failed"
- Verifica que MongoDB esté ejecutándose
- Revisa las variables de entorno en `.env`

### Warning: "Duplicate schema index"
- Es un warning inofensivo de Mongoose
- No afecta la funcionalidad

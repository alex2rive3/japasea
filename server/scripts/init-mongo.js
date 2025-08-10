// Script de inicialización de MongoDB para Docker
// Este script se ejecuta cuando se crea la base de datos por primera vez

// Cambiar a la base de datos japasea_db
db = db.getSiblingDB('japasea_db');

// Crear un usuario para la aplicación
db.createUser({
  user: 'japasea_user',
  pwd: 'japasea_password',
  roles: [
    {
      role: 'readWrite',
      db: 'japasea_db'
    }
  ]
});

// Crear colecciones iniciales con índices
db.createCollection('users');
db.createCollection('places');
db.createCollection('reviews');
db.createCollection('favorites');
db.createCollection('chathistories');
db.createCollection('audits');
db.createCollection('settings');

// Crear índices para optimizar consultas
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.places.createIndex({ "location": "2dsphere" });
db.places.createIndex({ "name": "text", "description": "text" });
db.reviews.createIndex({ "place": 1 });
db.reviews.createIndex({ "user": 1 });
db.favorites.createIndex({ "user": 1, "place": 1 }, { unique: true });
db.chathistories.createIndex({ "user": 1 });
db.audits.createIndex({ "timestamp": 1 });

print('Base de datos japasea_db inicializada correctamente');

# Guía de Docker Compose para Japasea

Esta guía explica cómo usar Docker Compose para el desarrollo de la aplicación Japasea.

## Prerrequisitos

- Docker Desktop instalado
- Docker Compose (incluido con Docker Desktop)

## Estructura de servicios

El docker-compose.yml incluye los siguientes servicios:

- **mongodb**: Base de datos MongoDB 7.0
- **server**: Servidor Node.js/Express (puerto 3001)
- **client**: Cliente React/Vite (puerto 5173)
- **mongo-express**: Interfaz web para MongoDB (puerto 8081)

## Configuración inicial

### 1. Configurar variables de entorno

Para el servidor:
```bash
cd server
cp env.example .env
# Editar .env con tus configuraciones
```

Para el cliente:
```bash
cd client
cp env.example .env
# Editar .env con tus configuraciones
```

### 2. Iniciar los servicios

Desde la raíz del proyecto:

```bash
# Construir e iniciar todos los servicios
docker-compose up --build

# Para ejecutar en segundo plano
docker-compose up -d --build
```

### 3. Verificar que los servicios estén funcionando

- Cliente React: http://localhost:5173
- Servidor API: http://localhost:3001
- Mongo Express: http://localhost:8081
- MongoDB: localhost:27017

## Comandos útiles

### Gestión de servicios

```bash
# Ver el estado de los servicios
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs server
docker-compose logs client

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart server
```

### Desarrollo

```bash
# Reconstruir un servicio específico
docker-compose build server
docker-compose build client

# Ejecutar comandos en un contenedor
docker-compose exec server npm run test
docker-compose exec server npm run db:seed

# Acceder al shell de un contenedor
docker-compose exec server sh
docker-compose exec mongodb mongosh
```

### Base de datos

```bash
# Hacer seed de la base de datos
docker-compose exec server npm run db:seed

# Limpiar la base de datos
docker-compose exec server npm run db:clear

# Ver estadísticas de la base de datos
docker-compose exec server npm run db:stats

# Conectar directamente a MongoDB
docker-compose exec mongodb mongosh -u admin -p adminpassword --authenticationDatabase admin
```

## Configuración de red

Los servicios están conectados a través de una red Docker llamada `japasea-network`. Esto permite que:

- El servidor se conecte a MongoDB usando `mongodb:27017`
- El cliente puede hacer peticiones al servidor
- Mongo Express puede acceder a MongoDB

## Volúmenes

- **mongodb_data**: Persiste los datos de MongoDB
- **Bind mounts**: Para hot reload en desarrollo
  - `./server:/app` (servidor)
  - `./client:/app` (cliente)

## Troubleshooting

### MongoDB no se conecta

1. Verificar que el contenedor de MongoDB esté corriendo:
   ```bash
   docker-compose ps mongodb
   ```

2. Verificar los logs:
   ```bash
   docker-compose logs mongodb
   ```

3. Reiniciar MongoDB:
   ```bash
   docker-compose restart mongodb
   ```

### Hot reload no funciona

1. Verificar que los volúmenes estén montados correctamente
2. En Windows, asegurarse de que Docker Desktop tenga permisos de archivos
3. Reiniciar el servicio:
   ```bash
   docker-compose restart client
   # o
   docker-compose restart server
   ```

### Puerto ocupado

Si recibes errores de puerto ocupado:

```bash
# Cambiar puertos en docker-compose.yml
# Por ejemplo, cambiar "5173:5173" a "5174:5173"
```

### Limpiar completamente

Para empezar de cero:

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Producción

Para producción, crea un `docker-compose.prod.yml` separado con:

- Variables de entorno de producción
- Configuraciones de seguridad
- Proxy reverso (nginx)
- Certificados SSL

## Tips de desarrollo

1. **Logs en tiempo real**: `docker-compose logs -f`
2. **Reinicio automático**: Los contenedores se reinician automáticamente si fallan
3. **Persistencia de datos**: Los datos de MongoDB se mantienen entre reinicios
4. **Variables de entorno**: Usa archivos `.env` para configuraciones locales

## Puertos expuestos

| Servicio | Puerto Host | Puerto Contenedor | Descripción |
|----------|-------------|-------------------|-------------|
| client   | 5173        | 5173              | Cliente React/Vite |
| server   | 3001        | 3001              | API Node.js |
| mongodb  | 27017       | 27017             | Base de datos MongoDB |
| mongo-express | 8081   | 8081              | Interfaz web MongoDB |

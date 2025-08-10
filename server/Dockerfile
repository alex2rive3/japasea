# Dockerfile para el servidor Node.js
FROM node:18-alpine

# Instalar dumb-init para el manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear directorio de trabajo
WORKDIR /app

# Cambiar al usuario node por seguridad
USER node

# Copiar archivos de dependencias
COPY --chown=node:node package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar el código fuente
COPY --chown=node:node . .

# Exponer el puerto
EXPOSE 3001

# Comando para desarrollo con hot reload
CMD ["dumb-init", "npm", "run", "dev"]

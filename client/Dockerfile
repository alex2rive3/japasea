# Dockerfile para el cliente React/Vite
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
RUN npm ci && npm cache clean --force

# Copiar el código fuente
COPY --chown=node:node . .

# Exponer el puerto de Vite
EXPOSE 5173

# Comando para desarrollo con hot reload
CMD ["dumb-init", "npm", "run", "dev", "--", "--host", "0.0.0.0"]

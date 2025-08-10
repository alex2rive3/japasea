# Makefile para Japasea - Comandos de Docker Compose

.PHONY: help build up down restart logs clean seed test

# Mostrar ayuda
help:
	@echo "Comandos disponibles para Japasea:"
	@echo "  make build     - Construir todas las imágenes"
	@echo "  make up        - Iniciar todos los servicios"
	@echo "  make down      - Detener todos los servicios"
	@echo "  make restart   - Reiniciar todos los servicios"
	@echo "  make logs      - Ver logs de todos los servicios"
	@echo "  make clean     - Limpiar contenedores y volúmenes"
	@echo "  make seed      - Hacer seed de la base de datos"
	@echo "  make test      - Ejecutar tests del servidor"
	@echo "  make mongo     - Conectar a MongoDB"
	@echo "  make shell-server - Shell del contenedor servidor"
	@echo "  make shell-client - Shell del contenedor cliente"

# Construir todas las imágenes
build:
	docker-compose build

# Iniciar todos los servicios
up:
	docker-compose up -d

# Iniciar con construcción
up-build:
	docker-compose up -d --build

# Detener todos los servicios
down:
	docker-compose down

# Reiniciar todos los servicios
restart:
	docker-compose restart

# Ver logs de todos los servicios
logs:
	docker-compose logs -f

# Ver logs del servidor
logs-server:
	docker-compose logs -f server

# Ver logs del cliente
logs-client:
	docker-compose logs -f client

# Limpiar contenedores y volúmenes
clean:
	docker-compose down -v
	docker system prune -f

# Hacer seed de la base de datos
seed:
	docker-compose exec server npm run db:seed

# Limpiar base de datos
clear-db:
	docker-compose exec server npm run db:clear

# Ejecutar tests del servidor
test:
	docker-compose exec server npm test

# Conectar a MongoDB
mongo:
	docker-compose exec mongodb mongosh -u admin -p adminpassword --authenticationDatabase admin

# Shell del contenedor servidor
shell-server:
	docker-compose exec server sh

# Shell del contenedor cliente
shell-client:
	docker-compose exec client sh

# Estado de los servicios
status:
	docker-compose ps

# Reiniciar solo el servidor
restart-server:
	docker-compose restart server

# Reiniciar solo el cliente
restart-client:
	docker-compose restart client

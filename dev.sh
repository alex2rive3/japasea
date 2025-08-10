#!/bin/bash

# Script de desarrollo para Japasea
# Facilita el uso de Docker Compose para desarrollo

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log() {
    echo -e "${BLUE}[JAPASEA]${NC} $1"
}

success() {
    echo -e "${GREEN}[JAPASEA]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[JAPASEA]${NC} $1"
}

error() {
    echo -e "${RED}[JAPASEA]${NC} $1"
}

# Verificar si Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado. Por favor instala Docker Desktop."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose no está disponible."
        exit 1
    fi
}

# Configurar archivos de entorno
setup_env() {
    log "Configurando archivos de entorno..."
    
    # Servidor
    if [ ! -f "server/.env" ]; then
        if [ -f "server/env.example" ]; then
            cp server/env.example server/.env
            success "Creado server/.env desde env.example"
        else
            warning "No se encontró server/env.example"
        fi
    else
        warning "server/.env ya existe"
    fi
    
    # Cliente
    if [ ! -f "client/.env" ]; then
        if [ -f "client/env.example" ]; then
            cp client/env.example client/.env
            success "Creado client/.env desde env.example"
        else
            warning "No se encontró client/env.example"
        fi
    else
        warning "client/.env ya existe"
    fi
}

# Iniciar servicios
start() {
    log "Iniciando servicios de Japasea..."
    docker-compose up -d --build
    success "Servicios iniciados!"
    show_status
}

# Detener servicios
stop() {
    log "Deteniendo servicios..."
    docker-compose down
    success "Servicios detenidos!"
}

# Mostrar estado
show_status() {
    log "Estado de los servicios:"
    docker-compose ps
    echo ""
    log "URLs disponibles:"
    echo "  - Cliente: http://localhost:5173"
    echo "  - Servidor: http://localhost:3001"
    echo "  - Mongo Express: http://localhost:8081"
}

# Mostrar logs
show_logs() {
    log "Mostrando logs... (Ctrl+C para salir)"
    docker-compose logs -f
}

# Hacer seed de la base de datos
seed_db() {
    log "Haciendo seed de la base de datos..."
    docker-compose exec server npm run db:seed
    success "Base de datos inicializada!"
}

# Limpiar todo
clean() {
    warning "Esto eliminará todos los contenedores y volúmenes. ¿Continuar? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        log "Limpiando contenedores y volúmenes..."
        docker-compose down -v
        docker system prune -f
        success "Limpieza completada!"
    else
        log "Limpieza cancelada."
    fi
}

# Ejecutar tests
run_tests() {
    log "Ejecutando tests del servidor..."
    docker-compose exec server npm test
}

# Mostrar ayuda
show_help() {
    echo "Script de desarrollo para Japasea"
    echo ""
    echo "Uso: ./dev.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  setup     - Configurar archivos de entorno"
    echo "  start     - Iniciar todos los servicios"
    echo "  stop      - Detener todos los servicios"
    echo "  restart   - Reiniciar todos los servicios"
    echo "  status    - Mostrar estado de los servicios"
    echo "  logs      - Mostrar logs en tiempo real"
    echo "  seed      - Hacer seed de la base de datos"
    echo "  test      - Ejecutar tests"
    echo "  clean     - Limpiar contenedores y volúmenes"
    echo "  help      - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./dev.sh setup     # Configurar por primera vez"
    echo "  ./dev.sh start     # Iniciar desarrollo"
    echo "  ./dev.sh logs      # Ver logs"
    echo "  ./dev.sh seed      # Inicializar base de datos"
}

# Función principal
main() {
    check_docker
    
    case "${1:-help}" in
        setup)
            setup_env
            ;;
        start)
            start
            ;;
        stop)
            stop
            ;;
        restart)
            stop
            start
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs
            ;;
        seed)
            seed_db
            ;;
        test)
            run_tests
            ;;
        clean)
            clean
            ;;
        help|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal
main "$@"

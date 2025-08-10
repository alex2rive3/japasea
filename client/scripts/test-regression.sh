#!/bin/bash

# Scripts para ejecutar tests de regresión de API
# Casos de uso comunes para el equipo de desarrollo

echo "🧪 Scripts de Tests de Regresión de API - Japasea"
echo "================================================="

case "$1" in
  "mock")
    echo "🎭 Ejecutando tests con mocks (desarrollo local)"
    echo "Útil para: verificar tests rápidamente sin backend"
    echo ""
    npm test src/__tests__/integration/api.regression.test.js -- --no-coverage
    ;;
    
  "backend")
    echo "🌐 Ejecutando tests con backend real"
    echo "Útil para: validar antes de hacer deploy"
    echo "Requiere: Backend ejecutándose en http://localhost:3001"
    echo ""
    USE_REAL_BACKEND=true npm test src/__tests__/integration/api.regression.test.js -- --no-coverage
    ;;
    
  "staging")
    echo "🚀 Ejecutando tests contra staging"
    echo "Útil para: validar después de deploy a staging"
    echo "Requiere: Backend staging disponible"
    echo ""
    USE_REAL_BACKEND=true VITE_API_URL=https://api-staging.japasea.com npm test src/__tests__/integration/api.regression.test.js -- --no-coverage
    ;;
    
  "update")
    echo "📸 Actualizando snapshots intencionalmente"
    echo "Útil para: cuando se hace cambio intencional en API"
    echo "⚠️  CUIDADO: Solo usar cuando el cambio es intencional"
    echo ""
    UPDATE_SNAPSHOTS=true npm test src/__tests__/integration/api.regression.test.js -- --no-coverage
    ;;
    
  "update-staging")
    echo "📸 Actualizando snapshots desde staging"
    echo "Útil para: sincronizar snapshots con versión de staging"
    echo ""
    USE_REAL_BACKEND=true VITE_API_URL=https://api-staging.japasea.com UPDATE_SNAPSHOTS=true npm test src/__tests__/integration/api.regression.test.js -- --no-coverage
    ;;
    
  "ci")
    echo "🤖 Modo CI/CD - Tests de regresión automatizados"
    echo "Útil para: pipeline de CI que verifica regresiones"
    echo ""
    # En CI normalmente usamos mocks para ser más rápidos y estables
    npm test src/__tests__/integration/api.regression.test.js -- --no-coverage --passWithNoTests
    ;;
    
  "watch")
    echo "👀 Modo watch - Ejecutar tests continuamente"
    echo "Útil para: desarrollo activo"
    echo ""
    npm test src/__tests__/integration/api.regression.test.js -- --no-coverage --watch
    ;;
    
  "help"|*)
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  mock         - Ejecutar con mocks (rápido, no requiere backend)"
    echo "  backend      - Ejecutar con backend local real"
    echo "  staging      - Ejecutar con backend de staging"
    echo "  update       - Actualizar snapshots intencionalmente"
    echo "  update-staging - Actualizar snapshots desde staging"
    echo "  ci           - Modo para CI/CD"
    echo "  watch        - Modo watch para desarrollo"
    echo "  help         - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 mock                    # Tests rápidos con mocks"
    echo "  $0 backend                 # Validar con backend local"
    echo "  $0 staging                 # Validar staging"
    echo "  $0 update                  # Actualizar snapshots"
    echo ""
    echo "Variables de entorno opcionales:"
    echo "  VITE_API_URL              - URL del backend (default: http://localhost:3001)"
    echo "  USE_REAL_BACKEND          - true/false (default: false)"
    echo "  UPDATE_SNAPSHOTS          - true/false (default: false)"
    echo ""
    echo "Archivos generados:"
    echo "  src/__tests__/snapshots/  - Snapshots de respuestas guardadas"
    echo ""
    ;;
esac

#!/bin/bash

# Japasea Migration Status Script

echo "🗾 JAPASEA - Estado de Migración NestJS"
echo "============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check current directory
if [ ! -f "package.json" ]; then
    echo "❌ Este script debe ejecutarse desde el directorio new_server"
    exit 1
fi

echo "${GREEN}✅ COMPLETADO${NC}"
echo "├── 📦 Configuración NestJS"
echo "├── 🏗️  Arquitectura Clean"
echo "├── 🔧 Infraestructura (Logging, DB)"
echo "├── 👥 Módulo Users (100%)"
echo "├── 📍 Entidad Places"
echo "├── ⭐ Entidad Reviews"
echo "├── 📄 Documentación"
echo "└── ⚙️  Scripts de setup"
echo ""

echo "${YELLOW}🔄 EN PROGRESO${NC}"
echo "├── 📍 Módulo Places (Use Cases + Controller)"
echo "├── ⭐ Módulo Reviews (Use Cases + Controller)"
echo "└── 🔐 Módulo Auth (Pendiente)"
echo ""

echo "${RED}📝 PENDIENTE${NC}"
echo "├── 👨‍💼 Módulo Admin"
echo "├── ❤️  Módulo Favorites"
echo "├── 💬 Módulo Chat"
echo "├── 🛡️  Guards y Middleware"
echo "├── 📧 Email Service"
echo "├── 🧪 Testing"
echo "└── 📊 Performance optimizations"
echo ""

echo "${BLUE}📊 ESTADÍSTICAS${NC}"
echo "├── Progreso total: 35%"
echo "├── Módulos completados: 1/6"
echo "├── Entidades migradas: 3/6"
echo "└── Archivos creados: ~40"
echo ""

echo "${BLUE}🚀 PRÓXIMOS PASOS${NC}"
echo ""
echo "1. Instalar dependencias:"
echo "   ${GREEN}npm install${NC}"
echo ""
echo "2. Configurar environment:"
echo "   ${GREEN}cp .env.example .env${NC}"
echo "   ${GREEN}# Editar .env con tu configuración${NC}"
echo ""
echo "3. Completar módulo Auth:"
echo "   ${GREEN}# Implementar AuthController y AuthService${NC}"
echo ""
echo "4. Completar módulo Places:"
echo "   ${GREEN}# Implementar PlacesController y Use Cases${NC}"
echo ""
echo "5. Ejecutar aplicación:"
echo "   ${GREEN}npm run start:dev${NC}"
echo ""

echo "📚 Documentación detallada en:"
echo "   - README.md"
echo "   - MIGRATION_STATUS.md"
echo ""

echo "🌐 Una vez ejecutándose:"
echo "   - API: http://localhost:3001"
echo "   - Swagger Docs: http://localhost:3001/api/docs"
echo ""

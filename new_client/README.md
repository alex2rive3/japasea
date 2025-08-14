# Japasea 2.0 - Cliente Refactorizado

## 🚀 Nueva Arquitectura con Redux Toolkit + Features

Este es el cliente refactorizado de Japasea con una arquitectura moderna basada en features y Redux Toolkit.

### 🛠 Tecnologías

- **React 19** - UI Framework
- **TypeScript** - Tipado estático
- **Redux Toolkit** - Gestión de estado
- **Material-UI v7** - Componentes UI
- **React Router DOM** - Enrutamiento
- **Vite** - Build tool y dev server
- **React Leaflet** - Mapas interactivos
- **i18next** - Internacionalización

### 📁 Estructura del Proyecto

```
src/
├── app/                 # Configuración de Redux Store
├── shared/              # Código compartido entre features
│   ├── components/      # Componentes reutilizables
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilidades
│   ├── types/           # Tipos globales
│   └── api/             # Configuración de API
├── features/            # Features de la aplicación
│   ├── auth/            # Autenticación
│   ├── places/          # Lugares
│   ├── reviews/         # Reseñas
│   ├── favorites/       # Favoritos
│   ├── chat/            # Chat
│   └── admin/           # Administración
└── pages/               # Páginas principales
```

### 📋 Estado de Migración

#### ✅ Fase 1: Configuración Base (COMPLETADA)
- [x] Estructura de carpetas creada
- [x] Redux Toolkit configurado
- [x] TypeScript configurado
- [x] Vite configurado
- [x] Dependencias instaladas

#### ⏳ Próximas Fases
- [ ] Fase 2: Shared/Core
- [ ] Fase 3: Feature Auth
- [ ] Fase 4: Feature Places
- [ ] Fase 5: Features adicionales
- [ ] Fase 6: Pages y Routing
- [ ] Fase 7: Testing y Optimización

### 🔄 Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

### 🎯 Próximos Pasos

1. Instalar dependencias: `npm install`
2. Migrar tipos compartidos a `/shared/types/`
3. Configurar API base en `/shared/api/`
4. Implementar feature Auth con Redux slice
5. Migrar componentes uno por uno

---

*Migración en progreso - Ver [REFACTORING_PLAN.md](../REFACTORING_PLAN.md) para más detalles*

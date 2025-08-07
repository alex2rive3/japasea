# Guía del Panel de Administración - Japasea

## Acceso al Panel

### URL de Acceso
- **Desarrollo**: http://localhost:5173/admin
- **Producción**: https://tudominio.com/admin

### Credenciales de Admin (Desarrollo)
```
Email: admin@japasea.com
Contraseña: Admin123!
```

### Requisitos
- Cuenta con rol `admin`
- Email verificado
- Sesión activa

## Navegación Principal

El panel de administración cuenta con un menú lateral con las siguientes secciones:

### 1. Dashboard (`/admin`)
Panel principal con información resumida del sistema.

**Características:**
- 📊 KPIs en tiempo real
- ⚠️ Alertas de acciones pendientes
- 🚀 Accesos rápidos a secciones importantes
- 📈 Resumen de estadísticas

**Métricas mostradas:**
- Total de usuarios (activos/inactivos)
- Total de lugares (por estado)
- Reseñas pendientes de moderación
- Lugares destacados

### 2. Lugares (`/admin/places`)
Gestión completa de lugares en la plataforma.

**Funcionalidades:**
- ➕ **Crear lugar**: Agregar nuevos lugares al sistema
- ✏️ **Editar**: Modificar información existente
- 🔍 **Búsqueda**: Por nombre, tipo o estado
- 🏷️ **Filtros**: Por categoría y estado
- ✅ **Verificar**: Marcar lugares como verificados
- ⭐ **Destacar**: Promocionar lugares en la página principal
- 🔄 **Cambiar estado**: Active/Inactive/Pending/Seasonal

**Operaciones Masivas:**
1. Seleccionar múltiples lugares con checkbox
2. Acciones disponibles:
   - Verificar seleccionados
   - Activar seleccionados
   - Eliminar seleccionados

**Campos del formulario:**
- Key (identificador único)
- Nombre
- Descripción
- Tipo (categoría)
- Dirección
- Coordenadas (lat/lng)
- Estado

### 3. Usuarios (`/admin/users`)
Administración de usuarios registrados.

**Funcionalidades:**
- 👥 **Listado completo** con paginación
- 🔍 **Búsqueda** por nombre o email
- 🎭 **Cambio de rol** (user ↔ admin)
- 🚫 **Suspender/Activar** cuentas
- 🗑️ **Eliminar** usuarios
- 📊 **Ver actividad**: Último acceso

**Filtros disponibles:**
- Por rol (Usuario/Administrador)
- Por estado (Activo/Suspendido)
- Por verificación de email

**Información mostrada:**
- Avatar y nombre
- Email
- Teléfono
- Rol actual
- Estado de la cuenta
- Email verificado (Sí/No)
- Último acceso

### 4. Reseñas (`/admin/reviews`)
Moderación de reseñas de usuarios.

**Funcionalidades:**
- 📝 **Moderación** de contenido
- ✅ **Aprobar** reseñas pendientes
- ❌ **Rechazar** con razón
- 🗑️ **Eliminar** contenido inapropiado
- 👁️ **Ver detalles** completos
- 🚩 **Reseñas reportadas** destacadas

**Estados de reseñas:**
- `Pendiente`: Esperando moderación
- `Aprobada`: Visible públicamente
- `Rechazada`: No visible

**Información mostrada:**
- Usuario autor
- Lugar reseñado
- Calificación (estrellas)
- Comentario
- Fecha de creación
- Estado actual

### 5. Estadísticas (`/admin/stats`)
Análisis de datos del sistema.

**Métricas disponibles:**
- 📊 Total por tipo de lugar
- 📈 Estados de recursos
- 🗓️ Tendencias temporales
- 👥 Actividad de usuarios

**Visualización:**
- Tarjetas con contadores
- Porcentajes de distribución
- Comparativas

### 6. Auditoría (`/admin/audit`)
Registro detallado de todas las acciones.

**Características:**
- 📜 **Historial completo** de acciones
- 🔍 **Filtros avanzados**:
  - Por rango de fechas
  - Por tipo de acción
  - Por recurso afectado
  - Por usuario
- 💾 **Exportar a CSV**
- 🌐 **Tracking de IP**

**Información registrada:**
- Fecha y hora
- Usuario que realizó la acción
- Tipo de acción (crear/actualizar/eliminar)
- Recurso afectado
- Detalles adicionales
- Dirección IP

### 7. Configuración (`/admin/settings`)
Configuración general del sistema.

**Secciones:**

#### General
- Nombre del sitio
- Descripción
- Email de contacto
- Teléfono de soporte
- Idioma predeterminado
- Zona horaria

#### Características
- ✅ Habilitar/deshabilitar registro
- 📧 Requerir verificación de email
- ⭐ Sistema de reseñas
- 💬 Chat con IA
- ❤️ Sistema de favoritos

#### Notificaciones
- 📧 Email
- 📱 Push notifications
- 💬 SMS
- Configurar remitente

#### Seguridad
- 🔐 Intentos máximos de login
- ⏱️ Tiempo de sesión
- 🔑 Políticas de contraseña
- 🛡️ Autenticación 2FA

#### Pagos
- 💳 Habilitar pagos
- 🏪 Pasarela (Stripe/PayPal/MercadoPago)
- 💱 Moneda (PYG/USD)
- 💰 Comisión sobre transacciones

## Sistema de Notificaciones

### Ubicación
Icono de campana en la barra superior del panel admin.

### Funcionalidades
- 🔔 **Contador** de no leídas
- 📝 **Lista** de notificaciones recientes
- ✅ **Marcar como leída**
- 🗑️ **Eliminar** notificaciones
- 📤 **Enviar notificación masiva**

### Tipos de notificaciones
- `info`: Información general
- `warning`: Advertencias
- `error`: Errores o problemas
- `success`: Acciones completadas

### Envío masivo
1. Click en "Enviar" en el panel de notificaciones
2. Completar:
   - Título
   - Mensaje
   - Tipo
   - Destinatarios (todos/activos)
3. Confirmar envío

## Operaciones Comunes

### Crear un nuevo lugar
1. Ir a `/admin/places`
2. Click en "Nuevo lugar"
3. Completar formulario
4. Guardar

### Moderar una reseña
1. Ir a `/admin/reviews`
2. Filtrar por "Pendientes"
3. Revisar contenido
4. Aprobar ✅ o Rechazar ❌

### Cambiar rol de usuario
1. Ir a `/admin/users`
2. Buscar usuario
3. Click en editar (✏️)
4. Seleccionar nuevo rol
5. Confirmar

### Exportar datos
1. Ir a `/admin/audit`
2. Aplicar filtros deseados
3. Click en exportar (⬇️)
4. Archivo CSV se descargará

## Atajos de Teclado

- `Ctrl + S`: Guardar cambios en formularios
- `Esc`: Cerrar diálogos
- `Ctrl + F`: Enfocar búsqueda

## Buenas Prácticas

### Seguridad
1. 🔐 Cambiar contraseña regularmente
2. 🚪 Cerrar sesión al terminar
3. 👥 Limitar usuarios admin
4. 📋 Revisar logs de auditoría

### Moderación
1. 👀 Revisar contenido diariamente
2. 📝 Documentar razones de rechazo
3. ⚡ Responder rápido a reportes
4. 🎯 Ser consistente en criterios

### Mantenimiento
1. 🗑️ Limpiar datos antiguos
2. 📊 Monitorear estadísticas
3. 🔄 Actualizar información regular
4. 💾 Hacer backups frecuentes

## Troubleshooting

### No puedo acceder al panel
- Verificar rol de admin en BD
- Limpiar caché del navegador
- Verificar token válido

### Las acciones no se guardan
- Verificar conexión a internet
- Revisar consola del navegador
- Verificar permisos en backend

### Datos no se actualizan
- Refrescar página (F5)
- Limpiar filtros
- Verificar estado del servidor

## Contacto y Soporte

Para problemas técnicos o dudas:
- 📧 Email: soporte@japasea.com
- 📱 WhatsApp: +595 xxx xxx xxx
- 📚 Documentación: /docs

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025

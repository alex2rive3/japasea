# 🛠️ Guía de Administración - Japasea

## 📋 Índice

1. [Introducción](#introducción)
2. [Acceso al Panel](#acceso-al-panel)
3. [Dashboard Principal](#dashboard-principal)
4. [Gestión de Lugares](#gestión-de-lugares)
5. [Gestión de Usuarios](#gestión-de-usuarios)
6. [Moderación de Reseñas](#moderación-de-reseñas)
7. [Estadísticas](#estadísticas)
8. [Registro de Auditoría](#registro-de-auditoría)
9. [Configuración del Sistema](#configuración-del-sistema)
10. [Mejores Prácticas](#mejores-prácticas)

## 🎯 Introducción

El Panel de Administración de Japasea proporciona herramientas completas para gestionar la plataforma. Esta guía te ayudará a utilizar todas las funcionalidades disponibles de manera efectiva.

## 🔐 Acceso al Panel

### Credenciales de Administrador
- **URL**: `https://tudominio.com/admin`
- **Email**: admin@japasea.com
- **Contraseña**: [Proporcionada por el equipo de desarrollo]

### Proceso de Login
1. Navega a la página de login
2. Ingresa tus credenciales de administrador
3. Serás redirigido automáticamente a `/admin`

### Navegación del Panel
El panel cuenta con un menú lateral con las siguientes secciones:
- 📊 Dashboard
- 📍 Lugares
- 👥 Usuarios
- ⭐ Reseñas
- 📈 Estadísticas
- 🔍 Auditoría
- ⚙️ Configuración

## 📊 Dashboard Principal

El dashboard muestra un resumen en tiempo real del estado de la plataforma:

### Métricas Principales
- **Total de Usuarios**: Usuarios registrados en la plataforma
- **Usuarios Activos**: Usuarios que han iniciado sesión recientemente
- **Total de Lugares**: Todos los lugares en la base de datos
- **Lugares Pendientes**: Lugares esperando aprobación
- **Reseñas Pendientes**: Reseñas esperando moderación

### Gráficos Interactivos
1. **Distribución por Tipo**: Gráfico circular mostrando tipos de lugares
2. **Estados de Lugares**: Distribución de lugares activos/pendientes/inactivos
3. **Actividad Semanal**: Tendencia de los últimos 7 días

### Acciones Rápidas
- Ver lugares pendientes de aprobación
- Moderar reseñas pendientes
- Acceder a usuarios nuevos

## 📍 Gestión de Lugares

### Listado de Lugares
- **Búsqueda**: Por nombre, dirección o descripción
- **Filtros**: 
  - Por tipo (restaurante, hotel, etc.)
  - Por estado (activo, pendiente, inactivo)
  - Por verificación
  - Por destacados

### Acciones Individuales
- **Ver Detalles**: Información completa del lugar
- **Editar**: Modificar cualquier campo
- **Cambiar Estado**: Activar/desactivar lugares
- **Verificar**: Marcar como lugar verificado
- **Destacar**: Promocionar en la página principal
- **Eliminar**: Remover permanentemente

### Operaciones Masivas
1. Selecciona múltiples lugares con los checkboxes
2. Elige una acción del menú desplegable:
   - Activar todos
   - Desactivar todos
   - Verificar todos
   - Eliminar seleccionados

### Crear Nuevo Lugar
1. Click en "Agregar Lugar"
2. Completa el formulario:
   - Información básica (nombre, tipo, descripción)
   - Ubicación (dirección, coordenadas)
   - Contacto (teléfono, email, website)
   - Horarios de atención
   - Fotos y galería
3. Guardar como borrador o publicar directamente

## 👥 Gestión de Usuarios

### Vista General
La tabla de usuarios muestra:
- Avatar y nombre
- Email
- Teléfono
- Rol (Usuario/Admin)
- Estado (Activo/Suspendido)
- Email verificado
- Último acceso

### Filtros Disponibles
- **Búsqueda**: Por nombre, email o teléfono
- **Por Rol**: Usuarios normales o administradores
- **Por Estado**: Activos, suspendidos o eliminados

### Acciones de Usuario
- **Cambiar Rol**: Promover a admin o degradar a usuario
- **Suspender**: Bloquear temporalmente el acceso
- **Activar**: Restaurar acceso a usuarios suspendidos
- **Eliminar**: Eliminar cuenta permanentemente
- **Ver Detalles**: Historial completo del usuario

### Exportar Usuarios
1. Click en "Exportar"
2. Selecciona formato (CSV/Excel)
3. Elige campos a incluir
4. Descargar archivo

## ⭐ Moderación de Reseñas

### Estados de Reseñas
- **Pendientes**: Nuevas reseñas esperando revisión
- **Aprobadas**: Reseñas visibles públicamente
- **Rechazadas**: Reseñas que no cumplen las políticas

### Proceso de Moderación
1. Revisar contenido de la reseña
2. Verificar que cumple las políticas:
   - Sin lenguaje ofensivo
   - Información relevante
   - No spam o publicidad
3. Acciones disponibles:
   - ✅ Aprobar
   - ❌ Rechazar (con motivo)
   - 🗑️ Eliminar

### Filtros de Reseñas
- Por estado (pendiente/aprobada/rechazada)
- Por lugar específico
- Por usuario
- Por calificación
- Por fecha

## 📈 Estadísticas

### Estadísticas Generales
- KPIs principales con tendencias
- Comparación con períodos anteriores
- Métricas de crecimiento

### Gráficos Disponibles
1. **Tendencias Mensuales**: Evolución de usuarios, lugares y reseñas
2. **Distribución por Categoría**: Tipos de lugares más populares
3. **Rendimiento por Categoría**: Comparación objetivo vs actual
4. **Crecimiento Anual**: Progreso mes a mes

### Filtros de Tiempo
- Últimos 7 días
- Último mes
- Últimos 3 meses
- Último año
- Rango personalizado

### Exportar Reportes
- Generar PDF con gráficos
- Exportar datos en CSV
- Programar reportes automáticos

## 🔍 Registro de Auditoría

### Información Registrada
- Fecha y hora de cada acción
- Usuario que realizó la acción
- Tipo de acción (crear, editar, eliminar)
- Recurso afectado (usuario, lugar, reseña)
- Detalles específicos

### Filtros de Búsqueda
- Por usuario
- Por tipo de acción
- Por recurso
- Por rango de fechas

### Uso de Auditoría
- Investigar cambios no autorizados
- Seguimiento de actividad administrativa
- Cumplimiento y compliance
- Resolución de disputas

### Exportar Logs
1. Aplicar filtros deseados
2. Click en "Exportar"
3. Seleccionar formato y período
4. Descargar archivo

## ⚙️ Configuración del Sistema

### Configuración General
- **Nombre del Sitio**: Título de la plataforma
- **Descripción**: Meta descripción para SEO
- **Email de Contacto**: Para notificaciones del sistema
- **Teléfono de Soporte**: Visible en la plataforma

### Características
- Habilitar/deshabilitar registro de usuarios
- Activar sistema de reseñas
- Requerir verificación de email
- Habilitar chat de soporte
- Modo mantenimiento

### Notificaciones
- Configurar emails automáticos
- Notificaciones de nuevos usuarios
- Alertas de reseñas pendientes
- Resumen diario/semanal

### Seguridad
- Intentos máximos de login
- Duración de sesiones
- Requisitos de contraseña
- Autenticación de dos factores
- IPs bloqueadas

### Integración de Pagos
- Configurar pasarelas de pago
- Comisiones y tarifas
- Monedas aceptadas
- Métodos de pago

## 💡 Mejores Prácticas

### Seguridad
1. **Contraseñas Fuertes**: Usa contraseñas únicas y complejas
2. **Cierre de Sesión**: Siempre cierra sesión al terminar
3. **Verificación**: Verifica cambios importantes antes de aplicar
4. **Backups**: Realiza respaldos antes de cambios masivos

### Moderación
1. **Consistencia**: Aplica las mismas reglas a todos
2. **Documentación**: Registra motivos de rechazo
3. **Comunicación**: Informa a usuarios sobre cambios
4. **Revisión Regular**: Revisa contenido pendiente diariamente

### Gestión de Datos
1. **Validación**: Verifica información antes de aprobar
2. **Actualización**: Mantén datos actualizados
3. **Limpieza**: Elimina contenido duplicado o spam
4. **Organización**: Usa categorías y etiquetas consistentes

### Monitoreo
1. **Dashboard Diario**: Revisa métricas principales
2. **Alertas**: Configura notificaciones importantes
3. **Tendencias**: Identifica patrones anormales
4. **Reportes**: Genera informes periódicos

## 🚨 Solución de Problemas

### Login Fallido
- Verifica credenciales correctas
- Limpia caché del navegador
- Verifica que tu cuenta esté activa

### Datos No Se Actualizan
- Refresca la página (F5)
- Verifica conexión a internet
- Contacta soporte técnico

### Errores al Guardar
- Verifica campos requeridos
- Revisa formato de datos
- Intenta en otro navegador

## 📞 Soporte

Para asistencia adicional:
- **Email**: soporte@japasea.com
- **Documentación**: [docs.japasea.com](https://docs.japasea.com)
- **Chat**: Disponible en horario laboral

---

**Última actualización**: Enero 2025
**Versión**: 2.0
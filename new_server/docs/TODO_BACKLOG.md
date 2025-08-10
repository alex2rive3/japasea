# TODO Backlog - Japasea

Este documento consolida tareas pendientes detectadas en el código (etiqueta TODO) y mejoras propuestas. Sirve como fuente única para priorización.

## Tareas Técnicas Pendientes

### Docker y DevOps ✅ Completado
- ✅ Configuración completa de Docker Compose
- ✅ Dockerfiles optimizados para desarrollo
- ✅ Scripts de automatización (dev.sh, Makefile)
- ✅ Documentación de Docker

### Desarrollo Pendiente

## Mejoras propuestas (prioridad)

### Alta
- Recomendaciones: priorizar verificados/destacados
  - Orden sugerido: metadata.featured desc, metadata.verified desc, rating.average desc, metadata.views desc.
  - Aplicar en getPlaces, searchPlaces, getRandomPlaces y fuente de datos del chat.
  - Evaluar índice compuesto para soportar el orden.

- Dashboard: porcentajes reales (no simulados)
  - Usar trends.last12Months del backend para variación m/m.
  - Ocultar porcentaje si no hay datos previos.

- AdminPlaces: robustez por id
  - Absolutamente todas las respuestas deben tener el _id y loggear anomalías de datos.

### Media
- Endpoints de stats por rango (usuarios y reseñas)
  - /admin/stats/users y /admin/stats/reviews con startDate, endDate y facets por estado.

- Cards Admin con imagen de portada y “Ver en mapa”
  - Reutilizar heurística de PlaceCards para default images por tipo.

- Moderación de reseñas
  - Vista con filtros por estado y lugar, y acciones rápidas desde dashboard.

### Baja
- Paginación/Infinite Scroll en AdminPlaces según tamaño de dataset.
- Auditoría ampliada para acciones admin (verify, feature, status, create/update).
- Tests: unit/integration para adminController.getStats y placesController.

## Notas técnicas
- Estados de lugares: active, inactive, pending, seasonal (ver seasonalInfo en el modelo).
- Seguridad admin: authenticateToken + requireRole('admin') en rutas.
- Versionado: cliente usa ApiClient con VITE_API_VERSION.

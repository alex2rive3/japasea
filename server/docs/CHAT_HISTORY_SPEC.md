### Especificación: Guardado y Recuperación del Historial de Chat (planes de viaje y lugares)

#### Objetivo
Garantizar que el historial de chat se guarde y recupere íntegramente, preservando exactamente lo que el bot respondió en su momento:
- Si la respuesta es un plan de viaje multi-día, se almacena completo en `response.travelPlan` (con todos los días, actividades y lugares como objetos).
- Si la respuesta es una recomendación simple, se almacena en `response.places` (lista de lugares como objetos).
- Un historial/sesión puede contener mensajes de ambos tipos; el cliente debe renderizar en base al contenido disponible por mensaje.

#### Alcance
- Backend (API y modelo) y Frontend (renderizado de mensajes del historial).
- Endpoints: `POST /api/v1/chat`, `GET /api/v1/chat/history`, `GET /api/v1/chat/session/:sessionId`.

---

### Modelo de datos (MongoDB)
Archivo: `server/src/models/chatHistoryModel.js`

- `user: ObjectId` (requerido, indexado)
- `sessionId: string` (indexado)
- `lastActivity: Date`
- `messages[]`:
  - `text: string`
  - `sender: 'user' | 'bot'`
  - `timestamp: Date`
  - `context?: string`
  - `response`:
    - `message?: string` (texto narrativo del bot)
    - `places?: Place[]` (para consultas simples)
    - `travelPlan?: { totalDays?: number; days: TravelDay[]; ... }` (para planes multi-día)
    - `timestamp?: string`

Interfaz del lugar embebido (resumen):
- `id|_id`, `key`, `name`, `description`, `address`, `location { lat, lng }`,type,category y campos  (, `phone`, `website`, `tags`, etc.).

Conclusión: El esquema es suficiente para guardar snapshots íntegros de `travelPlan` y `places` por mensaje.

---

### Reglas de guardado (POST /chat)
1. Detección del tipo de respuesta
   - Plan de viaje: el payload tiene `travelPlan` con `days[].activities[]`.
   - Recomendación simple: el payload tiene `places` (y/o un plan de 1 día con actividades de recomendación).

2. Normalización previa al guardado
   - Asegurar que cada lugar tenga `key` y `name` (si falta uno, copiar del otro; si ambos faltan, usar "Lugar por definir").
   - Asegurar `address` (si falta, "Dirección por confirmar").
   - Asegurar `location` con `lat` y `lng` numéricos (si faltan, usar coordenadas base de Encarnación).

3. Snapshot íntegro
   - Guardar en `messages[].response.travelPlan` el plan completo con lugares como objetos.
   - Guardar en `messages[].response.places` la lista de lugares completos para consultas simples.
   - Si por compatibilidad histórica algún `place` llega como string (ID), se recomienda intentar resolver a objeto antes de guardar; si no es posible, guardar el ID y un placeholder coherente.

4. Siempre almacenar también `response.message` (resumen narrativo) y `response.timestamp`.

---

### Reglas de recuperación
Endpoints:
- `GET /api/v1/chat/history?limit=N`
- `GET /api/v1/chat/session/:sessionId`

Comportamiento:
- Devolver los mensajes con `response.travelPlan` y/o `response.places` tal como se guardaron.
- Resolver referencias antiguas: si en historiales previos algún `place` está como string (ID), se resuelve a un objeto de `Place` antes de responder. Si no existe, se devuelve un objeto placeholder con mensaje amigable y las coordenadas base.
- Se aplica normalización final para garantizar campos clave presentes.

Implementación (resumen ya aplicado en el código):
- Método `normalizeResponse(response, shouldResolveReferences)`
  - Normaliza `places[]` y `travelPlan.days[].activities[].place`.
  - Si `shouldResolveReferences` es `true` y `place` es string, resuelve vía `Place.findById`; si falta, devuelve placeholder.
- `getChatHistory` y `getChatSession` llaman a `normalizeResponse(..., true)` antes de responder.

---

### Reglas del Frontend
Archivo relevante: `client/src/components/ChatComponent.tsx`

- Para cada mensaje de `sender: 'bot'`:
  - Si `message.response.travelPlan` existe: renderizar el plan con `TravelPlanComponent`.
  - Si `message.response.places` existe: renderizar la lista de lugares.
  - Un historial puede mezclar ambos tipos en distintos mensajes dentro de una misma sesión.
- Usar `place.key || place.name` como etiqueta visible; manejar `undefined/null` defensivamente (ya aplicado).

---

### Ejemplos

Mensaje del bot con plan multi-día:
```json
{
  "sender": "bot",
  "response": {
    "message": "Resumen del plan...",
    "travelPlan": {
      "totalDays": 5,
      "days": [
        {
          "dayNumber": 1,
          "title": "Llegada...",
          "activities": [
            {
              "time": "14:00",
              "category": "Alojamiento",
              "place": {
                "id": "68950e...",
                "key": "De la Costa Hotel",
                "name": "De la Costa Hotel",
                "address": "Avda Francia",
                "location": { "lat": -27.3343, "lng": -55.8720 }
              }
            }
          ]
        }
      ]
    },
    "timestamp": "2025-08-08T23:19:52.461Z"
  }
}
```

Mensaje del bot con recomendaciones simples:
```json
{
  "sender": "bot",
  "response": {
    "message": "Aquí tienes 3-4 lugares...",
    "places": [
      {
        "id": "68950e...",
        "key": "Hiroshima Restaurant",
        "name": "Hiroshima Restaurant",
        "address": "25 de mayo / Lomas Valentinas",
        "location": { "lat": -27.3287, "lng": -55.863455 }
      }
    ],
    "timestamp": "2025-08-08T23:42:32.967Z"
  }
}
```

Nota: Un historial/sesión puede alternar mensajes de ambos tipos.

---

### Migración (opcional recomendada)
- Script offline para historiales antiguos: resolver `activity.place` si es string (ID) → reescribir como objeto (snapshot). Si no existe el lugar, mantener ID y escribir placeholder.
- Beneficios: Respuestas más rápidas y menos dependencia de la colección `places` al leer el historial.

---

### Índices y rendimiento
- Ya presentes: `index({ user: 1, createdAt: -1 })`, `index({ user: 1, lastActivity: -1 })`, `sessionId` indexado.
- Usar `limit` razonable (10–20) al listar historial.
- Considerar políticas de retención/archivado a futuro si el historial crece mucho.

---

### Criterios de aceptación
- Guardado: 
  - Respuesta de plan contiene `travelPlan` completo con lugares como objetos.
  - Respuesta de recomendación contiene `places` con 3–4 lugares completos.
  - `response.message` y `response.timestamp` presentes.
- Recuperación:
  - Historial antiguo con IDs se devuelve con lugares resueltos o placeholders.
  - Frontend renderiza sin errores ambos tipos.

---

### Pruebas sugeridas
- Unitarias:
  - Normalización de `place` (faltan `key/name`, `address`, `location`).
  - `normalizeResponse` con `place` como objeto e ID.
- Integración:
  - POST `/chat` para plan y para recomendación; luego GET `/chat/history` y verificar estructura íntegra.
- E2E:
  - Usuario autenticado → conversar (mezcla de plan y lugares) → recargar → ver historial renderizado correctamente.

---

### Endpoints
- `POST /api/v1/chat`: procesa mensaje, normaliza y guarda snapshot de `travelPlan` o `places`.
- `GET /api/v1/chat/history?limit=N`: devuelve sesiones recientes con mensajes normalizados y referencias resueltas.
- `GET /api/v1/chat/session/:sessionId`: devuelve una sesión específica con normalización y referencias resueltas.


---

### Checks (lista de verificación)
- Backend (procesamiento):
  - [x] Detecta tipo de respuesta (plan vs. lugares).
  - [x] Normaliza lugares (`key/name`, `address`, `location`).
  - [x] Guarda snapshots íntegros (no solo IDs).
  - [x] `normalizeResponse` resuelve referencias de IDs al leer historial.
  - [x] Ajusta `totalDays` y `dayNumber` si vienen incompletos.
  - [x] En consultas simples, garantiza `response.places` aunque la IA devuelva un `travelPlan` de 1 día.
- Backend (endpoints):
  - [x] `/chat` normaliza y guarda.
  - [x] `/chat/history` devuelve mensajes normalizados (referencias resueltas).
  - [x] `/chat/session/:sessionId` idem.
- Modelo:
  - [x] `messages[].response.travelPlan` y `messages[].response.places` con campos suficientes.
  - [x] Índices por `user+lastActivity` y `sessionId`.
- Frontend:
  - [x] Renderiza `travelPlan` con `TravelPlanComponent`.
  - [x] Renderiza `places` como lista clicable con `onPlaceClick`.
  - [x] Carga historial y mapea mensajes defensivamente.
- Pruebas:
  - [ ] Unitarias de normalización.
  - [ ] Integración (POST `/chat`, GET `/history`).
  - [ ] E2E flujo mixto (plan + lugares).



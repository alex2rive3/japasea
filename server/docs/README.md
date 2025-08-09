### Análisis Comercial y Modelo de Monetización – Japasea

**Última actualización**: Enero 2025

### Resumen ejecutivo
- **Producto**: plataforma turística moderna (web) con autenticación, mapa, lugares, favoritos, reseñas, panel admin completo, auditoría, chat con IA e historial, API versionada y documentada.
- **Estado**: “MVP mejorado” listo para producción con 95%+ de funcionalidades core; pendientes: PWA/offline, notificaciones push, pagos/reservas, testeo automatizado y CI/CD.
- **Mercado**: Encarnación (~500k turistas/año, gasto ~USD 75M). Potencial de comisiones en reservas/tours y publicidad local.
- **Tesis**: vender implementación “llave en mano” + quedarse con % de ventas (GMV) atribuidas, con mínimo garantizado mensual y add-ons B2B.

### Valor del activo (estimación de precio)
- **Costo de reposición (880–1.350 h)**: Frontend (300–450 h), Backend (350–500 h), Admin (150–250 h), Perf/Seguridad/Docs (80–150 h). A USD 25–40/h → **USD 22k–54k**.
- **Rango sugerido (venta base 1 ciudad)**: **USD 8.900–19.900** hoy; con upsells puede escalar a **USD 30k–80k** (white‑label multi‑ciudad + reservas/pagos + móvil).

### Modelos de venta
- **Licencia + Setup + Revenue Share (recomendado)**: cobro por setup + fee mensual + % sobre GMV atribuido.
- **SaaS/white‑label**: fee mensual mayor (SLA, hosting, evolutivos) + % sobre transacciones/ads.

### Paquetes comerciales (propuesta)
- **Paquete Base (1 ciudad)**
  - Alcance: web operativa, catálogo de lugares, chat IA, favoritos, reseñas, admin completo, analíticas básicas.
  - Setup: **USD 8.900** | Mantenimiento: **USD 490/mes**
  - Revenue share (GMV atribuido): Restaurants **10–12%**, Hoteles **15–18%**, Tours **20–25%**
  - Mínimo garantizado: **USD 300/mes**
- **Paquete Pro (reservas + pagos + publicidad)**
  - + Reservas end‑to‑end, pagos locales, campañas self‑serve, PWA/push.
  - Setup: **USD 19.900** | Mantenimiento: **USD 990/mes**
  - Revenue share: Restaurants **12–15%**, Hoteles **15–20%**, Tours **22–28%**; Publicidad: **20–30%** de pauta gestionada
  - Mínimo garantizado: **USD 600/mes**
- **White‑label Municipio/Asociación**
  - Multi‑ciudad, SLAs (99.9% uptime), roles avanzados, reportes ejecutivos.
  - Setup: **USD 39.900–79.900** | Mantenimiento: **USD 1.490–2.490/mes**
  - Revenue share: GMV **10–20%** + **20–30%** de pauta
  - Mínimo garantizado: **USD 1.000–2.000/mes**

### Revenue share y atribución de ventas
- **Qué cuenta como venta**: reservas pagadas in‑app; canjes en local con QR/código por partner; click‑out con UTM + voucher/código (last‑touch ≤ 7–14 días) con confirmación del comercio.
- **Medición**: in‑app (órdenes en DB); fuera (QR por negocio, cupones, deep links WhatsApp con parámetros) + conciliación mensual.
- **Cláusulas**: mínimo garantizado mensual; ventana de atribución; exclusividad por zona (opcional); plazo 12–24 meses; preaviso 60 días.

### Upsells para subir el ticket
- **Reservas + pagos locales**: Bancard, Tigo Money, transferencias QR, pre‑autorizaciones, calendario, política de no‑show.
- **Publicidad self‑serve**: listados destacados, banners, segmentación geográfica/temporal, presupuestos y facturación auto.
- **Panel B2B avanzado**: cohortes, repetición, ticket promedio, comparativas, exportaciones, campañas (push/email).
- **Fidelidad y referidos**: “Pasaporte Encarnación”, puntos, niveles, recompensas; referidos vía WhatsApp.
- **PWA + push**: offline, re‑engagement por eventos/clima.
- **App móvil (React Native)**: upsell **USD 12k–25k**.
- **Multi‑idioma completo (ES/PT/EN)** y **SEO internacional**.
- **Integraciones**: GA4, Meta Pixel, Google My Business, POS.
- **SLA/Compliance**: monitoreo (Sentry/Prometheus), backups, CI/CD, TOS/Privacidad/Cookies.
- **Marketplace de experiencias**: guías PDF, audioguías, rutas premium (comisiones 20–30%).

### Estimación de esfuerzo y precios de mejoras
- Reservas + pagos locales: 4–6 semanas, **USD 6k–12k**
- Publicidad self‑serve: 3–5 semanas, **USD 5k–10k**
- PWA/offline + push: 2–3 semanas, **USD 3k–6k**
- Panel B2B avanzado + reportes: 3–5 semanas, **USD 5k–9k**
- App móvil básica: 6–10 semanas, **USD 12k–25k**
- Multi‑idioma + SEO internacional: 2–4 semanas, **USD 3k–6k**
- Tests + CI/CD + monitoreo prod: 2–3 semanas, **USD 3k–5k**

### Roadmap 60–90 días (cierre rápido)
- **Mes 1**: PWA/offline, push, pricing/planes, onboarding B2B, TOS/Privacidad/Cookies, dashboards base.
- **Mes 2**: Reservas + pagos locales (hoteles/restos), tracking QR/UTM/cupones, reportes de comisión, paquetes de publicidad.
- **Mes 3**: Fidelidad, campañas B2B, lanzamiento con 20–50 partners y calendario de temporada alta.

### Ejemplos de ROI
- 50 reservas/mes en restaurantes, ticket USD 20 → GMV USD 1.000 → 12% = **USD 120/mes**.
- 30 noches hotel a USD 40 → GMV USD 1.200 → 18% = **USD 216/mes**.
- 25 tours a USD 30 → GMV USD 750 → 22% = **USD 165/mes**.
- Publicidad: 10 comercios “Growth” a USD 100/mes = **USD 1.000/mes**; fee de gestión 25% = **USD 250/mes**.

### Riesgos y mitigación
- Pagos y reservas no productizados → integrar métodos locales y MVP de reservas con confirmación/depósito.
- Confiabilidad sin suite de tests/CI → Jest + pruebas API, pipeline CI/CD, monitoreo (Sentry).
- Legal y confianza local → TOS/privacidad/cookies, soporte WhatsApp, precios en Gs., métodos de pago locales.

### Contrato (puntos clave)
- Alcance y entregables por paquete.
- Setup, mensual y revenue share por rubro; mínimos garantizados.
- Definición técnica de atribución, acceso a reportes y auditoría.
- SLA, soporte, tiempos de respuesta, backups.
- Derechos sobre marca/datos y confidencialidad.
- Cronograma y hitos de aceptación.

### Observaciones técnicas del repo
- API v1 completa y documentada (`server/src/docs/swagger.v1.js`, `API_ENDPOINTS.md`).
- Panel admin robusto (usuarios, lugares, reseñas, stats, auditoría).
- Seguridad: JWT + refresh, rate limiting, validación y sanitización, Helmet.
- Chat IA con historial persistente y normalización (`server/docs/CHAT_HISTORY_SPEC.md`).
- Frontend moderno (React 18 + TS + MUI), mapas con Leaflet, componentes admin y hooks.

### Recomendación final de precio
- “Tal cual” 1 ciudad: **Setup USD 8.900** + **USD 490/mes** + revenue share (10–25%) + **mínimo USD 300/mes**.
- Con reservas + pagos + PWA/push + publicidad: **Setup USD 19.900** + **USD 990/mes** + revenue share (12–28%) + **mínimo USD 600/mes**.
- Municipios/asociaciones: **USD 39.900–79.900** + **USD 1.490–2.490/mes** + revenue share 10–20% y 20–30% pauta.

---

Si necesitás un one‑pager comercial y un borrador de contrato (con definición de atribución y mínimos garantizados), puedo incluirlos como anexos en esta carpeta.



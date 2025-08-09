### Guía de Internacionalización (i18n) – Español, Inglés y Portugués

Última actualización: Enero 2025

### Objetivos
- **Interfaz**: ES, EN y PT con detección automática y selector manual persistente.
- **Formato**: fechas, números y monedas según locale.
- **Mensajes**: validaciones, errores de API y correos localizados.
- **Contenido**: datos de lugares y categorías preparados para traducción.
- **SEO**: etiqueta lang, títulos, meta y (opcional) rutas por idioma.

### Librerías y APIs sugeridas
- **Frontend**: `i18next`, `react-i18next`, `i18next-browser-languagedetector`.
- **MUI**: locales `@mui/material/locale` (`esES`, `enUS`, `ptBR`).
- **Formateo**: `Intl.DateTimeFormat` y `Intl.NumberFormat`.
- **Backend (opcional)**: `i18next` o mapa de códigos→mensajes por idioma.

### Alcance por capa
- **Frontend (React)**
  - Archivos de traducción:
    - `client/src/locales/es/common.json`
    - `client/src/locales/en/common.json`
    - `client/src/locales/pt/common.json`
    - Sugerencia por namespaces: `auth.json`, `navbar.json`, `admin.json`, `places.json`.
  - Provider i18n en la raíz e integración con locale de MUI.
  - Detección de idioma (prioridad): `?lang` → `localStorage.lang` → `navigator.language` → `es`.
  - Selector en `Navbar` que persista y sincronice MUI locale.
  - Reemplazo progresivo de strings por `t('clave')`.

- **Backend (Node/Express) – recomendado**
  - Responder con **códigos de mensaje** (p. ej. `errors.auth.invalid_credentials`) + traducción según `req.locale`.
  - Middleware: lee `Accept-Language`, `?lang` o `x-lang`, setea `req.locale`.
  - Emails con plantillas por idioma.

- **Datos (MongoDB)**
  - Extender `Place` para traducciones:
    - `nameTranslations: { es?: string; en?: string; pt?: string }`
    - `descriptionTranslations: { es?: string; en?: string; pt?: string }`
    - `tagsTranslations?: { es?: string[]; en?: string[]; pt?: string[] }`
  - Render: `nameTranslations[locale] || name` como fallback.
  - Migración: duplicar `name/description` → `*Translations.es`.

- **Emails (Nodemailer)**
  - Directorio de plantillas: `templates/es|en|pt/verifyEmail.html`, `resetPassword.html`.
  - Parámetros comunes: `userName`, `verifyUrl`, `resetUrl`, `supportEmail`.
  - Selección por `preferredLanguage` del usuario o `req.locale`.

- **SEO y Accesibilidad**
  - `<html lang="es|en|pt">` dinámico.
  - Títulos y meta descripciones por idioma.
  - Sitemap por idioma (si se usan prefijos de ruta).
  - Alt texts y ARIA traducidos.

### Estrategia de rutas por idioma
- **MVP recomendado**: sin prefijo, idioma por estado/param (`/landing?lang=pt`).
- **SEO avanzado (futuro)**: prefijos `/es`, `/en`, `/pt` (requiere actualizar enrutado y links internos).

### Pasos Frontend
1. Instalar: `npm i i18next react-i18next i18next-browser-languagedetector`.
2. Crear `client/src/i18n/index.ts` (config y detector) y los JSON en `locales/`.
3. Envolver la app con `I18nextProvider` y sincronizar MUI locale (`esES`, `enUS`, `ptBR`).
4. Agregar `LanguageSwitcher` en `Navbar` (guarda `localStorage.lang`).
5. Reemplazar textos en: `Navbar`, `LandingPage`, Auth, Home y shell de Admin.
6. Utilidades de formato:
   - `formatCurrency(value, currency, locale)` usando `Intl.NumberFormat`.
   - `formatDate(date, locale, options)` con `Intl.DateTimeFormat`.

### Pasos Backend (opcional recomendado)
1. Middleware `localeMiddleware`:
   - Detectar `lang` y setear `req.locale`.
2. Estandarizar respuestas: `{ code, message: translate(code, req.locale) }`.
3. EmailService: parámetro `locale` para seleccionar plantilla.
4. Endpoints que devuelvan textos legibles deben aceptar `?lang`.

### Modelo de datos – Cambios
- `placeModel` (conceptual): agregar `nameTranslations`, `descriptionTranslations`, `tagsTranslations`.
- Índices opcionales por `nameTranslations.es` para búsqueda.
- Script de migración: copiar valores actuales a `*.es`.

### Convenciones de claves i18n
- `common.*` (botones, navegación)
- `auth.*` (login, registro, errores)
- `places.*` (listados, detalles)
- `admin.*` (panel, acciones)
- `errors.*` (genéricas)

Ejemplo `common.json`:
```
{
  "appName": "Japasea",
  "cta.start": "Comenzar",
  "cta.login": "Iniciar sesión"
}
```

### MUI – Locales
- `import { esES, enUS, ptBR } from '@mui/material/locale'`
- `createTheme(baseTheme, esES)` según el locale activo.

### Formateo de moneda y números
- PYG por defecto en ES/PT; USD en EN (opcional).
- `Intl.NumberFormat(locale, { style: 'currency', currency })`.

### Detección y persistencia
- Prioridad: query → localStorage → navegador → fallback `es`.
- Sincronizar `<html lang>` y MUI.

### Testing
- Unit: render por idioma con `I18nextProvider`.
- Snapshots ES/EN/PT de componentes clave.
- E2E: Auth, Landing, Home con cambio de idioma.

### Roadmap
- **Semana 1**: setup i18n, provider, detector, selector; traducir Landing, Navbar, Auth.
- **Semana 2**: Admin shell, Home, Place Cards; utilidades de formato.
- **Semana 3**: Emails ES/EN/PT; extender modelo Place + migración básica ES.
- **Semana 4**: SEO (lang, títulos, meta), tests unitarios/E2E, documentación.

### Criterios de aceptación
- Selector visible y persistente; idioma se respeta tras recarga.
- Landing, Navbar, Auth, Home y Admin shell 100% traducidos.
- Fechas y montos formateados según locale.
- Emails de verificación/reset en 3 idiomas.
- Modelo listo para almacenar traducciones de lugares.

### Riesgos y mitigación
- Strings hardcodeados → auditoría y regla ESLint para prevenir nuevos hardcodeos.
- Desincronización MUI vs i18n → contexto único de `currentLocale`.
- Tamaño de bundle (JSON) → lazy‑load por namespace/idioma si es necesario.

### Estimación (ES/EN/PT)
- Frontend base: 1.5–2.5 semanas.
- Emails + Admin shell + formatos: 0.5–1 semana.
- Modelo + migración + pruebas: 1–1.5 semanas.
- Total: 3–5 semanas.

### Ejemplo de inicialización (simplificado)
```
// client/src/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import es from '../locales/es/common.json'
import en from '../locales/en/common.json'
import pt from '../locales/pt/common.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { es: { common: es }, en: { common: en }, pt: { common: pt } },
    fallbackLng: 'es',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false }
  })

export default i18n
```

### Checklist
- [ ] Provider i18n + MUI locale.
- [ ] Selector de idioma persistente.
- [ ] Landing, Navbar, Auth, Home traducidos.
- [ ] Emails verify/reset en ES/EN/PT.
- [ ] `Place` extendido con `*Translations` y migración ejecutada.
- [ ] Documentación actualizada y ejemplos listos.

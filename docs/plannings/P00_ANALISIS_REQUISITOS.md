# Planning 00 — Análisis de Requisitos: Justicia Sana

**Fecha**: 2026-07-24
**Origen**: Propuesta "Plataforma Web y Aplicación Móvil del Comité de Convivencia Laboral — Piloto Seccional Magdalena" (`docs/cliente/PROPUESTA_CCL_PLATAFORMA.md`), formulada por Leonardo Fabio Gómez Colón (CCL Seccional Magdalena) en articulación con Daniel Arbeláez Álvarez (Ing. de software, Seccional Antioquia).
**Objetivo**: Delimitar el alcance de `justicia-sana` frente al sistema SIRAL existente y derivar la línea de trabajo estratégica (P01).
**Metodología**: SDD v2 (Spec-Driven Development) — Framework CDAID

---

## Contexto

La propuesta pide una **plataforma digital integral** para el Comité de Convivencia Laboral (CCL) de la Rama Judicial, piloto Seccional Magdalena, alineada con la Resolución 3461 de 2025. Consta de:

1. **Componente 1 — Módulo Interno Confidencial**: gestión de casos de acoso laboral de principio a fin (registro, trámite, actas, plazos, reportes, seguridad).
2. **Componente 2 — Portal Web Público**: pedagogía, transparencia y visibilidad institucional (información del comité, normativa, material educativo, canales de ayuda, participación ciudadana).
3. **Funcionalidades adicionales**: encuestas de clima, integración con canales de bienestar, notificaciones, acceso móvil (app).
4. **Integración JudIT**: SSO institucional + mesa de ayuda.

### Ecosistema existente

| Activo                                          | Estado                                                                                                           | Rol en este proyecto                                                                                                                                               |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **SIRAL** (`SIRAL_System`)                      | v1.0.0-rc1 — 100% completo (283 tests, FastAPI + Streamlit + PostgreSQL 16, deploy VPS pendiente)                | Cubre el Componente 1 (módulo interno). Referencia de dominio, convenciones CDAID y backend a extender                                                             |
| **rugby-bello-site**                            | LIVE (Astro + TS strict + Tailwind 4 + Cloudflare Pages)                                                         | Referencia de código frontend (JAMstack, SDD v2, quality gates). Nota: vive en otro dominio (renosbrc.com.co, DNS Cloudflare) — **no** es la referencia de hosting |
| **VPS SprintJudicial**                          | Operativo — Hostinger, Ubuntu + EasyPanel + Traefik. Hospeda blog.sprintjudicial.com (contenedor nginx estático) | Infraestructura de hosting, CMS y API para este proyecto                                                                                                           |
| **HammeredSolutions** + **blog-sprintjudicial** | LIVE — fuente Hugo + estático generado, deploy EasyPanel (Dockerfile nginx/caddy) tras Traefik                   | **Referencia del patrón de despliegue en el VPS**: repo → build EasyPanel → contenedor estático → subdominio                                                       |
| **justicia-sana** (este repo)                   | Planeación                                                                                                       | Portal público + complementos que se escapan de SIRAL                                                                                                              |

---

## Matriz de cobertura: Propuesta vs SIRAL

### Requisitos YA cubiertos por SIRAL (no se re-implementan)

| Req. propuesta                                            | Cobertura en SIRAL                               |
| --------------------------------------------------------- | ------------------------------------------------ |
| Registro seguro de quejas (formulario, adjuntos cifrados) | `RadicarQueja` + file_storage SHA-256 + Ley 1581 |
| Trámite y seguimiento de casos (estados, asignación)      | `CambiarEstado`, `EstadoQueja`, RBAC (ADMIN_CCL) |
| Gestión documental y actas                                | Entidad `ActaComite` + use case acta             |
| Reportes e informes de gestión (panel estadísticas)       | `GenerarReporte` + gráficos Streamlit            |
| Seguridad avanzada (roles, auditoría, cifrado, HTTPS)     | JWT + RBAC + AuditLog middleware + CSP/HSTS      |
| Notificaciones por correo (Ley 2213/2022)                 | `infrastructure/notifications`                   |
| Plazos legales con calendario hábil                       | `CalendarioHabil` (términos de 6 meses)          |
| Multi-seccional (base)                                    | Value object `Seccional`, rol SUPERADMIN         |

### Brechas (GAP) — lo que falta del ecosistema

| GAP  | Requisito de la propuesta                                                               | Destino propuesto                                                  |
| ---- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| G-01 | Portal público: ¿Quiénes somos?, estructura del CCL, transparencia                      | **justicia-sana** (estático)                                       |
| G-02 | Biblioteca de normativa y recursos legales (Ley 1010, Res. 2646, 652, 3461, circulares) | **justicia-sana** (estático)                                       |
| G-03 | Material pedagógico: infografías, folletos, videos, e-learning                          | **justicia-sana** (estático + multimedia)                          |
| G-04 | Noticias y novedades jurisprudenciales, campañas                                        | **justicia-sana** (contenido)                                      |
| G-05 | Canales de ayuda y contacto: atención psicológica ARL, líneas, horarios                 | **justicia-sana** (estático)                                       |
| G-06 | PQRS ciudadano enfocado a convivencia laboral                                           | **justicia-sana** (island) + API                                   |
| G-07 | Buzón anónimo de alertas tempranas de clima                                             | **justicia-sana** (island) + API                                   |
| G-08 | Encuestas de percepción y clima laboral anónimas                                        | **justicia-sana** (island) + API                                   |
| G-09 | Calendario de reuniones del CCL (mensuales + extraordinarias, Res. 3461)                | **SIRAL** (extensión, planning propio)                             |
| G-10 | Alertas de plazos Res. 3461: procedimiento ≤ 65 días calendario, etapas 5–15 días       | **SIRAL** (extensión de `CalendarioHabil`)                         |
| G-11 | Protocolos especiales: marcado y derivación de acoso sexual/violencia de género         | **SIRAL** (extensión)                                              |
| G-12 | Informe de remisión a autoridades externas (Inspector de Trabajo / Procuraduría)        | **SIRAL** (extensión de reportes)                                  |
| G-13 | Calendario de capacitaciones con inscripción en línea                                   | **justicia-sana** (contenido + island)                             |
| G-14 | Comunicados internos / boletines del CCL                                                | **justicia-sana** (contenido)                                      |
| G-15 | SSO JudIT (autenticación institucional)                                                 | **Diferido** (dependencia institucional UTDI)                      |
| G-16 | Enlace soporte técnico JudIT                                                            | **Diferido** (Q6: sin unificación con otras plataformas en el MVP) |
| G-17 | App móvil (Android/iOS)                                                                 | **PWA** (portal + SIRAL P04) — cross-platform diferido             |
| G-18 | Notificaciones push                                                                     | **Diferido** a fase PWA avanzada                                   |
| G-19 | Piloto Seccional Magdalena (SIRAL fue diseñado con cliente de Antioquia)                | **SIRAL** (parametrización por seccional)                          |
| G-20 | Estadísticas públicas anonimizadas en el portal                                         | **justicia-sana** consume API SIRAL en build-time                  |

---

## Decisión de arquitectura (resumen)

**justicia-sana = portal público estático (JAMstack) + CMS Strapi desde el día 1 + islands dinámicas puntuales**, todo hospedado en el VPS SprintJudicial (patrón blog-sprintjudicial), complementando a SIRAL sin duplicarlo:

```
  Editores CCL ──▶ Strapi v5 (cms.sprintjudicial.com — VPS, EasyPanel)
  (sin tocar código)      │ publicar contenido
                          │ webhook ─▶ rebuild automático
                          ▼
  GitHub justicia-sana ─▶ EasyPanel build (Astro fetch Strapi en build-time)
                          │ Dockerfile multi-stage: node build → nginx estático
                          ▼
  Ciudadanía ──────▶ Traefik ─▶ justiciasana.sprintjudicial.com
  Funcionarios            │  - Páginas estáticas (contenido Strapi)
                          │  - Islands: PQRS, encuestas, buzón (post-MVP)
                          │ runtime fetch (islands → endpoints públicos)
                          ▼
  CCL (módulo    ──▶ SIRAL — siral.sprintjudicial.com (VPS)
  interno)           FastAPI + Streamlit + PostgreSQL 16
                     + extensiones: stats públicas, encuestas, PQRS,
                       calendario CCL, derivaciones, multi-seccional
```

Justificación:

- **Práctico y con lo que se tiene** (Q6): toda la operación en el VPS existente (Hostinger + EasyPanel + Traefik), mismo patrón ya probado con blog.sprintjudicial.com. Sin dependencias de plataformas externas.
- **Publicación sin tocar código desde el día 1** (Q2): Strapi Admin UI para el CCL; al publicar, un webhook dispara el rebuild del estático en EasyPanel.
- **Seguridad por diseño**: el portal público no toca datos confidenciales; sitio estático sin BD propia expuesta; Strapi y SIRAL tras Traefik con HTTPS.
- **Un solo backend de negocio que mantener** (SIRAL), evitando un segundo sistema con su propia seguridad/auditoría.
- **Lighthouse 95+, accesibilidad WCAG AA, mobile-first**: requisitos de un portal institucional dirigido a ciudadanía.

---

## Preguntas Abiertas y Supuestos — VALIDADOS (2026-07-24)

> ✅ Los 7 supuestos fueron validados por el propietario del proyecto (Daniel Arbeláez). Decisiones firmes para P01 v2.

| #   | Pregunta                                    | Decisión validada                                                                                                                                                                         |
| --- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | ¿Rol de justicia-sana frente a SIRAL?       | ✅ Portal público + complementos; SIRAL sigue siendo el módulo interno y se integra                                                                                                       |
| Q2  | ¿Gestión de contenido?                      | ✅ **Strapi v5 desde el día 1** en el VPS (EasyPanel), estructura actualizada y de fácil manejo: el CCL publica desde Strapi Admin sin tocar código; webhook dispara rebuild del estático |
| Q3  | ¿Backend para encuestas/PQRS/buzón?         | ✅ Extender la API FastAPI de SIRAL (endpoints públicos con rate-limit, sin auth, anonimizados)                                                                                           |
| Q4  | ¿App móvil?                                 | ✅ Sin desarrollo móvil ahora; **PWA como visión** para etapa posterior. Primero el MVP                                                                                                   |
| Q5  | ¿Dominio de producción?                     | ✅ **`justiciasana.sprintjudicial.com`** (DNS del VPS Hostinger, HTTPS vía Traefik)                                                                                                       |
| Q6  | ¿SSO JudIT / integraciones externas?        | ✅ **Ninguna unificación con otras plataformas en el MVP** (ni SSO, ni enlaces de soporte JudIT). Se construye con lo que se tiene                                                        |
| Q7  | ¿Piloto Magdalena con SIRAL "de Antioquia"? | ✅ Parametrizar SIRAL por seccional (ya modela `Seccional`; planning en repo SIRAL)                                                                                                       |

### Decisiones de infraestructura derivadas (2026-07-24)

| #   | Decisión                                                                                                                                                                                                                                                              |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-A | **Hosting en el VPS SprintJudicial** (Hostinger, Ubuntu + EasyPanel + Traefik), NO Cloudflare Pages. Patrón probado de `blog-sprintjudicial`: Dockerfile multi-stage (node build Astro → nginx:alpine estático) desplegado por EasyPanel, auto-redeploy al hacer push |
| D-B | rugby-bello-site queda solo como **referencia de código** (Astro/TS/Tailwind/SDD v2); su hosting (Cloudflare/renosbrc) no aplica aquí                                                                                                                                 |
| D-C | **Instancia Strapi v5 en el VPS** (cms.sprintjudicial.com u otro subdominio) con PostgreSQL, content types propios de justicia-sana y roles de editor para el CCL. Si rugby-bello activa su CMS después, se evalúa compartir instancia con content types separados    |
| D-D | Triggers de rebuild del sitio: (1) push a `main` del repo, (2) webhook de publicación de Strapi → deploy hook de EasyPanel                                                                                                                                            |

---

## Hallazgos Diferidos

| ID   | Hallazgo                                              | Razón de diferimiento                                                                    |
| ---- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| D-01 | SSO JudIT (G-15)                                      | Q6: sin unificación con plataformas externas en el MVP; dependencia institucional (UTDI) |
| D-02 | Push notifications (G-18)                             | Requiere PWA madura + backend de suscripciones                                           |
| D-03 | App nativa/cross-platform y PWA (G-17)                | Q4: MVP primero; PWA queda como visión de etapa posterior                                |
| D-04 | Tickets automáticos y enlaces de soporte JudIT (G-16) | Q6: la propia propuesta lo marca como futuro/complejo                                    |
| D-05 | Multi-idioma (i18n)                                   | La propuesta lo señala como no imprescindible en Colombia                                |
| D-06 | Búsqueda avanzada de contenido                        | Búsqueda estática/Strapi básica suficiente en el MVP                                     |

---

## Criterios de Éxito del Análisis

- [x] Propuesta del cliente archivada en `docs/cliente/` (docx original + Markdown)
- [x] Matriz de cobertura SIRAL vs propuesta completa (20 GAPs identificados)
- [x] Decisión de arquitectura documentada con justificación
- [x] Supuestos y preguntas abiertas explícitos (7)
- [x] Supuestos Q1–Q7 validados por el propietario del proyecto (2026-07-24)
- [x] Decisiones de infraestructura D-A a D-D registradas (VPS, Strapi, rebuild)
- [x] P01 (plan estratégico) derivado de este análisis

---

**Versión**: 2.0 — supuestos validados, arquitectura ajustada a VPS SprintJudicial + Strapi día 1
**Fecha**: 2026-07-24

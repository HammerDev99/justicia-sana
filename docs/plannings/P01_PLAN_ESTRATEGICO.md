# Planning 01 — Plan Estratégico: Línea de Trabajo Justicia Sana

**Fecha**: 2026-07-24
**Origen**: P00_ANALISIS_REQUISITOS v2.0 (gap analysis + supuestos Q1–Q7 validados + decisiones D-A a D-D)
**Objetivo**: Definir la línea de trabajo completa (fases, ítems, orden, esfuerzo) para llevar el portal público del CCL a un **MVP en producción** en `justiciasana.sprintjudicial.com`, con publicación de contenido sin tocar código desde el día 1.
**Metodología**: SDD v2 (Spec-Driven Development) — Framework CDAID

---

## Estado Previo / Contexto

| Métrica | Valor actual | Target MVP |
|---------|:------------:|:----------:|
| Repositorio | Solo planeación (P00/P01) | Portal LIVE con CMS operativo |
| Tests | 0 | ≥ 25 unit (Vitest) + ≥ 12 E2E (Playwright) |
| Páginas | 0 | ≥ 12 páginas funcionales |
| Lighthouse | — | ≥ 95 (performance, a11y, SEO) |
| Editores autónomos | 0 | CCL publica desde Strapi sin desarrollador |

**Stack decidido** (Q2, D-A a D-D):

- **Frontend**: Astro 6+ · TypeScript strict · Tailwind CSS 4 (referencia de código: rugby-bello-site)
- **CMS**: Strapi v5 + PostgreSQL en el VPS SprintJudicial (EasyPanel) — desde el día 1
- **Hosting**: VPS SprintJudicial (Hostinger, Ubuntu + EasyPanel + Traefik) — patrón `blog-sprintjudicial`: Dockerfile multi-stage (node build → nginx:alpine) con auto-redeploy
- **Dominio**: `justiciasana.sprintjudicial.com` (HTTPS vía Traefik)
- **Backend dinámico** (post-MVP): API FastAPI de SIRAL extendida
- **Testing/CI**: Vitest · Playwright · ESLint/Prettier · GitHub Actions (quality gates)

**Convenciones**: CDAID (CLAUDE.md + agent_docs/ + plannings/sprints/SPECs). Commits: `tipo(alcance): descripcion | SPEC: JS-XX`.

**Enfoque MVP (Q4/Q6)**: primero un portal informativo sólido con CMS, con lo que ya se tiene (VPS + SIRAL). Sin integraciones con plataformas externas, sin app móvil. PWA y participación ciudadana son etapas posteriores explícitas.

---

## Alcance

### Fase F0 — Scaffolding + Walking Skeleton en Producción

> Meta: un "hola mundo" institucional desplegado en `justiciasana.sprintjudicial.com` desde el primer sprint — valida toda la tubería antes de invertir en contenido.

| ID | Ítem | Artefactos | Esfuerzo |
|----|------|-----------|:--------:|
| F0-01 | Init Astro + TS strict + Tailwind 4 + estructura `src/` (lib, layouts, components, pages, styles) | `package.json`, `astro.config.mjs`, `tsconfig.json` | Bajo |
| F0-02 | Quality gates: ESLint + Prettier (plugin Astro) + Vitest + Playwright + `astro check` | configs + `tests/` | Bajo |
| F0-03 | CI GitHub Actions: lint + check + test + build en cada push/PR | `.github/workflows/ci.yml` | Bajo |
| F0-04 | CDAID setup: CLAUDE.md definitivo, agent_docs/ (architecture, code_conventions, testing, workflow, antipatterns, project_status), templates sprint/SPEC | `CLAUDE.md`, `agent_docs/*` | Medio |
| F0-05 | Dockerfile multi-stage (node:22 build → nginx:alpine) + `nginx.conf` (cache estáticos, gzip, security headers) — patrón blog-sprintjudicial | `Dockerfile`, `nginx.conf` | Bajo |
| F0-06 | Servicio EasyPanel + DNS `justiciasana.sprintjudicial.com` + Traefik HTTPS + auto-deploy en push a `main` | EasyPanel (VPS) + guía en `docs/` | Medio |
| F0-07 | Design tokens institucionales (colores Rama Judicial, tipografía, contraste AA) | `src/styles/global.css` | Bajo |

### Fase F1 — CMS Strapi (publicación sin código, día 1)

| ID | Ítem | GAP/Decisión | Esfuerzo |
|----|------|:------------:|:--------:|
| F1-01 | Aprovisionar Strapi v5 + PostgreSQL en EasyPanel (subdominio cms, HTTPS Traefik, backups) | D-C | Medio |
| F1-02 | Content types: `norma`, `articulo` (noticias/jurisprudencia), `recurso-pedagogico`, `integrante-comite`, `capacitacion`, `comunicado`, `canal-ayuda`, single types (`quienes-somos`, `home`) | G-01..05, G-13/14 | Alto |
| F1-03 | Roles y permisos: rol Editor CCL (publicar sin admin), API token read-only para build | D-C | Bajo |
| F1-04 | Cliente Strapi tipado en Astro (`src/lib/`) — fetch build-time, tipos `readonly`, sin token en cliente (patrón strapi_integration de rugby-bello) | Q2 | Medio |
| F1-05 | Webhook Strapi publish → deploy hook EasyPanel (rebuild automático al publicar) | D-D | Bajo |
| F1-06 | Manual del editor CCL (guía breve con capturas: crear/publicar contenido) | Q2 | Medio |

### Fase F2 — Layout y Sistema de Diseño

| ID | Ítem | Esfuerzo |
|----|------|:--------:|
| F2-01 | BaseLayout + PageLayout con SEO completo (meta, OG, sitemap, robots) | Medio |
| F2-02 | Header/Footer institucionales + navegación accesible (keyboard, ARIA) | Medio |
| F2-03 | Componentes UI: Card, Callout legal, Accordion (FAQ), tabla normativa, banner de ayuda psicológica | Medio |
| F2-04 | Home: misión del CCL, accesos rápidos (radicar queja → SIRAL, ayuda psicológica, normativa) | Medio |

### Fase F3 — Contenido Núcleo (Componente 2 de la propuesta, servido desde Strapi)

| ID | Ítem | GAP | Esfuerzo |
|----|------|:---:|:--------:|
| F3-01 | "¿Quiénes somos?": estructura CCL, integrantes, funciones, reglamento | G-01 | Medio |
| F3-02 | Biblioteca de Normativa: Ley 1010/2006, Res. 2646/2008, 652/2012, 1356/2012, 3461/2025, Ley 1581/2012, 2213/2022, circulares CSJ — con resúmenes en lenguaje claro y PDFs | G-02 | Alto |
| F3-03 | Material pedagógico: ¿Qué es acoso laboral?, modalidades, cómo actuar (víctima/testigo), infografías descargables | G-03 | Alto |
| F3-04 | Noticias y jurisprudencia: listado + detalle de artículos, campañas | G-04 | Medio |
| F3-05 | Canales de ayuda: atención psicológica (ARL, bienestar), contacto CCL, ruta de denuncia interna/externa | G-05 | Medio |
| F3-06 | Capacitaciones y comunicados del CCL (calendario informativo + boletines) | G-13/14 | Medio |
| F3-07 | Página "Radicar una queja": explica el canal formal y enlaza a SIRAL (aclarando confidencialidad y no-anonimato) | — | Bajo |

### Fase F4 — Transparencia con Cifras (integración SIRAL build-time, solo lectura)

| ID | Ítem | GAP | Esfuerzo |
|----|------|:---:|:--------:|
| F4-01 | [SIRAL] Endpoint público `GET /api/v1/estadisticas/publicas` — agregados anonimizados por seccional, cacheable | G-20 | Medio |
| F4-02 | Cliente API SIRAL tipado en `src/lib/` (build-time fetch, resiliente a API caída: build no se rompe) | G-20 | Medio |
| F4-03 | Página "Transparencia y cifras": quejas por trimestre, tiempos promedio, tipos de conducta (visualización accesible) | G-20 | Medio |

### Fase F5 — Participación Ciudadana (post-MVP — islands + API SIRAL extendida)

| ID | Ítem | GAP | Esfuerzo |
|----|------|:---:|:--------:|
| F5-01 | [SIRAL] Módulo encuestas: entidades + use cases + endpoints públicos anónimos con rate-limit | G-08 | Alto |
| F5-02 | Island "Encuesta de clima" (formulario anónimo, sin cookies identificables) | G-08 | Medio |
| F5-03 | [SIRAL] Endpoint PQRS público + notificación email al CCL | G-06 | Medio |
| F5-04 | Island "PQRS convivencia laboral" con validación y aviso Habeas Data | G-06 | Medio |
| F5-05 | [SIRAL] Buzón anónimo de alertas tempranas (sin metadatos identificables, texto sanitizado) | G-07 | Medio |
| F5-06 | Island "Buzón anónimo" + política de uso responsable | G-07 | Medio |

### Fase F6 — Hardening y Auditoría del MVP

| ID | Ítem | Esfuerzo |
|----|------|:--------:|
| F6-01 | Auditoría Lighthouse ≥ 95 + WCAG AA (axe/manual) + corrección de hallazgos | Medio |
| F6-02 | Security headers en nginx (CSP, HSTS, X-Content-Type-Options) + revisión de exposición de Strapi (admin no público si es viable, rate-limit Traefik) | Medio |

### Fase F7 — PWA (visión, etapa posterior — Q4)

| ID | Ítem | Esfuerzo |
|----|------|:--------:|
| F7-01 | Manifest + service worker (contenido pedagógico offline-first, instalable) | Medio |
| F7-02 | Coordinación con SIRAL P04_PWA_OFFLINE para experiencia móvil del módulo interno | Medio |

### Extensiones en repo SIRAL (línea paralela — plannings P10+ de SIRAL_System)

> Pertenecen al módulo interno; se planifican y ejecutan en `SIRAL_System`. Se listan para trazabilidad.

| ID | Ítem | GAP | Etapa |
|----|------|:---:|-------|
| SIRAL-A | Parametrización por seccional: branding, sedes, comité (piloto Magdalena) | G-19 | MVP (Q7) |
| SIRAL-B | Endpoint público de estadísticas (soporte a F4-01) | G-20 | MVP |
| SIRAL-C | Plazos Res. 3461/2025: procedimiento ≤ 65 días, etapas 5–15 días, alertas al Secretario | G-10 | Post-MVP |
| SIRAL-D | Calendario de reuniones CCL (mensuales + extraordinarias) | G-09 | Post-MVP |
| SIRAL-E | Derivaciones: marcado acoso sexual/violencia de género + protocolo alterno | G-11 | Post-MVP |
| SIRAL-F | Informe de remisión a autoridades externas | G-12 | Post-MVP |
| SIRAL-G | Endpoints encuestas/PQRS/buzón (soporte a F5) | G-06/07/08 | Post-MVP |

---

## Definición del MVP

**MVP = F0 + F1 + F2 + F3 + F4 + F6** → portal informativo LIVE en `justiciasana.sprintjudicial.com`, con el CCL publicando contenido desde Strapi sin tocar código, cifras públicas de SIRAL, Lighthouse ≥ 95 y WCAG AA.

Fuera del MVP (etapas posteriores, en orden): **F5** (participación: encuestas, PQRS, buzón) → **F7** (PWA) → diferidos de P00 (JudIT/SSO, push, app nativa).

---

## Hallazgos Diferidos

Ver P00 § Hallazgos Diferidos (D-01 a D-06): SSO JudIT y todo enlace/unificación con plataformas externas (Q6), push, app nativa, i18n, búsqueda avanzada.

---

## Esfuerzo Total

| Fase | Ítems | Esfuerzo estimado | Etapa |
|------|:-----:|:-----------------:|-------|
| F0 Scaffolding + skeleton LIVE | 7 | 8–10 h | MVP |
| F1 CMS Strapi | 6 | 12–16 h | MVP |
| F2 Layout | 4 | 8–10 h | MVP |
| F3 Contenido núcleo | 7 | 14–18 h (depende de insumos del CCL) | MVP |
| F4 Transparencia cifras | 3 | 6–8 h | MVP |
| F6 Hardening | 2 | 4–6 h | MVP |
| **Subtotal MVP** | **29** | **52–68 h** | |
| F5 Participación | 6 | 16–20 h | Post-MVP |
| F7 PWA | 2 | 6–8 h | Visión |
| **Total justicia-sana** | **37** | **74–96 h** | |
| Extensiones SIRAL (paralelo) | 7 | 24–34 h | MVP: A y B |

---

## Criterios de Éxito

### MVP
- [ ] F0 completa → walking skeleton LIVE en `justiciasana.sprintjudicial.com` (sprint 1)
- [ ] F1 completa → el CCL publica un contenido de prueba desde Strapi y el sitio se reconstruye solo
- [ ] F2+F3 completas → las 6 secciones de contenido núcleo publicadas
- [ ] F4 completa → cifras reales anonimizadas de SIRAL en el portal
- [ ] F6 completa → Lighthouse ≥ 95, WCAG AA, security headers verificados
- [ ] Todo cambio pasa `npm run lint && npx astro check && npm test && npm run build`
- [ ] Cada SPEC auditada con protocolo SDD de 8 puntos (adaptación frontend)
- [ ] Ningún dato personal ni token en el cliente; build no se rompe si Strapi/SIRAL están caídos

### Post-MVP
- [ ] F5: encuestas + PQRS + buzón operativos contra endpoints públicos con rate-limit
- [ ] F7: PWA instalable con contenido pedagógico offline

---

## Orden de Implementación Recomendado

```
F0-01..05 → F0-06 (LIVE) → F0-07
                │
F1-01 → F1-02/03 → F1-04 → F1-05 → F1-06
                │
F2 (completa) → F3-01..07 (paralelizables tras F2)
                │
SIRAL-B ──▶ F4-01/02 → F4-03
                │
F6 (cierre MVP) ═══▶ MVP LANZADO
                │
SIRAL-G ──▶ F5 (islands tras endpoints) → F7 (PWA)
```

### Mapa de sprints propuesto

| Sprint | Contenido | Hito |
|--------|-----------|------|
| S01 | F0 completa | **Walking skeleton LIVE** en justiciasana.sprintjudicial.com |
| S02 | F1 completa | **CMS operativo** — CCL publica sin código |
| S03 | F2 completa + F3-01/02 | Portal navegable con primeras secciones |
| S04 | F3-03..07 | Contenido núcleo completo |
| S05 | F4 + F6 (+ SIRAL-A/B en paralelo) | **MVP LANZADO** — piloto Magdalena |
| S06 (post-MVP) | F5 (+ SIRAL-G) | Plataforma participativa |
| S07 (visión) | F7 | PWA |

---

**Versión**: 2.0 — ajustado a Q1–Q7 validados: Strapi día 1, hosting VPS SprintJudicial (patrón blog-sprintjudicial), enfoque MVP sin integraciones externas, PWA como visión
**Fecha**: 2026-07-24

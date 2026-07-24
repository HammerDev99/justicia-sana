# Planning 01 — Plan Estratégico: Línea de Trabajo Justicia Sana

**Fecha**: 2026-07-24
**Origen**: P00_ANALISIS_REQUISITOS (gap analysis propuesta CCL vs SIRAL)
**Objetivo**: Definir la línea de trabajo completa (fases, SPECs, orden, esfuerzo) para desarrollar el portal público del CCL y sus complementos, hasta el piloto Seccional Magdalena.
**Metodología**: SDD v2 (Spec-Driven Development) — Framework CDAID

---

## Estado Previo / Contexto

| Métrica | Valor actual | Target piloto |
|---------|:------------:|:-------------:|
| Repositorio | Vacío | Portal LIVE + islands dinámicas |
| Tests | 0 | ≥ 30 unit (Vitest) + ≥ 15 E2E (Playwright) |
| Páginas | 0 | ≥ 12 páginas funcionales |
| Lighthouse | — | ≥ 95 (performance, a11y, SEO) |
| Backend dinámico | — | 3 endpoints públicos en API SIRAL |

**Stack decidido** (heredado de rugby-bello-site, ver P00 Q2):
Astro 6+ · TypeScript strict · Tailwind CSS 4 · content collections (Markdown) · Vitest · Playwright · ESLint/Prettier · GitHub Actions → Cloudflare Pages.

**Convenciones**: CDAID (CLAUDE.md + agent_docs/ + plannings/sprints/SPECs). Commits: `tipo(alcance): descripcion | SPEC: JS-XX`.

---

## Alcance

### Fase F0 — Scaffolding y Gobierno del Proyecto

| ID | Ítem | Artefactos | Esfuerzo |
|----|------|-----------|:--------:|
| F0-01 | Init Astro + TS strict + Tailwind 4 + estructura `src/` (lib, layouts, components, pages, styles, content) | `package.json`, `astro.config.mjs`, `tsconfig.json` | Bajo |
| F0-02 | Quality gates: ESLint + Prettier (plugin Astro) + Vitest + Playwright + `astro check` | configs + `tests/` | Bajo |
| F0-03 | CI GitHub Actions (lint + check + test + build) | `.github/workflows/ci.yml` | Bajo |
| F0-04 | CDAID setup: CLAUDE.md definitivo, agent_docs/ (architecture, code_conventions, testing, workflow, antipatterns, project_status), templates de sprint/SPEC | `CLAUDE.md`, `agent_docs/*` | Medio |
| F0-05 | Design tokens institucionales (colores Rama Judicial, tipografía, contraste AA) | `src/styles/global.css` | Bajo |

### Fase F1 — Layout y Sistema de Diseño

| ID | Ítem | Artefactos | Esfuerzo |
|----|------|-----------|:--------:|
| F1-01 | BaseLayout + PageLayout con SEO (meta, OG, sitemap, robots) | `src/layouts/` | Medio |
| F1-02 | Header/Footer institucionales + navegación accesible (keyboard, ARIA) | `src/components/` | Medio |
| F1-03 | Componentes UI base: Card, Callout legal, Timeline, Accordion (FAQ), tabla normativa | `src/components/ui/` | Medio |
| F1-04 | Página de inicio: misión del CCL, accesos rápidos (denunciar → SIRAL, ayuda psicológica, normativa) | `src/pages/index.astro` | Medio |

### Fase F2 — Contenido Estático Núcleo (Componente 2 de la propuesta)

| ID | Ítem | GAP (P00) | Esfuerzo |
|----|------|:---------:|:--------:|
| F2-01 | Content collections + esquemas Zod (normas, noticias, recursos, integrantes, eventos) | — | Medio |
| F2-02 | Sección "¿Quiénes somos?": estructura CCL, integrantes, funciones, reglamento | G-01 | Medio |
| F2-03 | Biblioteca de Normativa: Ley 1010/2006, Res. 2646/2008, 652/2012, 1356/2012, 3461/2025, Ley 1581/2012, 2213/2022, circulares CSJ — con resúmenes en lenguaje claro | G-02 | Alto |
| F2-04 | Material pedagógico: ¿Qué es acoso laboral?, modalidades, cómo actuar (víctima/testigo), infografías descargables | G-03 | Alto |
| F2-05 | Noticias y jurisprudencia: blog con artículos, campañas, novedades | G-04 | Medio |
| F2-06 | Canales de ayuda: atención psicológica (ARL, bienestar), contacto CCL, ruta de denuncia interna/externa | G-05 | Medio |
| F2-07 | Capacitaciones y comunicados: calendario de talleres, boletines del CCL | G-13, G-14 | Medio |
| F2-08 | Enlace a soporte JudIT + enlace "Radicar queja" → SIRAL (aclarando que la queja formal es del módulo interno) | G-16 | Bajo |

### Fase F3 — Integración con SIRAL (build-time, solo lectura)

| ID | Ítem | GAP | Esfuerzo |
|----|------|:---:|:--------:|
| F3-01 | Cliente API tipado (`src/lib/`) para API SIRAL — patrón strapi_integration de rugby-bello | G-20 | Medio |
| F3-02 | [SIRAL] Endpoint público `GET /api/v1/estadisticas/publicas` (agregados anonimizados por seccional) | G-20 | Medio |
| F3-03 | Página "Transparencia y cifras": estadísticas anonimizadas renderizadas en build (quejas por trimestre, tiempos promedio, tipos de conducta) | G-20 | Medio |

### Fase F4 — Funcionalidades Dinámicas (islands + API SIRAL extendida)

| ID | Ítem | GAP | Esfuerzo |
|----|------|:---:|:--------:|
| F4-01 | [SIRAL] Módulo encuestas: entidades + use cases + endpoints públicos anónimos con rate-limit (crear respuesta, agregados) | G-08 | Alto |
| F4-02 | Island "Encuesta de clima" (formulario anónimo, sin cookies identificables) | G-08 | Medio |
| F4-03 | [SIRAL] Endpoint PQRS público + notificación email al CCL | G-06 | Medio |
| F4-04 | Island "PQRS convivencia laboral" con validación y aviso Habeas Data | G-06 | Medio |
| F4-05 | [SIRAL] Buzón anónimo de alertas tempranas (sin metadatos identificables, texto plano sanitizado) | G-07 | Medio |
| F4-06 | Island "Buzón anónimo" + página de política de uso responsable | G-07 | Medio |

### Fase F5 — Deploy y Producción

| ID | Ítem | Esfuerzo |
|----|------|:--------:|
| F5-01 | Cloudflare Pages (proyecto justicia-sana) + variables build | Bajo |
| F5-02 | CD: GitHub Actions → Cloudflare Pages en merge a main | Bajo |
| F5-03 | DNS subdominio (supuesto Q5) + HTTPS | Bajo |
| F5-04 | Auditoría Lighthouse + WCAG AA + security headers (CSP) | Medio |

### Fase F6 — PWA y Acceso Móvil (G-17)

| ID | Ítem | Esfuerzo |
|----|------|:--------:|
| F6-01 | Manifest + service worker (contenido pedagógico offline-first) | Medio |
| F6-02 | Coordinación con SIRAL P04_PWA_OFFLINE para experiencia móvil del módulo interno | Medio |

### Extensiones en repo SIRAL (línea paralela — plannings P10+ de SIRAL_System)

> Estos ítems del gap analysis pertenecen al módulo interno y se planifican/ejecutan en `SIRAL_System`, no aquí. Se listan para trazabilidad de la línea de trabajo completa.

| ID | Ítem | GAP |
|----|------|:---:|
| SIRAL-A | Plazos Res. 3461/2025: procedimiento ≤ 65 días calendario, etapas 5–15 días, alertas al Secretario | G-10 |
| SIRAL-B | Calendario de reuniones CCL (mensuales + extraordinarias) | G-09 |
| SIRAL-C | Derivaciones: marcado acoso sexual/violencia de género + protocolo alterno | G-11 |
| SIRAL-D | Informe de remisión a autoridades externas (Inspector de Trabajo/Procuraduría) | G-12 |
| SIRAL-E | Parametrización piloto Seccional Magdalena (branding, sedes, comité) | G-19 |
| SIRAL-F | Endpoints públicos F3-02/F4-01/F4-03/F4-05 (implementación backend) | G-06/07/08/20 |

---

## Hallazgos Diferidos

Ver P00 § Hallazgos Diferidos (D-01 a D-06): SSO JudIT, push, app nativa, tickets JudIT automáticos, i18n, buscador NoSQL.

---

## Esfuerzo Total

| Fase | Ítems | Esfuerzo estimado |
|------|:-----:|:-----------------:|
| F0 Scaffolding | 5 | 6–8 h |
| F1 Layout | 4 | 8–10 h |
| F2 Contenido | 8 | 16–20 h (depende de insumos del CCL) |
| F3 Integración SIRAL | 3 | 6–8 h |
| F4 Dinámico | 6 | 16–20 h |
| F5 Deploy | 4 | 4–6 h |
| F6 PWA | 2 | 6–8 h |
| **Total justicia-sana** | **32** | **62–80 h** |
| Extensiones SIRAL (paralelo) | 6 | 20–30 h |

---

## Criterios de Éxito

- [ ] F0–F2 completadas → portal navegable con contenido núcleo (hito "Portal informativo")
- [ ] F3 completada → transparencia con datos reales de SIRAL (hito "Portal con cifras")
- [ ] F4 completada → encuestas + PQRS + buzón operativos (hito "Plataforma participativa")
- [ ] F5 completada → LIVE en producción con Lighthouse ≥ 95 y WCAG AA (hito "Piloto lanzado")
- [ ] Todo cambio pasa `npm run lint && npx astro check && npm test && npm run build`
- [ ] Cada SPEC auditada con protocolo SDD de 8 puntos (adaptación frontend)
- [ ] Ningún dato personal ni token en el cliente; islands solo contra endpoints públicos anonimizados

---

## Orden de Implementación Recomendado

```
F0 (completa) → F1 (completa) → F2-01 → F2-02..F2-08 (paralelizables)
                                   │
                                   ├─▶ F5-01..F5-03 (deploy temprano tras F2 — hito visible)
                                   │
F3-02 [SIRAL] ──▶ F3-01 → F3-03
F4-01/03/05 [SIRAL] ──▶ F4-02/04/06 (cada island depende de su endpoint)
F5-04 → F6 (al final, sobre sitio estable)
```

**Regla**: deploy temprano (como rugby-bello) — el portal informativo (F2) sale a producción sin esperar F3/F4; las fases dinámicas se liberan incrementalmente.

### Mapa de sprints propuesto

| Sprint | Contenido | Hito |
|--------|-----------|------|
| S01 | F0 completa + F1-01/02 | Esqueleto navegable |
| S02 | F1-03/04 + F2-01/02/03 | Portal informativo (alpha) |
| S03 | F2-04..F2-08 + F5-01..03 | **LIVE — Portal informativo** |
| S04 | F3 + [SIRAL-F parcial] | Transparencia con cifras |
| S05 | F4 + [SIRAL-F resto] | Plataforma participativa |
| S06 | F5-04 + F6 | Piloto completo + PWA |

---

**Versión**: 1.0
**Fecha**: 2026-07-24

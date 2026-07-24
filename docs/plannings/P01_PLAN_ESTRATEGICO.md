# Planning 01 — Plan Estratégico: Línea de Trabajo Justicia Sana

**Fecha**: 2026-07-24
**Origen**: P00_ANALISIS_REQUISITOS v2.0 (gap analysis + supuestos Q1–Q7 validados + decisiones D-A a D-D)
**Objetivo**: Definir la línea de trabajo completa (fases, ítems, orden, esfuerzo) para llevar el portal público del CCL a un **MVP en producción** en `justiciasana.sprintjudicial.com`, con publicación de contenido sin tocar código desde el día 1.
**Metodología**: SDD v2 (Spec-Driven Development) — Framework CDAID

---

## Estado Previo / Contexto

| Métrica            |       Valor actual        |                 Target MVP                 |
| ------------------ | :-----------------------: | :----------------------------------------: |
| Repositorio        | Solo planeación (P00/P01) |       Portal LIVE con CMS operativo        |
| Tests              |             0             | ≥ 25 unit (Vitest) + ≥ 12 E2E (Playwright) |
| Páginas            |             0             |          ≥ 12 páginas funcionales          |
| Lighthouse         |             —             |       ≥ 95 (performance, a11y, SEO)        |
| Editores autónomos |             0             | CCL publica desde Strapi sin desarrollador |

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
> **Ejecutado en Sprint S01** — ver `docs/sprints/S01_SCAFFOLDING/` (SPECs formales + resumen de progreso).

| ID    | Ítem                                                                                                                                                    | Artefactos                                          | Esfuerzo | Estado |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | :------: | :----: |
| F0-01 | Init Astro + TS strict + Tailwind 4 + estructura `src/` (lib, layouts, components, pages, styles)                                                       | `package.json`, `astro.config.mjs`, `tsconfig.json` |   Bajo   | `[x]`  |
| F0-02 | Quality gates: ESLint + Prettier (plugin Astro) + Vitest + Playwright + `astro check`                                                                   | configs + `tests/`                                  |   Bajo   | `[x]`  |
| F0-03 | CI GitHub Actions: lint + check + test + build en cada push/PR                                                                                          | `.github/workflows/ci.yml`                          |   Bajo   | `[x]`¹ |
| F0-04 | CDAID setup: CLAUDE.md definitivo, agent_docs/ (architecture, code_conventions, testing, workflow, antipatterns, project_status), templates sprint/SPEC | `CLAUDE.md`, `agent_docs/*`                         |  Medio   | `[x]`  |
| F0-05 | Dockerfile multi-stage (node:22 build → nginx:alpine) + `nginx.conf` (cache estáticos, gzip, security headers) — patrón blog-sprintjudicial             | `Dockerfile`, `nginx.conf`                          |   Bajo   | `[x]`² |
| F0-06 | Servicio EasyPanel + DNS `justiciasana.sprintjudicial.com` + Traefik HTTPS + auto-deploy en push a `main`                                               | EasyPanel (VPS) + guía en `docs/`                   |  Medio   | `[x]`³ |
| F0-07 | Design tokens institucionales (colores Rama Judicial, tipografía, contraste AA)                                                                         | `src/styles/global.css`                             |   Bajo   | `[x]`  |

¹ Creado y estructuralmente válido; sin ejecución real verificada en GitHub Actions (requiere push remoto).
² Creado y revisado manualmente; `docker build` no ejecutable en el sandbox de desarrollo (sin daemon Docker con privilegios). Verificación real: primer build en EasyPanel (ver nota 3).
³ Rama `main` creada a partir de la rama de trabajo (repo no tenía `main` aún) y configurada en EasyPanel. Build confirmado exitoso por el propietario (2026-07-24): `astro build` + imagen `easypanel/sprintjudicial/justicia-sana` + nginx sirviendo tráfico. **Walking skeleton LIVE** — resolución pública de `justiciasana.sprintjudicial.com` (DNS/Traefik) pendiente de confirmación del propietario, sin bloquear el resto del plan.

### Fase F1 — CMS Strapi (publicación sin código, día 1)

> **Ejecutado en Sprint S02** — ver `docs/sprints/S02_CMS_STRAPI/` (SPECs formales + resumen de progreso).

| ID    | Ítem                                                                                                                                                                                         |   GAP/Decisión    | Esfuerzo | Estado |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------: | :------: | :----: |
| F1-01 | Aprovisionar Strapi v5 + PostgreSQL en EasyPanel (subdominio cms, HTTPS Traefik, backups)                                                                                                    |        D-C        |  Medio   | `[ ]`¹ |
| F1-02 | Content types: `norma`, `articulo` (noticias/jurisprudencia), `recurso-pedagogico`, `integrante-comite`, `capacitacion`, `comunicado`, `canal-ayuda`, single types (`quienes-somos`, `home`) | G-01..05, G-13/14 |   Alto   | `[x]`² |
| F1-03 | Roles y permisos: rol Editor CCL (publicar sin admin), API token read-only para build                                                                                                        |        D-C        |   Bajo   | `[ ]`¹ |
| F1-04 | Cliente Strapi tipado en Astro (`src/lib/`) — fetch build-time, tipos `readonly`, sin token en cliente (patrón strapi_integration de rugby-bello)                                            |        Q2         |  Medio   | `[x]`  |
| F1-05 | Webhook Strapi publish → deploy hook EasyPanel (rebuild automático al publicar)                                                                                                              |        D-D        |   Bajo   | `[ ]`¹ |
| F1-06 | Manual del editor CCL (guía breve con capturas: crear/publicar contenido)                                                                                                                    |        Q2         |  Medio   | `[x]`³ |

¹ **Bloqueante de la instancia real de Strapi** — requiere acción humana en el panel EasyPanel/Strapi Admin del VPS. Guía ejecutable: `docs/DEPLOYMENT_STRAPI.md`.
² Content types documentados como contrato JSON exacto (`docs/content-types/strapi-justicia-sana-content-types.md`); creación real en el Strapi Admin depende de F1-01.
³ Manual completo en su estructura y flujo; capturas de pantalla reales diferidas hasta que exista una instancia Strapi (F1-01).

### Fase F2 — Layout y Sistema de Diseño

> **Ejecutado en Sprint S03** — ver `docs/sprints/S03_LAYOUT_UI/` (SPECs formales + resumen de progreso).

| ID    | Ítem                                                                                               | Esfuerzo | Estado |
| ----- | -------------------------------------------------------------------------------------------------- | :------: | :----: |
| F2-01 | BaseLayout + PageLayout con SEO completo (meta, OG, sitemap, robots)                               |  Medio   | `[x]`  |
| F2-02 | Header/Footer institucionales + navegación accesible (keyboard, ARIA)                              |  Medio   | `[x]`  |
| F2-03 | Componentes UI: Card, Callout legal, Accordion (FAQ), tabla normativa, banner de ayuda psicológica |  Medio   | `[x]`  |
| F2-04 | Home: misión del CCL, accesos rápidos (radicar queja → SIRAL, ayuda psicológica, normativa)        |  Medio   | `[x]`¹ |

¹ Ampliado más allá del alcance literal: también crea `/quienes-somos`, `/normativa` y `/canales-de-ayuda`, resolviendo el hallazgo F0-A de `AUDIT_01` (enlaces con 404). Contenido estático trazable a `CLAUDE.md`/la propuesta, sin fabricar datos de contacto; F3 lo reemplaza con Strapi.

### Fase F3 — Contenido Núcleo (Componente 2 de la propuesta, servido desde Strapi)

> **Ejecutado en Sprint S04** — ver `docs/sprints/S04_CONTENIDO_NUCLEO/` (SPECs formales + resumen de progreso).

| ID    | Ítem                                                                                                                                                                      |   GAP   | Esfuerzo | Estado |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :------: | :----: |
| F3-01 | "¿Quiénes somos?": estructura CCL, integrantes, funciones, reglamento                                                                                                     |  G-01   |  Medio   | `[x]`¹ |
| F3-02 | Biblioteca de Normativa: Ley 1010/2006, Res. 2646/2008, 652/2012, 1356/2012, 3461/2025, Ley 1581/2012, 2213/2022, circulares CSJ — con resúmenes en lenguaje claro y PDFs |  G-02   |   Alto   | `[x]`¹ |
| F3-03 | Material pedagógico: ¿Qué es acoso laboral?, modalidades, cómo actuar (víctima/testigo), infografías descargables                                                         |  G-03   |   Alto   | `[x]`¹ |
| F3-04 | Noticias y jurisprudencia: listado + detalle de artículos, campañas                                                                                                       |  G-04   |  Medio   | `[x]`¹ |
| F3-05 | Canales de ayuda: atención psicológica (ARL, bienestar), contacto CCL, ruta de denuncia interna/externa                                                                   |  G-05   |  Medio   | `[x]`¹ |
| F3-06 | Capacitaciones y comunicados del CCL (calendario informativo + boletines)                                                                                                 | G-13/14 |  Medio   | `[x]`¹ |
| F3-07 | Página "Radicar una queja": explica el canal formal y enlaza a SIRAL (aclarando confidencialidad y no-anonimato)                                                          |    —    |   Bajo   | `[x]`  |

¹ Código cableado contra el cliente Strapi real (F1-04), con degradación agraciada extremo a extremo (verificada contra `cms.sprintjudicial.com`, que hoy responde 403 — sin permisos públicos habilitados todavía). El contenido real (biografías, normas cargadas, recursos, artículos, capacitaciones) depende de F1-01/03/05 (acción humana en el VPS) + insumos que el CCL debe aportar — mismo patrón operativo ya auditado y aprobado en F1 (`AUDIT_02`). F3-02/F3-01 conservan además el contenido estático ya auditado de F2 como fallback mientras Strapi esté vacío.

### Fase F4 — Transparencia con Cifras (integración SIRAL build-time, solo lectura)

> **Ejecutado en Sprint S05** — ver `docs/sprints/S05_TRANSPARENCIA_CIFRAS/` (SPECs formales + resumen de progreso). Fase cross-repo: F4-01 se implementó en `SIRAL_System`.

| ID    | Ítem                                                                                                                 | GAP  | Esfuerzo | Estado |
| ----- | -------------------------------------------------------------------------------------------------------------------- | :--: | :------: | :----: |
| F4-01 | [SIRAL] Endpoint público `GET /api/v1/estadisticas/publicas` — agregados anonimizados por seccional, cacheable       | G-20 |  Medio   | `[x]`¹ |
| F4-02 | Cliente API SIRAL tipado en `src/lib/` (build-time fetch, resiliente a API caída: build no se rompe)                 | G-20 |  Medio   | `[x]`² |
| F4-03 | Página "Transparencia y cifras": quejas por trimestre, tiempos promedio, tipos de conducta (visualización accesible) | G-20 |  Medio   | `[x]`² |

¹ Implementado en `SIRAL_System` (commit `5f75371`, rama `claude/justicia-sana-planning-nb8emp`): `GET /api/v1/estadisticas/publicas`, sin JWT, agregación pura con TDD real. Ver `SIRAL_System/agent_docs/project_status.md`.
² Cableado contra el endpoint real de SIRAL con degradación agraciada verificada de extremo a extremo (probado contra `https://api.siral.sprintjudicial.com` real → `ENOTFOUND`, sitio construido igual) **y** verificado con datos reales sembrados en una instancia local de SIRAL — ambos caminos confirmados, no solo el de degradación. La API productiva de SIRAL sigue "pendiente deploy" (mismo patrón operativo que Strapi en F1/F3).

### Fase F5 — Participación Ciudadana (post-MVP — islands + API SIRAL extendida)

| ID    | Ítem                                                                                         | GAP  | Esfuerzo |
| ----- | -------------------------------------------------------------------------------------------- | :--: | :------: |
| F5-01 | [SIRAL] Módulo encuestas: entidades + use cases + endpoints públicos anónimos con rate-limit | G-08 |   Alto   |
| F5-02 | Island "Encuesta de clima" (formulario anónimo, sin cookies identificables)                  | G-08 |  Medio   |
| F5-03 | [SIRAL] Endpoint PQRS público + notificación email al CCL                                    | G-06 |  Medio   |
| F5-04 | Island "PQRS convivencia laboral" con validación y aviso Habeas Data                         | G-06 |  Medio   |
| F5-05 | [SIRAL] Buzón anónimo de alertas tempranas (sin metadatos identificables, texto sanitizado)  | G-07 |  Medio   |
| F5-06 | Island "Buzón anónimo" + política de uso responsable                                         | G-07 |  Medio   |

### Fase F6 — Hardening y Auditoría del MVP

| ID    | Ítem                                                                                                                                                 | Esfuerzo |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | :------: |
| F6-01 | Auditoría Lighthouse ≥ 95 + WCAG AA (axe/manual) + corrección de hallazgos                                                                           |  Medio   |
| F6-02 | Security headers en nginx (CSP, HSTS, X-Content-Type-Options) + revisión de exposición de Strapi (admin no público si es viable, rate-limit Traefik) |  Medio   |

### Fase F7 — PWA (visión, etapa posterior — Q4)

| ID    | Ítem                                                                             | Esfuerzo |
| ----- | -------------------------------------------------------------------------------- | :------: |
| F7-01 | Manifest + service worker (contenido pedagógico offline-first, instalable)       |  Medio   |
| F7-02 | Coordinación con SIRAL P04_PWA_OFFLINE para experiencia móvil del módulo interno |  Medio   |

### Extensiones en repo SIRAL (línea paralela — plannings P10+ de SIRAL_System)

> Pertenecen al módulo interno; se planifican y ejecutan en `SIRAL_System`. Se listan para trazabilidad.

| ID      | Ítem                                                                                    |    GAP     | Etapa    |
| ------- | --------------------------------------------------------------------------------------- | :--------: | -------- |
| SIRAL-A | Parametrización por seccional: branding, sedes, comité (piloto Magdalena)               |    G-19    | MVP (Q7) |
| SIRAL-B | Endpoint público de estadísticas (soporte a F4-01)                                      |    G-20    | MVP      |
| SIRAL-C | Plazos Res. 3461/2025: procedimiento ≤ 65 días, etapas 5–15 días, alertas al Secretario |    G-10    | Post-MVP |
| SIRAL-D | Calendario de reuniones CCL (mensuales + extraordinarias)                               |    G-09    | Post-MVP |
| SIRAL-E | Derivaciones: marcado acoso sexual/violencia de género + protocolo alterno              |    G-11    | Post-MVP |
| SIRAL-F | Informe de remisión a autoridades externas                                              |    G-12    | Post-MVP |
| SIRAL-G | Endpoints encuestas/PQRS/buzón (soporte a F5)                                           | G-06/07/08 | Post-MVP |

---

## Definición del MVP

**MVP = F0 + F1 + F2 + F3 + F4 + F6** → portal informativo LIVE en `justiciasana.sprintjudicial.com`, con el CCL publicando contenido desde Strapi sin tocar código, cifras públicas de SIRAL, Lighthouse ≥ 95 y WCAG AA.

Fuera del MVP (etapas posteriores, en orden): **F5** (participación: encuestas, PQRS, buzón) → **F7** (PWA) → diferidos de P00 (JudIT/SSO, push, app nativa).

---

## Hallazgos Diferidos

Ver P00 § Hallazgos Diferidos (D-01 a D-06): SSO JudIT y todo enlace/unificación con plataformas externas (Q6), push, app nativa, i18n, búsqueda avanzada.

---

## Esfuerzo Total

| Fase                           | Ítems  |          Esfuerzo estimado           | Etapa      |
| ------------------------------ | :----: | :----------------------------------: | ---------- |
| F0 Scaffolding + skeleton LIVE |   7    |                8–10 h                | MVP        |
| F1 CMS Strapi                  |   6    |               12–16 h                | MVP        |
| F2 Layout                      |   4    |                8–10 h                | MVP        |
| F3 Contenido núcleo            |   7    | 14–18 h (depende de insumos del CCL) | MVP        |
| F4 Transparencia cifras        |   3    |                6–8 h                 | MVP        |
| F6 Hardening                   |   2    |                4–6 h                 | MVP        |
| **Subtotal MVP**               | **29** |             **52–68 h**              |            |
| F5 Participación               |   6    |               16–20 h                | Post-MVP   |
| F7 PWA                         |   2    |                6–8 h                 | Visión     |
| **Total justicia-sana**        | **37** |             **74–96 h**              |            |
| Extensiones SIRAL (paralelo)   |   7    |               24–34 h                | MVP: A y B |

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

| Sprint         | Contenido                         | Hito                                                         |
| -------------- | --------------------------------- | ------------------------------------------------------------ |
| S01            | F0 completa                       | **Walking skeleton LIVE** en justiciasana.sprintjudicial.com |
| S02            | F1 completa                       | **CMS operativo** — CCL publica sin código                   |
| S03            | F2 completa + F3-01/02            | Portal navegable con primeras secciones                      |
| S04            | F3-03..07                         | Contenido núcleo completo                                    |
| S05            | F4 + F6 (+ SIRAL-A/B en paralelo) | **MVP LANZADO** — piloto Magdalena                           |
| S06 (post-MVP) | F5 (+ SIRAL-G)                    | Plataforma participativa                                     |
| S07 (visión)   | F7                                | PWA                                                          |

---

**Versión**: 2.0 — ajustado a Q1–Q7 validados: Strapi día 1, hosting VPS SprintJudicial (patrón blog-sprintjudicial), enfoque MVP sin integraciones externas, PWA como visión
**Fecha**: 2026-07-24

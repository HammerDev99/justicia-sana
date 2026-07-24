# CLAUDE.md — Justicia Sana: Portal del Comité de Convivencia Laboral

Portal web público del Comité de Convivencia Laboral (CCL) de la Rama Judicial de Colombia — piloto Seccional Magdalena. Complementa al sistema SIRAL (módulo interno de gestión de quejas de acoso laboral) con pedagogía, transparencia, normativa y participación (encuestas, PQRS, buzón anónimo). Alineado con Resolución 3461/2025.

Origen: propuesta de Leonardo Fabio Gómez Colón (CCL Magdalena) + Daniel Arbeláez Álvarez (Ing. software, Seccional Antioquia). Ver `docs/cliente/PROPUESTA_CCL_PLATAFORMA.md`.

## Stack

- **Frontend**: Astro 6+ | TypeScript strict | Tailwind CSS 4 (referencia de código: rugby-bello-site)
- **CMS**: Strapi v5 + PostgreSQL en VPS SprintJudicial (EasyPanel) — publicación sin código desde el día 1; webhook publish → rebuild
- **Backend dinámico** (post-MVP): API FastAPI de SIRAL extendida (endpoints públicos anonimizados) — repo `SIRAL_System`
- **Hosting**: VPS SprintJudicial — Hostinger, Ubuntu + EasyPanel + Traefik. Dockerfile multi-stage (node build → nginx:alpine), patrón `blog-sprintjudicial`
- **Testing**: Vitest (unit) | Playwright (E2E)
- **CI/CD**: GitHub Actions (quality gates) + auto-deploy EasyPanel en push a `main`
- **Producción**: `justiciasana.sprintjudicial.com` (HTTPS vía Traefik)

## Convenciones (obligatorias)

- Responder en español, código en inglés
- TypeScript strict: ningún `any`, tipos para todas las respuestas de API
- Componentes Astro HTML-first, zero JS por defecto; islands solo para PQRS/encuestas/buzón
- Mobile-first, accesibilidad WCAG AA, SEO completo en cada página
- Seguridad: ningún token ni dato personal en cliente; islands solo contra endpoints públicos anonimizados con rate-limit
- Inmutabilidad: `as const`, `readonly`, no mutar datos de API
- Commits: español, `tipo(alcance): descripcion | SPEC: JS-XX`. Sin firma IA

## Estructura

```
justicia-sana/
├── CLAUDE.md                 # Este archivo (mapa del proyecto)
├── README.md                 # Presentación pública del proyecto
├── .claude/
│   ├── skills/sdd-framework-v2/   # Skill CDAID v2 (PDCA) — instalado localmente
│   ├── skills/refactoring/   # Instrumento Check P7 (code smells)
│   ├── skills/design-patterns/  # Instrumento Check P8 (GoF, SOLID)
│   └── agents/               # Sub-agentes con scope attenuation (8)
├── agent_docs/               # Documentación técnica por tema (L2)
│   └── project_status.md     # Estado actual (resto de archivos: F0-04)
├── docs/                     # L3 — un directorio por propósito PDCA
│   ├── cliente/              # Propuesta original (docx + md)
│   ├── content-types/        # Contrato JSON de content types Strapi
│   ├── plannings/            # [Plan] P00, P01 + template
│   ├── sprints/              # [Do] S01_SCAFFOLDING, S02_CMS_STRAPI (SPECs + resumen) + _TEMPLATE_SPRINT
│   ├── validate/             # [Check/Act] AUDIT_NN consolidadas + README
│   ├── templates/            # TEMPLATE_SDD_SPEC, TEMPLATE_AUDITORIA
│   ├── prompts/              # Prompts BASE de orquestación (Plan/Check/Do)
│   ├── diagrams/             # Diagramas de arquitectura
│   └── DEPLOYMENT.md         # Guía EasyPanel/DNS (F0-06)
└── src/                      # lib/, layouts/, components/, pages/, styles/
```

## Quick Start

```bash
npm install
npm run dev          # Dev server en http://localhost:4321
npm run build        # Build estático
npm run preview      # Sirve dist/ (requerido por E2E)
```

## Comandos frecuentes

```bash
npm run lint && npx astro check && npm test && npm run build   # quality gate completo
npm run test:e2e      # Playwright (requiere build + preview)
npm run lint:fix      # Autofix ESLint + Prettier
```

## Estado Actual

```
Fase:      SPRINT S01 completo (Fase F0 — Scaffolding) — walking skeleton LIVE. Sprint S02 (F1) en curso
Progreso:  [###                 ] ~10% implementación (10/29 ítems MVP)
```

| Métrica   | Valor                                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------- |
| Plannings | P00 v2 (requisitos + gap analysis + Q1–Q7 validados), P01 v2 (MVP: F0–F4+F6, 29 ítems; post-MVP: F5, F7) |
| Sprints   | S01 completo (F0) — ver `docs/sprints/S01_SCAFFOLDING/00_RESUMEN_SPRINT.md`. S02 (F1) — 3/6 en curso     |
| Tests     | 34 unit (Vitest) + 4 E2E (Playwright), todos en verde                                                    |
| Deploy    | **LIVE** — build confirmado en EasyPanel, `justiciasana.sprintjudicial.com`                              |
| Pendiente | F1-01/03/05 (Strapi real) — acción humana en el VPS, guía en `docs/DEPLOYMENT_STRAPI.md`                 |
| MVP       | Portal informativo + CMS Strapi + cifras SIRAL en justiciasana.sprintjudicial.com                        |

## Documentación (divulgación progresiva)

| Necesitas...                                        | Consulta                                                                                           |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Propuesta del cliente                               | `docs/cliente/PROPUESTA_CCL_PLATAFORMA.md`                                                         |
| Requisitos, gap analysis SIRAL, supuestos           | `docs/plannings/P00_ANALISIS_REQUISITOS.md`                                                        |
| Línea de trabajo (fases, sprints, esfuerzo)         | `docs/plannings/P01_PLAN_ESTRATEGICO.md`                                                           |
| Adecuar Strapi a producción (Postgres, secrets)     | `docs/plannings/P02_STRAPI_PRODUCCION.md`                                                          |
| Metodología SDD Framework v2 (CDAID v2, ciclo PDCA) | Skill local `.claude/skills/sdd-framework-v2/` (canónico: repo `HammerDev99/sdd-framework`)        |
| Auditorías y gates entre fases                      | `docs/validate/README.md` + `docs/prompts/01_BASE_CHECK_*`                                         |
| Arquitectura, convenciones, testing, antipatrones   | `agent_docs/` (architecture, code_conventions, testing, workflow, antipatterns)                    |
| Integración con Strapi (cliente, content types)     | `agent_docs/strapi_integration.md` + `docs/content-types/`                                         |
| Desplegar el sitio en el VPS (EasyPanel/DNS)        | `docs/DEPLOYMENT.md`                                                                               |
| Aprovisionar Strapi (roles, webhook)                | `docs/DEPLOYMENT_STRAPI.md`                                                                        |
| Manual de publicación para el CCL                   | `docs/MANUAL_EDITOR_CCL.md`                                                                        |
| Referencia código frontend (Astro/TS/Tailwind)      | Repo `rugby-bello-site` (`agent_docs/architecture.md`, `strapi_integration.md`)                    |
| Referencia dominio acoso laboral                    | Repo `SIRAL_System` (`CLAUDE.md`, `agent_docs/`)                                                   |
| Referencia deploy VPS (EasyPanel/Traefik/nginx)     | Repos `HammerDev99/blog-sprintjudicial` (Dockerfile, nginx.conf) y `HammerDev99/HammeredSolutions` |

## Reglas Críticas (resumen)

1. **TypeScript strict**: ningún `any`, tipos para toda entidad externa
2. **Zero JS por defecto**: islands solo para interactividad real (F5, post-MVP)
3. **Seguridad**: nada confidencial en este repo/sitio — lo confidencial vive en SIRAL
4. **Accesibilidad**: WCAG AA, HTML semántico, keyboard nav
5. **Performance**: Lighthouse ≥ 95
6. **SDD v2 (PDCA)**: todo cambio nace de un SPEC (`JS-XX`) en un sprint (Do); cada gate de fase se audita en `docs/validate/AUDIT_NN_*.md` (Check) y sus correcciones se documentan ahí (Act)
7. **Quality gates**: `npm run lint && npx astro check && npm test && npm run build` antes de commit

## Contexto Legal

| Norma                     | Alcance                                                                         |
| ------------------------- | ------------------------------------------------------------------------------- |
| Ley 1010 de 2006          | Definición de acoso laboral, conductas, procedimientos                          |
| Resolución 3461 de 2025   | CCL: conformación, procedimiento ≤ 65 días, confidencialidad, apoyo psicológico |
| Ley 1581 de 2012          | Habeas Data — el portal no recolecta datos personales sin aviso                 |
| Ley 2213 de 2022          | Notificaciones digitales (lado SIRAL)                                           |
| Res. 652/2012 y 1356/2012 | Regulación anterior del CCL (referencia histórica)                              |

## Compact Instructions

Al compactar, SIEMPRE preservar:

- Las 7 reglas críticas
- La decisión de arquitectura (estático en VPS + Strapi día 1 + islands post-MVP contra API SIRAL)
- Las decisiones validadas Q1–Q7 y D-A..D-D de P00
- El estado actual, la definición de MVP y el mapa de sprints de P01
- Convenciones de commits y código

---

**Versión**: 2.0
**Fecha**: 2026-07-24

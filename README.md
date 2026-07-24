# Justicia Sana — Portal del Comité de Convivencia Laboral

Portal web público del **Comité de Convivencia Laboral (CCL) de la Rama Judicial de Colombia** — piloto Seccional Magdalena. Promueve la pedagogía, transparencia y prevención del acoso laboral, en armonía con la **Resolución 3461 de 2025** del Ministerio de Trabajo.

Complementa al sistema [SIRAL](https://github.com/HammerDev99/SIRAL_System) (módulo interno confidencial de gestión de quejas de acoso laboral) con la cara pública del Comité: normativa en lenguaje claro, material pedagógico, canales de ayuda, cifras de transparencia y —en etapas posteriores— participación ciudadana (encuestas de clima, PQRS, buzón anónimo).

> Iniciativa de **Leonardo Fabio Gómez Colón** (CCL Seccional Magdalena) en articulación con **Daniel Arbeláez Álvarez** (Ing. de software, Seccional Antioquia). Propuesta completa en [`docs/cliente/PROPUESTA_CCL_PLATAFORMA.md`](docs/cliente/PROPUESTA_CCL_PLATAFORMA.md).

## Arquitectura

```
Editores CCL ─▶ Strapi v5 (VPS)  ─ publish webhook ─▶ rebuild
                                                        │
GitHub ─▶ EasyPanel build (Astro + fetch Strapi) ─▶ nginx estático
                                                        │
Ciudadanía ─▶ Traefik HTTPS ─▶ justiciasana.sprintjudicial.com
                                                        │
Funcionarios (módulo interno) ─▶ SIRAL (FastAPI + PostgreSQL, VPS)
```

- **Frontend**: Astro 6+ · TypeScript strict · Tailwind CSS 4 — HTML-first, zero JS por defecto
- **CMS**: Strapi v5 + PostgreSQL (VPS SprintJudicial, EasyPanel) — el CCL publica sin tocar código
- **Hosting**: VPS Ubuntu + EasyPanel + Traefik; contenedor nginx estático (Dockerfile multi-stage)
- **Datos dinámicos**: API pública anonimizada de SIRAL (estadísticas; post-MVP: encuestas, PQRS, buzón)
- **Calidad**: Vitest · Playwright · ESLint/Prettier · GitHub Actions · Lighthouse ≥ 95 · WCAG AA

## Estado

**Planeación completa — implementación no iniciada.** MVP definido: portal informativo + CMS + cifras de transparencia (fases F0–F4 + F6, 5 sprints). Ver [`agent_docs/project_status.md`](agent_docs/project_status.md).

## Documentación (SDD v2 / CDAID)

| Documento | Contenido |
|-----------|-----------|
| [`CLAUDE.md`](CLAUDE.md) | Mapa del proyecto, reglas críticas, convenciones |
| [`docs/cliente/`](docs/cliente/) | Propuesta original del CCL (docx + Markdown) |
| [`docs/plannings/P00_ANALISIS_REQUISITOS.md`](docs/plannings/P00_ANALISIS_REQUISITOS.md) | Requisitos, gap analysis vs SIRAL, decisiones validadas |
| [`docs/plannings/P01_PLAN_ESTRATEGICO.md`](docs/plannings/P01_PLAN_ESTRATEGICO.md) | Línea de trabajo: fases, MVP, sprints, esfuerzo |
| [`docs/sprints/`](docs/sprints/) | [Do] SPECs por sprint (SDD v2) |
| [`docs/validate/`](docs/validate/) | [Check/Act] Auditorías consolidadas y gates entre fases |
| [`docs/templates/`](docs/templates/) | Templates de SPEC y auditoría SDD |
| [`docs/prompts/`](docs/prompts/) | Prompts BASE de orquestación PDCA |
| [`agent_docs/`](agent_docs/) | Documentación técnica por tema (divulgación progresiva) |
| [`.claude/`](.claude/) | Skill `sdd-framework-v2` + sub-agentes del framework |

Metodología: [SDD Framework v2](https://github.com/HammerDev99/sdd-framework) — ciclo PDCA (Plan → Do → Check → Act).

## Marco legal

| Norma | Alcance |
|-------|---------|
| Ley 1010 de 2006 | Definición de acoso laboral, conductas y procedimientos |
| Resolución 3461 de 2025 | CCL: conformación, procedimiento, confidencialidad, apoyo psicológico |
| Ley 1581 de 2012 | Habeas Data — el portal no recolecta datos personales sin aviso |
| Ley 2213 de 2022 | Notificaciones digitales (lado SIRAL) |

## Desarrollo

El scaffolding (Astro) se crea en la fase F0 — ver P01. Una vez inicializado:

```bash
npm install
npm run dev          # http://localhost:4321
npm run lint && npx astro check && npm test && npm run build   # quality gates
```

Convención de commits: `tipo(alcance): descripcion | SPEC: JS-XX` (en español).

---

**Proyecto de código abierto** al servicio de la convivencia laboral en la Rama Judicial de Colombia.

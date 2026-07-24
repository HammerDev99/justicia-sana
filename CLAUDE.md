# CLAUDE.md — Justicia Sana: Portal del Comité de Convivencia Laboral

Portal web público del Comité de Convivencia Laboral (CCL) de la Rama Judicial de Colombia — piloto Seccional Magdalena. Complementa al sistema SIRAL (módulo interno de gestión de quejas de acoso laboral) con pedagogía, transparencia, normativa y participación (encuestas, PQRS, buzón anónimo). Alineado con Resolución 3461/2025.

Origen: propuesta de Leonardo Fabio Gómez Colón (CCL Magdalena) + Daniel Arbeláez Álvarez (Ing. software, Seccional Antioquia). Ver `docs/cliente/PROPUESTA_CCL_PLATAFORMA.md`.

## Stack

- **Frontend**: Astro 6+ | TypeScript strict | Tailwind CSS 4 (patrón rugby-bello-site)
- **Contenido**: Astro content collections (Markdown en repo) — migración a Strapi diseñada, diferida
- **Backend dinámico**: API FastAPI de SIRAL extendida (endpoints públicos anonimizados) — repo `SIRAL_System`
- **Hosting**: Cloudflare Pages (free tier) | **CMS/API**: VPS SprintJudicial
- **Testing**: Vitest (unit) | Playwright (E2E)
- **CI/CD**: GitHub Actions → Cloudflare Pages
- **Producción**: pendiente (supuesto: subdominio sprintjudicial.com — validar Q5 en P00)

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
├── agent_docs/               # Documentación detallada por tema (se crea en F0-04)
├── docs/
│   ├── cliente/              # Propuesta original (docx + md)
│   ├── plannings/            # P00 análisis, P01 plan estratégico, template
│   └── sprints/              # SPECs por sprint (SDD v2)
└── src/                      # Se crea en F0-01 (Astro)
```

## Estado Actual

```
Fase:      PLANEACIÓN — P00 + P01 completos, F0 pendiente
Progreso:  [                    ] 0% implementación (0/32 ítems)
```

| Métrica | Valor |
|---------|-------|
| Plannings | P00 (requisitos + gap analysis), P01 (plan estratégico, 6 fases, 32 ítems) |
| Sprints | 0 de 6 planificados |
| Supuestos por validar | Q1–Q7 en P00 |

## Documentación (divulgación progresiva)

| Necesitas... | Consulta |
|-------------|----------|
| Propuesta del cliente | `docs/cliente/PROPUESTA_CCL_PLATAFORMA.md` |
| Requisitos, gap analysis SIRAL, supuestos | `docs/plannings/P00_ANALISIS_REQUISITOS.md` |
| Línea de trabajo (fases, sprints, esfuerzo) | `docs/plannings/P01_PLAN_ESTRATEGICO.md` |
| Metodología CDAID / SDD v2 | Skill `cdaid-framework` (en SIRAL_System) |
| Referencia arquitectura estática | Repo `rugby-bello-site` (`agent_docs/architecture.md`) |
| Referencia dominio acoso laboral | Repo `SIRAL_System` (`CLAUDE.md`, `agent_docs/`) |

## Reglas Críticas (resumen)

1. **TypeScript strict**: ningún `any`, tipos para toda entidad externa
2. **Zero JS por defecto**: islands solo para interactividad real (F4)
3. **Seguridad**: nada confidencial en este repo/sitio — lo confidencial vive en SIRAL
4. **Accesibilidad**: WCAG AA, HTML semántico, keyboard nav
5. **Performance**: Lighthouse ≥ 95
6. **SDD v2**: todo cambio nace de un SPEC (`JS-XX`) dentro de un sprint, con auditoría posterior
7. **Quality gates**: `npm run lint && npx astro check && npm test && npm run build` antes de commit

## Contexto Legal

| Norma | Alcance |
|-------|---------|
| Ley 1010 de 2006 | Definición de acoso laboral, conductas, procedimientos |
| Resolución 3461 de 2025 | CCL: conformación, procedimiento ≤ 65 días, confidencialidad, apoyo psicológico |
| Ley 1581 de 2012 | Habeas Data — el portal no recolecta datos personales sin aviso |
| Ley 2213 de 2022 | Notificaciones digitales (lado SIRAL) |
| Res. 652/2012 y 1356/2012 | Regulación anterior del CCL (referencia histórica) |

## Compact Instructions

Al compactar, SIEMPRE preservar:
- Las 7 reglas críticas
- La decisión de arquitectura (portal estático + islands + API SIRAL)
- Los supuestos Q1–Q7 de P00 y su estado de validación
- El estado actual y el mapa de sprints de P01
- Convenciones de commits y código

---

**Versión**: 1.0
**Fecha**: 2026-07-24

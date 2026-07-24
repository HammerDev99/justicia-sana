# Validate — Registro de Auditorías (Check del ciclo PDCA)

> Un archivo por auditoría. Todo consolidado. Framework: SDD Framework v2 (CDAID v2).

## Estructura

```
validate/
├── README.md                                   # Este archivo (convenciones e historial)
└── AUDIT_{NN}_{YYYY-MM-DD}_{SLUG}.md           # Una auditoría = un archivo
```

## Convención

Cada auditoría es **un solo archivo markdown** que contiene:

1. Checklist de gate (funcional, seguridad, calidad, arquitectura)
2. Conformidad SDD (protocolo 8 puntos, tasa de aprobación ≥ 85%)
3. Reportes de cada agente auditor (resumidos en secciones, no archivos separados)
4. Correcciones aplicadas (tabla con fix, commit, test) — fase **Act**
5. Hallazgos diferidos (backlog → alimentan el siguiente Planning)
6. Veredicto final

## Naming

```
AUDIT_{NN}_{YYYY-MM-DD}_{SLUG}.md
```

- **NN**: secuencial (01, 02, 03…)
- **SLUG**: `GATE_F{N}_{FASE}` (gate entre fases), `REAUDIT_F{N}`, `QA_FINAL`, `SECURITY_SCAN`

Template: `docs/templates/TEMPLATE_AUDITORIA.md` · Prompt de orquestación: `docs/prompts/01_BASE_CHECK_auditoria_gate_entre_fases.md`

## Adaptación de instrumentos al stack de este proyecto (Astro/TypeScript)

| Instrumento (default Python)     | Equivalente aquí                                                  |
| -------------------------------- | ----------------------------------------------------------------- |
| pytest -x                        | `npm test` (Vitest) + `npx playwright test`                       |
| ruff check / mypy --strict       | `npm run lint` (ESLint+Prettier) / `npx astro check` (tsc strict) |
| bandit                           | `npm audit` + revisión CSP/headers                                |
| Result[T,E] + frozen dataclasses | `readonly` / `as const` / tipos estrictos para respuestas de API  |

## Skills instalados como instrumentos de Check

| Skill                             | Uso en auditoría                                  | Nota de adaptación                                                                                                                                                                          |
| --------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.claude/skills/refactoring/`     | P7 (code smells: duplicación, Feature Envy, etc.) | Catálogo y técnicas son agnósticas de lenguaje; `references/java-to-python.md` no aplica aquí — usar el catálogo de smells/técnicas directamente sobre componentes Astro/TS                 |
| `.claude/skills/design-patterns/` | P8 (patrones GoF, SOLID)                          | Usar `examples-typescript/` (21 patrones GoF en TS, verificables con `npx tsc -p tsconfig.json`) como referencia primaria en este proyecto; `examples/*.py` quedan como respaldo conceptual |

## Historial de auditorías

| #   | Fecha | Slug | Gate | Veredicto                                                      |
| --- | ----- | ---- | ---- | -------------------------------------------------------------- |
| —   | —     | —    | —    | Sin auditorías aún (primera: gate F0 al cierre del Sprint S01) |

---

**Actualizado**: 2026-07-24

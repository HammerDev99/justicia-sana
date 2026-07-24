# Workflow CDAID / SDD Framework v2 — Justicia Sana

> Nivel 2 de divulgación progresiva. Metodología completa: skill `.claude/skills/sdd-framework-v2/`.

## Ciclo PDCA aplicado a este proyecto

```
Plan (docs/plannings/)  → P00 análisis + gap analysis, P01 línea de trabajo por fases
Do   (docs/sprints/)    → un directorio por sprint, SPECs formales + registro de progreso
Check (docs/validate/)  → un AUDIT_NN_*.md consolidado por gate de fase
Act  (dentro del AUDIT) → correcciones de DEFECTOS; DIVERGENCIAS MENORES → siguiente Planning
```

## Ciclo TDD por SPEC

1. **Ready**: el SPEC tiene criterios de aceptación verificables (formato `TEMPLATE_SDD_SPEC.md`).
2. **RED**: escribir el test que falla primero (unit en `tests/unit/`, E2E en `tests/e2e/` cuando aplica).
3. **GREEN**: implementar el mínimo código de producción para pasar el test.
4. **Quality gate**: `npm run lint && npx astro check && npm test && npm run build` (+ `test:e2e` si el SPEC tocó flujo de usuario).
5. **Done**: marcar `[x]` en el planning (P01) y registrar fecha/commit/tests en el resumen del sprint.

## Adaptación de instrumentos (stack Astro/TypeScript, no Python)

| Instrumento CDAID default                 | Equivalente en este proyecto                                                             |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `pytest -x`                               | `npm test` (Vitest) + `npm run test:e2e` (Playwright)                                    |
| `ruff check` / `mypy --strict`            | `npm run lint` (ESLint+Prettier) / `npx astro check` (tsc strict)                        |
| `bandit`                                  | `npm audit` + revisión manual de CSP/security headers                                    |
| `Result[T,E]` + `@dataclass(frozen=True)` | tipos `readonly` / `as const`, sin excepciones no controladas en clientes de API externa |

Detalle completo: `docs/validate/README.md`.

## Gates entre fases

Cada fase de P01 (F0, F1, F2…) cierra con una auditoría en `docs/validate/AUDIT_NN_YYYY-MM-DD_GATE_F{N}_{NOMBRE}.md` antes de arrancar la siguiente. Tasa de aprobación mínima: 85% (CONFORME + DIVERGENCIA JUSTIFICADA sobre el total).

## Prompts de orquestación

`docs/prompts/`: `00_BASE_PLAN_*` (inicio/reorientación), `01_BASE_CHECK_*` (auditoría de gate), `02_BASE_DO_*` (reanudación de fase pendiente) — plantillas para retomar sesiones agenticas con contexto completo.

---

**Actualizado**: 2026-07-24 (Sprint S01 — Fase F0)

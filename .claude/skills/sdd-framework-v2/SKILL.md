---
name: cdaid-framework-v2
description: >
  Framework CDAID v2 (Contract-Driven Artificial Intelligence Development) para gestionar el ciclo de vida completo de proyectos de software con agentes IA.
  Mejoras v2: 4 fases PDCA con propositos claros (Plan/Do/Check/Act), validate/ consolidado (1 archivo por auditoria), auditoria multi-agente con skills como instrumentos, templates reutilizables.
  Use this skill when: the user starts a new project, creates a planning, defines a sprint, writes SDD specs, implements features with TDD, runs audits, reviews code quality, tracks verification metrics, manages progressive disclosure documentation, sets up CLAUDE.md, configures sub-agents or skills, discusses spec-driven development methodology, or asks about project structure and conventions.
  Also trigger when the user mentions: "CDAID", "SDD", "spec-driven", "planning", "sprint", "SPEC", "auditoria", "validate", "progressive disclosure", "divulgacion progresiva", "CLAUDE.md", "agent_docs", "quality gates", "scope attenuation", "compactacion", "TDD formal", "notebooks como laboratorio", "quick wins", "verificacion", "metricas de deuda", "multi-claude", "trazas de delegacion", "PDCA", "Plan Do Check Act".
  Do NOT use for: general coding tasks that don't involve project methodology, simple bug fixes without spec context, or questions about specific programming languages or frameworks.
---

# CDAID Framework v2 — Contract-Driven Artificial Intelligence Development

Framework de desarrollo asistido por IA que formaliza SDD (Spec-Driven Development), progressive disclosure, quality gates, sub-agentes especializados y verificacion continua.

**Cambios respecto a v1**: Ciclo redefinido como 4 fases PDCA, validate/ consolidado, auditoria multi-agente, templates reutilizables.

## Overview

CDAID opera en 4 fases ciclicas: **Plan → Do → Check → Act**. Cada cambio se formaliza como un SPEC con ID unico, criterios verificables, y auditoria post-implementacion de 8 puntos.

Basado en la taxonomia SDD de Birgitta Bockeler (Martin Fowler blog), CDAID opera en nivel **spec-anchored con auditoria formal** — la spec se mantiene viva despues de implementar, y las divergencias se clasifican formalmente.

## When to Use

### Activar para:
- **Inicio de proyecto**: Setup de CLAUDE.md, agent_docs/, sub-agentes, skills
- **Planning** (Plan): Desglosar requerimientos, decisiones arquitectonicas, riesgos, SPECs
- **Sprint** (Do): Implementar con SPECs como contrato (ready = spec, done = tests pasan)
- **Validate** (Check): Verificar codigo vs spec con tests, PBT, agentes, skills especializados
- **Metricas**: Trackear metricas de verificacion y deuda
- **Documentacion**: Mantener progressive disclosure actualizada
- **Setup agentes**: Configurar sub-agentes con scope attenuation

### NO activar para:
- Tareas de coding puro sin contexto de sprint/spec
- Debugging de bugs especificos (usar `systematic-debugging`)
- Refactoring sin planning (usar `refactoring`)
- Preguntas sobre frameworks/lenguajes especificos

---

## Quick Reference: Ciclo de Vida CDAID

```
Plan (plannings/) → Do (sprints/) → Check (validate/) → Act (corrections en AUDIT_*.md)
     ↑                                                            │
     └──── hallazgos MEDIUM diferidos alimentan el siguiente ─────┘
```

### Las 4 Fases Operativas

| Fase | Directorio | Proposito |
|------|-----------|-----------|
| **Plan** | `docs/plannings/` | Desglosar requerimientos en componentes y servicios. Decisiones sobre frameworks, BD, infraestructura, patrones. Riesgos, dependencias, performance, seguridad. Producir SPECs con criterios verificables. |
| **Do** | `docs/sprints/` | Para cada historia/SPEC, generar spec y tareas derivadas. Specs como criterio de "ready", tests/contratos como criterio de "done". TDD, quality gates, tracking. |
| **Check** | `docs/validate/` | Verificar que el codigo cumple la spec mediante tests, property-based testing, analisis estatico, revision de patrones, auditorias de seguridad. Skills especializados como instrumentos de verificacion. |
| **Act** | Dentro de `AUDIT_*.md` | Corregir hallazgos CRITICAL/HIGH con TDD. Documentar fixes. MEDIUM diferidos → siguiente Planning. |

---

## Quick Reference: docs/validate/ (consolidado)

Un solo archivo markdown por auditoria. Sin fragmentacion.

```
docs/validate/
├── README.md                                    # Convenciones e historial
├── AUDIT_01_YYYY-MM-DD_GATE_F1_NOMBRE.md       # Auditoria #1 (todo dentro)
├── AUDIT_02_YYYY-MM-DD_GATE_F2_NOMBRE.md       # Auditoria #2
└── AUDIT_NN_YYYY-MM-DD_{SLUG}.md               # Patron
```

Cada AUDIT contiene en un solo documento:
1. Checklist de gate (funcional, seguridad, calidad, arquitectura)
2. Conformidad SDD (protocolo 8 puntos, tasa de aprobacion)
3. Reportes resumidos de cada agente auditor (secciones, no archivos separados)
4. Correcciones aplicadas (tabla con fix, commit, test)
5. Hallazgos diferidos (backlog)
6. Veredicto final

**Naming**: `AUDIT_{NN}_{YYYY-MM-DD}_{SLUG}.md`
- SLUG: `GATE_F{N}_{FASE}`, `REAUDIT_F{N}`, `QA_FINAL`, `SECURITY_SCAN`

---

## Quick Reference: Formato de SPEC

```markdown
### SPEC-{milestone}-{fase}{N}: NombreDescriptivo

| Campo | Valor |
|-------|-------|
| **Origen** | Referencia al hallazgo/planning |
| **Archivos** | `src/modulo.py:100-150` |
| **Prioridad** | P0/P1/P2 — justificacion |
| **Estado** | `[ ]` pendiente / `[x]` completado |

**Cambios requeridos**:
1. Cambio exacto con lineas

**Criterios de aceptacion**:
- [ ] Criterio verificable
- [ ] `pytest -x` pasa sin regresion
- [ ] Tests nuevos validan Success y Failure paths

**Verificado**: YYYY-MM-DD | **Commit**: {hash}
```

---

## Quick Reference: Protocolo de Auditoria SDD (8 puntos)

| Punto | Verifica |
|-------|----------|
| P1 | DTOs — frozen, campos, JSON serializable |
| P2 | Metodos — firma, Result[T,E], paths Success/Failure |
| P3 | Backward compat — callers no rotos |
| P4 | DI/Container — registrado correctamente |
| P5 | Interfaces — delegan correctamente |
| P6 | Tests — Success, Failure, cantidad, coverage |
| P7 | Code smells — Feature Envy, Duplicate Code eliminados |
| P8 | Patterns — Facade, DI, ROP implementados |

### Clasificacion de divergencias

| Tipo | Accion |
|------|--------|
| **CONFORME** | Ninguna |
| **DIVERGENCIA JUSTIFICADA** | Documentar razon |
| **DIVERGENCIA MENOR** | Evaluar impacto |
| **DEFECTO** | Corregir obligatoriamente |

**Tasa de aprobacion**: (CONFORME + JUSTIFICADA) / Total ≥ 85%

---

## Quick Reference: Progressive Disclosure (3 niveles)

```
Nivel 1: CLAUDE.md (~120 lineas)
  ├── 6 reglas criticas (suficiente para 80% de tareas)
  ├── Tabla de navegacion a nivel 2
  └── Estado actual + metricas + Compact Instructions

Nivel 2: agent_docs/ (9 archivos, ~1200 lineas)
  ├── [CORE] workflow, code_conventions, testing, verification_metrics
  └── [DOMINIO] architecture, logging, antipatterns, troubleshooting, project_status

Nivel 3: docs/ (plannings, sprints, validate, templates, prompts, notebooks, diagrams)
  └── Detalle historico. Un directorio por proposito PDCA.
```

---

## Quick Reference: Auditoria Multi-Agente

| Agente | Enfoque | Skill complementario |
|--------|---------|---------------------|
| security-auditor | OWASP, PII, inputs, inmutabilidad | — |
| code-reviewer | Convenciones, bugs, Result pattern | — |
| python-reviewer | PEP 8, type hints, idioms | — |
| architect | Dependency flow, DDD, SOLID | — |
| refactor-planner | Smells Fowler, deuda tecnica | `/refactoring` |
| design-patterns analyst | GoF, SOLID, Pattern Decision Map | `/design-patterns` |
| dead-code scanner | Dead imports, test gaps, calidad | — |

**Tecnicas de verificacion** (segun skills disponibles):
- Tests unitarios (pytest), property-based testing (Hypothesis)
- Analisis estatico (ruff, mypy --strict, bandit)
- Smell analysis (skill `/refactoring`): 22 smells Fowler + 66 tecnicas
- Pattern analysis (skill `/design-patterns`): 22 GoF + SOLID + Code Smell→Pattern Map
- Debugging sistematico (skill `/systematic-debugging`)

---

## Quick Reference: Metricas de Verificacion

| Metrica | Formula | Meta |
|---------|---------|------|
| Paso 1ra auditoria | items aprobados / total | >= 85% |
| Tiempo deteccion regresion | fecha_deteccion - fecha_intro | < 1 sprint |
| Ratio correcciones | commits correccion / total | < 10% |
| Cobertura auditoria | archivos auditados / total | 100% / 5 sprints |

---

## Quick Reference: Sub-agentes (Scope Attenuation)

| Agente | Permisos | Modelo | Proposito |
|--------|----------|--------|-----------|
| code-reviewer | Read only | sonnet | Bugs, anti-patrones, convenciones |
| test-generator | Write tests/ | haiku | Unit + PBT |
| doc-auditor | Read only | haiku | Sync docs/codigo |
| security-scanner | Read + Bash(limitado) | haiku | OWASP, secrets |
| senior-architect | Full access | sonnet | Decisiones arquitectonicas |

**Principio**: Cada agente recibe permisos minimos para su tarea.

---

## Convenciones Criticas (6 reglas)

1. **Logging**: `get_logger(__name__)`, nunca `logging.getLogger`
2. **Errores**: `Result[T, E]` (Success/Failure), no try/except anidados
3. **Inmutabilidad**: `@dataclass(frozen=True)` para todos los DTOs
4. **Commits**: Espanol, formato convencional, sin firma IA
5. **Seguridad**: Whitelists SQL, HTML escape, validar inputs
6. **Tests**: Todo cambio pasa `pytest -x` + `ruff check` + `mypy`

---

## Templates Incluidos

| Template | Proposito |
|----------|-----------|
| `TEMPLATE_GATE_PHASE.md` | Gate de aprobacion entre fases |
| `TEMPLATE_SPRINT_RESUMEN.md` | Resumen de sprint con tracking CDAID |
| `TEMPLATE_SDD_SPEC.md` | SPEC individual con criterios |
| `TEMPLATE_AUDITORIA_SDD.md` | Auditoria 8 puntos consolidada |

---

## Reference Files

| Tarea | Archivo de referencia |
|-------|----------------------|
| Entender la metodologia completa | `references/cdaid-methodology.md` |
| Ver templates SDD (SPEC, Auditoria) | `references/sdd-templates.md` |
| Ver templates organizativos (Planning, Sprint) | `references/org-templates.md` |
| Convenciones de codigo y naming | `references/code-conventions.md` |
| Configurar sub-agentes y permisos | `references/agents-and-skills.md` |
| Adaptar framework a otros stacks | `references/stack-adaptation.md` |

---

## Changelog v1 → v2

| Cambio | v1 | v2 |
|--------|----|----|
| Nombre | Contract-Driven Agentic Intelligence Development | Contract-Driven **Artificial** Intelligence Development |
| Ciclo | 5 fases (C-D-A-I-D) | 4 fases PDCA (Plan-Do-Check-Act) |
| Proposito por fase | Implicito | Explicito (que, como, por que) |
| validate/ | No definido | `AUDIT_NN_*.md` consolidado (1 archivo = 1 auditoria) |
| Auditoria | Solo 8 puntos SDD | Multi-agente + skills como instrumentos de verificacion |
| Templates | Mencionados | 4 templates incluidos (Gate, Sprint, SPEC, Auditoria) |
| docs/prompts/ | No existia | Prompts de orquestacion para sesiones agenticas |
| Evidencia | Solo Sherlock-docs | Sherlock-docs + GexCom |

---

## Integration with Other Skills

| Skill | Cuando usar juntos |
|-------|--------------------|
| `systematic-debugging` | Cuando un SPEC falla tests — usar debugging antes de re-implementar |
| `refactoring` | Cuando la auditoria detecta code smells (P7) — instrumento de Check |
| `design-patterns` | Cuando la auditoria detecta patterns faltantes (P8) — instrumento de Check |
| `tdd-workflow` | Complemento para la fase Do (Sprint) |
| `verification-loop` | Complemento para la fase Check (Validate) |

# Organizational Templates — Planning y Sprint

## Template: Planning

```markdown
# Planning {NN} — {Titulo Descriptivo}

**Fecha**: YYYY-MM-DD
**Origen**: {auditoria | bug report | feature request | deuda tecnica}
**Objetivo**: {Meta clara y medible}
**Metodologia**: SDD / Fix-driven / Doc-driven

## Estado Previo / Contexto

| Metrica | Valor actual | Target |
|---------|:------------:|:------:|
| Tests | N | N+M |
| Coverage | X% | Y% |

## Alcance

### Fase A — {Nombre}

| ID | Hallazgo | Archivo(s) | Fix propuesto | Esfuerzo |
|----|----------|-----------|---------------|:--------:|
| A-01 | {Desc} | `src/mod.py:100` | {Cambio} | Bajo |

### Fase B — {Nombre}
(misma estructura)

## Hallazgos Diferidos

| ID | Hallazgo | Razon |
|----|----------|-------|
| — | {Desc} | {Bajo ROI / fuera de alcance} |

## Esfuerzo Total

| Fase | Items | Esfuerzo |
|------|:-----:|:--------:|
| A | N | N horas |
| Total | N | N horas |

## Criterios de Exito

- [ ] Items Fase A implementados
- [ ] `pytest -x` pasa
- [ ] `ruff check src/` limpio
- [ ] Tests nuevos: +N minimo
```

### Naming de directorios

```
docs/plannings/planning_{NN}_{YYYY-MM-DD}_{slug-descriptivo}/
  00_PLANNING_*.md          # Documento principal
  01_*.md                   # Sub-documentos tematicos
  04_SDD_SPEC_*.md          # Especificaciones SDD
  06_AUDITORIA_SDD_*.md     # Auditorias
```

---

## Template: Resumen de Sprint

```markdown
# Sprint {NN} — {Titulo}

**Fecha inicio**: YYYY-MM-DD
**Objetivo**: {Descripcion clara}
**Planning**: `docs/plannings/planning_{NN}_.../`
**Metodologia**: SDD / CDAID

## Estado General

Sprint {NN}: [████████████                            ] 30% (3/10 SPECs)

| Fase | Total | Completados | Pendientes |
|------|:-----:|:-----------:|:----------:|
| A | 5 | 3 | 2 |
| B | 5 | 0 | 5 |

## Registro de Progreso

| Fecha | SPEC | Descripcion | Commit | Tests |
|-------|------|-------------|--------|:-----:|
| MM-DD | SPEC-SNN-A1 | {desc} | abc123 | +5 |

## Metricas de Verificacion

| Metrica | Pre-Sprint | Post-Sprint | Delta |
|---------|:----------:|:-----------:|:-----:|
| Tests | N | N+M | +M |
| Coverage | X% | Y% | +Z% |

## Decisiones Tomadas

| # | Decision | Razon | Alt. descartada |
|---|----------|-------|-----------------|

## Trazas de Delegacion

| Decision | Propuesta IA | Aprobacion Humano |
|----------|-------------|-------------------|
```

### Naming de directorios

```
docs/sprints/sprint_{NN}_{YYYY-MM-DD}_{slug-descriptivo}/
  00_PROMPT_*.md              # Prompt para el agente
  01_RESUMEN_SPRINT.md        # Documento principal
  02_*.md                     # Sub-documentos
```

### Sub-sprints

Para quick wins o refinamientos: `sprint_{NN}_{M}_{fecha}_{slug}/`
Ejemplo: `sprint_23_1_2026-03-24_quick-wins/`

---

## Template: Auditoria Consolidada (docs/validate/)

Un solo archivo por auditoria. Sin fragmentacion en subdirectorios.

```markdown
# Auditoria #{NN} — Gate F{N}: {Nombre Fase}

| Campo | Valor |
|-------|-------|
| **Fecha** | YYYY-MM-DD |
| **Fase evaluada** | F{N}: {Nombre} (SPEC-{X}1 a {X}N, {N} archivos) |
| **Agentes** | {N} especializados en paralelo |
| **Skills** | /design-patterns, /refactoring, /cdaid-framework |
| **Baseline** | {N} tests, ruff {N}, mypy {N} |
| **Post-correccion** | {N} tests, ruff {N}, mypy {N} |
| **Tasa SDD** | {N}% (meta ≥85%) |
| **Veredicto** | APROBADO / BLOQUEADO |

## 1. Checklist de Gate
### Funcional
- [ ] {criterios funcionales}
### Seguridad
- [ ] {criterios seguridad}
### Calidad
- [ ] {criterios calidad}
### Arquitectura
- [ ] {criterios arquitectura}

## 2. Conformidad SDD (Protocolo 8 Puntos)
| Clasificacion | Cantidad |
|--------------|:--------:|
| CONFORME | {N} |
| DIVERGENCIA JUSTIFICADA | {N} |
| DIVERGENCIA MENOR | {N} |
| DEFECTO | {N} |
| **Tasa** | **{N}%** |

## 3. Reportes de Agentes
### 3.1 {Nombre Agente} — {N} hallazgos ({NC}C, {NH}H, {NM}M, {NL}L)
{Resumen de hallazgos por severidad, corregidos vs diferidos}

### 3.2 {Nombre Agente} — ...
{Repetir para cada agente}

## 4. Correcciones Aplicadas
| # | ID | Hallazgo | Fix | Test agregado |
|---|-----|----------|-----|:-------------:|

## 5. Hallazgos Diferidos (backlog)
| ID | Hallazgo | Sprint estimado |
|----|----------|:---------------:|

## 6. Veredicto
APROBADO / BLOQUEADO — {justificacion}
```

### Naming

```
docs/validate/
├── README.md
├── AUDIT_01_YYYY-MM-DD_GATE_F1_NOMBRE.md
├── AUDIT_02_YYYY-MM-DD_GATE_F2_NOMBRE.md
├── AUDIT_03_YYYY-MM-DD_REAUDIT_F1.md        # Re-auditoria
└── AUDIT_04_YYYY-MM-DD_QA_FINAL.md           # QA pre-deploy
```

**Principio**: Un archivo = una auditoria completa = trazabilidad total.

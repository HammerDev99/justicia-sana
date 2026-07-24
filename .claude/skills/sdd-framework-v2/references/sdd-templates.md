# SDD Templates — SPEC y Auditoria

## Template: SPEC Individual

```markdown
### SPEC-S{sprint}-{fase}{N}: NombreDescriptivo

| Campo | Valor |
|-------|-------|
| **Origen** | Referencia al hallazgo/planning que lo origina |
| **Archivos** | `src/paquete/modulo.py:100-150` |
| **Prioridad** | P0 — justificacion |
| **Estado** | `[ ]` pendiente / `[x]` completado / `[-]` cancelado |

**Cambios requeridos**:
1. Describir cambio exacto en archivo 1 (con lineas si es posible)
2. Describir cambio exacto en archivo 2

**Criterios de aceptacion**:
- [ ] Criterio verificable 1 (ej: DTO es @dataclass(frozen=True))
- [ ] Criterio verificable 2 (ej: Metodo retorna Result[T, str])
- [ ] `pytest -x` pasa sin regresion
- [ ] Tests nuevos validan Success y Failure paths
- [ ] `ruff check src/` limpio
- [ ] `mypy src/` sin errores

**Verificado**: YYYY-MM-DD | **Commit**: {hash}
```

## Template: Documento SDD_SPEC Completo

```markdown
# SDD SPEC — Sprint {NN}

**Fecha**: YYYY-MM-DD
**Planning de referencia**: `docs/plannings/planning_{NN}_{fecha}_{slug}/`
**Metodologia**: SDD (Spec-Driven Development)

## Resumen

| Campo | Valor |
|-------|-------|
| Sprint | {NN} |
| Total SPECs | {N} |
| Fases | A: {tema}, B: {tema} |

## Fase A — {Nombre}

### SPEC-S{NN}-A1: Nombre
(estructura SPEC individual)

### SPEC-S{NN}-A2: Nombre
(estructura SPEC individual)

## Fase B — {Nombre}

### SPEC-S{NN}-B1: Nombre
(estructura SPEC individual)

## Resumen de Esfuerzo

| Fase | SPECs | Esfuerzo | Estado |
|------|:-----:|----------|--------|
| A | N | N horas | Pendiente |
| B | N | N horas | Pendiente |
```

## Template: Auditoria SDD

```markdown
# Auditoria SDD — Sprint {NN}

**Fecha**: YYYY-MM-DD
**SPEC de referencia**: `ruta/al/spec`
**Auditor**: {humano / agente doc-auditor}

## Metodologia

Cotejo campo por campo: 8 puntos (P1-P8)

## Resultados por SPEC

### SPEC-S{NN}-A1: Nombre

| Punto | Resultado | Detalle |
|:-----:|-----------|---------|
| P1 | CONFORME | DTO frozen con campos correctos |
| P2 | CONFORME | Retorna Result[ResponseDTO, str] |
| P3 | CONFORME | Backward compat mantenido |
| P4 | CONFORME | Registrado en ServiceContainer |
| P5 | CONFORME | Interfaz delega al servicio |
| P6 | CONFORME | N tests (Success + Failure paths) |
| P7 | CONFORME | Sin code smells |
| P8 | CONFORME | DI + ROP implementados |

**Veredicto**: CONFORME (8/8)

## Resumen General

| Clasificacion | Cantidad |
|---------------|:--------:|
| CONFORME | N |
| DIVERGENCIA JUSTIFICADA | N |
| DIVERGENCIA MENOR | N |
| DEFECTO | N |

### Tasa de paso
(CONFORME + DIVERGENCIA JUSTIFICADA) / Total = N% (meta >= 85%)

## Acciones Correctivas (si hay defectos)

| SPEC | Defecto | Accion | Responsable | Fecha limite |
|------|---------|--------|-------------|:------------:|
```

## Convenciones de IDs

```
SPEC-S{sprint}-{fase}{numero}

Ejemplos:
  SPEC-S01-A1    → Sprint 1, Fase A, item 1
  SPEC-S03-B2    → Sprint 3, Fase B, item 2
  SPEC-S23.1-07  → Sprint 23.1, item 7
  S24-01         → Sprint 24, item 01 (simplificado)
```

Fases: letras secuenciales A, B, C, D... con nombres tematicos.

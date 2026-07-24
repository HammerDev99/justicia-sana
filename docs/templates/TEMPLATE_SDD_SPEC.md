# SDD SPEC — Sprint {NN}

**Fecha**: YYYY-MM-DD
**Planning de referencia**: `docs/plannings/planning_{NN}_{fecha}_{slug}/`
**Metodologia**: SDD (Spec-Driven Development)

---

## Resumen

| Campo             | Valor                |
| ----------------- | -------------------- |
| Sprint            | {NN}                 |
| Total SPECs       | {N}                  |
| Fases             | A: {tema}, B: {tema} |
| Esfuerzo estimado | {N} horas            |

---

## Fase A — {Nombre de la Fase}

### SPEC-S{NN}-A1: NombreDescriptivo

| Campo         | Valor                                          |
| ------------- | ---------------------------------------------- |
| **Origen**    | Referencia al hallazgo/planning que lo origina |
| **Archivos**  | `src/paquete/modulo.py:100-150`                |
| **Prioridad** | P0 — justificacion                             |
| **Estado**    | `[ ]` pendiente                                |

**Cambios requeridos**:

1. Describir cambio exacto en archivo 1 (con lineas si es posible)
2. Describir cambio exacto en archivo 2

**Criterios de aceptacion**:

- [ ] Criterio verificable 1 (ej: DTO es `@dataclass(frozen=True)`)
- [ ] Criterio verificable 2 (ej: Metodo retorna `Result[T, str]`)
- [ ] `pytest -x` pasa sin regresion
- [ ] Tests nuevos validan Success y Failure paths
- [ ] `ruff check src/` limpio
- [ ] `mypy src/` sin errores

**Verificado**: — | **Commit**: —

---

### SPEC-S{NN}-A2: NombreDescriptivo

<!-- Repetir estructura anterior para cada SPEC -->

---

## Fase B — {Nombre de la Fase}

### SPEC-S{NN}-B1: NombreDescriptivo

<!-- Repetir estructura -->

---

## Resumen de Esfuerzo

| Fase      | SPECs | Esfuerzo    | Estado    |
| --------- | :---: | ----------- | --------- |
| A         |   N   | N horas     | Pendiente |
| B         |   N   | N horas     | Pendiente |
| **Total** | **N** | **N horas** |           |

---

**Version**: 1.0
**Fecha**: YYYY-MM-DD

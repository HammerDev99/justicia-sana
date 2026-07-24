# Planning {NN} — {Titulo Descriptivo}

**Fecha**: YYYY-MM-DD
**Origen**: {Que motivo este planning: auditoria, bug report, feature request, deuda tecnica}
**Objetivo**: {Meta clara y medible}
**Metodologia**: SDD / Fix-driven / Doc-driven

---

## Estado Previo / Contexto

<!-- Describir la situacion actual que motiva el planning -->

| Metrica  | Valor actual | Target |
| -------- | :----------: | :----: |
| Tests    |      N       |  N+M   |
| Coverage |      X%      |   Y%   |
| Calidad  |      —       |   —    |

---

## Alcance

### Fase A — {Nombre}

| ID   | Hallazgo      | Archivo(s)          | Fix propuesto | Esfuerzo |
| ---- | ------------- | ------------------- | ------------- | :------: |
| A-01 | {Descripcion} | `src/modulo.py:100` | {Cambio}      |   Bajo   |
| A-02 | {Descripcion} | `src/otro.py:50`    | {Cambio}      |  Medio   |

### Fase B — {Nombre}

| ID   | Hallazgo      | Archivo(s)      | Fix propuesto | Esfuerzo |
| ---- | ------------- | --------------- | ------------- | :------: |
| B-01 | {Descripcion} | `src/modulo.py` | {Cambio}      |   Alto   |

---

## Hallazgos Diferidos

<!-- Items que se descartan o se posponen -->

| ID  | Hallazgo      | Razon de diferimiento                    |
| --- | ------------- | ---------------------------------------- |
| —   | {Descripcion} | {Bajo ROI / fuera de alcance / Fase N+1} |

---

## Esfuerzo Total

| Fase      | Items | Esfuerzo estimado |
| --------- | :---: | :---------------: |
| A         |   N   |      N horas      |
| B         |   N   |      N horas      |
| **Total** | **N** |    **N horas**    |

---

## Criterios de Exito

- [ ] Todos los items de Fase A implementados
- [ ] `pytest -x` pasa sin regresion
- [ ] `ruff check src/` limpio
- [ ] `mypy src/ --strict` sin errores
- [ ] Tests nuevos: +N minimo
- [ ] Metricas post-sprint documentadas

---

## Orden de Implementacion Recomendado

```
A-01 → A-02 → B-01
  (sin dependencias entre A-01 y A-02, pueden ser paralelos)
```

---

**Version**: 1.0
**Fecha**: YYYY-MM-DD

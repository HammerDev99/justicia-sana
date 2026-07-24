# Sprint 05 — Transparencia con Cifras (Fase F4)

**Fecha inicio**: 2026-07-24
**Objetivo**: Cerrar la Fase F4 completa — endpoint público de estadísticas anonimizadas en `SIRAL_System` (F4-01), cliente tipado (F4-02) y página "Transparencia y cifras" (F4-03) en `justicia-sana`, con degradación agraciada verificada de extremo a extremo y también con datos reales.
**Planning**: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (Fase F4)
**SPEC de referencia**: `docs/sprints/S05_TRANSPARENCIA_CIFRAS/SPEC_S05_F4_TRANSPARENCIA.md`
**Metodología**: SDD Framework v2 (CDAID v2) — fase Do

---

## Estado General

```
Sprint 05: [########################] 100% (3/3 SPECs completados)
```

| Fase      | Total SPECs | Completados | Pendientes |
| --------- | :---------: | :---------: | :--------: |
| F4        |      3      |      3      |     0      |
| **Total** |    **3**    |    **3**    |   **0**    |

---

## Registro de Progreso

| Fecha      | SPEC  | Descripción                                                                 | Repo            | Tests | Notas                                                                                          |
| ---------- | ----- | --------------------------------------------------------------------------- | --------------- | :---: | ---------------------------------------------------------------------------------------------- |
| 2026-07-24 | F4-01 | `GET /api/v1/estadisticas/publicas` sin JWT, agregación pura + JOIN real    | `SIRAL_System`  |  +11  | TDD real en la agregación pura (RED→GREEN); 294/294 tests, ruff+bandit limpios                 |
| 2026-07-24 | F4-02 | `fetchEstadisticasPublicas()` — mismo patrón de degradación que `strapi.ts` | `justicia-sana` |  +5   | Verificado con `ENOTFOUND` real (API sin desplegar), no solo un mock                           |
| 2026-07-24 | F4-03 | `/transparencia-y-cifras` + `ConteoBarras.astro` (barras sin JS)            | `justicia-sana` |  +4   | Verificado con datos reales sembrados en una instancia local de SIRAL, no solo el camino vacío |

---

## Métricas de Verificación

| Métrica                             |       Pre-Sprint        |       Post-Sprint       |          Delta          |
| ----------------------------------- | :---------------------: | :---------------------: | :---------------------: |
| Tests unitarios `justicia-sana`     |           34            |           48            | +14 (9 de F3 + 5 de F4) |
| Tests E2E `justicia-sana`           |           23            |           27            |           +4            |
| Tests `SIRAL_System` (unit+integ.)  |           283           |           294           |           +11           |
| Páginas funcionales `justicia-sana` |            9            |           10            |           +1            |
| Endpoints API `SIRAL_System`        |            9            |           10            |      +1 (público)       |
| `astro check`                       | 0 errores (39 archivos) | 0 errores (44 archivos) |            ✓            |
| `npm run lint`                      |         limpio          |         limpio          |            ✓            |
| `npm run build`                     |     OK (9 páginas)      |     OK (10 páginas)     |            ✓            |
| Enlaces de `navLinks`               |            8            |            9            |           +1            |

---

## Decisiones e Incidentes

1. **Fase cross-repo ejecutada en orden**: F4-01 (`[SIRAL]` en P01) se hizo primero en `SIRAL_System`, luego F4-02/F4-03 en `justicia-sana` consumiendo el endpoint recién creado — respeta la dependencia real entre los tres SPECs.

2. **`SIRAL_System` estaba marcado "100% COMPLETO"**: se evitó cualquier cambio invasivo al modelo de datos o a las capas ya auditadas (`AUDIT P08`, 55/55 hallazgos resueltos). La nueva funcionalidad se añadió como una extensión aislada (nuevos archivos + 2 líneas en `main.py` para registrar la ruta + 1 método nuevo en `SyncQuejaStore`), reutilizando el JOIN que ya existía en `find_by_seccional`/`count_by_estado` en vez de rediseñar el acceso a datos.

3. **Piloto de una sola seccional — "por seccional" implementado mas no exhibido de forma redundante**: el JOIN agrupa correctamente por seccional (probado con 2 seccionales sembradas en el test de integración), pero la página solo muestra la sección "Por seccional" si hay más de una con datos — hoy solo existe Magdalena, así que mostrarla sería repetir el resumen general. Sin trabajo adicional cuando el piloto crezca a más seccionales.

4. **Verificación con datos reales, no solo el camino vacío**: a diferencia de gran parte de F1/F3 (donde Strapi nunca tuvo datos reales que probar), aquí se levantó una instancia real de la API de SIRAL localmente, se sembraron datos con `SyncQuejaStore` directamente y se apuntó el build de `justicia-sana` a esa instancia via `SIRAL_API_URL`. Se confirmó visualmente (extrayendo el texto renderizado del HTML) que el camino "con datos" funciona correctamente, no solo el de degradación agraciada.

5. **Barras de estadísticas sin librería de gráficos**: `ConteoBarras.astro` calcula el ancho de cada barra en build-time y lo aplica como `style` inline — cero JavaScript, cero dependencia nueva. El número siempre acompaña la barra como texto (no solo el ancho visual), por accesibilidad.

6. **Nota de entorno documentada, no corregida**: `mypy src/ --strict` (el comando exacto del `Makefile` de `SIRAL_System`) falla por un error preexistente en `core/enums/roles.py`, confirmado que ocurre igual sin ningún archivo de esta extensión (deriva de versiones de dependencias sin lockfile en este entorno de trabajo). Documentado en `SIRAL_System/agent_docs/project_status.md`, no es un defecto de este sprint y no se intentó corregir (fuera de alcance — tocaría un archivo no relacionado de un sistema ya cerrado y auditado).

---

## Próximos Pasos

1. Auditoría de gate F4 (`docs/validate/AUDIT_05_..._GATE_F4_TRANSPARENCIA.md`) — Check del ciclo PDCA. Cross-repo: cubre tanto el endpoint de `SIRAL_System` como el cliente/página de `justicia-sana`.
2. Tras gate F4 aprobado: **MVP = F0+F1+F2+F3+F4+F6** — solo falta F6 (Hardening y Auditoría del MVP) para completar el MVP completo según `P01_PLAN_ESTRATEGICO.md`. Pendiente de orden explícita del propietario.
3. Sigue pendiente de acción humana: despliegue real de la API de SIRAL en el VPS — sin esto, `/transparencia-y-cifras` seguirá mostrando el placeholder honesto en producción.

---

**Versión**: 1.0
**Fecha**: 2026-07-24

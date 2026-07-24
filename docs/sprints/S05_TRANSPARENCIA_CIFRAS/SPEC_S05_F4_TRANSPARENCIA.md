# SDD SPEC — Sprint 05

**Fecha**: 2026-07-24
**Planning de referencia**: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (Fase F4), `SIRAL_System/docs/plannings/` (SIRAL-B)
**Metodología**: SDD Framework v2 (CDAID v2) — fase Do del ciclo PDCA

---

## Resumen

| Campo                   | Valor                         |
| ----------------------- | ----------------------------- |
| Sprint                  | 05                            |
| Total SPECs             | 3 (F4-01 a F4-03)             |
| Fase                    | F4 — Transparencia con Cifras |
| Esfuerzo estimado (P01) | 6–8 h                         |

**Alcance cross-repo**: F4-01 (`[SIRAL]`) se ejecuta en el repo **`SIRAL_System`**, no en este — así lo marca P01 desde su creación. F4-02/F4-03 son de este repo. Los tres se ejecutaron en la misma sesión de trabajo, en ese orden.

**Decisión de alcance (mismo patrón operativo que F1/F3)**: la API de SIRAL en producción está "pendiente deploy" (ver `SIRAL_System/agent_docs/project_status.md`), igual que Strapi lo estuvo en F1/F3. `fetchEstadisticasPublicas()` se cableó contra el cliente real, verificado con degradación agraciada de extremo a extremo: el build se probó contra `https://api.siral.sprintjudicial.com` real y obtuvo `ENOTFOUND` (DNS no resuelve — ni siquiera hay un servidor escuchando ahí todavía, un caso más estricto que el 403 de Strapi) y el sitio se construyó igual, sin errores, con la página cayendo a un placeholder honesto.

**Verificación con datos reales (no solo el camino vacío)**: se levantó una instancia real de la API de SIRAL en local con datos sembrados (Seccional + Empleados + 4 Quejas con distintos estados/tipos/trimestres) y se apuntó el build de este repo a esa instancia via `SIRAL_API_URL`. La página renderizó correctamente el total, el desglose por estado/tipo de conducta/trimestre y el tiempo promedio de resolución — confirmando que el camino "con datos" funciona, no solo el de degradación.

---

## Fase F4 — Transparencia con Cifras

### F4-01: Endpoint público `GET /api/v1/estadisticas/publicas` (repo `SIRAL_System`)

| Campo         | Valor                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Origen**    | P01 F4-01 (GAP G-20); `SIRAL_System` SIRAL-B                                                                                                                                   |
| **Repo**      | `SIRAL_System` (commit `5f75371`, rama `claude/justicia-sana-planning-nb8emp`)                                                                                                 |
| **Archivos**  | `src/siral/application/dtos/estadisticas_dtos.py`, `.../services/estadisticas_service.py`, `.../repositories/sync_queja_store.py`, `.../interfaces/api/routes/estadisticas.py` |
| **Prioridad** | P0 — bloquea F4-02/F4-03                                                                                                                                                       |
| **Estado**    | `[x]` completado                                                                                                                                                               |

**Cambios requeridos** (detalle completo en `SIRAL_System/agent_docs/project_status.md`):

1. Nueva ruta pública (sin JWT) que agrega quejas por estado, tipo de conducta, trimestre de radicación y tiempo promedio de resolución, agrupado por seccional vía el JOIN `quejas -> empleados -> seccionales` ya usado por `find_by_seccional`.
2. Ningún campo identificable expuesto (quejoso_id, acusado_id, descripcion, testigos, radicado) — verificado con un test dedicado que inspecciona los campos del DTO.
3. Agregación implementada como función **pura** (`calcular_estadisticas_publicas`), TDD real (RED con el módulo ausente, luego GREEN).

**Criterios de aceptación**:

- [x] 294/294 tests de `SIRAL_System` (283 previos + 11 nuevos), `ruff check src/` limpio, `bandit -r src/ -ll` sin hallazgos
- [x] Endpoint responde 200 sin `Authorization` header (verificado por integración con `httpx.AsyncClient`)
- [x] Verificado manualmente: servidor real (`uvicorn`) + `curl`, con datos vacíos y con datos sembrados

---

### SPEC-S05-F4-2: Cliente API SIRAL tipado

| Campo         | Valor                              |
| ------------- | ---------------------------------- |
| **Origen**    | P01 F4-02 (GAP G-20)               |
| **Archivos**  | `src/lib/siral.ts`, `.env.example` |
| **Prioridad** | P0                                 |
| **Estado**    | `[x]` completado                   |

**Cambios requeridos**:

1. `fetchEstadisticasPublicas()`: mismo patrón de degradación agraciada que `src/lib/strapi.ts` (try/catch, `!response.ok`, JSON inválido) — nunca lanza, devuelve `null`.
2. Sin token: el endpoint es público (rol `PUBLICO`, sin JWT) — no hay secreto que gestionar, a diferencia de `STRAPI_TOKEN`.
3. Tipos `readonly` (`ConteoCategoria`, `EstadisticasSeccional`, `EstadisticasPublicas`) reflejando exactamente el contrato JSON de F4-01.

**Criterios de aceptación**:

- [x] `npx astro check` sin errores
- [x] 5 tests unitarios (`tests/unit/siral.test.ts`): éxito, sin headers de auth, HTTP no-ok, red caída, JSON inválido
- [x] Verificado que el build **no se rompe** con la API real inalcanzable (`ENOTFOUND`, no solo un mock)

---

### SPEC-S05-F4-3: Página "Transparencia y cifras"

| Campo         | Valor                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------- |
| **Origen**    | P01 F4-03 (GAP G-20)                                                                                |
| **Archivos**  | `src/pages/transparencia-y-cifras.astro`, `src/components/ui/ConteoBarras.astro`, `src/lib/site.ts` |
| **Prioridad** | P0                                                                                                  |
| **Estado**    | `[x]` completado                                                                                    |

**Cambios requeridos**:

1. `ConteoBarras.astro`: visualización de barras **sin JavaScript** — el ancho se calcula en build-time y se aplica como `style` inline (no una utilidad de Tailwind dinámica, que el purge eliminaría). El número siempre se muestra como texto junto a la barra, no solo la barra — accesible, no depende del color/longitud visual únicamente (WCAG). Reutilizada 3 veces en la misma página (por estado, por tipo de conducta, por trimestre) — cruza el umbral de 3+ que ya justificó `PageHeader` en F3.
2. Si `fetchEstadisticasPublicas()` devuelve `null` o `total_quejas === 0` (caso real hoy, sin instancia de SIRAL), se muestra `ComingSoon` — mismo patrón que todas las páginas de F3.
3. Sección "Por seccional" solo se muestra si hay más de 1 seccional con datos — el piloto es de una sola seccional (Magdalena) hoy, así que mostrarla sería una repetición redundante del resumen general. El código ya soporta múltiples seccionales sin cambios cuando eso ocurra.
4. Añadida a `navLinks` (9 ítems ahora — ver nota de diseño abajo).

**Criterios de aceptación**:

- [x] `npx astro check` sin errores
- [x] E2E: responde 200, placeholder visible sin datos, enlazada en nav, cero errores de consola
- [x] Verificado manualmente con datos reales sembrados (no solo el camino vacío) — total, desglose y tiempo promedio se renderizan correctamente

---

## Notas de diseño

- **`navLinks` crece de 8 a 9 ítems**: el hallazgo diferido F3-L (`AUDIT_04`) ya advertía que 8 ítems se acercaba al techo práctico de un `nav` `flex-wrap` sin JS en móvil angosto. Con 9 ítems ese techo probablemente ya se cruzó. Se mantiene la decisión de cero JavaScript (regla crítica 2) — la alternativa nativa sin JS (`<details>/<summary>` como menú desplegable) se difiere hasta que el propio Gate F4 lo evalúe formalmente, para no tomar esa decisión de diseño sin auditoría.
- **Sin gráficos con librerías**: `ConteoBarras.astro` usa solo HTML+CSS (Tailwind + `style` inline), consistente con la regla crítica 2. No se evaluó ninguna librería de gráficos — habría sido la primera isla de JS del sitio sin una razón de peso que lo justifique frente a una alternativa sin JS igual de accesible.

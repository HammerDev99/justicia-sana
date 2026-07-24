# AUDIT 02 — Gate F1: CMS Strapi (cliente + contrato)

**Fecha**: 2026-07-24
**Fase auditada**: F1 (Sprint S02) — `docs/sprints/S02_CMS_STRAPI/`
**Tipo**: Gate entre fases (Check del ciclo PDCA)
**Auditor**: revisión inline multi-rol — sin subagentes
**Commits auditados**: `6c3c9d9` (cliente + contrato) · `bcee6e6` (trazabilidad) · `4b4b44c` (P02 Fase D)

> Alcance con naturaleza mixta: parte del gate es **código verificable en el repo** (cliente Strapi tipado); parte es **infraestructura fuera del repo** (instancia real, roles, webhook) que se audita como "planificado, pendiente de ejecución humana".

---

## 1. Checklist de gate

### Funcional

- [x] Cliente tipado (`src/lib/strapi.ts`): 3 genéricos + 11 funciones de dominio sobre los 9 content types
- [x] **Degradación agraciada verificada**: ninguna función lanza; devuelve `[]`/`null` ante error de red, HTTP no-ok o JSON inválido (criterio de aceptación P01)
- [x] 9 content types documentados como contrato JSON (`docs/content-types/`)
- [ ] Instancia Strapi real con los content types creados — **pendiente** (F1-01, acción humana; ver §4 F1-C)

### Seguridad

- [x] `STRAPI_TOKEN`/`STRAPI_URL` solo desde `import.meta.env` (server-side); **verificado empíricamente**: build con token de prueba → `grep` en `dist/` no lo encuentra
- [x] `.env` en `.gitignore`; `.env.example` sin valores reales
- [x] El portal público no expone datos confidenciales (regla crítica 3)

### Calidad

- [x] +22 tests (Vitest) sobre `strapi.ts`, total 34 en verde
- [x] `npx astro check` — 0 errores (tipos `readonly`, sin `any`)
- [x] `npm run lint` limpio

### Arquitectura

- [x] Tipos `readonly` para todas las respuestas de API (P00 inmutabilidad)
- [x] Cliente build-time; sin fetch en cliente (zero JS mantenido)
- [x] Patrón heredado literalmente de `rugby-bello-site/src/lib/strapi.ts` (no reinvención)

---

## 2. Conformidad SDD (protocolo 8 puntos, adaptado)

| #   | Punto (adaptado)                              | Resultado | Evidencia                                                                                                           |
| --- | --------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| P1  | Inmutabilidad (`readonly` ≈ frozen DTO)       | CONFORME  | `types.ts`: todas las interfaces `readonly`; `StrapiCollectionResponse<T>.data: readonly T[]`                       |
| P2  | Manejo de errores (degradación ≈ Result[T,E]) | CONFORME  | `fetchCollection`/`fetchSingle` atrapan y devuelven `[]`/`null`; nunca lanzan (equivalente a Failure sin excepción) |
| P3  | Backward compat                               | CONFORME  | Añade `src/lib/*` nuevo; no rompe F0 (build sigue verde)                                                            |
| P4  | Configuración                                 | CONFORME  | `STRAPI_URL`/`STRAPI_TOKEN` vía env con fallback; sin secretos en repo                                              |
| P5  | Delegación                                    | CONFORME  | 11 funciones de dominio delegan en `fetchCollection`/`fetchSingle`/`fetchBySlug` (DRY)                              |
| P6  | Tests: éxito + fallo + cobertura              | CONFORME  | 22 tests: éxito, HTTP error, red caída, `data:null`, JSON inválido, endpoint correcto por función                   |
| P7  | Code smells                                   | CONFORME  | Ver §3                                                                                                              |
| P8  | Patrones                                      | CONFORME  | Ver §3 (Facade/Repository-like sobre la API REST)                                                                   |

**Tasa de aprobación SDD**: 8 CONFORME / 8 = **100 %** (≥ 85 % ✓)

---

## 3. Reportes de revisión (multi-rol, inline)

### code-reviewer

- `strapi.ts`: `buildQueryString`/`buildHeaders` puros y cohesivos; `fetchBySlug` compone sobre `fetchCollection` (bien). Los `sort`/`populate` por defecto en las funciones de dominio son sensatos. `console.warn` (no `error`) para degradación esperada — correcto. **Sin hallazgos.**
- `types.ts`: unión de literales para cada enumeración (`TipoNorma`, `CategoriaArticulo`, …) refleja fielmente el contrato. **Sin hallazgos.**

### security-scanner

- No-fuga de token verificada empíricamente (no solo por lectura). Sin `dangerouslySetInnerHTML`/`set:html` sobre datos de Strapi en F1 (no hay render aún). **Nota para F3**: al renderizar `richtext`/`cuerpo` de Strapi habrá que sanitizar o usar render seguro — se registra como aviso para F3, no es hallazgo de F1.

### refactor-planner (skill `refactoring`)

- Sin Duplicate Code real: las 7 funciones de colección comparten el genérico; la repetición de `{ populate:'*', sort:…, ...params }` es configuración, no lógica duplicada. **Sin smell bloqueante.**

### design-patterns (skill `design-patterns`)

- El módulo actúa como **Facade** sobre la API REST de Strapi (oculta query-building y manejo de errores) con sabor a **Repository** (funciones de dominio por entidad). Apropiado, sin sobre-ingeniería. **Sin hallazgos.**

### doc-auditor

- Contrato de content-types ↔ `types.ts`: nombres de campo coinciden (revisado entidad por entidad). `SPEC_S02`, resumen, `strapi_integration.md` y `DEPLOYMENT_STRAPI.md` coherentes. Trazabilidad de commits correcta (F1-01/03/05 sin hash de completado). **Sin desincronización.**

---

## 4. Hallazgos de esta auditoría

| ID   | Hallazgo                                                                                                                                           | Clasificación            | Acción                                                                                                                                                  |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1-A | El cliente solo está probado contra `fetch` mockeado; **sin prueba de integración** contra una instancia Strapi real                               | DIVERGENCIA JUSTIFICADA  | No existía instancia al implementar. **Trigger**: test de integración tras P02 Fase A/B (instancia persistente con los content types)                   |
| F1-B | `types.ts` acopla nombres de campo al esquema Strapi; una divergencia al materializar el esquema causaría desajuste silencioso (campo `undefined`) | DIVERGENCIA MENOR        | Mitigado: el contrato JSON es fuente única. Verificar 1:1 al crear los `schema.json` (P02 B-01)                                                         |
| F1-C | F1-01/03/05 (instancia, roles, webhook) pendientes de acción humana                                                                                | NO DEFECTO (planificado) | Guía `DEPLOYMENT_STRAPI.md`; además surgió que la instancia desplegada está en dev/SQLite → **realimentó el Plan** con P02 (buen ciclo PDCA Check→Plan) |

Ningún hallazgo es **DEFECTO** en el código entregado. Los pendientes son acción humana en el VPS, ya planificados.

## 5. Correcciones aplicadas

Ninguna requerida en el código de F1 (sin defectos). La corrección relevante del período (deploy) pertenece a F0 (`AUDIT_01`).

## 6. Hallazgos diferidos

- **F1-A** → test de integración real, dependiente de P02 Fase A/B.
- **F1-B** → verificación 1:1 esquema↔tipos al ejecutar P02 B-01.
- **Aviso F3**: sanitización/render seguro de campos `richtext` de Strapi.
- **P02 completo** (Fases A/B/C) es prerequisito operativo para que F1 quede "real".

---

## Veredicto

**GATE F1: APROBADO (código) con salvedad operativa** ✅⚠

- Tasa de aprobación SDD: 100 % (8/8) sobre el código entregado.
- 0 DEFECTOS; 2 divergencias (1 justificada, 1 menor) + 1 pendiente planificado.
- **Salvedad**: F1 no está "real" hasta ejecutar **P02** (Strapi persistente en producción) y F1-01/03/05. El código del cliente ya degrada con gracia, así que **no bloquea** avanzar a F2.

Habilitado para continuar a F2 (a la orden del propietario). Cerrar F1 por completo requiere P02 + verificación de integración.

---

**Versión**: 1.0
**Fecha**: 2026-07-24

# AUDIT 04 — Gate F3: Contenido Núcleo

**Fecha**: 2026-07-24
**Fase auditada**: F3 (Sprint S04) — `docs/sprints/S04_CONTENIDO_NUCLEO/`
**Tipo**: Gate entre fases (Check del ciclo PDCA)
**Auditor**: 4 agentes paralelos (security-scanner, code-reviewer, senior-architect, refactor-planner) + análisis inline P8 (skill `design-patterns`) — todos los hallazgos re-verificados manualmente antes de incorporarse a este documento
**Commit auditado**: `c2302de` (Sprint S04 completo, PR #2 fusionado a `main`)

---

## 1. Checklist de gate

### Funcional

- [x] 7 páginas cableadas contra el cliente Strapi real (`quienes-somos`, `normativa`, `canales-de-ayuda`, `index`/`AyudaBanner`, `material-pedagogico`, `noticias` + `noticias/[slug]`, `capacitaciones-y-comunicados`)
- [x] `/radicar-una-queja` nueva, 100% estática, sin dependencia de Strapi
- [x] Degradación agraciada verificada de extremo a extremo — build probado contra `cms.sprintjudicial.com` real (responde 403, no caído): 9 páginas construidas sin error
- [x] `PageHeader.astro` extraído y adoptado — **hallazgo real durante este gate**: `404.astro` había quedado fuera de la migración (ver §4, F3-F) — corregido

### Seguridad

- [x] Sin `set:html` sobre contenido `richtext` de Strapi (verificado — ningún hallazgo)
- [x] Sin dato de contacto fabricado (verificado — los 3 tests de F2 siguen en verde)
- [x] Sin secretos/token expuestos (verificado)
- [x] **2 DEFECTOS reales encontrados y corregidos en este gate** (ver §4, F3-A y F3-B): URLs de media de Strapi sin prefijo `STRAPI_URL` (violaba una convención ya documentada en `agent_docs/strapi_integration.md`), y campos de enlace controlados por el editor de Strapi (`url_video`, `enlace_inscripcion`) sin validación de esquema — un valor `javascript:...` habría sido clic-ejecutable, sorteando la propia mitigación de XSS que el sprint afirmaba haber cerrado

### Calidad

- [x] `npx astro check` — 0 errores (39 archivos)
- [x] `npm run lint` — limpio
- [x] `npm test` — **43/43 unit** (era 34; +9 tests nuevos para los 3 helpers creados en el Act de este gate)
- [x] `npx playwright test` — **23/23 E2E** (mismo conteo que al cierre de S04; 2 tests corregidos, ninguno eliminado)

### Arquitectura

- [x] Patrón "fetch real + fallback honesto" aplicado consistentemente en las 6 páginas con datos Strapi (confirmado por `senior-architect`, sin divergencia no justificada)
- [x] `getStaticPaths()` de `noticias/[slug].astro` correcto para 0 artículos hoy (build no falla, 0 rutas generadas)
- [x] Nueva capa `src/lib/richtext.ts` (extraída en este gate) — cero componentes huérfanos, cero god-objects

---

## 2. Conformidad SDD (protocolo 8 puntos, adaptado — ver `docs/validate/README.md`)

> Los puntos que tenían un hallazgo real se muestran **CONFORME** cuando el Act de este mismo gate lo corrigió (con nota), y **DIVERGENCIA** cuando queda diferido a propósito.

### SPEC-S04-F3-1: "¿Quiénes somos?" dinámico

| Punto | Resultado | Detalle                                                                                                                                                                                                               |
| :---: | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  P1   | CONFORME  | Tipos `readonly` en toda la cadena                                                                                                                                                                                    |
|  P2   | CONFORME  | **2 defectos corregidos en este gate**: `reglamento_pdf.url` sin prefijo `STRAPI_URL` (F3-A) y `mision`/`funciones` (campos `richtext`) renderizados como un único `<p>` en vez de párrafos (F3-G) — ambos arreglados |
|  P3   | CONFORME  | Fallback al contenido estático de F2 intacto                                                                                                                                                                          |
|  P4   | CONFORME  | N/A                                                                                                                                                                                                                   |
|  P5   | CONFORME  | Usa `getStrapiMediaUrl()` y `splitRichtextParagraphs()`, ambos helpers compartidos nuevos                                                                                                                             |
|  P6   | CONFORME  | E2E confirma el fallback estático (`Objetivo`) cuando Strapi no tiene datos                                                                                                                                           |
|  P7   | CONFORME  | Duplicación de la lógica de párrafos resuelta (ver F3-G) — 3 usos ahora comparten un solo helper                                                                                                                      |
|  P8   | CONFORME  | Sin sobre-ingeniería; el helper de richtext es mínimo                                                                                                                                                                 |

**Veredicto**: 8/8 CONFORME (2 defectos corregidos en este gate)

---

### SPEC-S04-F3-2: Biblioteca de Normativa dinámica

| Punto | Resultado | Detalle                                                                       |
| :---: | --------- | ----------------------------------------------------------------------------- |
| P1–P8 | CONFORME  | Sin hallazgos nuevos de los 4 agentes; `NormaTable.astro` no requirió cambios |

**Veredicto**: 8/8 CONFORME

_Nota (no es un hallazgo nuevo de F3)_: `normativa.astro` sigue citando "procedimiento de hasta 65 días", ya aprobado en `AUDIT_03` por ser trazable a `CLAUDE.md`. La discrepancia cross-repo subyacente (F2-J: 65 días vs. 6 meses de `SIRAL_System`) sigue sin resolver — `/radicar-una-queja` la evita deliberadamente, así que el sitio hoy es inconsistente entre ambas páginas en ese único dato. No bloquea este gate (ya fue clasificado y diferido en `AUDIT_03`); se re-registra para visibilidad.

---

### SPEC-S04-F3-3: Material pedagógico

| Punto | Resultado | Detalle                                                                                                                        |
| :---: | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
|  P1   | CONFORME  | —                                                                                                                              |
|  P2   | CONFORME  | **2 defectos corregidos en este gate**: `archivo.url` sin prefijo `STRAPI_URL` (F3-A) y `url_video` sin validar esquema (F3-B) |
|  P3   | CONFORME  | —                                                                                                                              |
|  P4   | CONFORME  | N/A                                                                                                                            |
|  P5   | CONFORME  | Usa `getStrapiMediaUrl()`/`isEnlaceSeguro()`                                                                                   |
|  P6   | CONFORME  | **Corregido en este gate** (F3-C): el test "responden 200" no verificaba el status HTTP real — ver §5                          |
|  P7   | CONFORME  | Wrapper `ComingSoon` duplicado resuelto (F3-E)                                                                                 |
|  P8   | CONFORME  | —                                                                                                                              |

**Veredicto**: 8/8 CONFORME (2 defectos + 1 hallazgo de test corregidos en este gate)

---

### SPEC-S04-F3-4: Noticias y jurisprudencia

| Punto | Resultado         | Detalle                                                                                                                                                                                                 |
| :---: | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  P1   | CONFORME          | —                                                                                                                                                                                                       |
|  P2   | CONFORME          | Richtext (`cuerpo`) ahora usa el helper compartido (corrige además un gap real: `\n{2,}` no capturaba `\r\n\r\n`, y no filtraba párrafos vacíos)                                                        |
|  P3   | CONFORME          | `getStaticPaths()` correcto con 0 artículos                                                                                                                                                             |
|  P4   | CONFORME          | N/A                                                                                                                                                                                                     |
|  P5   | CONFORME          | Pasa el `Articulo` completo por `props` en vez de un segundo fetch — mejor diseño que el que describía el SPEC original (`fetchArticuloBySlug`); **SPEC corregido en este gate** (F3-I) para reflejarlo |
|  P6   | CONFORME          | Corregido F3-C (ver F3-3)                                                                                                                                                                               |
|  P7   | DIVERGENCIA MENOR | El contrato de unicidad del `slug` depende de que Strapi's `uid` field lo garantice — documentado solo en `docs/content-types/`, no reforzado con un comentario en `types.ts`. Bajo riesgo, diferido    |
|  P8   | CONFORME          | —                                                                                                                                                                                                       |

**Veredicto**: 7/8 CONFORME, 1 DIVERGENCIA MENOR (diferida, ver §6)

---

### SPEC-S04-F3-5: Canales de ayuda dinámico + `AyudaBanner` conectado

| Punto | Resultado | Detalle                                                                                                                                                                                                     |
| :---: | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1–P8 | CONFORME  | El grupo más limpio del sprint — ningún agente reportó un hallazgo específico de estos 2 archivos, más allá del wrapper `ComingSoon` compartido (F3-E, ya corregido) y el copy de Home (F3-J, ya corregido) |

**Veredicto**: 8/8 CONFORME

---

### SPEC-S04-F3-6: Capacitaciones y comunicados

| Punto | Resultado | Detalle                                                                                                                 |
| :---: | --------- | ----------------------------------------------------------------------------------------------------------------------- |
|  P1   | CONFORME  | —                                                                                                                       |
|  P2   | CONFORME  | **Defecto corregido en este gate**: `enlace_inscripcion` sin validar esquema (F3-B)                                     |
|  P3   | CONFORME  | —                                                                                                                       |
|  P4   | CONFORME  | N/A                                                                                                                     |
|  P5   | CONFORME  | Usa `isEnlaceSeguro()` y `splitRichtextParagraphs()`                                                                    |
|  P6   | CONFORME  | —                                                                                                                       |
|  P7   | CONFORME  | Wrapper `ComingSoon` y duplicación de richtext resueltos                                                                |
|  P8   | CONFORME  | La variación estructural (`sinContenido` combinando 2 colecciones) está justificada — confirmado por `senior-architect` |

**Veredicto**: 8/8 CONFORME (1 defecto corregido en este gate)

---

### SPEC-S04-F3-7: Página "Radicar una queja"

| Punto | Resultado | Detalle                                                                                                                                                                   |
| :---: | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  P1   | CONFORME  | —                                                                                                                                                                         |
|  P2   | CONFORME  | **Hallazgo corregido en este gate** (F3-D): la cita "conforme a la Ley 1010 de 2006" no era trazable a la fuente citada en el SPEC (`SIRAL_System/CLAUDE.md`) — corregida |
|  P3   | CONFORME  | Sin dependencia de Strapi, como se planeó                                                                                                                                 |
|  P4   | CONFORME  | N/A                                                                                                                                                                       |
|  P5   | CONFORME  | —                                                                                                                                                                         |
|  P6   | CONFORME  | Corregido F3-C (ver F3-3); TDD real verificado (ver Sprint S04, no repetido aquí)                                                                                         |
|  P7   | CONFORME  | —                                                                                                                                                                         |
|  P8   | CONFORME  | —                                                                                                                                                                         |

**Veredicto**: 8/8 CONFORME (1 hallazgo de precisión legal corregido en este gate)

**Tasa de aprobación SDD**: (8+8+8+7+8+8+8) / 56 = **55/56 = 98.2 %** (≥ 85 % ✓) · 0 DEFECTOS sin resolver

---

## 3. Reportes de revisión (4 agentes paralelos + análisis inline)

### security-scanner

- **F3-A** (media URL sin prefijo) y **F3-B** (href sin validar esquema) — hallazgos principales, ambos verificados contra el código real (no solo aceptados de la SPEC) y clasificados MEDIUM/LOW según explotabilidad (F3-B requiere una cuenta editora de Strapi comprometida; F3-A es un bug funcional latente, no una vulnerabilidad).
- Confirmó, leyendo el propio código fuente de Astro (`escape.js`), que `{}` sí escapa HTML — la afirmación central del SPEC sobre por qué evitar `set:html` es cierta, no solo asumida.
- **F3-K**: los tests anti-fabricación (`layout.spec.ts`) asumen "Strapi vacío" como invariante permanente; el día que el CCL publique un canal real con teléfono, esos tests se pondrían en rojo — riesgo de que bajo presión se debiliten en vez de re-diseñarse. Registrado como diferido (ver §6), no corregible hoy sin un fixture de Strapi que no existe.
- **F3-D**: cita legal no trazable en `radicar-una-queja.astro` — mismo tipo de riesgo que F2-J, en una página que lee una posible víctima antes de decidir denunciar.

### code-reviewer

- Confirmó independientemente que el puente `telefono?.string ?? undefined` (`CanalAyuda.telefono: string | null` → `AyudaBanner.telefono?: string`) es type-safe de verdad, no solo "pasa `astro check` por casualidad" — sin `exactOptionalPropertyTypes`, y `AyudaBanner` además usa truthiness checks.
- Halló los mismos F3-A/F3-B de forma independiente (convergencia con `security-scanner`), más F3-G (richtext de `quienes-somos` sin dividir en párrafos), F3-C (test "responden 200" sin aserción de status), F3-F (404.astro sin migrar a `PageHeader`), F3-I (SPEC↔código desincronizado sobre `fetchArticuloBySlug`), y F3-J (copy de Home en tiempo futuro).
- Sin hallazgos en `getStaticPaths()`, en la ausencia de `set:html`, ni en el manejo de errores general.

### senior-architect

- Patrón fetch+fallback aplicado consistentemente; la única variación estructural real (`capacitaciones-y-comunicados`'s `sinContenido`) está justificada por combinar 2 colecciones.
- Identificó el wrapper `ComingSoon` duplicado 4 veces como ya por encima del umbral que el propio proyecto usó para justificar `PageHeader` — recomendó absorberlo en el componente (F3-E, aplicado).
- **F3-L**: 8 ítems de navegación sin JS se acerca al techo práctico de `flex-wrap` en móvil angosto — juicio de diseño, no defecto de código; diferido para revisión de diseño, no de código.
- Sin problemas de acoplamiento/capas: todas las páginas dependen de `lib/strapi.ts` de la misma forma ya auditada en F1.

### refactor-planner (skill `refactoring`)

- Confirmó F3-F (404.astro sin `PageHeader`) y F3-E (wrapper `ComingSoon`) de forma convergente con otros agentes.
- Recomendó explícitamente **no** extraer el patrón "lista o `ComingSoon`" en un componente genérico — 4 ocurrencias del condicional, pero las ramas no son duplicación real (contenedores, campos y formas distintos); habría sido la abstracción prematura que el proyecto evita.
- Encontró `fetchNormaBySlug`/`fetchArticuloBySlug`/`fetchHome`/`Home` sin consumidores en `src/` — código heredado de F1, fuera del alcance de este gate (ya aprobado en `AUDIT_02`); solo corrigió la referencia desactualizada del SPEC de S04 (F3-I).
- Sugirió un `formatFecha()` para las fechas ISO crudas (`fecha_publicacion`, `fecha`) — 4 ocurrencias, por encima del umbral de 3, pero es una mejora cosmética/i18n de bajo riesgo. **Diferida** (ver §6) — no bloquea el gate.

### Análisis P8 — patrones (skill `design-patterns`, inline)

- El patrón "fetch real → fallback estático o `ComingSoon`" es, en esencia, un **Null Object** ligero (`ComingSoon` como stand-in seguro cuando no hay datos), correctamente implementado sin forzar una jerarquía de clases — apropiado para Astro/frontmatter.
- `PageHeader.astro` sigue funcionando como la pieza de Template Method establecida en F2 — su adopción en las 9 páginas confirma que no fue sobre-ingeniería.
- `getStrapiMediaUrl()` e `isEnlaceSeguro()` son funciones puras extraídas exactamente donde correspondía (Strategy/Utility mínimos, sin envolver en clases innecesarias) — coherente con el catálogo Python/TS de este proyecto ("Strategy → funciones de primera clase").
- Sin sobre-ingeniería nueva: se evaluó explícitamente extraer un componente genérico de lista-o-placeholder y se descartó por abstracción prematura (convergente con `refactor-planner`).

---

## 4. Hallazgos de esta auditoría

| ID   | Hallazgo                                                                                                                                                                                                                                                             | Clasificación           | Acción                                                                                                                                                            |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F3-A | `StrapiMedia.url` renderizado crudo como `href` (`quienes-somos.astro`, `material-pedagogico.astro`), sin prefijo `STRAPI_URL` — viola convención ya documentada en `agent_docs/strapi_integration.md:113`                                                           | **DEFECTO**             | **Corregido**: `getStrapiMediaUrl()` en `strapi.ts`, TDD RED→GREEN, 2 tests unitarios nuevos                                                                      |
| F3-B | `url_video`/`enlace_inscripcion` (texto libre editable en Strapi) renderizados como `href` sin validar esquema — un valor `javascript:...` sería clic-ejecutable, sorteando la mitigación de XSS que el SPEC §6 afirmaba haber cerrado                               | **DEFECTO**             | **Corregido**: `isEnlaceSeguro()` (allowlist http/https) + `rel="noopener noreferrer"`, TDD RED→GREEN, 3 tests                                                    |
| F3-C | `tests/e2e/contenido.spec.ts`: el test "responden 200" solo verificaba `banner`/`contentinfo` visibles, que también son ciertos en una página 404 (ambas usan `PageLayout`) — no detectaría una ruta rota                                                            | **DEFECTO**             | **Corregido**: se demostró el punto ciego con una ruta inexistente real (RED confirmado), se añadió `expect(response?.status()).toBe(200)`                        |
| F3-D | `radicar-una-queja.astro` citaba "conforme a la Ley 1010 de 2006" para "no son anónimas" — no trazable a la fuente que el SPEC exigía (`SIRAL_System/CLAUDE.md`, que no cita esa norma para esa afirmación)                                                          | DIVERGENCIA MENOR       | **Corregido**: se retiró la atribución legal no verificada, se mantiene la afirmación como regla del sistema SIRAL                                                |
| F3-E | `<div class="mt-8 max-w-2xl"><ComingSoon .../></div>` duplicado idéntico 4 veces                                                                                                                                                                                     | DIVERGENCIA MENOR       | **Corregido**: margen absorbido en `ComingSoon.astro`, 4 wrappers eliminados                                                                                      |
| F3-F | `404.astro` quedó fuera de la extracción de `PageHeader` (9 de 10 páginas migradas)                                                                                                                                                                                  | DIVERGENCIA MENOR       | **Corregido**                                                                                                                                                     |
| F3-G | `quienes-somos.astro` renderizaba `mision`/`funciones` (campos `richtext`) como un único `<p>`, inconsistente con el resto del sprint; la lógica de partición de párrafos estaba además duplicada con un gap real (no capturaba `\r\n`, no filtraba párrafos vacíos) | DIVERGENCIA MENOR       | **Corregido**: `splitRichtextParagraphs()` extraído a `src/lib/richtext.ts`, aplicado en 3 sitios, 4 tests unitarios nuevos                                       |
| F3-H | `layout.spec.ts` y `contenido.spec.ts` tenían 2 tests con el mismo nombre ("cero errores de consola en las páginas nuevas") cubriendo páginas distintas                                                                                                              | DIVERGENCIA MENOR       | **Corregido**: renombrado el de `layout.spec.ts`                                                                                                                  |
| F3-I | El SPEC de S04 listaba `fetchArticuloBySlug` como usado por F3-04; la implementación real usa `getStaticPaths()` + `props` (mejor diseño, evita un fetch extra)                                                                                                      | DIVERGENCIA MENOR (doc) | **Corregido**: texto del SPEC ajustado a la implementación real                                                                                                   |
| F3-J | Card de Home ("Ayuda psicológica") con copy en tiempo futuro ("publicará"), desalineado ahora que la página enlazada puede mostrar datos reales                                                                                                                      | DIVERGENCIA MENOR       | **Corregido**: copy neutralizado                                                                                                                                  |
| F3-K | Los tests anti-fabricación de contacto (F2) asumen "Strapi vacío" como invariante permanente — se pondrían en rojo el día que el CCL publique un canal real                                                                                                          | DIVERGENCIA JUSTIFICADA | Diferido — correcto para el estado actual; requiere un fixture de Strapi (no existente) para probar el caso "con datos reales" sin depender de una instancia real |
| F3-L | `navLinks` con 8 ítems se acerca al techo práctico de un `nav` `flex-wrap` sin JS en móvil angosto                                                                                                                                                                   | DIVERGENCIA JUSTIFICADA | Diferido — juicio de diseño, no defecto; revisar antes de añadir más ítems (F5/F7)                                                                                |
| F3-M | `getStaticPaths()` de `noticias/[slug].astro` depende de que Strapi's `uid` garantice slugs únicos — contrato documentado solo en `docs/content-types/`, no reforzado en `types.ts`                                                                                  | DIVERGENCIA MENOR       | Diferido — bajo riesgo, cosmético                                                                                                                                 |
| F3-N | `fetchArticulos()`/`fetchCanalesAyuda()` se llaman 2 veces por build (páginas índice + detalle/Home) — mismo endpoint, sin memoización                                                                                                                               | DIVERGENCIA MENOR       | Diferido — por debajo del umbral de 3+ para justificar una capa de caché                                                                                          |
| F3-O | Fechas ISO crudas (`fecha_publicacion`, `fecha`) mostradas sin formatear ni `<time>` semántico, en 4 sitios                                                                                                                                                          | DIVERGENCIA MENOR       | Diferido — `formatFecha()` recomendado, no bloqueante                                                                                                             |

Ningún hallazgo queda como **DEFECTO sin resolver**. Los 3 defectos reales (F3-A, F3-B, F3-C) se corrigieron dentro de este mismo gate con TDD verificado.

---

## 5. Correcciones aplicadas (Act)

| Hallazgo | Corrección                                                                                                                                 | Archivo(s)                                                                                                                              | Verificación                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| F3-A     | `getStrapiMediaUrl()` nuevo en `strapi.ts` (prefija `STRAPI_URL` si la URL es relativa)                                                    | `src/lib/strapi.ts`, `src/pages/quienes-somos.astro`, `src/pages/material-pedagogico.astro`, `tests/unit/strapi.test.ts`                | TDD: RED confirmado (`getStrapiMediaUrl is not a function`) → GREEN (2 tests: relativa/absoluta)        |
| F3-B     | `isEnlaceSeguro()` nuevo (allowlist `http(s)`) + `rel="noopener noreferrer"`                                                               | `src/lib/strapi.ts`, `src/pages/material-pedagogico.astro`, `src/pages/capacitaciones-y-comunicados.astro`, `tests/unit/strapi.test.ts` | TDD: RED confirmado → GREEN (3 tests: http/https válidos, `javascript:`/`data:`/`vbscript:` rechazados) |
| F3-C     | `contenido.spec.ts`: se añadió `expect(response?.status()).toBe(200)`                                                                      | `tests/e2e/contenido.spec.ts`                                                                                                           | RED real demostrado con una ruta inexistente (banner+contentinfo pasaban igual) → GREEN tras el fix     |
| F3-D     | Se retiró la atribución "conforme a la Ley 1010 de 2006"; se mantiene la afirmación como regla del sistema SIRAL                           | `src/pages/radicar-una-queja.astro`                                                                                                     | E2E "aclara que las quejas no son anónimas" sigue en verde                                              |
| F3-E     | Margen `mt-8 max-w-2xl` absorbido en `ComingSoon.astro`; 4 wrappers `<div>` eliminados                                                     | `src/components/ui/ComingSoon.astro` + 4 páginas                                                                                        | E2E de placeholder sigue en verde en las 4 páginas                                                      |
| F3-F     | `404.astro` migrado a `<PageHeader title="Página no encontrada" />`                                                                        | `src/pages/404.astro`                                                                                                                   | `astro check` 0 errores                                                                                 |
| F3-G     | `splitRichtextParagraphs()` nuevo en `src/lib/richtext.ts`; aplicado en `quienes-somos`, `noticias/[slug]`, `capacitaciones-y-comunicados` | `src/lib/richtext.ts`, 3 páginas, `tests/unit/richtext.test.ts`                                                                         | TDD: RED confirmado (módulo inexistente) → GREEN (4 tests: LF, CRLF, filtrado de vacíos, sin separador) |
| F3-H     | Test de `layout.spec.ts` renombrado                                                                                                        | `tests/e2e/layout.spec.ts`                                                                                                              | Suite completa sin nombres duplicados                                                                   |
| F3-I     | Texto del SPEC corregido para reflejar `getStaticPaths()` + `props` en vez de `fetchArticuloBySlug`                                        | `docs/sprints/S04_CONTENIDO_NUCLEO/SPEC_S04_F3_CONTENIDO.md`                                                                            | Revisión manual contra el código real                                                                   |
| F3-J     | Copy de la Card "Ayuda psicológica" en Home neutralizado                                                                                   | `src/pages/index.astro`                                                                                                                 | E2E "3 tarjetas siguen presentes" sigue en verde                                                        |

Quality gate completo re-ejecutado tras las correcciones: `npm run lint` ✓ · `npx astro check` (0 errores, 39 archivos) ✓ · `npm test` (**43/43**, +9 desde el cierre de S04) ✓ · `npm run build` (9 páginas) ✓ · `npx playwright test` (**23/23**) ✓.

---

## 6. Hallazgos diferidos (alimentan el backlog / próximo Planning)

- **F3-K** (tests anti-fabricación asumen Strapi vacío) → revisar cuando el CCL publique el primer canal real; requiere decidir una estrategia de fixture/mock para probar ambos estados sin depender de una instancia productiva
- **F3-L** (`navLinks` cerca del techo de `flex-wrap` sin JS) → revisión de diseño antes de F5/F7, no defecto de código hoy
- **F3-M** (contrato de unicidad de `slug` no reforzado en `types.ts`) → comentario de una línea, bajo riesgo
- **F3-N** (fetch duplicado del mismo endpoint en 2 páginas) → memoización si aparece un tercer caso (regla de 3+)
- **F3-O** (fechas ISO sin formatear) → `formatFecha()` (Intl.DateTimeFormat es-CO) + `<time>` semántico, mejora WCAG/i18n no bloqueante
- **F2-J** (persiste, no nuevo de F3): discrepancia "65 días" (`normativa.astro`, trazable a `CLAUDE.md`) vs. ningún número (`radicar-una-queja.astro`, deliberado) vs. "6 meses" (`SIRAL_System`) — requiere verificación humana del texto oficial de la Resolución 3461/2025
- Heredado de F1 (fuera de alcance de este gate, ya aprobado en `AUDIT_02`): `fetchNormaBySlug`/`fetchHome`/`Home` sin consumidores en `src/`; `FetchParams.pagination`/`fields` sin uso real

---

## Veredicto

**GATE F3: APROBADO** ✅

- Tasa de aprobación SDD: **98.2 %** (55/56 puntos CONFORME) — ≥ 85 % ✓
- 0 DEFECTOS sin resolver — los 3 encontrados (F3-A, F3-B, F3-C) se corrigieron con TDD dentro de este mismo gate, incluyendo 2 hallazgos de seguridad reales (URLs de media rotas en producción, enlaces controlados por editor sin validar esquema)
- 10 divergencias menores corregidas en el Act de este gate + 7 diferidas (ninguna bloqueante) documentadas para el backlog
- Autoridad de aprobación: automática (Gates F1-F4 no requieren revisión humana con tasa ≥85 % y 0 defectos sin resolver, por regla de este protocolo)

Habilitado para continuar a **Fase F4 (Transparencia con cifras SIRAL)**, a la orden del propietario del proyecto. La Fase F3 seguirá mostrando fallbacks/placeholders honestos en producción hasta que F1-01/03/05 (instancia real de Strapi) se ejecuten y el CCL cargue contenido — condición operativa ya conocida desde `AUDIT_02`, no un bloqueo de este gate.

---

**Versión**: 1.0
**Fecha**: 2026-07-24

# SDD SPEC — Sprint 04

**Fecha**: 2026-07-24
**Planning de referencia**: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (Fase F3), `docs/validate/AUDIT_02_2026-07-24_GATE_F1_CMS_STRAPI.md` (hallazgo F1-A, aviso de sanitización), `docs/validate/AUDIT_03_2026-07-24_GATE_F2_LAYOUT.md` (hallazgos F2-G, F2-I diferidos)
**Metodología**: SDD Framework v2 (CDAID v2) — fase Do del ciclo PDCA

---

## Resumen

| Campo                   | Valor                                        |
| ----------------------- | -------------------------------------------- |
| Sprint                  | 04                                           |
| Total SPECs             | 7 (F3-01 a F3-07)                            |
| Fase                    | F3 — Contenido Núcleo (servido desde Strapi) |
| Esfuerzo estimado (P01) | 14–18 h                                      |

**Decisión de alcance (documentada para no confundir a la auditoría)**: la instancia real de Strapi en producción **no existe todavía** — F1-01/03/05 siguen pendientes de acción humana en el VPS (ver `AUDIT_02` §F1-C). Populan contenido real (biografías de integrantes, recursos pedagógicos, artículos, capacitaciones) tampoco es posible hoy: son insumos que debe aportar el CCL, no algo que este sprint pueda o deba inventar.

Por lo tanto, F3 se ejecuta con el mismo patrón operativo ya auditado y aprobado en F1 (`AUDIT_02`, "APROBADO (código) con salvedad operativa"):

1. **Todas las páginas de F3-01/02/05 quedan cableadas contra el cliente Strapi real** (`fetchQuienesSomos`, `fetchIntegrantesComite`, `fetchNormas`, `fetchCanalesAyuda` — funciones ya construidas y auditadas en F1). Ninguna usa datos mockeados nuevos.
2. **F3-03/04/06 son páginas completamente nuevas**, también cableadas contra Strapi (`fetchRecursosPedagogicos`, `fetchArticulos`, `fetchCapacitaciones`/`fetchComunicados`).
3. **Degradación agraciada verificada de extremo a extremo**: como hoy no hay instancia real, cada `fetch*` real devuelve `[]`/`null` (comportamiento ya probado en F1) y cada página cae a un estado honesto — o el contenido estático ya auditado de F2 (quienes-somos, normativa), o un placeholder `ComingSoon` explícito (para contenido que F2 no cubrió). **Esto no es un mock**: es el comportamiento real de producción hasta que el CCL publique contenido, y valida en caliente (sin instancia de prueba) que el sitio nunca se rompe si Strapi está vacío o caído — el criterio de aceptación de P01 ("build no se rompe si Strapi/SIRAL están caídos").
4. **F3-07 (Radicar una queja) es 100% estática**, sin dependencia de Strapi — no hay ningún GAP de contenido que la bloquee, así que se implementa completa en este sprint.
5. **Extracción de `PageHeader.astro`**: resuelve el hallazgo diferido F2-G (`AUDIT_03`) — con el crecimiento de 5 a 9 páginas, la duplicación de las clases Tailwind del `<h1>` ya justifica la abstracción (regla de 3+ con criterio, ya no es prematura).
6. **Seguridad en contenido enriquecido (`richtext` de Strapi)**: `Articulo.cuerpo` y `Comunicado.cuerpo` **no se renderizan con `set:html`**. Se dividen en párrafos por saltos de línea y se interpolan como texto (`{parrafo}`), que Astro escapa automáticamente — mitiga XSS almacenado si una cuenta editora de Strapi es comprometida o publica contenido malicioso por error. Se pierde formato enriquecido (negritas, enlaces internos del editor) a cambio; atender el aviso ya registrado en `AUDIT_02` ("al renderizar richtext/cuerpo de Strapi habrá que sanitizar o usar render seguro") con una sanitización robusta (allowlist de tags) queda diferido a cuando el CCL efectivamente necesite formato enriquecido — decisión de seguridad deliberada, no una limitación accidental.

**Regla de seguridad heredada de F2**: sigue sin fabricarse ningún dato de contacto de ayuda psicológica. La diferencia con F2 es que ahora, si Strapi _sí_ tiene canales reales cargados, la página los muestra — ya no son inventados, son datos reales publicados por el CCL vía CMS.

---

## Fase F3 — Contenido Núcleo

### SPEC-S04-F3-1: "¿Quiénes somos?" dinámico (integrantes + misión/funciones)

| Campo         | Valor                           |
| ------------- | ------------------------------- |
| **Origen**    | P01 F3-01 (GAP G-01)            |
| **Archivos**  | `src/pages/quienes-somos.astro` |
| **Prioridad** | P0                              |
| **Estado**    | `[x]` completado                |

**Cambios requeridos**:

1. `quienes-somos.astro` hace `await fetchQuienesSomos()` y `await fetchIntegrantesComite()` en build-time.
2. Si `fetchQuienesSomos()` devuelve datos reales, se usan `mision`/`funciones` (y enlace a `reglamento_pdf` si existe) en vez del texto estático. Si devuelve `null` (caso real hoy), se conserva el contenido estático de F2 (ya auditado y trazable a `CLAUDE.md`/propuesta).
3. Si `fetchIntegrantesComite()` devuelve integrantes, se renderiza una lista (nombre, rol, biografía breve) ordenada por `orden_visualizacion`. Si devuelve `[]` (caso real hoy), se conserva la nota explícita de que la nómina se publicará cuando el CCL la cargue.

**Criterios de aceptación**:

- [x] `npx astro check` sin errores
- [x] E2E: la página sigue mostrando header/footer y contenido no vacío con Strapi inalcanzable (degradación verificada de extremo a extremo, sin mocks)
- [x] Sin dato de integrante fabricado — solo se renderiza si viene de Strapi

---

### SPEC-S04-F3-2: Biblioteca de Normativa dinámica

| Campo         | Valor                       |
| ------------- | --------------------------- |
| **Origen**    | P01 F3-02 (GAP G-02)        |
| **Archivos**  | `src/pages/normativa.astro` |
| **Prioridad** | P0                          |
| **Estado**    | `[x]` completado            |

**Cambios requeridos**:

1. `await fetchNormas()`. Si devuelve normas reales, se pasan directamente a `NormaTable` (tipado estructuralmente contra `Norma` desde F2 — cero cambios al componente, confirma la decisión arquitectónica ya auditada en `AUDIT_03`/senior-architect). Si devuelve `[]` (caso real hoy), se conserva el array estático de F2 (ya corregido en `AUDIT_03`, `estado_vigencia: 'Modificada'`).

**Criterios de aceptación**:

- [x] `npx astro check` sin errores
- [x] E2E: `NormaTable` sigue mostrando las normas de `CLAUDE.md` con Strapi inalcanzable
- [x] `NormaTable.astro` no requiere ningún cambio (verifica la decisión de F2)

---

### SPEC-S04-F3-5: Canales de ayuda dinámico + `AyudaBanner` conectado

| Campo         | Valor                                                                    |
| ------------- | ------------------------------------------------------------------------ |
| **Origen**    | P01 F3-05 (GAP G-05); `AUDIT_03` hallazgo diferido ("conectar en F3-05") |
| **Archivos**  | `src/pages/canales-de-ayuda.astro`, `src/pages/index.astro`              |
| **Prioridad** | P0 — es el hallazgo de seguridad más sensible del proyecto               |
| **Estado**    | `[x]` completado                                                         |

**Cambios requeridos**:

1. `canales-de-ayuda.astro` hace `await fetchCanalesAyuda()`. Si hay canales reales, se listan (nombre, tipo, teléfono/correo/horario si existen). Si `[]` (caso real hoy), se conserva `ComingSoon` sin ningún dato — **comportamiento idéntico al de F2**, ahora demostrado con el cliente real en vez de solo con ausencia de props.
2. `index.astro` busca un canal de tipo `'Atención psicológica'` en el mismo fetch y, si existe, pasa `telefono`/`correo` reales a `<AyudaBanner />`. Si no hay ninguno, `AyudaBanner` se sigue llamando sin props (fallback ya auditado en F2 — enlaza a `/canales-de-ayuda`).

**Criterios de aceptación**:

- [x] E2E: los 3 tests de "sin datos de contacto fabricados" (`layout.spec.ts`) siguen en verde — con Strapi inalcanzable, el HTML sigue sin `tel:`/`mailto:`/líneas cortas, igual que en F2
- [x] `astro check` sin errores
- [x] `AyudaBanner.astro` no requiere cambios de interfaz — solo cambia cómo se le llama

---

### SPEC-S04-F3-7: Página "Radicar una queja"

| Campo         | Valor                                                  |
| ------------- | ------------------------------------------------------ |
| **Origen**    | P01 F3-07 (sin GAP asociado, sin dependencia Strapi)   |
| **Archivos**  | `src/pages/radicar-una-queja.astro`, `src/lib/site.ts` |
| **Prioridad** | P0 — no bloqueada por Strapi, se entrega completa      |
| **Estado**    | `[x]` completado                                       |

**Cambios requeridos**:

1. Página nueva 100% estática: explica que el portal es informativo, que el trámite formal se hace por el sistema interno **SIRAL** (para funcionarios de la Rama Judicial autenticados — sin enlace público a un dominio aún no confirmado en producción, mismo criterio que el `Callout` de Home), que las quejas **no son anónimas** (cita textual trazable a `SIRAL_System/CLAUDE.md` § Restricciones: "Quejas NO anónimas — requieren sujeto identificable") y que el trámite es confidencial (Resolución 3461/2025).
2. Enlaza a `/canales-de-ayuda` para quien necesite apoyo antes de radicar.
3. Añadida a `navLinks` (`src/lib/site.ts`).

**Criterios de aceptación**:

- [x] `npx astro check` sin errores
- [x] E2E: la página responde 200 y aparece en la navegación principal
- [x] No cita un plazo en días/meses de la Resolución 3461/2025 (evita perpetuar la discrepancia cross-repo F2-J, no resuelta)

---

### SPEC-S04-F3-3: Material pedagógico

| Campo         | Valor                                                    |
| ------------- | -------------------------------------------------------- |
| **Origen**    | P01 F3-03 (GAP G-03)                                     |
| **Archivos**  | `src/pages/material-pedagogico.astro`, `src/lib/site.ts` |
| **Prioridad** | P1                                                       |
| **Estado**    | `[x]` completado                                         |

**Cambios requeridos**:

1. Página nueva: `await fetchRecursosPedagogicos()`. Si hay recursos, se listan (título, tipo, tema, descripción, enlace a archivo/video). Si `[]` (caso real hoy), `ComingSoon` con mensaje honesto.
2. Añadida a `navLinks`.

**Criterios de aceptación**:

- [x] `npx astro check` sin errores
- [x] E2E: la página responde 200; con Strapi inalcanzable muestra el placeholder, no una página rota

---

### SPEC-S04-F3-4: Noticias y jurisprudencia

| Campo         | Valor                                                                                  |
| ------------- | -------------------------------------------------------------------------------------- |
| **Origen**    | P01 F3-04 (GAP G-04)                                                                   |
| **Archivos**  | `src/pages/noticias/index.astro`, `src/pages/noticias/[slug].astro`, `src/lib/site.ts` |
| **Prioridad** | P1                                                                                     |
| **Estado**    | `[x]` completado                                                                       |

**Cambios requeridos**:

1. `noticias/index.astro`: `await fetchArticulos()`. Si hay artículos, lista (título, categoría, resumen, fecha) enlazando a `/noticias/{slug}`. Si `[]`, `ComingSoon`.
2. `noticias/[slug].astro`: `getStaticPaths()` genera una ruta por artículo real, pasando el `Articulo` completo como prop (evita un segundo fetch por artículo — mejor diseño que llamar a `fetchArticuloBySlug`, que por eso queda sin usar en `src/pages/`; permanece en `strapi.ts` como parte del cliente genérico ya auditado en F1). Hoy 0 rutas generadas — comportamiento correcto y esperado, no es un error. Renderiza `cuerpo` como párrafos de texto plano (ver regla de seguridad en el resumen del sprint — sin `set:html`).
3. Añadida a `navLinks`.

**Criterios de aceptación**:

- [x] `npx astro check` sin errores
- [x] `npm run build` no falla con 0 artículos (0 páginas de detalle generadas, comportamiento esperado)
- [x] Ningún `set:html` sobre contenido de Strapi

---

### SPEC-S04-F3-6: Capacitaciones y comunicados

| Campo         | Valor                                                             |
| ------------- | ----------------------------------------------------------------- |
| **Origen**    | P01 F3-06 (GAP G-13/14)                                           |
| **Archivos**  | `src/pages/capacitaciones-y-comunicados.astro`, `src/lib/site.ts` |
| **Prioridad** | P1                                                                |
| **Estado**    | `[x]` completado                                                  |

**Cambios requeridos**:

1. Página nueva con dos secciones: `await fetchCapacitaciones()` (título, fecha, modalidad, inscripción) y `await fetchComunicados()` (título, fecha, cuerpo como párrafos de texto plano). Si ambas colecciones están vacías, `ComingSoon`.
2. Añadida a `navLinks`.

**Criterios de aceptación**:

- [x] `npx astro check` sin errores
- [x] E2E: la página responde 200 con Strapi inalcanzable

---

## Hallazgos que alimentan la auditoría de gate F3 (Check)

| Hallazgo esperado                                                                      | Clasificación esperada  | Nota                                                                                         |
| -------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| Ninguna página de F3 muestra contenido real todavía (Strapi vacío/sin instancia)       | DIVERGENCIA JUSTIFICADA | Idéntico patrón operativo a F1 (`AUDIT_02`), ya auditado y aprobado — depende de F1-01 + CCL |
| `cuerpo` de `Articulo`/`Comunicado` se renderiza sin formato enriquecido (texto plano) | DIVERGENCIA JUSTIFICADA | Decisión de seguridad deliberada — evita XSS almacenado sin sanitizador ausente en el stack  |
| `navLinks` crece a 8 ítems sin menú hamburguesa                                        | DIVERGENCIA JUSTIFICADA | Se mantiene cero JS (regla crítica 2); `flex-wrap` ya soporta más ítems, verificado por E2E  |

# AUDIT 03 — Gate F2: Layout y Sistema de Diseño

**Fecha**: 2026-07-24
**Fase auditada**: F2 (Sprint S03) — `docs/sprints/S03_LAYOUT_UI/`
**Tipo**: Gate entre fases (Check del ciclo PDCA)
**Auditor**: 4 agentes paralelos (code-reviewer, security-scanner, senior-architect, refactor-planner) + análisis inline P8 (skill `design-patterns`) — todos los hallazgos re-verificados manualmente antes de incorporarse a este documento
**Commit auditado**: `de697b5` (Sprint S03 completo)

---

## 1. Checklist de gate

### Funcional

- [x] `BaseLayout` (shell puro) + `SEO.astro` + `PageLayout` (Header+main+Footer)
- [x] `Header`/`Footer` institucionales, `aria-current="page"` en enlace activo
- [x] 6 componentes UI reutilizables: Card, Callout, Accordion, NormaTable, AyudaBanner, ComingSoon
- [x] Home + 3 páginas nuevas (`/quienes-somos`, `/normativa`, `/canales-de-ayuda`) — cierra F0-A (0 enlaces de nav con 404)
- [x] `npm run build` genera 5 páginas + sitemap sin errores

### Seguridad

- [x] `/canales-de-ayuda` y Home (`AyudaBanner`) no fabrican ningún dato de contacto (teléfono/correo/línea corta)
- [x] **Hallazgo real corregido en este gate**: el test E2E que verificaba lo anterior tenía puntos ciegos (ver §4, hallazgo F2-A) — corregido con TDD antes de este veredicto
- [x] Contenido de `/quienes-somos` y `/normativa` trazable a `CLAUDE.md`/propuesta original (sin datos inventados)

### Calidad

- [x] `npx astro check` — 0 errores (30 archivos)
- [x] `npm run lint` — limpio (ESLint + Prettier)
- [x] `npm test` — 34/34 unit (Vitest)
- [x] `npx playwright test` — **15/15 E2E** (era 14 antes del Act de este gate; +1 al separar el test de seguridad en 3 tests page-scoped)

### Arquitectura

- [x] `PageLayout` compone `BaseLayout` + `Header` + `Footer` (Template/composición, sin duplicación)
- [x] `NormaTable` tipado estructuralmente contra `Norma` de `src/lib/types.ts` (mismo tipo que `strapi.ts` de F1) — listo para F3-02 sin cambiar el componente
- [x] Cero `<script>` en componentes nuevos (regla crítica 2 mantenida; `Accordion` usa `<details>/<summary>` nativo)

---

## 2. Conformidad SDD (protocolo 8 puntos, adaptado — ver `docs/validate/README.md`)

### SPEC-S03-F2-1: BaseLayout + SEO.astro + PageLayout

| Punto | Resultado         | Detalle                                                                                                                                                                                                                                                                                                                               |
| :---: | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  P1   | CONFORME          | `Props` `readonly` en los 3 archivos                                                                                                                                                                                                                                                                                                  |
|  P2   | CONFORME          | Sin lógica propensa a error; extracción de `SEO.astro` sin regresión de etiquetas                                                                                                                                                                                                                                                     |
|  P3   | CONFORME          | Build sigue verde tras la refactorización de `BaseLayout`                                                                                                                                                                                                                                                                             |
|  P4   | CONFORME          | F0-B resuelto: fuente `Inter` declarada-no-cargada eliminada; decisión documentada de no usar Google Fonts (privacidad institucional)                                                                                                                                                                                                 |
|  P5   | CONFORME          | `PageLayout` delega en `BaseLayout` + `Header` + `Footer` (composición, no duplicación)                                                                                                                                                                                                                                               |
|  P6   | CONFORME          | `astro check` 0 errores; E2E confirma header/footer presentes en las 4 páginas                                                                                                                                                                                                                                                        |
|  P7   | DIVERGENCIA MENOR | El skip-link (`href="#contenido"`) vive en `BaseLayout` pero el `id="contenido"` solo existe en `PageLayout`. Hoy inofensivo (todas las páginas usan `PageLayout`), pero es un acoplamiento oculto/invertido que rompería si F5 añade un layout alterno sin `PageLayout`. Hallazgo convergente: `senior-architect` + `code-reviewer`. |
|  P8   | CONFORME          | Composición tipo Template (shell fijo + slot) — apropiado, sin sobre-ingeniería                                                                                                                                                                                                                                                       |

**Veredicto**: 7/8 CONFORME, 1 DIVERGENCIA MENOR (diferida, ver §6)

---

### SPEC-S03-F2-2: Header + Footer institucionales

| Punto | Resultado | Detalle                                                                                                                                                  |
| :---: | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  P1   | CONFORME  | Sin estado mutable; datos desde `site`/`navLinks` (`src/lib/site.ts`)                                                                                    |
|  P2   | CONFORME  | N/A — sin rutas de error                                                                                                                                 |
|  P3   | CONFORME  | Extracción de `BaseLayout` (F0) sin romper `home.spec.ts`                                                                                                |
|  P4   | CONFORME  | Cero duplicación de datos de navegación                                                                                                                  |
|  P5   | CONFORME  | `isActive()` cohesivo, usa `Astro.url.pathname`                                                                                                          |
|  P6   | CONFORME  | E2E: `aria-current="page"` verificado en el enlace activo                                                                                                |
|  P7   | CONFORME  | Sin `<script>`; sin menú hamburguesa — decisión documentada y justificada (4 ítems no lo requieren, regla crítica 2 más estricta que `rugby-bello-site`) |
|  P8   | CONFORME  | Sin patrón forzado; suficiente con HTML+Tailwind                                                                                                         |

**Veredicto**: 8/8 CONFORME

---

### SPEC-S03-F2-3: Componentes UI (Card, Callout, Accordion, NormaTable, AyudaBanner, ComingSoon)

| Punto | Resultado         | Detalle                                                                                                                                                                                                                                                                                                                                             |
| :---: | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  P1   | CONFORME          | `readonly` en las 6 interfaces de `Props`                                                                                                                                                                                                                                                                                                           |
|  P2   | CONFORME          | `AyudaBanner` degrada con gracia (sin `telefono`/`correo` → fallback a enlace, nunca fabrica un contacto)                                                                                                                                                                                                                                           |
|  P3   | CONFORME          | Componentes nuevos, sin romper páginas existentes                                                                                                                                                                                                                                                                                                   |
|  P4   | CONFORME          | N/A — sin configuración externa                                                                                                                                                                                                                                                                                                                     |
|  P5   | CONFORME          | `NormaTable` tipado estructuralmente contra `Norma` (F1) — desacopla el componente de la fuente de datos (listo para F3-02)                                                                                                                                                                                                                         |
|  P6   | CONFORME          | +10 tests E2E nuevos; `astro check` 0 errores en los 6 componentes                                                                                                                                                                                                                                                                                  |
|  P7   | DIVERGENCIA MENOR | `Accordion` tiene una clase `class="group p-4"` sin uso (dead CSS, hallazgo `code-reviewer`). 5× duplicación de clases Tailwind del encabezado de página entre `index/quienes-somos/normativa/canales-de-ayuda` — `refactor-planner` recomienda extraer `PageHeader.astro`, diferido a F3 (más páginas para justificar la abstracción)              |
|  P8   | CONFORME          | **Corregido en este gate**: `SPEC_S03_F2_LAYOUT.md` afirmaba que `AyudaBanner` acepta una prop `mensaje` que no existe en el componente (hallazgo convergente `refactor-planner` + `code-reviewer`). Se corrigió el texto del SPEC — no se añadió una prop sin uso al componente (evita código muerto, coherente con las convenciones del proyecto) |

**Veredicto**: 7/8 CONFORME, 1 DIVERGENCIA MENOR (diferida, ver §6)

---

### SPEC-S03-F2-4: Home + 3 páginas nuevas (resuelve F0-A)

| Punto | Resultado         | Detalle                                                                                                                                                                                                                                                                                                                               |
| :---: | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  P1   | CONFORME          | `const normas: readonly NormaResumen[]` — inmutable                                                                                                                                                                                                                                                                                   |
|  P2   | CONFORME          | **DEFECTO encontrado y corregido en este gate** (ver §4, F2-A): el test E2E que debía garantizar "sin datos de contacto fabricados" tenía puntos ciegos reales — verificado con TDD (RED: inyección de `<a href="tel:1067">` pasaba el test viejo; GREEN: el test reescrito la detecta)                                               |
|  P3   | CONFORME          | Cierra F0-A: 0 enlaces de `navLinks` con 404 (antes 3)                                                                                                                                                                                                                                                                                |
|  P4   | CONFORME          | N/A                                                                                                                                                                                                                                                                                                                                   |
|  P5   | CONFORME          | Cada página delega en `PageLayout` + componentes UI de F2-3                                                                                                                                                                                                                                                                           |
|  P6   | CONFORME          | 15/15 E2E en verde tras el Act de este gate; `npm run build` OK (5 páginas)                                                                                                                                                                                                                                                           |
|  P7   | DIVERGENCIA MENOR | `404.astro` no declara `robots noindex` (indexable, hallazgo `security-scanner`, diferido). _(Corregidos en este gate, ya no cuentan como divergencia: `estado_vigencia: 'Derogada'` sin trazabilidad a `CLAUDE.md` → cambiado a `'Modificada'`; texto de las `Card` de Home que sobrevendía contenido aún no publicado → suavizado)_ |
|  P8   | CONFORME          | `ComingSoon` como patrón de placeholder honesto; decisión de seguridad "no fabricar contacto" aplicada consistentemente                                                                                                                                                                                                               |

**Veredicto**: 7/8 CONFORME, 1 DIVERGENCIA MENOR (diferida, ver §6)

**Tasa de aprobación SDD**: (7+8+7+7) / 32 = **29/32 = 90.6 %** (≥ 85 % ✓) · 0 DEFECTOS sin resolver

---

## 3. Reportes de revisión (4 agentes paralelos + análisis inline)

### code-reviewer

- `Accordion.astro`: clase `group` sin ningún selector `group-*` que la use — dead CSS, no bug funcional.
- `AyudaBanner.astro`: `Props` real solo tiene `telefono?`/`correo?`; el SPEC afirmaba una tercera prop `mensaje` inexistente — drift de documentación, no de código.
- `layout.spec.ts` (versión pre-gate): `getByText(/SIRAL/)` era un locator ambiguo (ya corregido durante F2, ver `00_RESUMEN_SPRINT.md` punto 7 — no es hallazgo nuevo).
- Coincide con `security-scanner` en `estado_vigencia: 'Derogada'` (ver abajo) y con `senior-architect` en el acoplamiento del skip-link.

### security-scanner

- **Hallazgo principal (F2-A, DEFECTO)**: el test de seguridad de `layout.spec.ts` usaba `innerText()` (ciego a atributos `href`) y una regex de 7+ dígitos consecutivos que no cubre las líneas cortas colombianas reales (106/123/141/155/192) ni formatos con puntos. Solo cubría `/canales-de-ayuda`, no Home (donde renderiza `AyudaBanner`). **Verificado empíricamente por mí, no solo aceptado**: inyecté `<a href="tel:1067">Linea 106</a>` en `canales-de-ayuda.astro` y confirmé que el test viejo pasaba igual (falso negativo real). Corregido — ver §4.
- `estado_vigencia: 'Derogada'` en `normativa.astro` para Res. 652/2012 y 1356/2012 no es trazable al texto literal de `CLAUDE.md` (que dice "referencia histórica", no "derogada") — riesgo de precisión legal en un portal institucional judicial. Corregido a `'Modificada'`.
- `quienes-somos.astro`: la frase sobre el alcance de la Resolución 3461/2025 ("redefinió... con énfasis en...") va ligeramente más allá de la redacción literal de `CLAUDE.md`, aunque sí es consistente con `docs/cliente/PROPUESTA_CCL_PLATAFORMA.md`. Clasificado DIVERGENCIA JUSTIFICADA (fuente real, solo no es la tabla de `CLAUDE.md`) — diferido, no bloqueante.
- Sin XSS/inyección: todo el contenido de F2 es estático, sin `set:html` ni datos de usuario.

### senior-architect

- `BaseLayout`/`PageLayout`: el skip-link con `id="contenido"` vive fuera del componente que declara el `href`, acoplamiento oculto (ver P7 de F2-1). Recomienda declarar el `id` en `BaseLayout` o documentar el contrato explícitamente antes de F5.
- `NormaTable` tipado estructuralmente contra `Norma`: decisión arquitectónica correcta — permite a F3-02 pasar datos reales de Strapi sin tocar el componente. Sin sobre-ingeniería (el `Pick<>` es mínimo, no expone campos no usados).
- Composición `BaseLayout` → `PageLayout` → páginas: jerarquía de 2 niveles, apropiada para el tamaño actual del sitio; no recomienda un tercer nivel todavía.

### refactor-planner (skill `refactoring`)

- Duplicate Code: clases Tailwind del `<h1>` de encabezado (`text-3xl font-bold text-brand-primary sm:text-4xl`) repetidas literalmente en 5 páginas. No es code smell bloqueante todavía (solo 5 páginas), pero recomienda extraer `PageHeader.astro` en F3 cuando el número de páginas crezca — evita abstracción prematura hoy.
- `AyudaBanner`/SPEC: mismo hallazgo que `code-reviewer` sobre la prop `mensaje` inexistente (convergente).
- Sin otros smells (Feature Envy, God Component) en los componentes UI de F2-3.

### Análisis P8 — patrones (skill `design-patterns`, inline)

- **Template Method (implícito, apropiado)**: `BaseLayout` fija el "esqueleto" (html/head/SEO/body) y `PageLayout` rellena las variantes (Header/main/Footer) vía composición de slots — equivalente funcional a Template Method sin herencia de clases, idiomático en Astro.
- **Facade (implícito, apropiado)**: `PageLayout` es la fachada que usan las páginas; ocultan la complejidad de ensamblar `BaseLayout`+`Header`+`Footer`.
- **Strategy no aplica**: no hay familias de algoritmos intercambiables en F2 — los componentes UI son presentacionales, no lógica de negocio. Correctamente no forzado.
- **Sin sobre-ingeniería detectada**: no hay Factory/Abstract Factory/Observer forzados donde bastaba composición simple. El único patrón "faltante" candidato (extraer `PageHeader.astro`) está correctamente diferido — 5 repeticiones no justifican la abstracción todavía (regla de 3+ con criterio, no automatismo).

---

## 4. Hallazgos de esta auditoría

| ID   | Hallazgo                                                                                                                                                          | Clasificación            | Acción                                                                                                                                                                                                                       |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F2-A | Test E2E de seguridad con puntos ciegos reales: ciego a `href="tel:"/"mailto:"`, no cubría líneas cortas colombianas (106/123/141/155/192), no probaba Home       | **DEFECTO**              | **Corregido en este gate** (TDD, ver §5) — `layout.spec.ts` reescrito, verificado RED→GREEN con inyección real de dato fabricado                                                                                             |
| F2-B | `estado_vigencia: 'Derogada'` sin trazabilidad literal a `CLAUDE.md` para Res. 652/2012 y 1356/2012                                                               | DIVERGENCIA MENOR        | **Corregido en este gate** — cambiado a `'Modificada'`                                                                                                                                                                       |
| F2-C | `SPEC_S03_F2_LAYOUT.md` afirmaba una prop `mensaje` en `AyudaBanner` que no existe en el componente                                                               | DIVERGENCIA MENOR (doc)  | **Corregido en este gate** — texto del SPEC ajustado a la interfaz real                                                                                                                                                      |
| F2-D | `Card` de Home sobrevendía contenido aún no publicado ("Canales de atención... disponibles", "integrantes")                                                       | DIVERGENCIA MENOR        | **Corregido en este gate** — copy suavizado para reflejar el estado real (stub honesto)                                                                                                                                      |
| F2-E | Skip-link (`href="#contenido"`) en `BaseLayout` acoplado a un `id` que solo existe en `PageLayout`                                                                | DIVERGENCIA MENOR        | Diferido — fijar antes de F5 (riesgo solo si aparece un layout alterno sin `PageLayout`)                                                                                                                                     |
| F2-F | `Accordion.astro` tiene una clase `group` sin uso                                                                                                                 | DIVERGENCIA MENOR        | Diferido — cosmético, sin impacto funcional                                                                                                                                                                                  |
| F2-G | 5× duplicación de clases Tailwind del `<h1>` de encabezado entre páginas                                                                                          | DIVERGENCIA MENOR        | Diferido a F3 — extraer `PageHeader.astro` cuando haya más páginas (evita abstracción prematura)                                                                                                                             |
| F2-H | `404.astro` no declara `robots noindex` — página indexable                                                                                                        | DIVERGENCIA MENOR        | Diferido — no bloqueante para F2, corregible en cualquier momento junto con SEO general                                                                                                                                      |
| F2-I | `quienes-somos.astro` — frase sobre alcance de Resolución 3461/2025 va algo más allá de la redacción literal de `CLAUDE.md` (sí trazable a la propuesta original) | DIVERGENCIA JUSTIFICADA  | Ninguna — fuente real existe (`docs/cliente/PROPUESTA_CCL_PLATAFORMA.md`), solo no es cita literal de la tabla de `CLAUDE.md`                                                                                                |
| F2-J | Discrepancia entre "≤ 65 días" (`CLAUDE.md` de justicia-sana) y "6 meses" (`CLAUDE.md` de SIRAL_System) para el plazo de la Resolución 3461/2025                  | NO RESUELTO (cross-repo) | **No se resuelve por adivinanza** — requiere consultar el texto oficial de la norma. Se deja registrado para que el propietario lo verifique; ninguna página de F2 cita un plazo en días/meses, así que no bloquea este gate |

Ningún hallazgo queda como **DEFECTO sin resolver**. F2-A era el único DEFECTO real y se corrigió dentro de este mismo gate.

---

## 5. Correcciones aplicadas (Act)

| Hallazgo | Corrección                                                                                                                                                                                                                   | Archivo(s)                                         | Verificación                                                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F2-A     | Reescrito el bloque de seguridad de `layout.spec.ts`: usa `page.content()` (HTML crudo) en vez de `innerText()`, agrega chequeo de `href="tel:"`, líneas cortas colombianas y formatos con puntos; extiende cobertura a Home | `tests/e2e/layout.spec.ts`                         | **TDD real**: RED confirmado (inyección `tel:1067` pasaba el test viejo) → GREEN confirmado (el test nuevo la detecta, luego se revirtió la inyección) → suite completa 15/15 en verde |
| F2-B     | `estado_vigencia` de Res. 652/2012 y 1356/2012 cambiado de `'Derogada'` a `'Modificada'`                                                                                                                                     | `src/pages/normativa.astro`                        | `npx astro check` 0 errores; E2E `NormaTable` sigue en verde                                                                                                                           |
| F2-C     | Corregido el texto del SPEC: solo `telefono`/`correo` opcionales, sin mención de `mensaje`                                                                                                                                   | `docs/sprints/S03_LAYOUT_UI/SPEC_S03_F2_LAYOUT.md` | Revisión manual contra `AyudaBanner.astro` (interfaz real)                                                                                                                             |
| F2-D     | Copy de las 3 `Card` de Home suavizado para no sobrevender contenido en preparación                                                                                                                                          | `src/pages/index.astro`                            | Revisión manual + E2E "las 3 tarjetas siguen presentes" sigue en verde                                                                                                                 |

Quality gate completo re-ejecutado tras las correcciones: `npm run lint` ✓ · `npx astro check` (0 errores, 30 archivos) ✓ · `npm test` (34/34) ✓ · `npm run build` (5 páginas) ✓ · `npx playwright test` (15/15) ✓.

---

## 6. Hallazgos diferidos (alimentan el backlog / próximo Planning)

- **F2-E** (skip-link/`id="contenido"`) → resolver antes de F5 (cuando exista riesgo real de un layout alterno)
- **F2-F** (clase `group` muerta en `Accordion`) → limpieza cosmética, cualquier sprint futuro que toque el componente
- **F2-G** (duplicación de encabezado de página) → extraer `PageHeader.astro` en F3 cuando el número de páginas lo justifique
- **F2-H** (404 sin `robots noindex`) → agrupar con mejoras SEO generales (también pendiente de F1-B/AUDIT_02: `site.url` vs `Astro.site`, OG image/locale)
- **F2-I** (redacción de `quienes-somos`) → sin acción; queda registrado como fuente = propuesta original, no `CLAUDE.md` literal
- **F2-J** (65 días vs 6 meses, discrepancia entre `CLAUDE.md` de justicia-sana y de SIRAL_System) → **requiere verificación humana contra el texto oficial de la Resolución 3461/2025**; no se resuelve por inferencia
- `AyudaBanner` no tipado aún contra `CanalAyuda` de `lib/types.ts` → conectar en F3-05 (integración real de canales de ayuda vía Strapi)
- `Card.astro` sin validación de esquema de `href` → diferido, hoy todos los `href` son estáticos y seguros

---

## Veredicto

**GATE F2: APROBADO** ✅

- Tasa de aprobación SDD: **90.6 %** (29/32 puntos CONFORME) — ≥ 85 % ✓
- 0 DEFECTOS sin resolver (el único encontrado, F2-A, se corrigió con TDD dentro de este mismo gate)
- 7 divergencias menores diferidas (backlog, ninguna bloqueante) + 1 divergencia justificada + 1 discrepancia cross-repo registrada para verificación humana (F2-J)
- Autoridad de aprobación: automática (Gates F1-F4 no requieren revisión humana con tasa ≥85 % y 0 defectos sin resolver, por regla de este protocolo)

Habilitado para continuar a **F3 (Sprint S04 — Contenido Núcleo vía Strapi)**, a la orden del propietario del proyecto.

---

**Versión**: 1.0
**Fecha**: 2026-07-24

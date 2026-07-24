# SDD SPEC — Sprint 03

**Fecha**: 2026-07-24
**Planning de referencia**: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (Fase F2), `docs/validate/AUDIT_01_2026-07-24_GATE_F0_SCAFFOLDING.md` (hallazgos F0-A, F0-B)
**Metodología**: SDD Framework v2 (CDAID v2) — fase Do del ciclo PDCA

---

## Resumen

| Campo                   | Valor                           |
| ----------------------- | ------------------------------- |
| Sprint                  | 03                              |
| Total SPECs             | 4 (F2-01 a F2-04)               |
| Fase                    | F2 — Layout y Sistema de Diseño |
| Esfuerzo estimado (P01) | 8–10 h                          |

**Decisión de alcance (documentada para no confundir a la auditoría)**: P01 asigna F2-04 solo a "Home". Este sprint **amplía F2-04** para crear 3 páginas nuevas (`/quienes-somos`, `/normativa`, `/canales-de-ayuda`) que resuelven el hallazgo **F0-A** de AUDIT_01 (enlaces del walking skeleton que daban 404). Esto **no duplica F3**: el contenido real de esas páginas vendrá de Strapi en F3-01/F3-02/F3-05; aquí solo se elimina el 404 con contenido mínimo, honesto y verificable — sin inventar datos sensibles.

**Regla de seguridad aplicada en este sprint**: ningún número de teléfono, correo o dato de contacto de ayuda psicológica se fabrica. `/canales-de-ayuda` queda como página "en preparación" explícita hasta que el CCL cargue esos datos reales vía Strapi (F3-05) — inventar un número de ayuda sería activamente dañino para alguien que lo necesite de verdad.

---

## Fase F2 — Layout y Sistema de Diseño

### SPEC-S03-F2-1: BaseLayout + SEO.astro + PageLayout

| Campo         | Valor                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Origen**    | P01 F2-01; AUDIT_01 hallazgo F0-B (fuente Inter declarada sin cargar)                                               |
| **Archivos**  | `src/components/SEO.astro`, `src/layouts/BaseLayout.astro`, `src/layouts/PageLayout.astro`, `src/styles/global.css` |
| **Prioridad** | P0 — todas las páginas nuevas dependen de esto                                                                      |
| **Estado**    | `[x]` completado                                                                                                    |

**Cambios requeridos**:

1. Extraer las etiquetas meta/OG/Twitter de `BaseLayout.astro` a un componente `SEO.astro` reutilizable (patrón `rugby-bello-site/src/components/SEO.astro`).
2. `BaseLayout.astro` queda como shell puro (html/head/SEO/body + `<slot />`), sin header/footer — igual que la referencia.
3. `PageLayout.astro` nuevo: envuelve `BaseLayout` y añade `Header` + `<main>` + `Footer`. Es lo que usan las páginas reales.
4. **Resolución de F0-B**: quitar `--font-sans: 'Inter', ...` de `global.css` (nunca se cargaba). Decisión: **no** añadir Google Fonts — evita peticiones a terceros desde un sitio institucional judicial (privacidad) y mantiene Lighthouse alto. Queda el stack `ui-sans-serif, system-ui` de Tailwind por defecto, que ya cumple AA (verificado en F0).

**Criterios de aceptación**:

- [x] `npx astro check` sin errores (0 errores, 30 archivos)
- [x] `SEO.astro` genera las mismas etiquetas que tenía `BaseLayout` (sin regresión de SEO)
- [x] `global.css` no declara una fuente que no se carga

**Verificado**: 2026-07-24 | **Commit**: `de697b5`

---

### SPEC-S03-F2-2: Header + Footer institucionales

| Campo         | Valor                                                        |
| ------------- | ------------------------------------------------------------ |
| **Origen**    | P01 F2-02                                                    |
| **Archivos**  | `src/components/Header.astro`, `src/components/Footer.astro` |
| **Prioridad** | P0                                                           |
| **Estado**    | `[x]` completado                                             |

**Cambios requeridos**:

1. `Header.astro`: extraído de `BaseLayout` (F0). Añade `aria-current="page"` en el enlace activo (mejora real de accesibilidad, ausente en F0). Usa `site`/`navLinks` de `src/lib/site.ts` — cero duplicación de datos.
2. **Decisión de diseño — sin menú hamburguesa ni JavaScript**: a diferencia de rugby-bello (nav con grupos anidados + `<script>` para el menú móvil), justicia-sana tiene solo 4 enlaces de navegación. La regla crítica 2 de este proyecto ("zero JS por defecto") es más estricta que la de rugby-bello. Con 4 ítems, un `nav` con `flex-wrap` (ya probado en F0) es suficiente en móvil sin necesidad de menú colapsable ni JS — mantiene el sitio en cero JavaScript hasta F5.
3. `Footer.astro`: extraído de `BaseLayout`, mismo texto institucional del walking skeleton (sin inventar datos de contacto nuevos).

**Criterios de aceptación**:

- [x] E2E: el enlace de la página actual tiene `aria-current="page"` (`layout.spec.ts`)
- [x] E2E: la navegación es completamente operable por teclado (heredado de F0, `home.spec.ts` sigue en verde)
- [x] Cero `<script>` en `Header`/`Footer` (verificado por lectura — ninguno de los dos archivos tiene bloque `<script>`)

**Verificado**: 2026-07-24 | **Commit**: `de697b5`

---

### SPEC-S03-F2-3: Componentes UI (Card, Callout, Accordion, NormaTable, AyudaBanner)

| Campo         | Valor                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Origen**    | P01 F2-03                                                                                                                       |
| **Archivos**  | `src/components/ui/Card.astro`, `Callout.astro`, `Accordion.astro`, `NormaTable.astro`, `AyudaBanner.astro`, `ComingSoon.astro` |
| **Prioridad** | P1                                                                                                                              |
| **Estado**    | `[x]` completado                                                                                                                |

**Cambios requeridos**:

1. `Card.astro`: título, descripción, `href`, ícono opcional. Reemplaza los `<a>` inline de accesos rápidos en `index.astro` (F0).
2. `Callout.astro`: caja de aviso (`variant`: info/legal/warning), HTML-first, sin JS.
3. `Accordion.astro`: usa `<details>/<summary>` nativos — accesible y con teclado sin una sola línea de JavaScript.
4. `NormaTable.astro`: **tipado contra `Norma` de `src/lib/types.ts`** (el mismo tipo que ya consume `src/lib/strapi.ts` en F1) — queda listo para que F3-02 le pase datos reales de Strapi sin cambiar el componente, solo la fuente de datos.
5. `AyudaBanner.astro`: banner de ayuda psicológica con `telefono`/`correo`/`mensaje` **opcionales** — si no se pasan (caso de hoy, sin datos reales), muestra un mensaje genérico que enlaza a `/canales-de-ayuda` en vez de fabricar un contacto.
6. `ComingSoon.astro`: placeholder honesto ("Sección en preparación") para contenido que aún no gestiona el CCL vía Strapi.

**Criterios de aceptación**:

- [x] `npx astro check` sin errores en los 6 componentes (0 errores, 30 archivos)
- [x] `AyudaBanner` sin `telefono`/`correo` no renderiza ningún dato de contacto inventado (verificado por E2E — `layout.spec.ts`, sin patrones de teléfono/correo en `/canales-de-ayuda`)
- [x] `Accordion` funciona sin JavaScript (verificado por E2E interactuando solo con `<details>` nativo — click en `<summary>`, propiedad `open` cambia)

**Verificado**: 2026-07-24 | **Commit**: `de697b5`

---

### SPEC-S03-F2-4: Home + 3 páginas nuevas (resuelve F0-A)

| Campo         | Valor                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Origen**    | P01 F2-04; AUDIT_01 hallazgo F0-A                                                                                                                |
| **Archivos**  | `src/pages/index.astro`, `src/pages/quienes-somos.astro`, `src/pages/normativa.astro`, `src/pages/canales-de-ayuda.astro`, `src/pages/404.astro` |
| **Prioridad** | P0 — cierra el hallazgo F0-A del gate anterior                                                                                                   |
| **Estado**    | `[x]` completado                                                                                                                                 |

**Cambios requeridos**:

1. `index.astro`: migra a `PageLayout`; usa `Card` para los 3 accesos rápidos; añade `Callout` (aviso real: "este portal no tramita quejas — usa SIRAL") y `Accordion` con 2-3 preguntas frecuentes, contenido tomado literalmente de `CLAUDE.md`/`docs/cliente/PROPUESTA_CCL_PLATAFORMA.md` (sin inventar).
2. `quienes-somos.astro`: contenido real (misión, marco legal) tomado de `CLAUDE.md`/la propuesta — **sí** se puede escribir contenido real aquí porque no involucra datos verificables inventables (a diferencia de contactos). Nota explícita: "la nómina de integrantes se publicará aquí cuando el CCL cargue el content type `integrante-comite` en Strapi (F3-01)".
3. `normativa.astro`: usa `NormaTable` con las normas **ya citadas en la tabla "Contexto Legal" de `CLAUDE.md`** (Ley 1010/2006, Resolución 3461/2025, Ley 1581/2012, Ley 2213/2022, Res. 652/2012, Res. 1356/2012) — mismo texto descriptivo que ya está en el repo, sin redactar nuevos resúmenes "en lenguaje claro" a nombre del CCL (eso sí le corresponde a F3-02 vía Strapi).
4. `canales-de-ayuda.astro`: usa `ComingSoon` — **sin ningún dato de contacto**. Explica qué encontrará aquí el usuario cuando el CCL publique los canales reales (F3-05).
5. `404.astro`: migra a `PageLayout` (antes usaba `BaseLayout` directo, sin header/footer).

**Criterios de aceptación**:

- [x] E2E: los 4 enlaces de `navLinks` responden 200 (cierra F0-A — cero 404 en la navegación principal)
- [x] E2E: `/canales-de-ayuda` no contiene ningún patrón de teléfono/correo en el HTML
- [x] `npm run build` genera las 5 páginas (`/`, `/quienes-somos`, `/normativa`, `/canales-de-ayuda`, `/404`) + sitemap sin errores
- [x] Todo el texto nuevo es trazable a una fuente ya existente en el repo (`CLAUDE.md` tabla "Contexto Legal", propuesta original) — sin datos inventados

**Verificado**: 2026-07-24 | **Commit**: `de697b5`

---

## Hallazgos que alimentan la auditoría de gate F2 (Check)

| Hallazgo esperado                                                            | Clasificación esperada  | Nota                                                                                      |
| ---------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------- |
| Contenido de `/quienes-somos` y `/normativa` es estático, no viene de Strapi | DIVERGENCIA JUSTIFICADA | F3-01/F3-02 lo migran a Strapi; aquí se resuelve el 404 sin duplicar ese trabajo          |
| `/canales-de-ayuda` sin contenido real                                       | DIVERGENCIA JUSTIFICADA | Decisión de seguridad deliberada — no fabricar contactos de ayuda psicológica             |
| Sin menú hamburguesa/JS en el header                                         | DIVERGENCIA JUSTIFICADA | Solo 4 ítems de nav; regla crítica 2 (zero JS) más estricta que la referencia rugby-bello |

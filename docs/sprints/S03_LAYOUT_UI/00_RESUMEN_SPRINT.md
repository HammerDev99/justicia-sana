# Sprint 03 — Layout y Sistema de Diseño

**Fecha inicio**: 2026-07-24
**Objetivo**: Sistema de layout (BaseLayout/PageLayout/SEO), Header/Footer accesibles, 6 componentes UI reutilizables, y resolución del hallazgo F0-A (enlaces de navegación que daban 404) con contenido honesto y trazable — sin fabricar datos sensibles de contacto.
**Planning**: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (Fase F2)
**SPEC de referencia**: `docs/sprints/S03_LAYOUT_UI/SPEC_S03_F2_LAYOUT.md`
**Metodología**: SDD Framework v2 (CDAID v2) — fase Do

---

## Estado General

```
Sprint 03: [########################] 100% (4/4 SPECs completados)
```

| Fase      | Total SPECs | Completados | Pendientes |
| --------- | :---------: | :---------: | :--------: |
| F2        |      4      |      4      |     0      |
| **Total** |    **4**    |    **4**    |   **0**    |

---

## Registro de Progreso

| Fecha      | SPEC     | Descripción                                                                                 | Commit    | Tests | Notas                                                                                    |
| ---------- | -------- | ------------------------------------------------------------------------------------------- | --------- | :---: | ---------------------------------------------------------------------------------------- |
| 2026-07-24 | S03-F2-1 | `SEO.astro` + `BaseLayout` shell puro + `PageLayout` + fix F0-B                             | `de697b5` |   —   | Fuente Inter eliminada (nunca se cargaba); sin Google Fonts por privacidad institucional |
| 2026-07-24 | S03-F2-2 | `Header.astro` + `Footer.astro` extraídos, `aria-current`, sin JS                           | `de697b5` |   —   | Sin menú hamburguesa — 4 ítems no lo justifican, mantiene cero JS                        |
| 2026-07-24 | S03-F2-3 | 6 componentes UI: Card, Callout, Accordion, NormaTable, AyudaBanner, ComingSoon             | `de697b5` |  +10  | `NormaTable` tipado contra `Norma` de `src/lib/types.ts` — listo para F3-02              |
| 2026-07-24 | S03-F2-4 | Home + 3 páginas nuevas (`/quienes-somos`, `/normativa`, `/canales-de-ayuda`) — cierra F0-A | `de697b5` |   —   | `/canales-de-ayuda` sin ningún contacto fabricado — decisión de seguridad deliberada     |

---

## Métricas de Verificación

| Métrica                   | Pre-Sprint |              Post-Sprint              | Delta |
| ------------------------- | :--------: | :-----------------------------------: | :---: |
| Tests unitarios (Vitest)  |     34     |                  34                   |   —   |
| Tests E2E (Playwright)    |     4      |                  14                   |  +10  |
| Páginas funcionales       |     2      |                   5                   |  +3   |
| Componentes reutilizables |     0      | 6 (UI) + 3 (layout/header/footer/SEO) |  +9   |
| `astro check`             |     —      |        0 errores (30 archivos)        |   ✓   |
| `npm run lint`            |     —      |                limpio                 |   ✓   |
| `npm run build`           |     —      |            OK (5 páginas)             |   ✓   |
| Enlaces de nav con 404    |     3      |                   0                   |  −3   |

---

## Decisiones e Incidentes

1. **Alcance ampliado de F2-04, documentado en el SPEC**: P01 solo pedía "Home" en F2-04. Se amplió para crear `/quienes-somos`, `/normativa` y `/canales-de-ayuda`, resolviendo el hallazgo F0-A de `AUDIT_01` (enlaces de navegación que daban 404 en producción). No duplica el trabajo de F3 (contenido real vía Strapi): el contenido de estas páginas es estático y explícitamente reemplazable, con nota en cada página sobre qué content type de Strapi lo sustituirá.

2. **Regla de seguridad aplicada — sin fabricar contactos de ayuda psicológica**: `/canales-de-ayuda` no muestra ningún teléfono, correo ni dato de contacto. Inventar un número de ayuda psicológica sería activamente dañino para alguien que lo necesite de verdad. La página queda como "en preparación" explícita hasta que el CCL cargue los canales reales en Strapi (F3-05). Verificado por E2E con una aserción negativa (regex de teléfono/correo) sobre el HTML renderizado, no solo por revisión visual.

3. **Contenido de `/quienes-somos` y `/normativa` — trazabilidad estricta a fuentes existentes**: todo el texto nuevo proviene literalmente de `CLAUDE.md` (tabla "Contexto Legal") o de `docs/cliente/PROPUESTA_CCL_PLATAFORMA.md` — no se redactaron "resúmenes en lenguaje claro" nuevos a nombre del CCL (eso es competencia de F3-02 vía Strapi, con contenido que el propio Comité aprueba).

4. **F0-B resuelto quitando la fuente, no cargándola**: la fuente `Inter` estaba declarada en `global.css` pero nunca se cargaba (hallazgo de `AUDIT_01`). Se decidió **no** añadir Google Fonts (peticiones a terceros desde un sitio judicial institucional, coste de Lighthouse) — se formaliza el uso del stack `system-ui` que ya cumplía WCAG AA desde F0.

5. **Sin menú hamburguesa/JavaScript en el Header**: a diferencia del patrón de referencia (`rugby-bello-site`, con nav anidada + `<script>`), justicia-sana tiene solo 4 enlaces. La regla crítica 2 de este proyecto ("zero JS por defecto") es más estricta — un `nav` con `flex-wrap` (ya validado en F0 con Playwright) es suficiente sin JS. Se mantiene el sitio en cero JavaScript hasta F5.

6. **`NormaTable` diseñado para F3, no solo para el stub actual**: el componente está tipado contra `Pick<Norma, 'titulo' | 'resumen_lenguaje_claro' | 'estado_vigencia'>` — el mismo tipo `Norma` que ya consume `src/lib/strapi.ts` (F1). Cuando F3-02 conecte `fetchNormas()` a Strapi, el componente no cambia, solo la fuente de datos en `normativa.astro`.

7. **Corrección de un test propio durante la verificación**: el primer intento de `layout.spec.ts` tenía un locator ambiguo (`getByText(/SIRAL/)` resolvía a 2 elementos, ya que "SIRAL" aparece tanto en el `Callout` como en el FAQ). Corregido acotando el locator al `role="note"` del `Callout` — no era un defecto de la implementación, sino del test.

---

## Próximos Pasos

1. ~~Confirmar autoría/push del commit de este sprint.~~ Hecho (`de697b5`).
2. ~~Auditoría de gate F2~~ — **APROBADO** (SDD 90.6 %, 0 defectos sin resolver). Ver `docs/validate/AUDIT_03_2026-07-24_GATE_F2_LAYOUT.md`.
3. Sprint S04 (Fase F3 — Contenido Núcleo servido desde Strapi), que reemplazará el contenido estático de `/quienes-somos`, `/normativa` y poblará `/canales-de-ayuda` con datos reales una vez el CCL los cargue (depende de P02 Fases A/B/C completas en el VPS) — **pendiente de orden explícita del propietario del proyecto**.

---

**Versión**: 1.0
**Fecha**: 2026-07-24

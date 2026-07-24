# Sprint 04 — Contenido Núcleo (Fase F3)

**Fecha inicio**: 2026-07-24
**Objetivo**: Cablear las 7 secciones de contenido núcleo (F3-01..07) contra el cliente Strapi real construido en F1, con degradación agraciada extremo a extremo mientras no exista instancia productiva ni insumos del CCL; entregar completa la única pieza sin dependencia de Strapi (F3-07, "Radicar una queja"); resolver el hallazgo diferido F2-G extrayendo `PageHeader.astro`.
**Planning**: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (Fase F3)
**SPEC de referencia**: `docs/sprints/S04_CONTENIDO_NUCLEO/SPEC_S04_F3_CONTENIDO.md`
**Metodología**: SDD Framework v2 (CDAID v2) — fase Do

---

## Estado General

```
Sprint 04: [########################] 100% (7/7 SPECs completados)
```

| Fase      | Total SPECs | Completados | Pendientes |
| --------- | :---------: | :---------: | :--------: |
| F3        |      7      |      7      |     0      |
| **Total** |    **7**    |    **7**    |   **0**    |

---

## Registro de Progreso

| Fecha      | SPEC     | Descripción                                                                                                | Tests | Notas                                                                                     |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------------- | :---: | ----------------------------------------------------------------------------------------- |
| 2026-07-24 | S04-F3-1 | `quienes-somos.astro` cableado a `fetchQuienesSomos()`/`fetchIntegrantesComite()`, fallback estático de F2 |  +1   | 0 datos reales hoy (Strapi 403) — fallback engancha correctamente, verificado por E2E     |
| 2026-07-24 | S04-F3-2 | `normativa.astro` cableado a `fetchNormas()`, fallback estático de F2                                      |   —   | `NormaTable.astro` no requiere ningún cambio — confirma la decisión arquitectónica de F2  |
| 2026-07-24 | S04-F3-5 | `canales-de-ayuda.astro` + `index.astro` cableados a `fetchCanalesAyuda()`                                 |   —   | Los 3 tests de seguridad "sin datos fabricados" de F2 siguen en verde sin cambios         |
| 2026-07-24 | S04-F3-7 | `/radicar-una-queja` nueva, 100% estática                                                                  |  +4   | TDD real: RED/GREEN verificado inyectando "65 días" para probar el test anti-F2-J         |
| 2026-07-24 | S04-F3-3 | `/material-pedagogico` nueva, cableada a `fetchRecursosPedagogicos()`                                      |  +2   | Placeholder honesto mientras Strapi esté vacío                                            |
| 2026-07-24 | S04-F3-4 | `/noticias` + `/noticias/[slug]` nuevas, cableadas a `fetchArticulos()`                                    |  +1   | `cuerpo` (richtext) se renderiza como texto plano — sin `set:html`, mitiga XSS almacenado |
| 2026-07-24 | S04-F3-6 | `/capacitaciones-y-comunicados` nueva, cableada a ambas colecciones                                        |   —   | Mismo criterio de seguridad para `Comunicado.cuerpo`                                      |
| 2026-07-24 | —        | Extracción de `PageHeader.astro`, `navLinks` ampliado a 8 ítems                                            |   —   | Resuelve F2-G; adoptado por las 9 páginas del sitio                                       |

---

## Métricas de Verificación

| Métrica                   |       Pre-Sprint        |                       Post-Sprint                       |       Delta       |
| ------------------------- | :---------------------: | :-----------------------------------------------------: | :---------------: |
| Tests unitarios (Vitest)  |           34            |                           34                            |         —         |
| Tests E2E (Playwright)    |           15            |                           23                            |        +8         |
| Páginas funcionales       |            5            | 9 (+ ruta dinámica `/noticias/[slug]`, 0 generadas hoy) |        +4         |
| Componentes reutilizables |            9            |                           10                            | +1 (`PageHeader`) |
| `astro check`             | 0 errores (30 archivos) |                 0 errores (37 archivos)                 |         ✓         |
| `npm run lint`            |         limpio          |                         limpio                          |         ✓         |
| `npm run build`           |     OK (5 páginas)      |                     OK (9 páginas)                      |         ✓         |
| Enlaces de `navLinks`     |            4            |                            8                            |        +4         |

---

## Decisiones e Incidentes

1. **Alcance operativo idéntico al de F1 (`AUDIT_02`)**: sin instancia real de Strapi en producción (F1-01/03/05 pendientes de acción humana) ni insumos del CCL, ninguna página de F3 puede mostrar contenido real todavía. Se documentó explícitamente en el SPEC (no se oculta) y se ejecutó el cableado completo contra el cliente real, verificado con degradación agraciada de extremo a extremo — no contra mocks, sino contra `cms.sprintjudicial.com`, que respondió HTTP 403 durante el build (instancia existe, permisos públicos aún no habilitados). El sitio nunca se rompió: 9 páginas construidas correctamente.

2. **Seguridad — sin `set:html` sobre contenido `richtext` de Strapi**: `Articulo.cuerpo` y `Comunicado.cuerpo` se dividen en párrafos de texto plano interpolado (`{parrafo}`), que Astro escapa automáticamente. Decisión deliberada para no introducir una superficie de XSS almacenado sin un sanitizador vetado en el stack — atiende el aviso ya registrado en `AUDIT_02` F1. Se pierde formato enriquecido a cambio; se revisará cuando el CCL necesite publicar contenido con ese formato.

3. **`PageHeader.astro` extraído, resolviendo F2-G (`AUDIT_03`)**: con el crecimiento de 5 a 9 páginas la duplicación de clases Tailwind del `<h1>` ya justificaba la abstracción que F2 diferió deliberadamente por prematura. Las 9 páginas del sitio ahora comparten el mismo componente.

4. **`navLinks` crece de 4 a 8 ítems sin menú hamburguesa**: se mantiene la decisión de cero JavaScript de F2 (regla crítica 2). El `nav` con `flex-wrap` (ya probado en F0/F2) sigue siendo completamente operable por teclado con 8 ítems — verificado por E2E. Si el sitio sigue creciendo, revisar antes de F5 si se necesita agrupar por secciones.

5. **`/radicar-una-queja` no cita un plazo en días ni meses**: la Resolución 3461/2025 tiene una discrepancia sin resolver entre `CLAUDE.md` de justicia-sana ("≤65 días") y de SIRAL_System ("6 meses") — hallazgo F2-J, no resuelto por inferencia. Esta página nueva evita perpetuar cualquiera de las dos cifras. Verificado con TDD real: se inyectó "65 días" en el texto, se confirmó que el test nuevo lo detecta (RED), se revirtió y se confirmó GREEN.

6. **Corrección de un test propio durante la verificación**: el primer intento del test de placeholders (`contenido.spec.ts`) tenía un locator ambiguo (coincidía tanto con el título de `ComingSoon` como con el mensaje específico de cada página). Corregido acotando el locator al texto fijo del componente (`'Sección en preparación'`) — no era un defecto de la implementación, sino del test (mismo tipo de hallazgo que en S03).

7. **`AyudaBanner` de Home conectado a `fetchCanalesAyuda()`**: resuelve el hallazgo diferido de `AUDIT_03` ("conectar en F3-05"). Busca un canal `'Atención psicológica'`; si existe, pasa `telefono`/`correo` reales; si no, conserva el fallback ya auditado en F2 (enlace a `/canales-de-ayuda`, sin fabricar contacto). La interfaz de `AyudaBanner.astro` no cambió.

---

## Próximos Pasos

1. ~~Auditoría de gate F3~~ — **APROBADO** (SDD 98.2 %, 3 defectos encontrados y corregidos en el gate — 2 de seguridad real: URLs de media rotas y enlaces sin validar esquema). Ver `docs/validate/AUDIT_04_2026-07-24_GATE_F3_CONTENIDO.md`.
2. Fase F4 (Transparencia con cifras SIRAL) — **pendiente de orden explícita del propietario del proyecto**.
3. Sigue pendiente de acción humana: F1-01/03/05 (instancia real de Strapi) + que el CCL cargue contenido real — sin esto, F3 seguirá mostrando los fallbacks/placeholders honestos en producción.

---

**Versión**: 1.0
**Fecha**: 2026-07-24

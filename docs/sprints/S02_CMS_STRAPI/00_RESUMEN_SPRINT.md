# Sprint 02 — CMS Strapi

**Fecha inicio**: 2026-07-24
**Objetivo**: Contrato de content types documentado, cliente Strapi tipado y probado en Astro (degradación agraciada verificada), guías de aprovisionamiento y manual del editor listos — bloqueado en el aprovisionamiento real (F1-01/03/05) por requerir acceso humano al panel EasyPanel y al Strapi Admin del VPS.
**Planning**: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (Fase F1)
**SPEC de referencia**: `docs/sprints/S02_CMS_STRAPI/SPEC_S02_F1_STRAPI.md`
**Metodología**: SDD Framework v2 (CDAID v2) — fase Do

---

## Estado General

```
Sprint 02: [###########------------] ~50% (3/6 SPECs completados en el repo; 3 requieren acción humana fuera de él*)
```

\* F1-02 y F1-06 están `[x]` como entregable documental (contrato/manual), con una sub-tarea `[ ]` de ejecución/capturas reales diferida a después de F1-01.

| Fase      | Total SPECs | Completados (repo) | Pendientes (acción humana VPS) |
| --------- | :---------: | :----------------: | :----------------------------: |
| F1        |      6      |         3          |               3                |
| **Total** |    **6**    |       **3**        |             **3**              |

---

## Registro de Progreso

| Fecha      | SPEC     | Descripción                                                     | Commit    | Tests | Notas                                                                                     |
| ---------- | -------- | --------------------------------------------------------------- | --------- | :---: | ----------------------------------------------------------------------------------------- |
| —          | S02-F1-1 | Aprovisionar Strapi v5 + PostgreSQL en EasyPanel                | —         |   —   | **Pendiente** — acción humana. Guía commiteada en `6c3c9d9`: `docs/DEPLOYMENT_STRAPI.md`  |
| 2026-07-24 | S02-F1-2 | Content types (9): documentados como contrato JSON              | `6c3c9d9` |   —   | `docs/content-types/strapi-justicia-sana-content-types.md`; creación real depende de F1-1 |
| —          | S02-F1-3 | Roles y permisos — Editor CCL + token read-only                 | —         |   —   | **Pendiente** — acción humana. Guía commiteada en `6c3c9d9`: `docs/DEPLOYMENT_STRAPI.md`  |
| 2026-07-24 | S02-F1-4 | Cliente Strapi tipado (`src/lib/types.ts`, `src/lib/strapi.ts`) | `6c3c9d9` |  +22  | TDD real (RED→GREEN); token verificado ausente en `dist/` tras build                      |
| —          | S02-F1-5 | Webhook Strapi publish → deploy hook EasyPanel                  | —         |   —   | **Pendiente** — acción humana. Guía commiteada en `6c3c9d9`: `docs/DEPLOYMENT_STRAPI.md`  |
| 2026-07-24 | S02-F1-6 | Manual del editor CCL (borrador estructural)                    | `6c3c9d9` |   —   | `docs/MANUAL_EDITOR_CCL.md`; capturas reales diferidas a post-F1-1                        |

---

## Métricas de Verificación

| Métrica                    | Pre-Sprint |          Post-Sprint           | Delta |
| -------------------------- | :--------: | :----------------------------: | :---: |
| Tests unitarios (Vitest)   |     12     |               34               |  +22  |
| Tests E2E (Playwright)     |     4      |               4                |   —   |
| Content types documentados |     0      |  9 (7 collection + 2 single)   |  +9   |
| `astro check`              |     —      |           0 errores            |   ✓   |
| `npm run lint`             |     —      |             limpio             |   ✓   |
| `npm run build`            |     —      | OK (token no filtrado a dist/) |   ✓   |
| `agent_docs/` completos    |     5      |               6                |  +1   |

---

## Decisiones e Incidentes

1. **F1 tiene naturaleza mixta**: a diferencia de F0 (100% verificable en este repo), la mitad de F1 vive en infraestructura externa (Strapi en el VPS). Se aplicó el mismo criterio de honestidad que en F0-06: lo que es acción humana queda `[ ]` con guía ejecutable; lo que es código o contrato documental se completa y prueba en este sprint.
2. **Content types como contrato, no como instancia**: `docs/content-types/strapi-justicia-sana-content-types.md` define el schema JSON exacto de los 9 content types, replicando el patrón de `rugby-bello-site/docs/content-types/`. El cliente tipado en `src/lib/types.ts` asume esos nombres de campo literalmente — cualquier divergencia al crearlos en el Strapi Admin real rompería el mapeo de tipos (a verificar en la auditoría de gate F1 tras F1-01).
3. **Cliente Strapi — degradación agraciada como criterio de aceptación, no como buena práctica opcional**: el planning P01 exige explícitamente "el build no se rompe si Strapi está caído". Se verificó con 22 tests que mockean `fetch` (éxito, error HTTP, fallo de red, `data: null`, JSON inválido) — ninguna función de `src/lib/strapi.ts` lanza excepciones.
4. **Verificación de no-fuga del token**: se ejecutó `npm run build` con `STRAPI_TOKEN` de prueba y se confirmó por `grep` que el valor no aparece en ningún archivo de `dist/` — regla crítica 5 de `CLAUDE.md` verificada empíricamente, no solo por revisión de código.
5. **Manual del editor sin capturas**: se decidió no fabricar imágenes de una interfaz de Strapi que aún no existe. El manual cubre el flujo completo en texto: se completa con capturas reales cuando exista la instancia (F1-01).
6. **Posible convivencia con rugby-bello-site**: ambos proyectos usan Strapi v5 en el mismo VPS. Se documentó en `docs/DEPLOYMENT_STRAPI.md` que, de compartir instancia, los content types no colisionan por nombre — decisión de instancia compartida vs. separada queda para el propietario en F1-01.

---

## Próximos Pasos

1. Confirmar autoría/push del commit de este sprint.
2. **Acción del propietario**: ejecutar `docs/DEPLOYMENT_STRAPI.md` (F1-01, F1-03, F1-05) — aprovisionar Strapi, crear los 9 content types con el schema exacto del contrato, configurar rol Editor CCL, token read-only y webhook.
3. Tras F1-01 completado: agregar capturas reales a `docs/MANUAL_EDITOR_CCL.md` (F1-06) y ejecutar una verificación de integración real del cliente contra la instancia (más allá de los mocks).
4. Auditoría de gate F1 (`docs/validate/AUDIT_02_2026-07-24_GATE_F1_CMS_STRAPI.md`) — Check del ciclo PDCA.
5. Tras gate F1 aprobado: iniciar Sprint 03 (Fase F2 — Layout y Sistema de Diseño), que no depende de que F1-01/03/05 estén ejecutados (el cliente Strapi ya degrada con gracia).

---

**Versión**: 1.0
**Fecha**: 2026-07-24
